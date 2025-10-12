-- Create seller_profiles table if it doesn't exist
-- This table manages seller roles and approval status

CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'seller')),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_email ON seller_profiles(email);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_role ON seller_profiles(role);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_approved ON seller_profiles(is_approved);

-- Enable RLS (Row Level Security)
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "Users can view own seller profile" ON seller_profiles;
CREATE POLICY "Users can view own seller profile" ON seller_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own profile (except role and approval)
DROP POLICY IF EXISTS "Users can update own seller profile" ON seller_profiles;
CREATE POLICY "Users can update own seller profile" ON seller_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Only admins can insert new seller profiles
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

-- Policy: Only admins can approve/reject sellers
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
