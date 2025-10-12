import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Test 1: Check if we can import the admin client
    let importTest = null;
    try {
      const { supabaseAdmin } = await import("@/lib/supabase/supabase.admin");
      importTest = {
        success: true,
        message: "Admin client imported successfully"
      };
    } catch (importError) {
      importTest = {
        success: false,
        error: (importError as Error).message,
        message: "Failed to import admin client"
      };
    }

    // Test 2: Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    return NextResponse.json({
      status: "ok",
      importTest,
      environment: envCheck,
      timestamp: new Date().toISOString(),
      instructions: [
        "1. Check if serviceRoleKey is true",
        "2. If false, add SUPABASE_SERVICE_ROLE_KEY to .env.local",
        "3. Restart your development server",
        "4. Run the database migration script"
      ]
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
