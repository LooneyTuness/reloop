import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";

export async function GET(req: NextRequest) {
  try {
    // Test if we can access seller_profiles with admin client
    const { data: sellers, error } = await supabaseAdmin
      .from("seller_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({
        status: "error",
        message: "Failed to access seller_profiles",
        error: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Admin client can access seller_profiles",
      sellers: sellers || [],
      count: sellers?.length || 0
    });

  } catch (error) {
    console.error("Error in admin test:", error);
    return NextResponse.json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
