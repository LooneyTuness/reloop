-- Fix the handle_order_completion Trigger Function
-- This fixes the UUID vs BIGINT type mismatch in the trigger
-- Run this in Supabase SQL Editor

-- Step 1: Drop the existing problematic trigger
DROP TRIGGER IF EXISTS trigger_order_completion ON orders;
DROP TRIGGER IF EXISTS order_completion_trigger ON orders;

-- Step 2: Fix the trigger function with proper type casting
CREATE OR REPLACE FUNCTION handle_order_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Update items with proper type casting
    -- order_items.order_id is BIGINT, items.id is UUID, so we need to cast properly
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
      WHERE order_id = NEW.id::bigint
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

-- Step 3: Recreate the trigger
CREATE TRIGGER trigger_order_completion
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_completion();

-- Success message
SELECT 'Trigger function fixed! Now run the bigint-rpc-function.sql to create the RPC function.' as message;
