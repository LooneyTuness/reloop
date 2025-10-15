-- Quick Fix for Production Database
-- Run this in your Supabase SQL Editor

-- 1. Add category_id column to items table if it doesn't exist
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 2. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);

-- 3. Ensure categories table exists
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- 5. Insert default categories
INSERT INTO categories (id, name, slug, description, level, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Women', 'women', 'Women''s fashion and accessories', 0, 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'Men', 'men', 'Men''s fashion and accessories', 0, 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'Kids', 'kids', 'Children''s fashion and accessories', 0, 3),
    ('550e8400-e29b-41d4-a716-446655440004', 'Accessories', 'accessories', 'Fashion accessories for all', 0, 4)
ON CONFLICT (slug) DO NOTHING;

-- 6. Verify the fix
SELECT 
    'Items table columns:' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'items' 
AND column_name IN ('category_id', 'category')
ORDER BY column_name;
