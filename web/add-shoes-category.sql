-- Add main Shoes category to the database
-- This script adds a standalone "Shoes" category at level 0

-- Insert main Shoes category (level 0)
INSERT INTO categories (name, slug, description, level, sort_order, is_active) VALUES
    ('Shoes', 'shoes', 'Shoes for all genders and ages', 0, 5, true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert subcategories for main Shoes category (level 1)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    sc.id,
    1,
    subcat.sort_order,
    true
FROM categories sc
CROSS JOIN (VALUES 
    ('Women''s Shoes', 'shoes-women', 'Women''s shoes', 1),
    ('Men''s Shoes', 'shoes-men', 'Men''s shoes', 2),
    ('Kids'' Shoes', 'shoes-kids', 'Children''s shoes', 3),
    ('Unisex Shoes', 'shoes-unisex', 'Unisex shoes for all', 4)
) AS subcat(name, slug, description, sort_order)
WHERE sc.name = 'Shoes' AND sc.level = 0
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert types for Women's Shoes under main Shoes category (level 2)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    wsc.id,
    2,
    subcat.sort_order,
    true
FROM categories wsc
CROSS JOIN (VALUES 
    ('Heels', 'shoes-women-heels', 'Women''s high heels', 1),
    ('Flats', 'shoes-women-flats', 'Women''s flat shoes', 2),
    ('Sneakers', 'shoes-women-sneakers', 'Women''s sneakers', 3),
    ('Boots', 'shoes-women-boots', 'Women''s boots', 4),
    ('Sandals', 'shoes-women-sandals', 'Women''s sandals', 5)
) AS subcat(name, slug, description, sort_order)
WHERE wsc.slug = 'shoes-women' AND wsc.level = 1
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert types for Men's Shoes under main Shoes category (level 2)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    msc.id,
    2,
    subcat.sort_order,
    true
FROM categories msc
CROSS JOIN (VALUES 
    ('Sneakers', 'shoes-men-sneakers', 'Men''s sneakers', 1),
    ('Dress Shoes', 'shoes-men-dress', 'Men''s dress shoes', 2),
    ('Boots', 'shoes-men-boots', 'Men''s boots', 3),
    ('Loafers', 'shoes-men-loafers', 'Men''s loafers', 4),
    ('Sandals', 'shoes-men-sandals', 'Men''s sandals', 5)
) AS subcat(name, slug, description, sort_order)
WHERE msc.slug = 'shoes-men' AND msc.level = 1
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert types for Kids' Shoes under main Shoes category (level 2)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    ksc.id,
    2,
    subcat.sort_order,
    true
FROM categories ksc
CROSS JOIN (VALUES 
    ('Sneakers', 'shoes-kids-sneakers', 'Kids'' sneakers', 1),
    ('Boots', 'shoes-kids-boots', 'Kids'' boots', 2),
    ('Sandals', 'shoes-kids-sandals', 'Kids'' sandals', 3),
    ('Dress Shoes', 'shoes-kids-dress', 'Kids'' dress shoes', 4)
) AS subcat(name, slug, description, sort_order)
WHERE ksc.slug = 'shoes-kids' AND ksc.level = 1
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert types for Unisex Shoes under main Shoes category (level 2)
INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active)
SELECT 
    subcat.name,
    subcat.slug,
    subcat.description,
    usc.id,
    2,
    subcat.sort_order,
    true
FROM categories usc
CROSS JOIN (VALUES 
    ('Sneakers', 'shoes-unisex-sneakers', 'Unisex sneakers', 1),
    ('Boots', 'shoes-unisex-boots', 'Unisex boots', 2),
    ('Sandals', 'shoes-unisex-sandals', 'Unisex sandals', 3),
    ('Slip-ons', 'shoes-unisex-slipons', 'Unisex slip-on shoes', 4)
) AS subcat(name, slug, description, sort_order)
WHERE usc.slug = 'shoes-unisex' AND usc.level = 1
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    parent_id = EXCLUDED.parent_id,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Verify the categories were added
SELECT 'Categories added successfully:' as info;
SELECT level, name, slug, parent_id, sort_order FROM categories WHERE name = 'Shoes' OR slug LIKE 'shoes-%' ORDER BY level, sort_order;

