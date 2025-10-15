-- Complete Database Fix - Add All Missing Columns and Tables
-- Run this in your Supabase SQL Editor

-- 1. Ensure categories table exists
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

-- 2. Add missing columns to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS size TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS old_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS buyer_id UUID,
ADD COLUMN IF NOT EXISTS reserved_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reserved_by UUID,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_size ON items(size);
CREATE INDEX IF NOT EXISTS idx_items_brand ON items(brand);
CREATE INDEX IF NOT EXISTS idx_items_condition ON items(condition);
CREATE INDEX IF NOT EXISTS idx_items_user_email ON items(user_email);
CREATE INDEX IF NOT EXISTS idx_items_title ON items(title);
CREATE INDEX IF NOT EXISTS idx_items_sold_at ON items(sold_at);
CREATE INDEX IF NOT EXISTS idx_items_buyer_id ON items(buyer_id);

-- 4. Insert default categories
INSERT INTO categories (id, name, slug, description, level, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Women', 'women', 'Women''s fashion and accessories', 0, 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'Men', 'men', 'Men''s fashion and accessories', 0, 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'Kids', 'kids', 'Children''s fashion and accessories', 0, 3),
    ('550e8400-e29b-41d4-a716-446655440004', 'Accessories', 'accessories', 'Fashion accessories for all', 0, 4)
ON CONFLICT (slug) DO NOTHING;

-- 5. Verify the changes
SELECT 
    'Items table columns:' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'items' 
AND column_name IN ('size', 'brand', 'condition', 'user_email', 'title', 'old_price', 'sold_at', 'buyer_id', 'reserved_until', 'reserved_by', 'category_id', 'images')
ORDER BY column_name;

-- 6. Show categories
SELECT 'Categories:' as info, id, name, slug, level FROM categories ORDER BY level, sort_order;
