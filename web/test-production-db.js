#!/usr/bin/env node

/**
 * Test Production Database Connection
 *
 * This script tests your production database connection
 * Run with: node test-production-db.js
 */

const { createClient } = require("@supabase/supabase-js");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

async function testProductionDatabase() {
  log("🧪 Testing Production Database Connection", "bright");
  log("==========================================", "bright");

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    logError("Missing environment variables!");
    logInfo("Please set:");
    logInfo(
      "  NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project-id.supabase.co"
    );
    logInfo("  SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key");
    logInfo("");
    logInfo("You can set them temporarily with:");
    logInfo('  $env:NEXT_PUBLIC_SUPABASE_URL="your-url"');
    logInfo('  $env:SUPABASE_SERVICE_ROLE_KEY="your-key"');
    return;
  }

  log(`📍 Database URL: ${supabaseUrl}`, "magenta");

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Test basic connection
    log("\n🔗 Testing basic connection...", "cyan");
    const { data: testData, error: testError } = await supabase
      .from("seller_profiles")
      .select("count")
      .limit(1);

    if (testError) {
      logError(`Connection failed: ${testError.message}`);
      return;
    }

    logSuccess("Basic connection successful!");

    // Test all required tables
    const requiredTables = [
      "seller_profiles",
      "items",
      "categories",
      "category_hierarchy",
      "orders",
      "order_items",
      "cart_items",
      "user_profiles",
      "notifications",
      "seller_applications",
      "waitlist",
      "product_views",
      "daily_analytics",
      "vendor_sales",
      "seller_invites",
      "vendor_sales_summary",
    ];

    log("\n📋 Testing all tables...", "cyan");
    const missingTables = [];
    const presentTables = [];

    for (const tableName of requiredTables) {
      try {
        const { error } = await supabase.from(tableName).select("*").limit(1);

        if (error) {
          missingTables.push(tableName);
          logError(`❌ ${tableName} - ${error.message}`);
        } else {
          presentTables.push(tableName);
          logSuccess(`✅ ${tableName}`);
        }
      } catch (err) {
        missingTables.push(tableName);
        logError(`❌ ${tableName} - ${err.message}`);
      }
    }

    // Summary
    log("\n📊 Test Results", "cyan");
    log("===============", "cyan");
    logSuccess(
      `Present tables: ${presentTables.length}/${requiredTables.length}`
    );

    if (missingTables.length > 0) {
      logError(`Missing tables: ${missingTables.length}`);
      logWarning("Missing tables:");
      missingTables.forEach((table) => logInfo(`  - ${table}`));
    } else {
      logSuccess("All tables present! 🎉");
    }

    // Test API endpoints
    log("\n🌐 Testing API endpoints...", "cyan");

    // Test items endpoint
    try {
      const { data: items, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .limit(1);

      if (itemsError) {
        logError(`Items API: ${itemsError.message}`);
      } else {
        logSuccess("Items API working");
      }
    } catch (err) {
      logError(`Items API: ${err.message}`);
    }

    // Test categories endpoint
    try {
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .limit(1);

      if (categoriesError) {
        logError(`Categories API: ${categoriesError.message}`);
      } else {
        logSuccess("Categories API working");
      }
    } catch (err) {
      logError(`Categories API: ${err.message}`);
    }

    log("\n🎉 Production database test completed!", "green");

    if (missingTables.length === 0) {
      log("\n✅ Your production database is ready to use!", "green");
      logInfo("Next steps:");
      logInfo("1. Deploy your application");
      logInfo("2. Set environment variables in your deployment platform");
      logInfo("3. Test your live application");
    } else {
      log(
        "\n⚠️  Some tables are missing. Please run the setup script again.",
        "yellow"
      );
    }
  } catch (err) {
    logError(`Test failed: ${err.message}`);
  }
}

// Run the test
testProductionDatabase().catch((err) => {
  logError(`Script failed: ${err.message}`);
  process.exit(1);
});
