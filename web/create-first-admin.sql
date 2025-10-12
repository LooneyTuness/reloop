-- Create First Admin User Script
-- Run this script to create your first admin user for managing seller applications

-- Replace 'your-admin-email@domain.com' with your actual email address
-- This script will:
-- 1. Create a user in auth.users (if they don't exist)
-- 2. Create a seller profile with admin role
-- 3. Set them as approved

-- Step 1: Create admin user in auth.users (if not exists)
-- Note: You'll need to run this manually in Supabase Auth or use the Supabase dashboard
-- to create the user first, then run the INSERT below

-- Step 2: Create admin seller profile
-- Replace 'your-admin-email@domain.com' with your actual email
-- Replace 'your-user-id-from-auth-users' with the actual user ID from auth.users

INSERT INTO seller_profiles (user_id, email, role, is_approved)
SELECT 
  id as user_id,
  email,
  'admin' as role,
  true as is_approved
FROM auth.users
WHERE email = 'your-admin-email@domain.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  is_approved = true;

-- Verify the admin was created
SELECT 
  sp.id,
  sp.email,
  sp.role,
  sp.is_approved,
  sp.created_at
FROM seller_profiles sp
WHERE sp.email = 'your-admin-email@domain.com'
AND sp.role = 'admin'
AND sp.is_approved = true;

-- Test admin functions
SELECT 
  is_admin() as current_user_is_admin,
  is_approved_seller() as current_user_is_approved_seller;
