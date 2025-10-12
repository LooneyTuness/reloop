-- Fix the Trigger Solution - Repair the Problematic Trigger Function
-- This solution fixes the handle_order_completion trigger to handle UUID types properly
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Fix the problematic trigger function to handle UUID types properly
CREATE OR REPLACE FUNCTION handle_order_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Update items with proper type casting to handle UUID vs text issues
    UPDATE items 
    SET 
      status = 'sold',
      sold_at = NOW(),
      buyer_id = NEW.user_id,
      reserved_until = NULL,
      reserved_by = NULL,
      is_active = false
    WHERE id::text IN (
      SELECT oi.item_id::text 
      FROM order_items oi
      WHERE oi.order_id::text = NEW.id::text
    );
    
    -- Log the completion
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message
    ) VALUES (
      NEW.user_id,
      'order_completed',
      'Order Completed',
      'Your order #' || NEW.id || ' has been completed.'
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create a simple function that just updates the order status
-- Now that the trigger is fixed, this should work
CREATE OR REPLACE FUNCTION update_order_status_fixed(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update - the trigger should now work properly
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

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_fixed(TEXT) TO authenticated;

-- Step 5: Test with order 43 (the one from your logs)
SELECT update_order_status_fixed('43');

-- Step 6: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 43;

-- Step 7: Check if items were updated by the trigger
SELECT 
  i.id,
  i.title,
  i.status,
  i.sold_at
FROM items i
JOIN order_items oi ON i.id::text = oi.item_id::text
WHERE oi.order_id = 43;

-- Step 8: Check notifications
SELECT 
  type,
  title,
  message
FROM notifications 
WHERE user_id = (SELECT user_id FROM orders WHERE id = 43)
ORDER BY created_at DESC
LIMIT 3;

-- Success message
SELECT 'Trigger fix applied! The handle_order_completion trigger should now work properly.' as message;
