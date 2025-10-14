// Test script to verify item creation in Supabase
// Run this in your browser console on the localhost:3000 page

import { createBrowserClient } from "./src/lib/supabase/supabase.browser.js";

async function testItemCreation() {
  console.log("🧪 Testing item creation...");

  try {
    const supabase = createBrowserClient();

    // Test 1: Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log("👤 User authentication:", {
      user: user?.id,
      error: authError,
    });

    if (!user) {
      console.error("❌ No authenticated user found");
      return;
    }

    // Test 2: Try to create a test item
    const testItem = {
      title: "Test Item " + Date.now(),
      description: "This is a test item",
      price: 29.99,
      category: "Test",
      condition: "excellent",
      size: "M",
      seller: "Test Seller",
      photos: ["/api/placeholder/400/400"],
      user_id: user.id,
      user_email: user.email,
      status: "active",
      is_active: true,
      quantity: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("📦 Creating test item:", testItem);

    const { data, error } = await supabase
      .from("items")
      .insert(testItem)
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating item:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    } else {
      console.log("✅ Item created successfully:", data);
    }

    // Test 3: Try to read items
    const { data: items, error: readError } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (readError) {
      console.error("❌ Error reading items:", readError);
    } else {
      console.log("📋 Recent items:", items);
    }
  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

// Run the test
testItemCreation();

