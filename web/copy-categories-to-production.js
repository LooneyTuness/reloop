#!/usr/bin/env node

/**
 * Copy Categories from Local to Production Database
 * This script copies all category data from your local database to production
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Database configurations
const localSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const localSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Production database configuration (you'll need to set these)
const productionSupabaseUrl = process.env.PRODUCTION_SUPABASE_URL;
const productionSupabaseKey = process.env.PRODUCTION_SUPABASE_SERVICE_ROLE_KEY;

if (!localSupabaseUrl || !localSupabaseKey) {
  console.error("❌ Missing local database environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!productionSupabaseUrl || !productionSupabaseKey) {
  console.error("❌ Missing production database environment variables:");
  console.error("   - PRODUCTION_SUPABASE_URL");
  console.error("   - PRODUCTION_SUPABASE_SERVICE_ROLE_KEY");
  console.error("\n💡 Add these to your .env.local file:");
  console.error("   PRODUCTION_SUPABASE_URL=your_production_url");
  console.error(
    "   PRODUCTION_SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key"
  );
  process.exit(1);
}

const localSupabase = createClient(localSupabaseUrl, localSupabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const productionSupabase = createClient(
  productionSupabaseUrl,
  productionSupabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function copyCategories() {
  try {
    console.log("🔍 Fetching categories from local database...");

    // Get all categories from local database
    const { data: localCategories, error: localError } = await localSupabase
      .from("categories")
      .select("*")
      .order("level", { ascending: true })
      .order("sort_order", { ascending: true });

    if (localError) {
      console.error("❌ Error fetching from local database:", localError);
      return;
    }

    if (!localCategories || localCategories.length === 0) {
      console.log("⚠️  No categories found in local database");
      return;
    }

    console.log(
      `✅ Found ${localCategories.length} categories in local database`
    );

    // Check what's already in production
    console.log("🔍 Checking production database...");
    const { data: productionCategories, error: prodError } =
      await productionSupabase.from("categories").select("id, slug");

    if (prodError) {
      console.error("❌ Error checking production database:", prodError);
      return;
    }

    const existingSlugs = new Set(
      productionCategories?.map((c) => c.slug) || []
    );
    console.log(
      `📊 Production database has ${
        productionCategories?.length || 0
      } existing categories`
    );

    // Filter out categories that already exist in production
    const newCategories = localCategories.filter(
      (cat) => !existingSlugs.has(cat.slug)
    );

    if (newCategories.length === 0) {
      console.log("✅ All categories already exist in production database");
      return;
    }

    console.log(`📝 Found ${newCategories.length} new categories to copy`);

    // Insert categories in batches by level to maintain proper parent-child relationships
    const mainCategories = newCategories.filter((c) => c.level === 0);
    const subCategories = newCategories.filter((c) => c.level === 1);
    const types = newCategories.filter((c) => c.level === 2);

    let successCount = 0;
    let errorCount = 0;

    // Insert main categories first
    if (mainCategories.length > 0) {
      console.log(`📤 Inserting ${mainCategories.length} main categories...`);
      const { error: mainError } = await productionSupabase
        .from("categories")
        .upsert(mainCategories, { onConflict: "slug" });

      if (mainError) {
        console.error("❌ Error inserting main categories:", mainError);
        errorCount += mainCategories.length;
      } else {
        console.log("✅ Main categories inserted successfully");
        successCount += mainCategories.length;
      }
    }

    // Insert subcategories
    if (subCategories.length > 0) {
      console.log(`📤 Inserting ${subCategories.length} subcategories...`);
      const { error: subError } = await productionSupabase
        .from("categories")
        .upsert(subCategories, { onConflict: "slug" });

      if (subError) {
        console.error("❌ Error inserting subcategories:", subError);
        errorCount += subCategories.length;
      } else {
        console.log("✅ Subcategories inserted successfully");
        successCount += subCategories.length;
      }
    }

    // Insert types
    if (types.length > 0) {
      console.log(`📤 Inserting ${types.length} types...`);
      const { error: typesError } = await productionSupabase
        .from("categories")
        .upsert(types, { onConflict: "slug" });

      if (typesError) {
        console.error("❌ Error inserting types:", typesError);
        errorCount += types.length;
      } else {
        console.log("✅ Types inserted successfully");
        successCount += types.length;
      }
    }

    // Verify the migration
    console.log("\n🔍 Verifying migration...");
    const { data: finalCategories, error: verifyError } =
      await productionSupabase
        .from("categories")
        .select("level, name, slug")
        .order("level", { ascending: true })
        .order("sort_order", { ascending: true });

    if (verifyError) {
      console.error("❌ Error verifying migration:", verifyError);
    } else {
      console.log("\n📊 Final category count by level:");
      const byLevel = finalCategories.reduce((acc, cat) => {
        acc[cat.level] = (acc[cat.level] || 0) + 1;
        return acc;
      }, {});

      Object.keys(byLevel)
        .sort()
        .forEach((level) => {
          const levelName =
            level === "0"
              ? "Main Categories"
              : level === "1"
              ? "Subcategories"
              : "Types";
          console.log(`  ${levelName}: ${byLevel[level]} items`);
        });
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`   Successfully copied: ${successCount} categories`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount} categories`);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the migration
copyCategories();
