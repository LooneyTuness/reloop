-- Fix UUID type casting issues for order updates
-- This script creates a more robust RPC function that handles UUID types properly

-- Step 1: Drop and recreate the function with better type handling
DROP FUNCTION IF EXISTS update_order_status_fixed(TEXT);

-- Step 2: Create a more robust function that handles both UUID and BIGINT
CREATE OR REPLACE FUNCTION update_order_status_fixed(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  order_record RECORD;
  user_language TEXT;
  result JSON;
  order_id_uuid UUID;
  order_id_bigint BIGINT;
BEGIN
  -- Try to parse as UUID first, then as BIGINT
  BEGIN
    order_id_uuid := order_id_param::UUID;
    -- Get order details using UUID
    SELECT o.*
    INTO order_record
    FROM orders o
    WHERE o.id = order_id_uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    -- If UUID parsing fails, try BIGINT
    BEGIN
      order_id_bigint := order_id_param::BIGINT;
      -- Get order details using BIGINT
      SELECT o.*
      INTO order_record
      FROM orders o
      WHERE o.id = order_id_bigint;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'Invalid order ID format: %', order_id_param;
    END;
  END;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', order_id_param;
  END IF;
  
  -- Get user language preference
  user_language := get_user_language_preference(order_record.user_id);
  
  -- Update order status to completed (use the original ID from the record)
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_record.id;
  
  -- Update items status to sold
  UPDATE items 
  SET 
    status = 'sold',
    sold_at = NOW()
  WHERE id IN (
    SELECT item_id 
    FROM order_items 
    WHERE order_id = order_record.id
  );
  
  -- Create translated notification
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    order_record.user_id,
    'order_completed',
    get_translated_message('order_completed_title', user_language),
    get_translated_message('order_completed_message', user_language) || order_record.id || get_translated_message('order_completed_suffix', user_language),
    json_build_object('order_id', order_record.id, 'status', 'completed')
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
    WHERE id = order_record.id
  ) o;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_fixed(TEXT) TO authenticated;

-- Step 4: Test the function (optional)
-- Uncomment the line below to test with a specific order
-- SELECT update_order_status_fixed('52');

-- Success message
SELECT 'Robust RPC function update_order_status_fixed created successfully!' as message;
