-- Ultra-Simple Fix - Bypass Complex Triggers
-- This approach avoids all the UUID type casting issues
-- Run this in Supabase SQL Editor

-- Step 1: Drop the problematic trigger completely (with correct names)
DROP TRIGGER IF EXISTS trigger_order_completion ON orders;
DROP TRIGGER IF EXISTS order_status_trigger ON orders;
DROP FUNCTION IF EXISTS handle_order_completion() CASCADE;

-- Step 2: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 3: Create a comprehensive order update function that handles everything
CREATE OR REPLACE FUNCTION complete_order_with_items(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  order_record RECORD;
  item_record RECORD;
BEGIN
  -- First, get the order details
  SELECT * INTO order_record
  FROM orders 
  WHERE id = order_id_param::uuid;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Order not found with ID: ' || order_id_param);
  END IF;
  
  -- Update the order status
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::uuid;
  
  -- Update all related items using a simple loop
  FOR item_record IN 
    SELECT oi.item_id
    FROM order_items oi
    WHERE oi.order_id = order_id_param::uuid
  LOOP
    UPDATE items 
    SET 
      status = 'sold',
      sold_at = NOW(),
      buyer_id = order_record.user_id,
      reserved_until = NULL,
      reserved_by = NULL,
      is_active = false
    WHERE id = item_record.item_id;
  END LOOP;
  
  -- Create notification
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    order_record.user_id,
    'order_completed',
    'Order Completed',
    'Your order #' || order_record.id || ' has been completed.',
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
    WHERE id = order_id_param::uuid
  ) o;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION complete_order_with_items(TEXT) TO authenticated;

-- Step 5: Test the function
SELECT complete_order_with_items('42');

-- Step 6: Verify everything worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Step 7: Check if items were updated
SELECT 
  i.id,
  i.title,
  i.status,
  i.sold_at
FROM items i
JOIN order_items oi ON i.id = oi.item_id
WHERE oi.order_id = 42;

-- Step 8: Check notifications
SELECT 
  type,
  title,
  message
FROM notifications 
WHERE user_id = (SELECT user_id FROM orders WHERE id = 42)
ORDER BY created_at DESC
LIMIT 5;

-- Success message
SELECT 'Ultra-simple fix applied! Order completion should work now.' as message;
