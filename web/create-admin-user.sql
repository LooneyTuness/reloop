-- Create Admin User Script
-- Run this in your Supabase SQL Editor to create an admin user

-- Step 1: First, you need to create the user in Supabase Auth
-- Go to Authentication > Users in your Supabase dashboard and create a user manually
-- OR use the Supabase Admin API to create the user programmatically
-- 
-- For manual creation:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Enter email and password
-- 4. Set "Email Confirm" to true
-- 5. Note down the User ID that gets generated

-- Step 2: Insert the admin profile into seller_profiles table
-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from step 1
-- Replace 'admin@yourdomain.com' with the admin's email
-- Replace 'Admin Name' with the admin's full name

INSERT INTO seller_profiles (
    user_id,
    email,
    full_name,
    role,
    business_name,
    is_approved,
    created_at,
    updated_at
) VALUES (
    'YOUR_USER_ID_HERE',  -- Replace with actual user ID from Supabase Auth
    'admin@yourdomain.com',  -- Replace with admin email
    'Admin Name',  -- Replace with admin's full name
    'admin',
    'Platform Administration',
    true,
    NOW(),
    NOW()
);

-- Step 3: Verify the admin was created
SELECT 
    id,
    user_id,
    email,
    full_name,
    role,
    is_approved,
    created_at
FROM seller_profiles 
WHERE role = 'admin';

-- Optional: Create additional admin users by repeating the INSERT statement
-- with different user IDs and details
