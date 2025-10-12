-- Create seller profile for current user
-- This will fix the "NO_PROFILE_FOUND" issue

-- Create the seller profile
INSERT INTO seller_profiles (user_id, email, role, is_approved)
VALUES (
  auth.uid(),
  auth.jwt() ->> 'email',
  'seller',
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- Verify the profile was created
SELECT 
  'Profile created successfully' as status,
  id,
  user_id,
  email,
  role,
  is_approved,
  created_at
FROM seller_profiles 
WHERE user_id = auth.uid();

-- Test profile access again
SELECT 
  'Profile access test after creation' as test_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM seller_profiles WHERE user_id = auth.uid())
    THEN 'PROFILE_NOW_EXISTS'
    ELSE 'STILL_NO_PROFILE'
  END as access_status;
