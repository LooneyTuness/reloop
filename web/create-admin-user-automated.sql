-- Automated Admin User Creation Script
-- This script creates both the auth user and seller profile automatically
-- Run this in your Supabase SQL Editor

-- Note: This approach uses Supabase's built-in functions
-- Make sure you have the necessary permissions to create users

-- Step 1: Create the auth user using Supabase's auth.admin.create_user function
-- This will be executed via the Supabase Admin API, not directly in SQL
-- You'll need to run this via your application or a script

-- Step 2: Insert admin profile (run this after creating the auth user)
-- Replace the user_id with the one generated from the auth user creation

DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'admin@yourdomain.com';
    admin_name TEXT := 'Platform Administrator';
BEGIN
    -- Check if admin already exists
    SELECT user_id INTO admin_user_id 
    FROM seller_profiles 
    WHERE email = admin_email AND role = 'admin';
    
    IF admin_user_id IS NULL THEN
        -- Insert admin profile
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
            gen_random_uuid(),  -- This will be replaced with actual user_id
            admin_email,
            admin_name,
            'admin',
            'Platform Administration',
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Admin profile created successfully';
    ELSE
        RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
    END IF;
END $$;

-- Step 3: Verify admin creation
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
WHERE role = 'admin'
ORDER BY created_at DESC;
