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

    if (userError) {
      return NextResponse.json({
        exists: false,
        error: userError.message
      });
    }

    if (!user || !user.user) {
      return NextResponse.json({
        exists: false,
        message: "User not found"
      });
    }

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

