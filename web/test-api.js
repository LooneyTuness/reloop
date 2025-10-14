const { createClient } = require("@supabase/supabase-js");

// Test the API response
async function testAPI() {
  try {
    console.log("Testing items API...");

    const response = await fetch(
      "http://localhost:3000/api/items?page=1&limit=5"
    );
    const data = await response.json();

    console.log("API Response:", JSON.stringify(data, null, 2));

    if (data.items && data.items.length > 0) {
      console.log("\nFirst item seller data:");
      console.log("user_id:", data.items[0].user_id);
      console.log("seller_profiles:", data.items[0].seller_profiles);
      console.log("seller field:", data.items[0].seller);
    }
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

testAPI();
