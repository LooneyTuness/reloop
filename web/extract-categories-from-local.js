#!/usr/bin/env node

/**
 * Extract Categories from Local Database
 * This script connects to your local Supabase database and extracts all category data
 * to create a migration script for production.
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Local database configuration
const localSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const localSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!localSupabaseUrl || !localSupabaseKey) {
  console.error("❌ Missing environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  console.error("   Make sure your .env.local file is configured correctly.");
  process.exit(1);
}

const supabase = createClient(localSupabaseUrl, localSupabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function extractCategories() {
  try {
    console.log("🔍 Extracting categories from local database...");

    // Get all categories ordered by level and sort_order
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("level", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("❌ Error fetching categories:", error);
      return;
    }

    if (!categories || categories.length === 0) {
      console.log("⚠️  No categories found in local database");
      return;
    }

    console.log(`✅ Found ${categories.length} categories in local database`);

    // Generate SQL migration script
    const migrationSQL = generateMigrationSQL(categories);

    // Write to file
    const fs = require("fs");
    const filename = "category-data-migration.sql";
    fs.writeFileSync(filename, migrationSQL);

    console.log(`📝 Migration script written to: ${filename}`);
    console.log("\n📋 Next steps:");
    console.log("1. Review the generated migration script");
    console.log("2. Run it in your production Supabase SQL Editor");
    console.log("3. Verify the categories are properly inserted");

    // Display summary
    displayCategorySummary(categories);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

function generateMigrationSQL(categories) {
  let sql = `-- Category Data Migration Script
-- Generated from local database on ${new Date().toISOString()}
-- This script will insert all categories into your production database

-- Clear existing categories (be careful in production!)
-- DELETE FROM categories;

-- Insert main categories (level 0)
INSERT INTO categories (id, name, slug, description, level, sort_order, is_active, created_at, updated_at) VALUES
`;

  // Group categories by level
  const mainCategories = categories.filter((c) => c.level === 0);
  const subCategories = categories.filter((c) => c.level === 1);
  const types = categories.filter((c) => c.level === 2);

  // Insert main categories
  mainCategories.forEach((cat, index) => {
    const comma = index < mainCategories.length - 1 ? "," : "";
    sql += `    ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${
      cat.slug
    }', '${(cat.description || "").replace(/'/g, "''")}', ${cat.level}, ${
      cat.sort_order
    }, ${cat.is_active}, '${cat.created_at}', '${cat.updated_at}')${comma}\n`;
  });

  sql += `ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at;

-- Insert subcategories (level 1)
INSERT INTO categories (id, name, slug, description, parent_id, level, sort_order, is_active, created_at, updated_at) VALUES
`;

  subCategories.forEach((cat, index) => {
    const comma = index < subCategories.length - 1 ? "," : "";
    sql += `    ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${
      cat.slug
    }', '${(cat.description || "").replace(/'/g, "''")}', '${cat.parent_id}', ${
      cat.level
    }, ${cat.sort_order}, ${cat.is_active}, '${cat.created_at}', '${
      cat.updated_at
    }')${comma}\n`;
  });

  sql += `ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at;

-- Insert types (level 2)
INSERT INTO categories (id, name, slug, description, parent_id, level, sort_order, is_active, created_at, updated_at) VALUES
`;

  types.forEach((cat, index) => {
    const comma = index < types.length - 1 ? "," : "";
    sql += `    ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${
      cat.slug
    }', '${(cat.description || "").replace(/'/g, "''")}', '${cat.parent_id}', ${
      cat.level
    }, ${cat.sort_order}, ${cat.is_active}, '${cat.created_at}', '${
      cat.updated_at
    }')${comma}\n`;
  });

  sql += `ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at;

-- Verify the migration
SELECT 
    level,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY sort_order) as categories
FROM categories 
GROUP BY level
ORDER BY level;

-- Show full category hierarchy
SELECT 
    c.level,
    c.name,
    c.slug,
    parent.name as parent_name,
    c.sort_order
FROM categories c
LEFT JOIN categories parent ON c.parent_id = parent.id
ORDER BY c.level, c.sort_order, c.name;
`;

  return sql;
}

function displayCategorySummary(categories) {
  console.log("\n📊 Category Summary:");

  const byLevel = categories.reduce((acc, cat) => {
    if (!acc[cat.level]) acc[cat.level] = [];
    acc[cat.level].push(cat);
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
      console.log(
        `\n${levelName} (Level ${level}): ${byLevel[level].length} items`
      );
      byLevel[level].forEach((cat) => {
        console.log(`  - ${cat.name} (${cat.slug})`);
      });
    });
}

// Run the extraction
extractCategories();
