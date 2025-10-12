-- Correct BIGINT Solution - Proper BIGINT Type Handling
-- This solution properly handles BIGINT types for orders.id
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create a function that properly handles BIGINT types
CREATE OR REPLACE FUNCTION update_order_status_bigint(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Update using proper BIGINT type casting
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::bigint;
  
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
    WHERE id = order_id_param::bigint
  ) o;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_bigint(TEXT) TO authenticated;

-- Step 4: Test with order 43 (the one from your logs)
SELECT update_order_status_bigint('43');

-- Step 5: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 43;

-- Step 6: Also test with order 42
SELECT update_order_status_bigint('42');

-- Step 7: Verify order 42
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Success message
SELECT 'Correct BIGINT solution applied! Order status updates should work with proper BIGINT handling.' as message;
