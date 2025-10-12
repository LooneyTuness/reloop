-- Bypass Solution - Update Order Status Without Triggering the Function
-- This solution tries to update the order status in a way that doesn't trigger the problematic function
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create a function that updates using a different column or approach
CREATE OR REPLACE FUNCTION update_order_status_bypass(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Try updating using a different approach that might not trigger the problematic function
  -- We'll use a more direct approach with explicit type casting
  UPDATE orders 
  SET 
    status = 'completed'::text,
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
GRANT EXECUTE ON FUNCTION update_order_status_bypass(TEXT) TO authenticated;

-- Step 4: Test with order 43 (the one from your logs)
SELECT update_order_status_bypass('43');

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
SELECT 'Bypass solution applied! This uses explicit type casting for the status update.' as message;
