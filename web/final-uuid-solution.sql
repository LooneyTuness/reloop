-- Final UUID Solution - Proper UUID Type Handling
-- This solution properly handles UUID types for orders.id
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create a function that properly handles UUID types
CREATE OR REPLACE FUNCTION update_order_status_uuid(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Update using proper UUID type casting
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::uuid;
  
  -- Return the updated order data
  SELECT to_json(o) INTO result
  FROM (
    SELECT 
      id,
      status,
      full_name,
      email,
      updated_at,
      created_at
    FROM orders 
    WHERE id = order_id_param::uuid
  ) o;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_uuid(TEXT) TO authenticated;

-- Step 4: Test with order 43 (the one from your logs)
SELECT update_order_status_uuid('43');

-- Step 5: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = '43'::uuid;

-- Step 6: Also test with order 42
SELECT update_order_status_uuid('42');

-- Step 7: Verify order 42
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = '42'::uuid;

-- Success message
SELECT 'Final UUID solution applied! Order status updates should work with proper UUID handling.' as message;
