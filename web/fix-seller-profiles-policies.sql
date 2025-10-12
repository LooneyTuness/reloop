-- Fix RLS policies to allow admin access
-- This script updates the policies to work properly with the admin interface

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own seller profile" ON seller_profiles;
DROP POLICY IF EXISTS "Users can update own seller profile" ON seller_profiles;
DROP POLICY IF EXISTS "Only admins can create seller profiles" ON seller_profiles;
DROP POLICY IF EXISTS "Only admins can approve sellers" ON seller_profiles;

-- Create new policies that work with admin access

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own seller profile" ON seller_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own seller profile" ON seller_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow service role (admin API) to do everything
CREATE POLICY "Service role can do everything" ON seller_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Policy 4: Allow authenticated users to insert (for admin interface)
CREATE POLICY "Authenticated users can insert seller profiles" ON seller_profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy 5: Allow authenticated users to select all (for admin interface)
CREATE POLICY "Authenticated users can select all seller profiles" ON seller_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy 6: Allow authenticated users to update all (for admin interface)
CREATE POLICY "Authenticated users can update all seller profiles" ON seller_profiles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create helper functions
CREATE OR REPLACE FUNCTION is_approved_seller(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM seller_profiles 
    WHERE user_id = user_uuid 
    AND role = 'seller' 
    AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM seller_profiles 
    WHERE user_id = user_uuid 
    AND role = 'admin' 
    AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
