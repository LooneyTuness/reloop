-- Safe Seller Profiles Setup
-- This script only creates the essential functions and updates policies
-- Use this if the seller_profiles table already exists

-- Create function to check if user is approved seller
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

-- Create function to check if user is admin
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

-- Update policies safely (drop if exists, then create)
DROP POLICY IF EXISTS "Users can view own seller profile" ON seller_profiles;
CREATE POLICY "Users can view own seller profile" ON seller_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own seller profile" ON seller_profiles;
CREATE POLICY "Users can update own seller profile" ON seller_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only admins can create seller profiles" ON seller_profiles;
CREATE POLICY "Only admins can create seller profiles" ON seller_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM seller_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin' 
      AND is_approved = true
    )
  );

DROP POLICY IF EXISTS "Only admins can approve sellers" ON seller_profiles;
CREATE POLICY "Only admins can approve sellers" ON seller_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM seller_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin' 
      AND is_approved = true
    )
  );

-- Test the functions
SELECT 
  'Functions created successfully' as status,
  is_admin() as current_user_is_admin,
  is_approved_seller() as current_user_is_approved_seller;
