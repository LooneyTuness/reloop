import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        status: "error",
        message: "Admin service not available",
        error: "Supabase admin client not initialized"
      });
    }

    // Test basic Supabase connection
    const { data: testData, error: testError } = await supabaseAdmin
      .from("seller_profiles")
      .select("count")
      .limit(1);

    if (testError) {
      return NextResponse.json({
        status: "error",
        message: "Database connection failed",
        error: testError.message,
        code: testError.code,
        hint: testError.hint,
        details: testError.details,
        instructions: [
          "1. The seller_profiles table doesn't exist",
          "2. Go to Supabase SQL Editor",
          "3. Run the create-seller-profiles-table.sql script",
          "4. Refresh this page"
        ]
      });
    }

    // If we get here, table exists
    const { data: sellers, error } = await supabaseAdmin
      .from("seller_profiles")
      .select("*")
      .eq("role", "seller");

    if (error) {
      return NextResponse.json({
        status: "error",
        message: "Failed to fetch sellers",
        error: error.message,
        code: error.code
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection working",
      sellers: sellers || [],
      tableExists: true
    });

  } catch (error) {
    console.error("Error in database test:", error);
    return NextResponse.json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
