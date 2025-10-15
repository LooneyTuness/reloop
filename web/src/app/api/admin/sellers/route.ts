import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per user

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      );
    }

    // First check if the table exists
    const { error: tableError } = await supabaseAdmin
      .from("seller_profiles")
      .select("id")
      .limit(1);

    if (tableError) {
      console.error("Seller profiles table error:", tableError);
      return NextResponse.json({
        error: "Database table not found",
        details: "The seller_profiles table doesn't exist. Please run the database migration first.",
        instructions: [
          "1. Go to your Supabase SQL editor",
          "2. Run the create-seller-profiles-table.sql script",
          "3. Refresh this page"
        ]
      }, { status: 500 });
    }

    // Get all sellers
    const { data: sellers, error } = await supabaseAdmin
      .from("seller_profiles")
      .select("*")
      .eq("role", "seller")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sellers:", error);
      return NextResponse.json(
        { error: "Failed to fetch sellers" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sellers });
  } catch (error) {
    console.error("Error in GET sellers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      );
    }

    // Check if user is authenticated and has admin role
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const { data: profile } = await supabaseAdmin
      .from("seller_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Rate limiting check
    const now = Date.now();
    const userRateLimit = rateLimitMap.get(user.id);
    
    if (userRateLimit) {
      if (now < userRateLimit.resetTime) {
        if (userRateLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
          return NextResponse.json(
            { error: "Rate limit exceeded. Please try again later." },
            { status: 429 }
          );
        }
        userRateLimit.count++;
      } else {
        // Reset the counter
        rateLimitMap.set(user.id, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(user.id, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    const { email, fullName, createdBy } = await req.json();

    if (!email || !fullName || !createdBy) {
      return NextResponse.json(
        { error: "Email, fullName, and createdBy are required" },
        { status: 400 }
      );
    }

    // Sanitize and validate inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedFullName = fullName.trim().replace(/[<>]/g, '');
    const sanitizedCreatedBy = createdBy.trim().replace(/[<>]/g, '');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate name length and characters
    if (sanitizedFullName.length < 2 || sanitizedFullName.length > 100) {
      return NextResponse.json(
        { error: "Full name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }

    // Check for suspicious patterns
    if (sanitizedEmail.includes('..') || sanitizedEmail.startsWith('.') || sanitizedEmail.endsWith('.')) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // First check if the table exists
    const { error: tableError } = await supabaseAdmin
      .from("seller_profiles")
      .select("id")
      .limit(1);

    if (tableError) {
      console.error("Seller profiles table error:", tableError);
      return NextResponse.json({
        error: "Database table not found",
        details: "The seller_profiles table doesn't exist. Please run the database migration first.",
        instructions: [
          "1. Go to your Supabase SQL editor",
          "2. Run the create-seller-profiles-table.sql script",
          "3. Try again"
        ]
      }, { status: 500 });
    }

    // Check if user already has a seller profile
    const { data: existingProfile } = await supabaseAdmin
      .from("seller_profiles")
      .select("id")
      .eq("email", sanitizedEmail)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "User is already a seller" },
        { status: 409 }
      );
    }

    // Try to find existing user by email
    let existingUser = null;
    try {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      existingUser = users.users.find(user => user.email === sanitizedEmail);
    } catch {
      console.log("Could not list users, will create new user");
    }

    let userId;

    if (!existingUser) {
      // User doesn't exist, create them
      const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: sanitizedEmail,
        email_confirm: true,
        user_metadata: {
          full_name: sanitizedFullName
        }
      });

      if (createUserError || !newUser.user) {
        console.error("Error creating user:", createUserError);
        return NextResponse.json(
          { 
            error: "Failed to create user account",
            details: createUserError?.message || "Unknown error"
          },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
    } else {
      userId = existingUser.id;
    }

    // Create seller profile
    // For production, you can change this to false for manual approval
    const autoApprove = process.env.NODE_ENV === 'production' ? false : true;
    
    const { data: seller, error: profileError } = await supabaseAdmin
      .from("seller_profiles")
      .insert({
        user_id: userId,
        email: sanitizedEmail,
        full_name: sanitizedFullName,
        role: "seller",
        is_approved: autoApprove
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error creating seller profile:", profileError);
      return NextResponse.json(
        { 
          error: "Failed to create seller profile",
          details: profileError.message,
          code: profileError.code
        },
        { status: 500 }
      );
    }

    // Log the seller creation for audit purposes
    console.log(`[AUDIT] Seller created by admin ${user.id} (${sanitizedCreatedBy}):`, {
      sellerId: seller.id,
      sellerEmail: sanitizedEmail,
      sellerName: sanitizedFullName,
      createdBy: sanitizedCreatedBy,
      timestamp: new Date().toISOString(),
      adminUserId: user.id,
      isApproved: autoApprove
    });

    // Generate dashboard URL
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/seller-dashboard`;

    return NextResponse.json({
      success: true,
      seller,
      dashboardUrl,
      message: autoApprove 
        ? "Seller created and approved successfully" 
        : "Seller created successfully. Pending admin approval.",
      requiresApproval: !autoApprove
    });

  } catch (error) {
    console.error("Error in POST sellers:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
