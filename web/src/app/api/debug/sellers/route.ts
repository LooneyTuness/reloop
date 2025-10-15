import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin service not available" },
        { status: 503 }
      );
    }

    // Test if seller_profiles table exists
    const { data: tableCheck, error: tableError } = await supabaseAdmin
      .from("seller_profiles")
      .select("id")
      .limit(1);

    if (tableError) {
      return NextResponse.json({
        error: "Table doesn't exist or access denied",
        details: tableError.message,
        code: tableError.code,
        hint: tableError.hint,
        instructions: [
          "1. Run the create-seller-profiles-table.sql migration",
          "2. Make sure you're signed in as an admin",
          "3. Check if the table was created successfully"
        ]
      }, { status: 500 });
    }

    // If table exists, try to get sellers
    const { data: sellers, error } = await supabaseAdmin
      .from("seller_profiles")
      .select("*")
      .eq("role", "seller")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({
        error: "Failed to fetch sellers",
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      sellers: sellers || [],
      message: "Table exists and query successful"
    });

  } catch (error) {
    console.error("Error in debug sellers:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
