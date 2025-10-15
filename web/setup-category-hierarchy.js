#!/usr/bin/env node

/**
 * Setup Category Hierarchy in Production Database
 * This script creates the category_hierarchy view and related functions
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Production database configuration
const productionSupabaseUrl = process.env.PRODUCTION_SUPABASE_URL;
const productionSupabaseKey = process.env.PRODUCTION_SUPABASE_SERVICE_ROLE_KEY;

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

async function setupCategoryHierarchy() {
  try {
    console.log("🔧 Setting up category hierarchy in production database...");

    // SQL script to create the category hierarchy
    const hierarchySQL = `
-- Drop existing objects if they exist
-- Handle both table and view cases
DROP TABLE IF EXISTS category_hierarchy CASCADE;
DROP VIEW IF EXISTS category_hierarchy CASCADE;
DROP FUNCTION IF EXISTS get_category_path(UUID);

-- Create the get_category_path function
CREATE OR REPLACE FUNCTION get_category_path(category_id UUID)
RETURNS TEXT[] AS $$
DECLARE
    result_path TEXT[];
BEGIN
    WITH RECURSIVE category_path AS (
        -- Base case: start with the given category
        SELECT 
            c.id,
            c.name,
            c.parent_id,
            c.level,
            ARRAY[c.name]::TEXT[] as path
        FROM categories c
        WHERE c.id = category_id
        
        UNION ALL
        
        -- Recursive case: go up the hierarchy
        SELECT 
            c.id,
            c.name,
            c.parent_id,
            c.level,
            c.name || cp.path as path
        FROM categories c
        JOIN category_path cp ON c.id = cp.parent_id
    )
    SELECT cp.path INTO result_path
    FROM category_path cp
    WHERE cp.parent_id IS NULL
    ORDER BY array_length(cp.path, 1) DESC
    LIMIT 1;
    
    RETURN COALESCE(result_path, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

-- Create the category_hierarchy view
CREATE OR REPLACE VIEW category_hierarchy AS
SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.level,
    c.parent_id,
    c.sort_order,
    c.is_active,
    c.created_at,
    c.updated_at,
    -- Get parent category names
    parent.name as parent_name,
    parent.slug as parent_slug,
    -- Get grandparent category names
    grandparent.name as grandparent_name,
    grandparent.slug as grandparent_slug,
    -- Get full path
    get_category_path(c.id) as full_path
FROM categories c
LEFT JOIN categories parent ON c.parent_id = parent.id
LEFT JOIN categories grandparent ON parent.parent_id = grandparent.id
WHERE c.is_active = true
ORDER BY c.level, c.sort_order, c.name;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- Create trigger for categories table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
        CREATE TRIGGER update_categories_updated_at
            BEFORE UPDATE ON categories
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
`;

    // Execute the SQL script
    console.log("📝 Creating category_hierarchy view and functions...");
    const { error: sqlError } = await productionSupabase.rpc("exec_sql", {
      sql: hierarchySQL,
    });

    if (sqlError) {
      console.error("❌ Error executing SQL:", sqlError);
      return;
    }

    console.log(
      "✅ Category hierarchy view and functions created successfully"
    );

    // Test the setup
    console.log("🔍 Testing category hierarchy setup...");

    // Test 1: Check if view exists and has data
    const { data: hierarchyData, error: hierarchyError } =
      await productionSupabase.from("category_hierarchy").select("*").limit(5);

    if (hierarchyError) {
      console.error(
        "❌ Error testing category_hierarchy view:",
        hierarchyError
      );
      return;
    }

    console.log(
      `✅ Category hierarchy view working - found ${hierarchyData.length} sample records`
    );

    // Test 2: Check category count by level
    const { data: levelCounts, error: levelError } = await productionSupabase
      .from("category_hierarchy")
      .select("level")
      .then((result) => {
        if (result.error) return result;
        const counts = result.data.reduce((acc, item) => {
          acc[item.level] = (acc[item.level] || 0) + 1;
          return acc;
        }, {});
        return { data: counts, error: null };
      });

    if (levelError) {
      console.error("❌ Error checking level counts:", levelError);
    } else {
      console.log("📊 Category count by level:");
      Object.keys(levelCounts)
        .sort()
        .forEach((level) => {
          const levelName =
            level === "0"
              ? "Main Categories"
              : level === "1"
              ? "Subcategories"
              : "Types";
          console.log(`  ${levelName}: ${levelCounts[level]} items`);
        });
    }

    // Test 3: Test the get_category_path function
    const { data: testCategories, error: testError } = await productionSupabase
      .from("categories")
      .select("id, name, slug")
      .eq("level", 2)
      .limit(3);

    if (testError) {
      console.error("❌ Error fetching test categories:", testError);
    } else if (testCategories && testCategories.length > 0) {
      console.log("🔍 Testing get_category_path function:");
      for (const category of testCategories) {
        const { data: pathData, error: pathError } =
          await productionSupabase.rpc("get_category_path", {
            category_id: category.id,
          });
        if (!pathError && pathData) {
          console.log(`  ${category.name}: ${pathData.join(" > ")}`);
        }
      }
    }

    console.log("\n✅ Category hierarchy setup completed successfully!");
    console.log("\n📋 What was created:");
    console.log("  - category_hierarchy view");
    console.log("  - get_category_path function");
    console.log("  - Database indexes for performance");
    console.log("  - Updated_at trigger for categories table");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the setup
setupCategoryHierarchy();
