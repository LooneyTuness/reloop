-- Remove Lingerie Category Script
-- This script removes the existing lingerie category from the database

-- First, update any items that are using the lingerie category
-- Set their category_id to NULL
UPDATE items 
SET category_id = NULL 
WHERE category_id IN (
    SELECT id FROM categories 
    WHERE slug = 'women-clothing-lingerie'
);

-- Remove the lingerie category
DELETE FROM categories 
WHERE slug = 'women-clothing-lingerie';

-- Verify the removal
SELECT 
    level,
    name,
    slug,
    parent_id,
    sort_order
FROM categories 
WHERE name ILIKE '%lingerie%'
ORDER BY level, sort_order, name;

-- Show remaining women's clothing categories
SELECT 
    level,
    name,
    slug,
    parent_id,
    sort_order
FROM categories 
WHERE parent_id IN (
    SELECT id FROM categories 
    WHERE slug = 'women-clothing' AND level = 1
)
ORDER BY level, sort_order, name;
