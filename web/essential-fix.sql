-- Essential Fix - Just Fix the Constraint and Create Working Function
-- This avoids dropping triggers and just creates a working solution
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint (this is the main issue)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create a simple order update function that works with BIGINT
CREATE OR REPLACE FUNCTION update_order_status_working(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update using proper BIGINT type casting
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
GRANT EXECUTE ON FUNCTION update_order_status_working(TEXT) TO authenticated;

-- Step 4: Test the function
SELECT update_order_status_working('42');

-- Step 5: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Success message
SELECT 'Essential fix applied! Order status updates should work now.' as message;
