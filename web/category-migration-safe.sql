-- Safe Category System Migration
-- This script safely creates/updates the hierarchical category system without breaking existing functionality

-- Drop only the category-specific objects
DROP VIEW IF EXISTS category_hierarchy;
DROP FUNCTION IF EXISTS get_category_path(UUID);

-- Create categories table for hierarchical categories (if not exists)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 0, -- 0: main category, 1: subcategory, 2: type
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Add category_id to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);

-- Clear existing categories data
DELETE FROM categories;

-- Insert main categories
INSERT INTO categories (id, name, slug, description, level, sort_order) VALUES
    (gen_random_uuid(), 'Women', 'women', 'Women''s fashion and accessories', 0, 1),
    (gen_random_uuid(), 'Men', 'men', 'Men''s fashion and accessories', 0, 2),
    (gen_random_uuid(), 'Kids', 'kids', 'Children''s fashion and accessories', 0, 3),
    (gen_random_uuid(), 'Accessories', 'accessories', 'Fashion accessories for all', 0, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Women
INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    wc.id,
    1,
    subcat.sort_order
FROM categories wc
CROSS JOIN (VALUES 
    ('Clothing', 'women-clothing', 'Women''s clothing', 1),
    ('Shoes', 'women-shoes', 'Women''s shoes', 2),
    ('Bags', 'women-bags', 'Women''s bags and purses', 3),
    ('Jewelry', 'women-jewelry', 'Women''s jewelry', 4),
    ('Beauty', 'women-beauty', 'Beauty and cosmetics', 5)
) AS subcat(name, slug, description, sort_order)
WHERE wc.name = 'Women' AND wc.level = 0
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Men
INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    mc.id,
    1,
    subcat.sort_order
FROM categories mc
CROSS JOIN (VALUES 
    ('Clothing', 'men-clothing', 'Men''s clothing', 1),
    ('Shoes', 'men-shoes', 'Men''s shoes', 2),
    ('Bags', 'men-bags', 'Men''s bags and accessories', 3),
    ('Watches', 'men-watches', 'Men''s watches', 4),
    ('Grooming', 'men-grooming', 'Men''s grooming products', 5)
) AS subcat(name, slug, description, sort_order)
WHERE mc.name = 'Men' AND mc.level = 0
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Kids
INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    kc.id,
    1,
    subcat.sort_order
FROM categories kc
CROSS JOIN (VALUES 
    ('Clothing', 'kids-clothing', 'Children''s clothing', 1),
    ('Shoes', 'kids-shoes', 'Children''s shoes', 2),
    ('Toys', 'kids-toys', 'Toys and games', 3),
    ('Books', 'kids-books', 'Children''s books', 4),
    ('Accessories', 'kids-accessories', 'Children''s accessories', 5)
) AS subcat(name, slug, description, sort_order)
WHERE kc.name = 'Kids' AND kc.level = 0
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Accessories
INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    ac.id,
    1,
    subcat.sort_order
FROM categories ac
CROSS JOIN (VALUES 
    ('Bags', 'accessories-bags', 'Handbags and purses', 1),
    ('Jewelry', 'accessories-jewelry', 'Jewelry and watches', 2),
    ('Sunglasses', 'accessories-sunglasses', 'Sunglasses and eyewear', 3),
    ('Scarves', 'accessories-scarves', 'Scarves and wraps', 4),
    ('Belts', 'accessories-belts', 'Belts and buckles', 5)
) AS subcat(name, slug, description, sort_order)
WHERE ac.name = 'Accessories' AND ac.level = 0
ON CONFLICT (slug) DO NOTHING;

-- Insert types (level 2) for Women's Clothing
INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
SELECT 
    type.name,
    type.slug,
    type.description,
    wc.id,
    2,
    type.sort_order
FROM categories wc
CROSS JOIN (VALUES 
    ('Dresses', 'women-clothing-dresses', 'Women''s dresses', 1),
    ('Wedding Dresses', 'women-clothing-wedding-dresses', 'Women''s wedding dresses and bridal wear', 2),
    ('Tops', 'women-clothing-tops', 'Women''s tops and blouses', 3),
    ('Bottoms', 'women-clothing-bottoms', 'Women''s pants and skirts', 4),
    ('Jackets', 'women-clothing-jackets', 'Women''s jackets and coats', 5),
    ('Activewear', 'women-clothing-activewear', 'Women''s activewear', 6)
) AS type(name, slug, description, sort_order)
WHERE wc.slug = 'women-clothing' AND wc.level = 1
ON CONFLICT (slug) DO NOTHING;

-- Insert types for Men's Clothing
INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
SELECT 
    type.name,
    type.slug,
    type.description,
    mc.id,
    2,
    type.sort_order
FROM categories mc
CROSS JOIN (VALUES 
    ('Shirts', 'men-clothing-shirts', 'Men''s shirts and polos', 1),
    ('T-Shirts', 'men-clothing-t-shirts', 'Men''s t-shirts and tanks', 2),
    ('Pants', 'men-clothing-pants', 'Men''s pants and trousers', 3),
    ('Shorts', 'men-clothing-shorts', 'Men''s shorts', 4),
    ('Jackets', 'men-clothing-jackets', 'Men''s jackets and coats', 5),
    ('Suits', 'men-clothing-suits', 'Men''s suits and formal wear', 6)
) AS type(name, slug, description, sort_order)
WHERE mc.slug = 'men-clothing' AND mc.level = 1
ON CONFLICT (slug) DO NOTHING;

-- Insert types for Women's Shoes
INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
SELECT 
    type.name,
    type.slug,
    type.description,
    ws.id,
    2,
    type.sort_order
FROM categories ws
CROSS JOIN (VALUES 
    ('Heels', 'women-shoes-heels', 'Women''s high heels', 1),
    ('Flats', 'women-shoes-flats', 'Women''s flat shoes', 2),
    ('Sneakers', 'women-shoes-sneakers', 'Women''s sneakers', 3),
    ('Boots', 'women-shoes-boots', 'Women''s boots', 4),
    ('Sandals', 'women-shoes-sandals', 'Women''s sandals', 5)
) AS type(name, slug, description, sort_order)
WHERE ws.slug = 'women-shoes' AND ws.level = 1
ON CONFLICT (slug) DO NOTHING;

-- Insert types for Men's Shoes
INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
SELECT 
    type.name,
    type.slug,
    type.description,
    ms.id,
    2,
    type.sort_order
FROM categories ms
CROSS JOIN (VALUES 
    ('Sneakers', 'men-shoes-sneakers', 'Men''s sneakers', 1),
    ('Dress Shoes', 'men-shoes-dress', 'Men''s dress shoes', 2),
    ('Boots', 'men-shoes-boots', 'Men''s boots', 3),
    ('Loafers', 'men-shoes-loafers', 'Men''s loafers', 4),
    ('Sandals', 'men-shoes-sandals', 'Men''s sandals', 5)
) AS type(name, slug, description, sort_order)
WHERE ms.slug = 'men-shoes' AND ms.level = 1
ON CONFLICT (slug) DO NOTHING;

-- Create a function to get category path (with proper type casting)
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

-- Create a view for easy category hierarchy queries
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

-- Add trigger to update updated_at timestamp (only if function doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        EXECUTE 'CREATE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql';
    END IF;
END $$;

-- Create trigger for categories table (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
        CREATE TRIGGER update_categories_updated_at
            BEFORE UPDATE ON categories
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Verify the category structure
SELECT 
    level,
    name,
    slug,
    parent_id,
    sort_order
FROM categories 
ORDER BY level, sort_order, name;
