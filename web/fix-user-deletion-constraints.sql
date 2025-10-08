-- Fix foreign key constraints to allow user deletion
-- This script updates the orders table to handle user deletions properly

-- 1. First, let's see the current constraint
-- Check existing foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'orders'
  AND kcu.column_name = 'user_id';

-- 2. Drop the existing foreign key constraint
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- 3. Add a new foreign key constraint with ON DELETE SET NULL
-- This will set user_id to NULL when a user is deleted
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE SET NULL;

-- 4. Make user_id nullable (if it isn't already)
ALTER TABLE public.orders 
ALTER COLUMN user_id DROP NOT NULL;

-- 5. Optional: Add a check constraint to ensure we have either user_id or guest info
-- This ensures data integrity while allowing guest orders
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_or_guest_check 
CHECK (
  (user_id IS NOT NULL) OR 
  (user_id IS NULL AND email IS NOT NULL)
);

-- 6. Update any existing orders with NULL user_id to have proper guest info
-- This handles the current failing row
UPDATE public.orders 
SET user_id = NULL 
WHERE user_id IS NULL 
  AND email IS NOT NULL;

-- 7. Create an index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- 8. Create an index for guest orders (email-based lookups)
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email) 
WHERE user_id IS NULL;
