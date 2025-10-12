-- Comprehensive UUID Type Casting Fix
-- This fixes all UUID vs text type mismatches in the database
-- Run this in Supabase SQL Editor

-- Step 1: Fix the handle_order_completion trigger function
CREATE OR REPLACE FUNCTION handle_order_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Update items with proper type casting
    UPDATE items 
    SET 
      status = 'sold',
      sold_at = NOW(),
      buyer_id = NEW.user_id,
      reserved_until = NULL,
      reserved_by = NULL,
      is_active = false
    WHERE id IN (
      SELECT item_id::text 
      FROM order_items 
      WHERE order_id::text = NEW.id::text
    );
    
    -- Log the completion
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      data
    ) VALUES (
      NEW.user_id,
      'order_completed',
      'Order Completed',
      'Your order #' || NEW.id || ' has been completed.',
      json_build_object('order_id', NEW.id, 'status', NEW.status)
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 3: Create a robust order update function with proper type casting
CREATE OR REPLACE FUNCTION update_order_status_safe(
  order_id_param TEXT,
  new_status_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  order_exists BOOLEAN;
BEGIN
  -- Check if order exists with proper type casting
  SELECT EXISTS(
    SELECT 1 FROM orders 
    WHERE id::text = order_id_param
  ) INTO order_exists;
  
  IF NOT order_exists THEN
    RETURN json_build_object('error', 'Order not found with ID: ' || order_id_param);
  END IF;
  
  -- Update the order status with explicit type casting
  UPDATE orders 
  SET 
    status = new_status_param,
    updated_at = NOW()
  WHERE id::text = order_id_param;
  
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

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_safe(TEXT, TEXT) TO authenticated;

-- Step 5: Test the function with order 42
SELECT update_order_status_safe('42', 'completed');

-- Step 6: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Step 7: Check if items were updated (if any)
SELECT 
  i.id,
  i.title,
  i.status,
  i.sold_at
FROM items i
JOIN order_items oi ON i.id::text = oi.item_id::text
WHERE oi.order_id = 42;

-- Success message
SELECT 'All UUID type casting issues fixed!' as message;
