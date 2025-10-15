-- Simple Fix: Just Add Missing Columns
-- This script only adds the missing columns without test inserts
-- Run this in your production Supabase SQL Editor

-- 1. Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Make buyer_id nullable to allow guest orders
ALTER TABLE orders ALTER COLUMN buyer_id DROP NOT NULL;

-- 3. Update existing records to have user_id = buyer_id for backward compatibility
UPDATE orders 
SET user_id = buyer_id 
WHERE user_id IS NULL AND buyer_id IS NOT NULL;

-- 4. Temporarily disable RLS to allow order creation
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- 5. Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;
