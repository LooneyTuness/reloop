-- Temporarily Disable RLS for Testing
-- Run this in your Supabase SQL Editor

-- 1. Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'items';

-- 2. Disable RLS temporarily (for testing only)
ALTER TABLE items DISABLE ROW LEVEL SECURITY;

-- 3. Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'items';

-- WARNING: This disables security! Only use for testing.
-- Remember to re-enable RLS and add proper policies later.
