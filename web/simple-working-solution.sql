-- Simple Working Solution - BIGINT Fix
-- This handles orders.id as BIGINT type correctly
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint (this is the main issue)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create the simple working RPC function with BIGINT handling
CREATE OR REPLACE FUNCTION update_order_status_fixed(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update with proper BIGINT type casting
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

-- Step 3: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_fixed(TEXT) TO authenticated;

-- Success message
SELECT 'BIGINT working solution applied! This should handle orders.id as BIGINT correctly.' as message;
