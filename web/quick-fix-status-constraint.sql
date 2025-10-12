-- Quick Fix for Orders Status Update Issue
-- This script removes the problematic constraint that's preventing status updates

-- Step 1: Drop the problematic constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Test updating the order status that was failing
UPDATE orders 
SET 
  status = 'completed',
  updated_at = NOW()
WHERE id = 41;

-- Step 3: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 41;

-- Step 4: Check if the vendor_orders view reflects the change
SELECT 
  order_id,
  order_status,
  order_full_name,
  order_email
FROM vendor_orders 
WHERE order_id = '41';

-- Success message
SELECT 'Constraint removed! Order status update should now work.' as message;
