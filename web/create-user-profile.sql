-- Check and create seller profile if needed
-- Run this to ensure the current user has a seller profile

-- First, check if the user has a profile
SELECT 
  'Profile check' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM seller_profiles WHERE user_id = auth.uid())
    THEN 'PROFILE_EXISTS'
    ELSE 'NO_PROFILE'
  END as status;

-- Show current profile details (if exists)
SELECT 
  'Current profile' as info,
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

-- Create profile if it doesn't exist
INSERT INTO seller_profiles (user_id, email, role, is_approved)
SELECT 
  auth.uid(),
  auth.jwt() ->> 'email',
  'seller',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM seller_profiles WHERE user_id = auth.uid()
);

-- Verify the profile was created/updated
SELECT 
  'Final profile status' as info,
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
