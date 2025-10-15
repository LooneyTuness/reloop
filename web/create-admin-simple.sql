-- Simple Admin User Creation
-- This matches your exact table schema

-- Step 1: First create the auth user in Supabase Dashboard
-- Go to Authentication > Users > Add user
-- Set email, password, and Email Confirm = true
-- Copy the generated User ID

-- Step 2: Insert admin profile (replace YOUR_USER_ID_HERE with actual user ID)
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
    'Platform Administrator',  -- Replace with admin's full name
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
    business_name,
    created_at
FROM seller_profiles 
WHERE role = 'admin';
