-- BIGINT RPC Function - Proper BIGINT Handling
-- This creates an RPC function that handles BIGINT types correctly
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create RPC function with proper BIGINT handling
CREATE OR REPLACE FUNCTION update_order_status_bigint(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Update using proper BIGINT type casting
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
GRANT EXECUTE ON FUNCTION update_order_status_bigint(TEXT) TO authenticated;

-- Success message
SELECT 'BIGINT RPC function created! Order updates should work now.' as message;
