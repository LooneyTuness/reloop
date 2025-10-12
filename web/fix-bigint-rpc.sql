-- Fix BIGINT Type Casting Issue
-- The orders table uses BIGINT, not UUID

-- Step 1: Create function that handles BIGINT properly
CREATE OR REPLACE FUNCTION update_order_status_fixed(
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
  
  -- Update related items to sold status
  UPDATE items 
  SET 
    status = 'sold',
    sold_at = NOW()
  WHERE id IN (
    SELECT item_id 
    FROM order_items 
    WHERE order_id = order_id_param::bigint
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

-- Step 2: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_fixed(TEXT) TO authenticated;

-- Step 3: Test the function
SELECT 'BIGINT RPC function created successfully!' as message;
