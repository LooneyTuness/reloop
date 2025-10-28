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

    const { userId, email, role = "seller" } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "User ID and email are required" },
        { status: 400 }
      );
    }

    console.log("Creating seller profile for user:", userId, email);

    // Check if seller profile already exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from("seller_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    // If checkError exists and it's not a "no rows" error, log it but continue
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking for existing profile:", checkError);
    }

    if (existingProfile) {
      console.log("Seller profile already exists for user:", userId);
      return NextResponse.json({
        success: true,
        profile: existingProfile,
        message: "Seller profile already exists"
      });
    }

    // Create seller profile
    const { data: profile, error } = await supabaseAdmin
      .from("seller_profiles")
      .insert({
        user_id: userId,
        email: email,
        role: role,
        is_approved: true
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating seller profile:", error);
      return NextResponse.json(
        { error: "Failed to create seller profile: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
      message: "Seller profile created successfully"
    });

  } catch (error) {
    console.error("Error in POST create seller profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
