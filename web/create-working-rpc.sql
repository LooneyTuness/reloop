-- Simple working RPC function
-- This handles the most common case: orders.id as BIGINT

CREATE OR REPLACE FUNCTION update_order_status_fixed(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Simple update - let PostgreSQL handle the type conversion
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param;
  
  -- Return success
  SELECT json_build_object('success', true, 'order_id', order_id_param) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION update_order_status_fixed(TEXT) TO authenticated;

-- Test message
SELECT 'Simple RPC function created!' as message;
