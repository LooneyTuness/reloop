-- Complete Order Solution - Mark Items as Sold
-- This updates both the order status and marks items as sold
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Disable any existing triggers temporarily (ignore errors if they don't exist)
DO $$
BEGIN
  BEGIN
    ALTER TABLE orders DISABLE TRIGGER trigger_order_completion;
  EXCEPTION WHEN undefined_object THEN
    -- Trigger doesn't exist, ignore
  END;
  
  BEGIN
    ALTER TABLE orders DISABLE TRIGGER order_completion_trigger;
  EXCEPTION WHEN undefined_object THEN
    -- Trigger doesn't exist, ignore
  END;
END $$;

-- Step 3: Create a complete RPC function that updates order and marks items as sold
CREATE OR REPLACE FUNCTION update_order_complete(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
  items_updated INTEGER;
BEGIN
  -- Update the order status
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::bigint;
  
  -- Mark all items in this order as sold
  -- Fix the UUID vs BIGINT type mismatch
  UPDATE items 
  SET 
    status = 'sold',
    sold_at = NOW(),
    is_active = false
  WHERE id::text IN (
    SELECT item_id::text 
    FROM order_items 
    WHERE order_id = order_id_param::bigint
  );
  
  -- Get count of items updated
  GET DIAGNOSTICS items_updated = ROW_COUNT;
  
  -- Return success with details
  SELECT json_build_object(
    'success', true, 
    'order_id', order_id_param,
    'items_updated', items_updated
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_complete(TEXT) TO authenticated;

-- Success message
SELECT 'Complete order solution applied! Orders and items will be updated together.' as message;
