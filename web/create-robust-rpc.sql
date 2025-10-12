-- Final UUID Solution - Proper UUID Type Handling
-- This solution properly handles UUID types for orders.id
-- Based on the working solution from before

-- Step 1: Create a function that properly handles UUID types
CREATE OR REPLACE FUNCTION update_order_status_fixed(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Update using proper UUID type casting (this is the key!)
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::uuid;
  
  -- Update related items to sold status
  UPDATE items 
  SET 
    status = 'sold',
    sold_at = NOW()
  WHERE id IN (
    SELECT item_id 
    FROM order_items 
    WHERE order_id = order_id_param::uuid
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
    WHERE id = order_id_param::uuid
  ) o;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_fixed(TEXT) TO authenticated;

-- Step 3: Test the function
SELECT 'Robust RPC function created successfully!' as message;
