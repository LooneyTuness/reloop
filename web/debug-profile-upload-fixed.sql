-- Debug seller profile and check for issues (Fixed version)
-- Run this to see what might be causing the upload failure

-- Check your current seller profile details
SELECT 
  'Your seller profile' as info,
  id,
  user_id,
  email,
  role,
  is_approved,
  full_name,
  phone,
  bio,
  location,
  website,
  avatar_url,
  business_name,
  business_type,
  tax_id,
  bank_account,
  created_at,
  updated_at
FROM seller_profiles 
WHERE user_id = auth.uid();

-- Check if all the new profile fields exist in the table
SELECT 
  'Table structure check' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'seller_profiles' 
AND column_name IN ('full_name', 'phone', 'bio', 'location', 'website', 'avatar_url', 'business_name', 'business_type', 'tax_id', 'bank_account')
ORDER BY column_name;

-- Test if you can update your profile (simplified version)
UPDATE seller_profiles 
SET updated_at = NOW()
WHERE user_id = auth.uid();

-- Check if the update worked
SELECT 
  'Profile update test completed' as test_type,
  'Check if updated_at changed' as note;
