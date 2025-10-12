-- Fix Profile Picture Upload Issue
-- This script adds the missing profile fields to seller_profiles table

-- Add missing profile fields to seller_profiles table
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

-- Create indexes for the new fields for better performance
CREATE INDEX IF NOT EXISTS idx_seller_profiles_full_name ON seller_profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_location ON seller_profiles(location);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_business_name ON seller_profiles(business_name);

-- Update the policies to allow users to update their profile fields
DROP POLICY IF EXISTS "Users can update own seller profile" ON seller_profiles;
CREATE POLICY "Users can update own seller profile" ON seller_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own profile (for new users)
DROP POLICY IF EXISTS "Users can create own seller profile" ON seller_profiles;
CREATE POLICY "Users can create own seller profile" ON seller_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Test the updated table structure
SELECT 
  'Profile fields added successfully' as status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'seller_profiles' 
AND column_name IN ('full_name', 'phone', 'bio', 'location', 'website', 'avatar_url', 'business_name', 'business_type', 'tax_id', 'bank_account')
ORDER BY column_name;
