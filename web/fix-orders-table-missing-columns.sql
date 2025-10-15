-- Fix Orders Table - Add Missing Address Columns and RLS Policies
-- This script adds the missing columns that the application expects
-- Run this in your production Supabase SQL Editor

-- Add missing columns to orders table
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

-- Update the user_id column to reference the buyer_id for existing records
-- This ensures backward compatibility
UPDATE orders 
SET user_id = buyer_id 
WHERE user_id IS NULL AND buyer_id IS NOT NULL;

-- Add foreign key constraint for user_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_user_id_fkey' 
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE orders 
        ADD CONSTRAINT orders_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add index for user_id for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Create RLS policies for orders table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Sellers can view orders for their items" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

-- Policy 1: Users can view their own orders (as buyers)
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id OR auth.uid() = buyer_id);

-- Policy 2: Users can insert their own orders
CREATE POLICY "Users can insert their own orders" ON orders
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id OR auth.uid() = buyer_id);

-- Policy 3: Users can update their own orders (for status changes, etc.)
CREATE POLICY "Users can update their own orders" ON orders
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id OR auth.uid() = buyer_id)
    WITH CHECK (auth.uid() = user_id OR auth.uid() = buyer_id);

-- Policy 4: Sellers can view orders for their items
CREATE POLICY "Sellers can view orders for their items" ON orders
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = seller_id);

-- Policy 5: Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));

-- Ensure RLS is enabled on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for order_items table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view order items for their orders" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items for their orders" ON order_items;
DROP POLICY IF EXISTS "Sellers can view order items for their orders" ON order_items;

-- Policy 1: Users can view order items for their orders
CREATE POLICY "Users can view order items for their orders" ON order_items
    FOR SELECT 
    TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (auth.uid() = orders.user_id OR auth.uid() = orders.buyer_id)
    ));

-- Policy 2: Users can insert order items for their orders
CREATE POLICY "Users can insert order items for their orders" ON order_items
    FOR INSERT 
    TO authenticated 
    WITH CHECK (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (auth.uid() = orders.user_id OR auth.uid() = orders.buyer_id)
    ));

-- Policy 3: Sellers can view order items for their orders
CREATE POLICY "Sellers can view order items for their orders" ON order_items
    FOR SELECT 
    TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND auth.uid() = orders.seller_id
    ));

-- Ensure RLS is enabled on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verify RLS policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;
