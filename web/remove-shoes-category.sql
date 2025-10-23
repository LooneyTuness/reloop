-- Remove Shoes main category and all its subcategories
-- This script removes the entire shoes category hierarchy

-- First, delete all shoe subcategories and types (level 2)
DELETE FROM categories WHERE slug LIKE 'shoes-%' AND level = 2;

-- Then, delete all shoe subcategories (level 1) 
DELETE FROM categories WHERE slug LIKE 'shoes-%' AND level = 1;

-- Finally, delete the main shoes category (level 0)
DELETE FROM categories WHERE slug = 'shoes' AND level = 0;

-- Verify the categories were removed
SELECT 'Shoes categories removed successfully:' as info;
SELECT level, name, slug, parent_id, sort_order FROM categories WHERE name = 'Shoes' OR slug LIKE 'shoes-%' ORDER BY level, sort_order;
