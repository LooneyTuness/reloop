-- Check Seller Profiles Setup
-- Run this to see what's already configured in your database

-- Check if seller_profiles table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'seller_profiles')
    THEN '✅ seller_profiles table exists'
    ELSE '❌ seller_profiles table missing'
  END as table_status;

-- Check if seller_applications table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'seller_applications')
    THEN '✅ seller_applications table exists'
    ELSE '❌ seller_applications table missing'
  END as applications_table_status;

-- Check existing policies on seller_profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'seller_profiles'
ORDER BY policyname;

-- Check if functions exist
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_approved_seller')
    THEN '✅ is_approved_seller function exists'
    ELSE '❌ is_approved_seller function missing'
  END as seller_function_status;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin')
    THEN '✅ is_admin function exists'
    ELSE '❌ is_admin function missing'
  END as admin_function_status;

-- Check current user's seller profile (if any)
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM seller_profiles WHERE user_id = auth.uid())
    THEN '✅ You have a seller profile'
    ELSE '❌ No seller profile found'
  END as profile_status;

-- Show your current profile details (if exists)
SELECT 
  id,
  email,
  role,
  is_approved,
  created_at
FROM seller_profiles 
WHERE user_id = auth.uid();
