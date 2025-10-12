-- Alternative Solution - Use a Different Update Method
-- This solution tries to update the order status using a method that might not trigger the problematic function
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create a function that uses a different update approach
CREATE OR REPLACE FUNCTION update_order_status_alternative(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Try using a different update method that might not trigger the problematic function
  -- We'll update using a subquery approach
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id IN (
    SELECT id FROM orders WHERE id = order_id_param::bigint
  );
  
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
GRANT EXECUTE ON FUNCTION update_order_status_alternative(TEXT) TO authenticated;

-- Step 4: Test with order 43 (the one from your logs)
SELECT update_order_status_alternative('43');

-- Step 5: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 43;

-- Success message
SELECT 'Alternative update solution applied! This uses a different update method.' as message;
