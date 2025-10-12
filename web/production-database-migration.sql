-- Production Database Migration Script
-- This script prepares the database for production deployment
-- Run this in Supabase SQL Editor

-- ==============================================
-- STEP 1: Fix Orders Status Constraint
-- ==============================================

-- Drop existing constraint if it exists
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the correct constraint with all valid statuses
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- ==============================================
-- STEP 2: Create Production-Ready Order Update Function
-- ==============================================

-- Create a robust function that handles order completion and item status updates
CREATE OR REPLACE FUNCTION update_order_complete_production(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
  items_updated INTEGER;
  order_exists BOOLEAN;
BEGIN
  -- Check if order exists
  SELECT EXISTS(SELECT 1 FROM orders WHERE id = order_id_param::bigint) INTO order_exists;
  
  IF NOT order_exists THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Order not found',
      'order_id', order_id_param
    );
  END IF;
  
  -- Update the order status
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::bigint;
  
  -- Mark all items in this order as sold
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
    'items_updated', items_updated,
    'message', 'Order completed successfully'
  ) INTO result;
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  -- Return error information
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'order_id', order_id_param
  );
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- STEP 3: Create Order Status Update Function (Simple)
-- ==============================================

-- Create a simple function for just updating order status
CREATE OR REPLACE FUNCTION update_order_status_production(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
  order_exists BOOLEAN;
BEGIN
  -- Check if order exists
  SELECT EXISTS(SELECT 1 FROM orders WHERE id = order_id_param::bigint) INTO order_exists;
  
  IF NOT order_exists THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Order not found',
      'order_id', order_id_param
    );
  END IF;
  
  -- Update the order status
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::bigint;
  
  -- Return success
  SELECT json_build_object(
    'success', true, 
    'order_id', order_id_param,
    'message', 'Order status updated successfully'
  ) INTO result;
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  -- Return error information
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'order_id', order_id_param
  );
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- STEP 4: Grant Permissions
-- ==============================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_order_complete_production(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_order_status_production(TEXT) TO authenticated;

-- ==============================================
-- STEP 5: Ensure RLS is Enabled
-- ==============================================

-- Enable Row Level Security on key tables
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 6: Create Notifications Table (if not exists)
-- ==============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- ==============================================
-- STEP 7: Create Indexes for Performance
-- ==============================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================

SELECT 'Production database migration completed successfully! 🚀' as message;
