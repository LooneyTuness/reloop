-- Fix Row Level Security Policies for Items Table
-- Run this in your Supabase SQL Editor

-- 1. First, let's check the current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'items';

-- 2. Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'items';

-- 3. Drop existing policies if they exist (to start fresh)
DROP POLICY IF EXISTS "Users can insert their own items" ON items;
DROP POLICY IF EXISTS "Users can view all items" ON items;
DROP POLICY IF EXISTS "Users can update their own items" ON items;
DROP POLICY IF EXISTS "Users can delete their own items" ON items;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON items;
DROP POLICY IF EXISTS "Enable read access for all users" ON items;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON items;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON items;

-- 4. Create proper RLS policies for items table

-- Policy 1: Allow authenticated users to insert items
CREATE POLICY "Enable insert for authenticated users only" ON items
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Policy 2: Allow everyone to read items (for public catalog)
CREATE POLICY "Enable read access for all users" ON items
    FOR SELECT 
    TO public 
    USING (is_active = true);

-- Policy 3: Allow users to update their own items
CREATE POLICY "Enable update for users based on user_id" ON items
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow users to delete their own items
CREATE POLICY "Enable delete for users based on user_id" ON items
    FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- 5. Ensure RLS is enabled on the items table
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 6. Verify the policies were created
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
WHERE tablename = 'items'
ORDER BY policyname;
