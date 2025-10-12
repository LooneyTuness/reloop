-- Create missing RPC function for updating order status
-- This function is called by VendorOrdersPanel.tsx

-- Step 1: Create the update_order_status_fixed function
CREATE OR REPLACE FUNCTION update_order_status_fixed(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  order_record RECORD;
  user_language TEXT;
  result JSON;
BEGIN
  -- Get order details - handle both UUID and BIGINT types
  SELECT o.*
  INTO order_record
  FROM orders o
  WHERE o.id::text = order_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', order_id_param;
  END IF;
  
  -- Get user language preference
  user_language := get_user_language_preference(order_record.user_id);
  
  -- Update order status to completed
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id::text = order_id_param;
  
  -- Update items status to sold
  UPDATE items 
  SET 
    status = 'sold',
    sold_at = NOW()
  WHERE id IN (
    SELECT item_id 
    FROM order_items 
    WHERE order_id::text = order_id_param
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
    WHERE id::text = order_id_param
  ) o;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_fixed(TEXT) TO authenticated;

-- Step 3: Test the function (optional)
-- Uncomment the line below to test with a specific order
-- SELECT update_order_status_fixed('50');

-- Success message
SELECT 'RPC function update_order_status_fixed created successfully!' as message;
