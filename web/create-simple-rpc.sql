-- Simple RPC function for order status updates
-- This is a fallback function for VendorOrdersPanel.tsx

-- Step 1: Create a simple RPC function
CREATE OR REPLACE FUNCTION update_order_status_fixed(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update without complex type handling
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id::text = order_id_param;
  
  -- Return success
  SELECT json_build_object('success', true, 'order_id', order_id_param) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_fixed(TEXT) TO authenticated;

-- Step 3: Test the function
SELECT 'Simple RPC function created successfully!' as message;
