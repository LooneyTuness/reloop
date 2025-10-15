#!/usr/bin/env node

/**
 * Production Database Setup Script
 *
 * This script helps you set up your production database by:
 * 1. Validating environment variables
 * 2. Testing database connection
 * 3. Running basic schema checks
 * 4. Providing setup instructions
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

async function validateEnvironment() {
  log("\n🔍 Validating Environment Variables...", "cyan");

  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  const missing = [];
  const present = [];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    logError(`Missing environment variables: ${missing.join(", ")}`);
    logInfo(
      "Please set these variables in your deployment platform or .env.local file"
    );
    return false;
  }

  logSuccess(`All required environment variables are present`);
  return true;
}

async function testDatabaseConnection() {
  log("\n🔗 Testing Database Connection...", "cyan");

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Test basic connection
    const { data, error } = await supabase
      .from("seller_profiles")
      .select("count")
      .limit(1);

    if (error) {
      logError(`Database connection failed: ${error.message}`);
      logInfo("This might mean the database schema is not set up yet");
      return false;
    }

    logSuccess("Database connection successful");
    return true;
  } catch (err) {
    logError(`Connection error: ${err.message}`);
    return false;
  }
}

async function checkRequiredTables() {
  log("\n📋 Checking Required Tables...", "cyan");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const requiredTables = [
    "seller_profiles",
    "items",
    "categories",
    "category_hierarchy",
    "orders",
    "order_items",
    "cart_items",
    "user_profiles",
  ];

  const missingTables = [];
  const presentTables = [];

  for (const tableName of requiredTables) {
    try {
      const { error } = await supabase.from(tableName).select("*").limit(1);

      if (error) {
        missingTables.push(tableName);
      } else {
        presentTables.push(tableName);
      }
    } catch (err) {
      missingTables.push(tableName);
    }
  }

  if (presentTables.length > 0) {
    logSuccess(`Present tables: ${presentTables.join(", ")}`);
  }

  if (missingTables.length > 0) {
    logWarning(`Missing tables: ${missingTables.join(", ")}`);
    logInfo("You may need to run database migration scripts");
  }

  return missingTables.length === 0;
}

async function main() {
  log("🚀 Production Database Setup Script", "bright");
  log("=====================================", "bright");

  // Check if we're in production mode
  const isProduction = process.env.NODE_ENV === "production";
  const environment = isProduction ? "Production" : "Development";

  log(`\n📍 Environment: ${environment}`, "magenta");
  log(
    `🔗 Database URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"}`,
    "magenta"
  );

  // Step 1: Validate environment
  const envValid = await validateEnvironment();
  if (!envValid) {
    process.exit(1);
  }

  // Step 2: Test connection
  const connectionOk = await testDatabaseConnection();
  if (!connectionOk) {
    logWarning("Database connection failed. You may need to:");
    logInfo("1. Check your Supabase project URL and keys");
    logInfo("2. Ensure your Supabase project is active");
    logInfo("3. Run database migration scripts");
    process.exit(1);
  }

  // Step 3: Check tables
  const tablesOk = await checkRequiredTables();

  log("\n📊 Setup Summary", "cyan");
  log("================", "cyan");
  logSuccess("Environment variables: ✓");
  logSuccess("Database connection: ✓");

  if (tablesOk) {
    logSuccess("Required tables: ✓");
    log("\n🎉 Your production database is ready!", "green");
  } else {
    logWarning("Required tables: ⚠️  Some tables missing");
    log("\n📝 Next Steps:", "yellow");
    logInfo("1. Run your database migration scripts");
    logInfo("2. Set up initial data if needed");
    logInfo("3. Test all API endpoints");
    logInfo("4. Set up database backups");
  }

  log("\n🔧 Additional Setup:", "cyan");
  logInfo("• Configure Row Level Security (RLS) policies");
  logInfo("• Set up database backups");
  logInfo("• Monitor database performance");
  logInfo("• Test all API endpoints in production");
}

// Run the script
main().catch((err) => {
  logError(`Script failed: ${err.message}`);
  process.exit(1);
});
