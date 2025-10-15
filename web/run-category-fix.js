#!/usr/bin/env node

/**
 * Fix Production Category Column
 * This script runs the category column fix on the production database
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Production database configuration
const productionSupabaseUrl =
  process.env.PRODUCTION_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const productionSupabaseKey =
  process.env.PRODUCTION_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!productionSupabaseUrl || !productionSupabaseKey) {
  console.error("❌ Missing production database environment variables:");
  console.error("   - PRODUCTION_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
  console.error(
    "   - PRODUCTION_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY"
  );
  console.error("\n💡 Add these to your .env.local file:");
  console.error("   PRODUCTION_SUPABASE_URL=your_production_url");
  console.error(
    "   PRODUCTION_SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key"
  );
  process.exit(1);
}

const supabase = createClient(productionSupabaseUrl, productionSupabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function fixCategoryColumn() {
  try {
    console.log("🔧 Fixing production database category column...");
    console.log(`📍 Database: ${productionSupabaseUrl}`);

    // Read the SQL file
    const fs = require("fs");
    const path = require("path");
    const sqlPath = path.join(__dirname, "fix-production-category-column.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Execute the SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      console.error("❌ Error executing SQL:", error);
      return;
    }

    console.log("✅ Category column fix completed successfully!");
    console.log("📊 Results:", data);

    // Test the fix by checking the table structure
    const { data: columns, error: columnError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", "items")
      .in("column_name", ["category_id", "category"])
      .order("column_name");

    if (columnError) {
      console.error("❌ Error checking table structure:", columnError);
    } else {
      console.log("📋 Items table structure:");
      console.table(columns);
    }

    // Check categories
    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("id, name, slug, level")
      .order("level, sort_order");

    if (categoryError) {
      console.error("❌ Error checking categories:", categoryError);
    } else {
      console.log("📂 Available categories:");
      console.table(categories);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the fix
fixCategoryColumn();
