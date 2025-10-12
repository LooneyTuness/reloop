-- Fix Orders Status Check Constraint
-- This script identifies and fixes the constraint that's preventing status updates

-- Step 1: Check what constraints exist on the orders table
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'orders'::regclass;

-- Step 2: Check the specific orders_status_check constraint
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'orders_status_check';

-- Step 3: Drop the problematic constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 4: Add a new, more permissive constraint that allows 'completed' status
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing'));

-- Step 5: Verify the constraint was added correctly
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'orders_status_check';

-- Step 6: Test updating an order status
-- Replace '41' with the actual order ID you want to test
UPDATE orders 
SET 
  status = 'completed',
  updated_at = NOW()
WHERE id = 41;

-- Step 7: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 41;

-- Step 8: Check if the vendor_orders view reflects the change
SELECT 
  order_id,
  order_status,
  order_full_name,
  order_email
FROM vendor_orders 
WHERE order_id = '41';

-- Success message
SELECT 'Orders status constraint fixed! Status updates should now work.' as message;
