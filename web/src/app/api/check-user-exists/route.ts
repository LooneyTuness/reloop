import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin service not available" },
        { status: 503 }
      );
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists in auth.users
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    console.log('Check user exists - userId:', userId);
    console.log('Check user exists - result:', { user, userError });

    if (userError) {
      console.error('User lookup error:', userError);
      return NextResponse.json({
        exists: false,
        error: userError.message,
        code: userError.status
      });
    }

    if (!user || !user.user) {
      console.log('User not found in auth.users for ID:', userId);
      return NextResponse.json({
        exists: false,
        message: "User not found"
      });
    }

    console.log('User found in auth.users:', user.user.email);
    
    return NextResponse.json({
      exists: true,
      user: {
        id: user.user.id,
        email: user.user.email,
        created_at: user.user.created_at,
        email_confirmed_at: user.user.email_confirmed_at
      }
    });

  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

