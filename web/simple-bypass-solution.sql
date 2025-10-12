-- Simple Bypass Solution - Disable Trigger Temporarily
-- This completely bypasses the problematic trigger
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

-- Step 3: Create a simple RPC function that just updates the order
CREATE OR REPLACE FUNCTION update_order_simple(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update without triggering any functions
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::bigint;
  
  -- Return success
  SELECT json_build_object('success', true, 'order_id', order_id_param) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_simple(TEXT) TO authenticated;

-- Success message
SELECT 'Simple bypass solution applied! Trigger disabled, RPC function created.' as message;
