-- Test script to verify order status updates work
-- Run this to test updating order status directly in the database

-- 1. First, let's see what orders exist and their current status
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  created_at,
  updated_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Test updating a specific order (replace 'ORDER_ID_HERE' with actual order ID)
-- UPDATE orders 
-- SET 
--   status = 'completed',
--   updated_at = NOW()
-- WHERE id = 'ORDER_ID_HERE';

-- 3. Check if the update worked
-- SELECT 
--   id, 
--   status, 
--   full_name, 
--   email, 
--   updated_at
-- FROM orders 
-- WHERE id = 'ORDER_ID_HERE';

-- 4. Check vendor_orders view to see if it reflects the change
-- SELECT 
--   order_id,
--   order_status,
--   order_full_name,
--   order_email,
--   order_date
-- FROM vendor_orders 
-- WHERE order_id = 'ORDER_ID_HERE';

-- 5. Test updating all pending orders to completed (use with caution!)
-- UPDATE orders 
-- SET 
--   status = 'completed',
--   updated_at = NOW()
-- WHERE status = 'pending';

-- 6. Verify the changes
-- SELECT 
--   status,
--   COUNT(*) as count
-- FROM orders 
-- GROUP BY status;
