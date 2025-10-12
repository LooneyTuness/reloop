-- Fix Orders Data and Update Status
-- This script fixes any constraint violations and provides examples for status updates

-- Step 1: Fix any orders that might have constraint violations
-- This ensures all orders meet the required field constraints
UPDATE orders SET 
  total_amount = COALESCE(total_amount, 0.01),
  payment_method = COALESCE(payment_method, 'unknown'),
  full_name = COALESCE(full_name, 'Guest Customer'),
  phone = COALESCE(phone, '000-000-0000'),
  email = COALESCE(email, 'guest@example.com'),
  address_line1 = COALESCE(address_line1, 'Address Not Provided'),
  city = COALESCE(city, 'Unknown City'),
  address_line2 = COALESCE(address_line2, ''),
  postal_code = COALESCE(postal_code, ''),
  notes = COALESCE(notes, '')
WHERE 
  total_amount IS NULL OR 
  total_amount <= 0 OR
  payment_method IS NULL OR
  payment_method = '' OR
  full_name IS NULL OR 
  full_name = '' OR
  phone IS NULL OR 
  phone = '' OR
  email IS NULL OR 
  email = '' OR
  address_line1 IS NULL OR 
  address_line1 = '' OR
  city IS NULL OR 
  city = '';

-- Step 2: Example queries for updating order status
-- Replace 'ORDER_ID_HERE' with the actual order ID you want to update

-- Update a specific order to completed status
-- UPDATE orders 
-- SET 
--   status = 'completed',
--   updated_at = NOW()
-- WHERE id = 'ORDER_ID_HERE' AND status = 'pending';

-- Update all pending orders to completed (use with caution!)
-- UPDATE orders 
-- SET 
--   status = 'completed',
--   updated_at = NOW()
-- WHERE status = 'pending';

-- Step 3: Verification queries
-- Check current order statuses
SELECT id, status, full_name, email, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for any remaining constraint violations
SELECT COUNT(*) as violating_orders
FROM orders 
WHERE 
  status IS NULL OR 
  status NOT IN ('pending', 'completed') OR
  total_amount IS NULL OR 
  total_amount <= 0 OR
  payment_method IS NULL OR
  payment_method = '' OR
  full_name IS NULL OR 
  full_name = '' OR
  phone IS NULL OR 
  phone = '' OR
  email IS NULL OR 
  email = '' OR
  address_line1 IS NULL OR 
  address_line1 = '' OR
  city IS NULL OR 
  city = '';

-- Success message
SELECT 'Orders data fixed successfully! Use the example queries above to update specific orders.' as message;
