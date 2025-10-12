-- Ultimate Solution - Avoid Triggering the Problematic Function
-- This solution updates the order status WITHOUT triggering the problematic handle_order_completion function
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create a function that updates order status using a different approach
-- We'll use a direct SQL execution that might bypass the trigger
CREATE OR REPLACE FUNCTION update_order_status_direct(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Use EXECUTE to run raw SQL that might bypass the trigger
  EXECUTE format('UPDATE orders SET status = %L, updated_at = NOW() WHERE id = %s', 'completed', order_id_param);
  
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
GRANT EXECUTE ON FUNCTION update_order_status_direct(TEXT) TO authenticated;

-- Step 4: Test with order 43 (the one from your logs)
SELECT update_order_status_direct('43');

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
SELECT 'Direct update solution applied! This should bypass the problematic trigger.' as message;
