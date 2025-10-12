-- Clean up conflicting RLS policies
-- Run this to fix the policy conflicts

-- Remove the overly permissive policies that conflict with user-specific ones
DROP POLICY IF EXISTS "Authenticated users can insert seller profiles" ON seller_profiles;
DROP POLICY IF EXISTS "Authenticated users can select all seller profiles" ON seller_profiles;
DROP POLICY IF EXISTS "Authenticated users can update all seller profiles" ON seller_profiles;

-- Keep only the proper user-specific policies
-- These should already exist from the previous migration:
-- - "Users can view own seller profile"
-- - "Users can update own seller profile" 
-- - "Users can create own seller profile"
-- - "Service role can do everything"

-- Verify the remaining policies
SELECT 
  'Remaining RLS Policies' as info,
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'seller_profiles'
ORDER BY policyname;

-- Test if the current user can access their profile
SELECT 
  'Profile access test' as test_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM seller_profiles WHERE user_id = auth.uid())
    THEN 'CAN_ACCESS_PROFILE'
    ELSE 'NO_PROFILE_FOUND'
  END as access_status;
