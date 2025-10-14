# Items Table Analysis

## Current Table Structure (from your data)

Based on the INSERT statement, your `items` table has these columns:

- `id` (UUID)
- `name` (TEXT)
- `title` (TEXT)
- `description` (TEXT)
- `price` (DECIMAL)
- `old_price` (DECIMAL, nullable)
- `condition` (TEXT)
- `size` (TEXT)
- `brand` (TEXT, nullable)
- `category` (TEXT)
- `photos` (JSONB array)
- `seller_id` (TEXT, nullable) ← Different from what we expected
- `status` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `user_id` (UUID)
- `user_email` (TEXT)
- `is_active` (BOOLEAN)
- `quantity` (INTEGER)
- `sold_at` (TIMESTAMP, nullable)
- `buyer_id` (UUID, nullable)
- `reserved_until` (TIMESTAMP, nullable)
- `reserved_by` (UUID, nullable)
- `deleted_at` (TIMESTAMP, nullable)
- `seller` (TEXT, nullable) ← This exists!

## Issues Found

1. **Column Name Mismatch**: Your table has `seller_id` but the code expects `seller`
2. **Photos Format**: Photos are stored as JSONB array, not string array
3. **Data Types**: Some fields might have different types than expected

## Solutions Needed

1. Update the code to use `seller_id` instead of `seller`
2. Fix the photos handling to work with JSONB format
3. Update TypeScript types to match actual schema

