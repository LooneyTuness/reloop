-- Fix Order Status Constraint Issue
-- This script removes the problematic constraint that prevents status updates

-- Step 1: Drop the problematic constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Add a new constraint that allows all valid status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 3: Test updating an order status (replace '42' with actual order ID)
-- For numeric order IDs, use the numeric value directly
-- UPDATE orders 
-- SET 
--   status = 'completed',
--   updated_at = NOW()
-- WHERE id = 42;

-- Step 4: Verify the update worked
-- SELECT 
--   id, 
--   status, 
--   full_name, 
--   email, 
--   updated_at
-- FROM orders 
-- WHERE id = 42;

-- Step 5: Check if the vendor_orders view reflects the change
-- SELECT 
--   order_id,
--   order_status,
--   order_full_name,
--   order_email
-- FROM vendor_orders 
-- WHERE order_id = '42';

-- Step 4: Verify the constraint was added correctly
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'orders_status_check';

-- Success message
SELECT 'Order status constraint fixed! Status updates should now work.' as message;
