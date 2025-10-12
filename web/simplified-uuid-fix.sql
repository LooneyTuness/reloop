-- Simplified UUID Fix - Avoid Complex Type Casting
-- This approach uses simpler queries that avoid UUID type mismatches
-- Run this in Supabase SQL Editor

-- Step 1: Drop the problematic trigger first
DROP TRIGGER IF EXISTS order_status_trigger ON orders;

-- Step 2: Create a simplified trigger function that avoids complex type casting
CREATE OR REPLACE FUNCTION handle_order_completion()
RETURNS TRIGGER AS $$
DECLARE
  item_record RECORD;
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Use a cursor to iterate through items instead of complex JOIN
    FOR item_record IN 
      SELECT DISTINCT oi.item_id
      FROM order_items oi
      WHERE oi.order_id = NEW.id
    LOOP
      -- Update each item individually to avoid type casting issues
      UPDATE items 
      SET 
        status = 'sold',
        sold_at = NOW(),
        buyer_id = NEW.user_id,
        reserved_until = NULL,
        reserved_by = NULL,
        is_active = false
      WHERE id = item_record.item_id;
    END LOOP;
    
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

-- Step 3: Recreate the trigger
CREATE TRIGGER order_status_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_completion();

-- Step 4: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 5: Create a simple order update function
CREATE OR REPLACE FUNCTION update_order_status_simple(
  order_id_param TEXT,
  new_status_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update without complex type casting
  UPDATE orders 
  SET 
    status = new_status_param,
    updated_at = NOW()
  WHERE id = order_id_param::uuid;
  
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

-- Step 6: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_simple(TEXT, TEXT) TO authenticated;

-- Step 7: Test with a simple direct update first
UPDATE orders 
SET 
  status = 'completed',
  updated_at = NOW()
WHERE id = 42;

-- Step 8: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Step 9: Check if items were updated
SELECT 
  i.id,
  i.title,
  i.status,
  i.sold_at
FROM items i
JOIN order_items oi ON i.id = oi.item_id
WHERE oi.order_id = 42;

-- Success message
SELECT 'Simplified UUID fix applied successfully!' as message;
