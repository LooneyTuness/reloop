-- Alternative: Use CASCADE DELETE to remove all user data when user is deleted
-- WARNING: This will delete ALL orders and related data when a user is deleted

-- 1. Drop existing foreign key constraints
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- 2. Add CASCADE DELETE constraint
-- This will delete all orders when a user is deleted
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 3. Also update cart_items table if it has similar constraints
ALTER TABLE public.cart_items 
DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;

ALTER TABLE public.cart_items 
ADD CONSTRAINT cart_items_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 4. Update items table if it has user_id
ALTER TABLE public.items 
DROP CONSTRAINT IF EXISTS items_user_id_fkey;

ALTER TABLE public.items 
ADD CONSTRAINT items_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;
