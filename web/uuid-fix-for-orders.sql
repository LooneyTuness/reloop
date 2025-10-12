-- UUID Fix for Orders Table
-- This fixes the UUID type casting issue for orders.id field
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint (this is the main issue)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Create a simple order update function that works with UUID
CREATE OR REPLACE FUNCTION update_order_status_uuid_fixed(
  order_id_param TEXT
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update using proper UUID type casting
  UPDATE orders 
  SET 
    status = 'completed',
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

-- Step 3: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_uuid_fixed(TEXT) TO authenticated;

-- Step 4: Test the function with a sample order ID
-- Note: Replace 'your-order-id-here' with an actual order ID from your database
-- SELECT update_order_status_uuid_fixed('your-order-id-here');

-- Success message
SELECT 'UUID fix applied! Order status updates should work with proper UUID handling.' as message;
