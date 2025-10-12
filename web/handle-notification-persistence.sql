-- SQL script to handle notification persistence when orders are deleted
-- Run this in your Supabase SQL Editor

-- Option 1: Keep notifications but mark them as "order_deleted"
-- This preserves the notification but indicates the order no longer exists

-- Add a column to track if the referenced order still exists
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS order_deleted BOOLEAN DEFAULT FALSE;

-- Create a function to mark notifications as deleted when orders are deleted
CREATE OR REPLACE FUNCTION mark_notifications_order_deleted()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark all notifications for this order as having deleted order
  UPDATE notifications 
  SET order_deleted = TRUE
  WHERE order_id = OLD.id::text;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically mark notifications when order is deleted
DROP TRIGGER IF EXISTS trigger_mark_notifications_order_deleted ON orders;
CREATE TRIGGER trigger_mark_notifications_order_deleted
  AFTER DELETE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION mark_notifications_order_deleted();

-- Option 2: Alternative - Store order data in notification for persistence
-- This creates a complete snapshot of order data in the notification

-- Add columns to store order snapshot data
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS order_snapshot JSONB;

-- Function to create order snapshot when notification is created
CREATE OR REPLACE FUNCTION create_order_snapshot()
RETURNS TRIGGER AS $$
DECLARE
  order_data JSONB;
BEGIN
  -- Get order data and create snapshot
  SELECT to_jsonb(o.*) INTO order_data
  FROM orders o
  WHERE o.id::text = NEW.order_id;
  
  -- Store snapshot in notification
  NEW.order_snapshot = order_data;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create order snapshot
DROP TRIGGER IF EXISTS trigger_create_order_snapshot ON notifications;
CREATE TRIGGER trigger_create_order_snapshot
  BEFORE INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION create_order_snapshot();

-- Update existing notifications to have order snapshots
UPDATE notifications 
SET order_snapshot = (
  SELECT to_jsonb(o.*)
  FROM orders o
  WHERE o.id::text = notifications.order_id
)
WHERE order_snapshot IS NULL 
  AND order_id IS NOT NULL;

-- Create a view for notifications with order status
CREATE OR REPLACE VIEW notifications_with_order_status AS
SELECT 
  n.*,
  CASE 
    WHEN n.order_deleted = TRUE THEN 'deleted'
    WHEN o.id IS NOT NULL THEN 'active'
    ELSE 'unknown'
  END as order_status,
  o.status as order_current_status
FROM notifications n
LEFT JOIN orders o ON n.order_id = o.id::text
WHERE n.is_dismissed = FALSE;
