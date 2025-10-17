#!/usr/bin/env node

/**
 * Quick Switch to Production Database
 *
 * This script helps you quickly switch from the old reloop database
 * to the production database by setting environment variables.
 */

const { createClient } = require("@supabase/supabase-js");

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

async function main() {
  log("🔄 Switching to Production Database", "bright");
  log("===================================", "bright");
  log("");

  // Check current environment
  const currentUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  logInfo(`Current database URL: ${currentUrl || "Not set"}`);
  log("");

  if (!currentUrl) {
    logError("No database URL found in environment variables!");
    logInfo(
      "Please set NEXT_PUBLIC_SUPABASE_URL to your production database URL."
    );
    logInfo("");
    logInfo("You can set it temporarily with:");
    logInfo(
      '  $env:NEXT_PUBLIC_SUPABASE_URL="https://your-production-project-id.supabase.co"'
    );
    logInfo(
      '  $env:SUPABASE_SERVICE_ROLE_KEY="your_production_service_role_key"'
    );
    logInfo("");
    logInfo("Or run: node setup-production-env.js");
    return;
  }

  // Check if it's the old reloop database
  if (currentUrl.includes("wkttbmstlttzuavtqpxb")) {
    logWarning("⚠️  You're currently using the old reloop database!");
    logInfo("This is why sellers are logging into the wrong database.");
    log("");
  }

  // Test the current database connection
  log("🧪 Testing current database connection...", "cyan");

  try {
    const supabase = createClient(
      currentUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Test connection
    const { data, error } = await supabase
      .from("seller_profiles")
      .select("count")
      .limit(1);

    if (error) {
      logError(`Database connection failed: ${error.message}`);
      return;
    }

    logSuccess("Database connection successful!");
    logInfo(`Connected to: ${currentUrl}`);

    // Check if this looks like a production database
    if (currentUrl.includes("wkttbmstlttzuavtqpxb")) {
      logWarning("This appears to be the old reloop database.");
      logInfo("To switch to production database:");
      logInfo(
        "1. Get your production database credentials from Supabase dashboard"
      );
      logInfo("2. Run: node setup-production-env.js");
      logInfo("3. Or set environment variables manually");
    } else {
      logSuccess("This appears to be a production database! 🎉");
    }
  } catch (err) {
    logError(`Connection test failed: ${err.message}`);
  }

  log("");
  logInfo("To verify the fix:");
  logInfo("1. Check that sellers can log in successfully");
  logInfo("2. Verify they see the correct data");
  logInfo("3. Test seller dashboard functionality");
}

main().catch((error) => {
  logError(`Script failed: ${error.message}`);
  process.exit(1);
});
