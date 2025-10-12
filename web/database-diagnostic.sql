-- Database Diagnostic Script
-- Run this to check the current state of your database

-- Check if seller_profiles table exists and its structure
SELECT 
  'seller_profiles table check' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'seller_profiles')
    THEN 'EXISTS'
    ELSE 'MISSING'
  END as table_status;

-- Show current columns in seller_profiles table
SELECT 
  'Current seller_profiles columns' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'seller_profiles'
ORDER BY ordinal_position;

-- Check if the user has a seller profile
SELECT 
  'User profile check' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM seller_profiles WHERE user_id = auth.uid())
    THEN 'HAS_PROFILE'
    ELSE 'NO_PROFILE'
  END as profile_status;

-- Show current user's profile (if exists)
SELECT 
  'Current user profile' as info,
  id,
  user_id,
  email,
  role,
  is_approved,
  full_name,
  avatar_url,
  created_at
FROM seller_profiles 
WHERE user_id = auth.uid();

-- Check RLS policies on seller_profiles
SELECT 
  'RLS Policies' as info,
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'seller_profiles'
ORDER BY policyname;
