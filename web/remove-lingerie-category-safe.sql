-- Safe Remove Lingerie Category Script
-- This script safely removes the existing lingerie category from the database

-- Check if lingerie category exists
DO $$
DECLARE
    lingerie_count INTEGER;
    lingerie_id UUID;
BEGIN
    -- Check if lingerie category exists and get its ID
    SELECT COUNT(*), id INTO lingerie_count, lingerie_id
    FROM categories 
    WHERE slug = 'women-clothing-lingerie'
    LIMIT 1;
    
    IF lingerie_count > 0 THEN
        RAISE NOTICE 'Found lingerie category with ID: %', lingerie_id;
        
        -- Check if any items are using this category
        IF EXISTS (SELECT 1 FROM items WHERE category_id = lingerie_id) THEN
            RAISE NOTICE 'Found items using lingerie category. Setting category_id to NULL...';
            
            -- Update items to remove category reference
            UPDATE items 
            SET category_id = NULL 
            WHERE category_id = lingerie_id;
            
            RAISE NOTICE 'Updated % items to remove lingerie category reference', 
                (SELECT COUNT(*) FROM items WHERE category_id = lingerie_id);
        END IF;
        
        -- Remove the lingerie category
        DELETE FROM categories 
        WHERE id = lingerie_id;
        
        RAISE NOTICE 'Successfully removed lingerie category';
    ELSE
        RAISE NOTICE 'Lingerie category not found - nothing to remove';
    END IF;
END $$;

-- Verify the removal
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'SUCCESS: Lingerie category removed'
        ELSE 'WARNING: Lingerie category still exists'
    END as status
FROM categories 
WHERE slug = 'women-clothing-lingerie';

-- Show remaining women's clothing categories
SELECT 
    'Remaining Women''s Clothing Categories:' as info,
    level,
    name,
    slug,
    sort_order
FROM categories 
WHERE parent_id IN (
    SELECT id FROM categories 
    WHERE slug = 'women-clothing' AND level = 1
)
ORDER BY sort_order, name;
