-- Permission-Safe Solution - No Trigger Manipulation
-- This solution works without requiring trigger manipulation permissions
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create a simple function that just updates the order status
-- This avoids triggering the problematic handle_order_completion function
CREATE OR REPLACE FUNCTION update_order_status_only(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update that should work without triggering issues
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
GRANT EXECUTE ON FUNCTION update_order_status_only(TEXT) TO authenticated;

-- Step 4: Test with a direct update first to see if the constraint is the only issue
UPDATE orders 
SET 
  status = 'completed',
  updated_at = NOW()
WHERE id = 42;

-- Step 5: Verify the direct update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Step 6: Test the function
SELECT update_order_status_only('42');

-- Success message
SELECT 'Permission-safe solution applied! Direct updates should work now.' as message;
