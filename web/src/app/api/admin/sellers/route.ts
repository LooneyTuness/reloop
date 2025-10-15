import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      );
    }

    // First check if the table exists
    const { data: tableCheck, error: tableError } = await supabaseAdmin
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

    const { email, fullName, createdBy } = await req.json();

    if (!email || !fullName || !createdBy) {
      return NextResponse.json(
        { error: "Email, fullName, and createdBy are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // First check if the table exists
    const { data: tableCheck, error: tableError } = await supabaseAdmin
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
      .eq("email", email)
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
      existingUser = users.users.find(user => user.email === email);
    } catch (listError) {
      console.log("Could not list users, will create new user");
    }

    let userId;

    if (!existingUser) {
      // User doesn't exist, create them
      const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: {
          full_name: fullName
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
    const { data: seller, error: profileError } = await supabaseAdmin
      .from("seller_profiles")
      .insert({
        user_id: userId,
        email: email,
        role: "seller",
        is_approved: true
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

    // Generate dashboard URL
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/seller-dashboard`;

    return NextResponse.json({
      success: true,
      seller,
      dashboardUrl,
      message: "Seller created successfully"
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
