-- Insert Categories into Production Database
-- Run this script in your production Supabase SQL Editor

-- First, let's check what categories already exist
SELECT 'Current categories in production:' as info;
SELECT level, COUNT(*) as count FROM categories GROUP BY level ORDER BY level;

-- Insert main categories (level 0) - Women, Men, Kids, Accessories
INSERT INTO categories (name, slug, description, level, sort_order, is_active) VALUES
    ('Women', 'women', 'Women''s fashion and accessories', 0, 1, true),
    ('Men', 'men', 'Men''s fashion and accessories', 0, 2, true),
    ('Kids', 'kids', 'Children''s fashion and accessories', 0, 3, true),
    ('Accessories', 'accessories', 'Fashion accessories for all', 0, 4, true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert subcategories for Women (level 1)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    wc.id,
    1,
    subcat.sort_order,
    true
FROM categories wc
CROSS JOIN (VALUES 
    ('Clothing', 'women-clothing', 'Women''s clothing', 1),
    ('Shoes', 'women-shoes', 'Women''s shoes', 2),
    ('Bags', 'women-bags', 'Women''s bags and purses', 3),
    ('Jewelry', 'women-jewelry', 'Women''s jewelry', 4),
    ('Beauty', 'women-beauty', 'Beauty and cosmetics', 5)
) AS subcat(name, slug, description, sort_order)
WHERE wc.name = 'Women' AND wc.level = 0
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert subcategories for Men (level 1)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    mc.id,
    1,
    subcat.sort_order,
    true
FROM categories mc
CROSS JOIN (VALUES 
    ('Clothing', 'men-clothing', 'Men''s clothing', 1),
    ('Shoes', 'men-shoes', 'Men''s shoes', 2),
    ('Bags', 'men-bags', 'Men''s bags and accessories', 3),
    ('Watches', 'men-watches', 'Men''s watches', 4),
    ('Grooming', 'men-grooming', 'Men''s grooming products', 5)
) AS subcat(name, slug, description, sort_order)
WHERE mc.name = 'Men' AND mc.level = 0
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert subcategories for Kids (level 1)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    kc.id,
    1,
    subcat.sort_order,
    true
FROM categories kc
CROSS JOIN (VALUES 
    ('Clothing', 'kids-clothing', 'Children''s clothing', 1),
    ('Shoes', 'kids-shoes', 'Children''s shoes', 2),
    ('Toys', 'kids-toys', 'Toys and games', 3),
    ('Books', 'kids-books', 'Children''s books', 4),
    ('Accessories', 'kids-accessories', 'Children''s accessories', 5)
) AS subcat(name, slug, description, sort_order)
WHERE kc.name = 'Kids' AND kc.level = 0
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert subcategories for Accessories (level 1)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    ac.id,
    1,
    subcat.sort_order,
    true
FROM categories ac
CROSS JOIN (VALUES 
    ('Bags', 'accessories-bags', 'Handbags and purses', 1),
    ('Jewelry', 'accessories-jewelry', 'Jewelry and watches', 2),
    ('Sunglasses', 'accessories-sunglasses', 'Sunglasses and eyewear', 3),
    ('Scarves', 'accessories-scarves', 'Scarves and wraps', 4),
    ('Belts', 'accessories-belts', 'Belts and buckles', 5)
) AS subcat(name, slug, description, sort_order)
WHERE ac.name = 'Accessories' AND ac.level = 0
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert types (level 2) for Women's Clothing
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    type.name,
    type.slug,
    type.description,
    wc.id,
    2,
    type.sort_order,
    true
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
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert types for Men's Clothing
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    type.name,
    type.slug,
    type.description,
    mc.id,
    2,
    type.sort_order,
    true
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
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert types for Women's Shoes
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    type.name,
    type.slug,
    type.description,
    ws.id,
    2,
    type.sort_order,
    true
FROM categories ws
CROSS JOIN (VALUES 
    ('Heels', 'women-shoes-heels', 'Women''s high heels', 1),
    ('Flats', 'women-shoes-flats', 'Women''s flat shoes', 2),
    ('Sneakers', 'women-shoes-sneakers', 'Women''s sneakers', 3),
    ('Boots', 'women-shoes-boots', 'Women''s boots', 4),
    ('Sandals', 'women-shoes-sandals', 'Women''s sandals', 5)
) AS type(name, slug, description, sort_order)
WHERE ws.slug = 'women-shoes' AND ws.level = 1
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert types for Men's Shoes
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    type.name,
    type.slug,
    type.description,
    ms.id,
    2,
    type.sort_order,
    true
FROM categories ms
CROSS JOIN (VALUES 
    ('Sneakers', 'men-shoes-sneakers', 'Men''s sneakers', 1),
    ('Dress Shoes', 'men-shoes-dress', 'Men''s dress shoes', 2),
    ('Boots', 'men-shoes-boots', 'Men''s boots', 3),
    ('Loafers', 'men-shoes-loafers', 'Men''s loafers', 4),
    ('Sandals', 'men-shoes-sandals', 'Men''s sandals', 5)
) AS type(name, slug, description, sort_order)
WHERE ms.slug = 'men-shoes' AND ms.level = 1
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Verify the migration
SELECT 'Final category count by level:' as info;
SELECT level, COUNT(*) as count FROM categories GROUP BY level ORDER BY level;

-- Show the full category hierarchy
SELECT 'Full category hierarchy:' as info;
SELECT 
    c.level,
    c.name,
    c.slug,
    parent.name as parent_name,
    c.sort_order
FROM categories c
LEFT JOIN categories parent ON c.parent_id = parent.id
ORDER BY c.level, c.sort_order, c.name;
