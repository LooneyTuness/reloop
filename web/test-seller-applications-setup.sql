-- Test script to verify seller application system setup
-- Run this in your Supabase SQL editor to test the database setup

-- Test 1: Check if seller_applications table exists
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'seller_applications'
ORDER BY ordinal_position;

-- Test 2: Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'seller_applications';

-- Test 3: Insert a test application (this should work)
INSERT INTO seller_applications (
  full_name,
  email,
  store_name,
  website_social,
  product_description,
  understands_application,
  status
) VALUES (
  'Test User',
  'test@example.com',
  'Test Store',
  'https://instagram.com/test',
  'Test products for verification',
  true,
  'pending'
);

-- Test 4: Verify the insert worked
SELECT * FROM seller_applications WHERE email = 'test@example.com';

-- Test 5: Clean up test data
DELETE FROM seller_applications WHERE email = 'test@example.com';

-- Test 6: Verify cleanup
SELECT COUNT(*) as remaining_test_records FROM seller_applications WHERE email = 'test@example.com';
