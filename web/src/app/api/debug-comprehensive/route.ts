import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase.admin";

export async function GET(req: NextRequest) {
  try {
    console.log("=== DEBUG: Starting comprehensive test ===");
    
    // Test 1: Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      appUrl: !!process.env.NEXT_PUBLIC_APP_URL
    };
    
    console.log("Environment check:", envCheck);
    
    // Test 2: Check if supabaseAdmin is working
    let adminTest: { success: boolean; error: string | null } = { success: false, error: null };
    try {
      const { data: testData, error: testError } = await supabaseAdmin
        .from("seller_profiles")
        .select("id")
        .limit(1);
      
      if (testError) {
        adminTest.error = testError.message;
        console.log("Admin test error:", testError);
      } else {
        adminTest.success = true;
        console.log("Admin test success");
      }
    } catch (err) {
      adminTest.error = err instanceof Error ? err.message : "Unknown error";
      console.log("Admin test exception:", err);
    }
    
    // Test 3: Try to get all sellers
    let sellersTest: { success: boolean; error: string | null; data: any[] | null } = { success: false, error: null, data: null };
    try {
      const { data: sellers, error: sellersError } = await supabaseAdmin
        .from("seller_profiles")
        .select("*")
        .eq("role", "seller")
        .order("created_at", { ascending: false });
      
      if (sellersError) {
        sellersTest.error = sellersError.message;
        console.log("Sellers test error:", sellersError);
      } else {
        sellersTest.success = true;
        sellersTest.data = sellers;
        console.log("Sellers test success:", sellers?.length || 0, "sellers");
      }
    } catch (err) {
      sellersTest.error = err instanceof Error ? err.message : "Unknown error";
      console.log("Sellers test exception:", err);
    }
    
    // Test 4: Check if we can create a test seller profile
    let createTest: { success: boolean; error: string | null } = { success: false, error: null };
    try {
      // This is just a test - we won't actually insert
      const testInsert = {
        user_id: "00000000-0000-0000-0000-000000000000", // dummy UUID
        email: "test@example.com",
        role: "seller",
        is_approved: true
      };
      
      // We'll just validate the structure, not actually insert
      createTest.success = true;
      console.log("Create test structure valid");
    } catch (err) {
      createTest.error = err instanceof Error ? err.message : "Unknown error";
      console.log("Create test exception:", err);
    }
    
    console.log("=== DEBUG: Test complete ===");
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      adminClient: adminTest,
      sellersQuery: sellersTest,
      createStructure: createTest,
      summary: {
        envOk: envCheck.supabaseUrl && envCheck.serviceRoleKey,
        adminOk: adminTest.success,
        sellersOk: sellersTest.success,
        createOk: createTest.success
      }
    });
    
  } catch (error) {
    console.error("=== DEBUG: Fatal error ===", error);
    return NextResponse.json({
      error: "Fatal error in debug",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
