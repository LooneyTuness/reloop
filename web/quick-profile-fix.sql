-- Quick Fix for Profile Picture Upload
-- Run this in your Supabase SQL Editor

-- Step 1: Add missing fields to seller_profiles table
ALTER TABLE seller_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS bank_account TEXT;

-- Step 2: Update RLS policies to allow profile updates
DROP POLICY IF EXISTS "Users can update own seller profile" ON seller_profiles;
CREATE POLICY "Users can update own seller profile" ON seller_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 3: Allow users to create their own profile if it doesn't exist
DROP POLICY IF EXISTS "Users can create own seller profile" ON seller_profiles;
CREATE POLICY "Users can create own seller profile" ON seller_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 4: Verify the changes
SELECT 
  'Migration completed successfully' as status,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'seller_profiles' 
AND column_name IN ('full_name', 'phone', 'bio', 'location', 'website', 'avatar_url', 'business_name', 'business_type', 'tax_id', 'bank_account')
ORDER BY column_name;
