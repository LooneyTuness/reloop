#!/usr/bin/env node

/**
 * Remove Lingerie Category Runner
 *
 * This script helps you remove the existing lingerie category from your Supabase database.
 *
 * Instructions:
 * 1. Copy the contents of remove-lingerie-category-safe.sql
 * 2. Go to your Supabase dashboard
 * 3. Navigate to SQL Editor
 * 4. Paste and run the removal script
 *
 * The script will:
 * - Check if lingerie category exists
 * - Update any items using the category
 * - Remove the lingerie category
 * - Verify the removal
 */

const fs = require("fs");
const path = require("path");

console.log("🗑️  Remove Lingerie Category");
console.log("============================\n");

console.log("📋 Removal Steps:");
console.log("1. Open your Supabase dashboard");
console.log("2. Go to SQL Editor");
console.log("3. Copy the contents of remove-lingerie-category-safe.sql");
console.log("4. Paste and run the removal script\n");

const removalFile = path.join(__dirname, "remove-lingerie-category-safe.sql");

if (fs.existsSync(removalFile)) {
  console.log("✅ Removal file found: remove-lingerie-category-safe.sql");
  console.log("\n📄 Removal script contents:");
  console.log("─".repeat(50));

  const content = fs.readFileSync(removalFile, "utf8");
  console.log(content);

  console.log("─".repeat(50));
  console.log(
    "\n🚀 Ready to remove! Copy the above SQL and run it in Supabase."
  );
} else {
  console.log("❌ Removal file not found: remove-lingerie-category-safe.sql");
  console.log("Please make sure the file exists in the web directory.");
}

console.log("\n⚠️  Important Notes:");
console.log("- This will permanently remove the lingerie category");
console.log(
  "- Any items using this category will have their category_id set to NULL"
);
console.log("- Make sure to backup your database before running this script");
console.log("- The script is safe to run multiple times");

