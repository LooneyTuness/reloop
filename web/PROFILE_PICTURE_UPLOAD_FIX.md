# Profile Picture Upload Fix

## Issue Summary

The profile picture upload was failing because of a mismatch between the code and database schema:

1. **Table Name Mismatch**: Code was trying to use `profiles` table but database only had `seller_profiles`
2. **Missing Fields**: The `seller_profiles` table was missing profile fields like `avatar_url`, `full_name`, `phone`, `bio`, etc.
3. **Incorrect Field References**: Code was using `id` field but database uses `user_id` as the primary identifier

## Files Modified

### 1. Database Schema (`web/fix-profile-picture-upload.sql`)

- Added missing profile fields to `seller_profiles` table
- Updated RLS policies to allow profile updates
- Added indexes for better performance

### 2. Data Service (`web/src/lib/supabase/data-service.ts`)

- Fixed table name from `profiles` to `seller_profiles`
- Updated field references to use `user_id` instead of `id`

### 3. TypeScript Types (`web/src/lib/supabase/supabase.types.ts`)

- Added all missing profile fields to the `seller_profiles` type definitions
- Updated Row, Insert, and Update types

### 4. Profile Manager Component (`web/src/components/seller-dashboard/SellerProfileManager.tsx`)

- Updated interface to match the actual database schema
- Added missing fields like `user_id`, `role`, `is_approved`

## How to Apply the Fix

### Step 1: Run the Database Migration

Execute the SQL migration script in your Supabase database:

```sql
-- Run this in your Supabase SQL editor
\i web/fix-profile-picture-upload.sql
```

Or copy and paste the contents of `web/fix-profile-picture-upload.sql` into your Supabase SQL editor.

### Step 2: Verify the Changes

After running the migration, verify that the fields were added:

```sql
-- Check if the new fields exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'seller_profiles'
AND column_name IN ('full_name', 'phone', 'bio', 'location', 'website', 'avatar_url', 'business_name', 'business_type', 'tax_id', 'bank_account')
ORDER BY column_name;
```

### Step 3: Test the Profile Picture Upload

1. Navigate to the seller profile page
2. Try uploading a profile picture
3. The upload should now work without errors

## What Was Fixed

✅ **Table Name**: Changed from `profiles` to `seller_profiles`  
✅ **Missing Fields**: Added `avatar_url`, `full_name`, `phone`, `bio`, `location`, `website`, `business_name`, `business_type`, `tax_id`, `bank_account`  
✅ **Field References**: Updated to use `user_id` instead of `id`  
✅ **TypeScript Types**: Updated to match the actual database schema  
✅ **RLS Policies**: Updated to allow users to update their own profiles

## Current Status

The profile picture upload functionality should now work correctly. The code properly:

- Uses the correct table name (`seller_profiles`)
- Has all required profile fields in the database
- Uses the correct field references (`user_id`)
- Has proper TypeScript type definitions

## Next Steps

After applying the database migration, test the profile picture upload feature to ensure it's working as expected.
