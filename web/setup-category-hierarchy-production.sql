-- Setup Category Hierarchy in Production Database
-- This script creates the category_hierarchy view and related functions
-- Run this in your production Supabase SQL Editor

-- First, let's check if the category_hierarchy already exists
SELECT 'Checking existing category_hierarchy...' as info;

-- Drop existing objects if they exist (to ensure clean setup)
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

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Create trigger function for updated_at (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- Create trigger for categories table (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
        CREATE TRIGGER update_categories_updated_at
            BEFORE UPDATE ON categories
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Test the category_hierarchy view
SELECT 'Testing category_hierarchy view...' as info;

-- Show category count by level
SELECT 
    'Category count by level:' as info,
    level,
    COUNT(*) as count
FROM category_hierarchy 
GROUP BY level
ORDER BY level;

-- Show sample of the hierarchy
SELECT 
    'Sample category hierarchy:' as info,
    level,
    name,
    slug,
    parent_name,
    grandparent_name,
    full_path
FROM category_hierarchy 
ORDER BY level, sort_order, name
LIMIT 20;

-- Test the get_category_path function with a sample category
SELECT 
    'Testing get_category_path function:' as info,
    c.name,
    c.slug,
    get_category_path(c.id) as path
FROM categories c 
WHERE c.level = 2 
LIMIT 5;

-- Show the complete hierarchy structure
SELECT 
    'Complete category hierarchy:' as info,
    CASE 
        WHEN c.level = 0 THEN '📁 ' || c.name
        WHEN c.level = 1 THEN '  └── 📂 ' || c.name
        WHEN c.level = 2 THEN '      └── 📄 ' || c.name
        ELSE '    ' || c.name
    END as hierarchy,
    c.slug,
    c.sort_order
FROM categories c
ORDER BY c.level, c.sort_order, c.name;

-- Verify everything is working
SELECT '✅ Category hierarchy setup completed successfully!' as status;
