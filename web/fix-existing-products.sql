-- Fix existing products by linking them to categories based on category name
-- This script will update existing products to have proper category_id references

-- First, let's see what products we have and their current category values
SELECT 
    i.id, 
    i.name, 
    i.title, 
    i.category, 
    i.category_id,
    i.created_at
FROM items i
WHERE i.is_active = true 
ORDER BY i.created_at DESC;

-- Update products with category 'Women' to link to Women category
UPDATE items 
SET category_id = (
    SELECT id FROM categories 
    WHERE name = 'Women' AND level = 0 
    LIMIT 1
)
WHERE category = 'Women' 
AND category_id IS NULL;

-- Update products with category 'clothing' to link to Women's Clothing subcategory
UPDATE items 
SET category_id = (
    SELECT id FROM categories 
    WHERE name = 'Clothing' AND level = 1 
    AND parent_id = (SELECT id FROM categories WHERE name = 'Women' AND level = 0)
    LIMIT 1
)
WHERE category = 'clothing' 
AND category_id IS NULL;

-- Update products with category 'Men' to link to Men category
UPDATE items 
SET category_id = (
    SELECT id FROM categories 
    WHERE name = 'Men' AND level = 0 
    LIMIT 1
)
WHERE category = 'Men' 
AND category_id IS NULL;

-- Update products with category 'Accessories' to link to Accessories category
UPDATE items 
SET category_id = (
    SELECT id FROM categories 
    WHERE name = 'Accessories' AND level = 0 
    LIMIT 1
)
WHERE category = 'Accessories' 
AND category_id IS NULL;

-- Update products with category 'Kids' to link to Kids category
UPDATE items 
SET category_id = (
    SELECT id FROM categories 
    WHERE name = 'Kids' AND level = 0 
    LIMIT 1
)
WHERE category = 'Kids' 
AND category_id IS NULL;

-- For products with no category or unrecognized category, assign to a default category
-- Let's use Women as the default since it's the first main category
UPDATE items 
SET category_id = (
    SELECT id FROM categories 
    WHERE name = 'Women' AND level = 0 
    LIMIT 1
)
WHERE (category IS NULL OR category = '') 
AND category_id IS NULL;

-- Show the updated results
SELECT 
    i.id, 
    i.name, 
    i.title, 
    i.category, 
    i.category_id,
    c.name as category_name,
    c.level as category_level
FROM items i
LEFT JOIN categories c ON i.category_id = c.id
WHERE i.is_active = true 
ORDER BY i.created_at DESC;
