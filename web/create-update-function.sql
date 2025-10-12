-- Create RPC function to handle order status updates with proper type casting
-- Run this in Supabase SQL Editor

-- Step 1: Create the RPC function
CREATE OR REPLACE FUNCTION update_order_status(
  order_id_param TEXT,
  new_status_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Update the order status with explicit type casting
  UPDATE orders 
  SET 
    status = new_status_param,
    updated_at = NOW()
  WHERE id::text = order_id_param;
  
  -- Check if any rows were updated
  IF FOUND THEN
    -- Return the updated order data
    SELECT to_json(o) INTO result
    FROM (
      SELECT 
        id,
        status,
        full_name,
        email,
        updated_at
      FROM orders 
      WHERE id::text = order_id_param
    ) o;
    
    RETURN result;
  ELSE
    -- Return error if no rows were updated
    RETURN json_build_object('error', 'No order found with ID: ' || order_id_param);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_order_status(TEXT, TEXT) TO authenticated;

-- Step 3: Test the function with order 42
SELECT update_order_status('42', 'completed');

-- Step 4: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Success message
SELECT 'RPC function created and tested successfully!' as message;
