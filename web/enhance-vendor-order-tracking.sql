-- SQL script to enhance vendor-specific order tracking
-- Run this in your Supabase SQL Editor

-- 0. First, ensure orders table has created_at column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing orders to have a created_at timestamp
UPDATE orders 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- 1. Add vendor_id to order_items table for direct vendor tracking
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Add buyer information to order_items for better tracking
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS buyer_name TEXT;
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS buyer_email TEXT;
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS buyer_phone TEXT;

-- 3. Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON order_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_item_id ON order_items(item_id);

-- 4. Create a view for vendor orders (easier querying)
CREATE OR REPLACE VIEW vendor_orders AS
SELECT 
  oi.id as order_item_id,
  oi.order_id,
  oi.item_id,
  oi.vendor_id,
  oi.buyer_name,
  oi.buyer_email,
  oi.buyer_phone,
  oi.quantity,
  oi.price,
  o.created_at as order_date,
  o.status as order_status,
  o.full_name as order_full_name,
  o.email as order_email,
  o.phone as order_phone,
  o.address_line1,
  o.address_line2,
  o.city,
  o.postal_code,
  o.notes as order_notes,
  i.title as item_title,
  i.photos as item_photos
FROM order_items oi
JOIN orders o ON oi.order_id::text = o.id::text
JOIN items i ON oi.item_id::text = i.id::text
WHERE oi.vendor_id IS NOT NULL;

-- 5. Create a function to automatically populate vendor_id when order_items are inserted
CREATE OR REPLACE FUNCTION set_vendor_id_from_item()
RETURNS TRIGGER AS $$
BEGIN
  -- Get vendor_id from the item (with type casting)
  SELECT user_id INTO NEW.vendor_id 
  FROM items 
  WHERE id::text = NEW.item_id::text;
  
  -- Get buyer information from the order (with type casting)
  SELECT full_name, email, phone 
  INTO NEW.buyer_name, NEW.buyer_email, NEW.buyer_phone
  FROM orders 
  WHERE id::text = NEW.order_id::text;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS trigger_set_vendor_info ON order_items;
CREATE TRIGGER trigger_set_vendor_info
  BEFORE INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION set_vendor_id_from_item();

-- 7. Update existing order_items to have vendor_id (if any exist)
UPDATE order_items 
SET vendor_id = i.user_id,
    buyer_name = o.full_name,
    buyer_email = o.email,
    buyer_phone = o.phone
FROM items i, orders o
WHERE order_items.item_id::text = i.id::text 
  AND order_items.order_id::text = o.id::text
  AND order_items.vendor_id IS NULL;

-- 8. Add RLS policies for vendor order access
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Vendors can view their own order items" ON order_items;
DROP POLICY IF EXISTS "System can insert order items" ON order_items;
DROP POLICY IF EXISTS "Vendors can update their own order items" ON order_items;

-- Create new policies
CREATE POLICY "Vendors can view their own order items" ON order_items
  FOR SELECT USING (auth.uid() = vendor_id);

CREATE POLICY "System can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Vendors can update their own order items" ON order_items
  FOR UPDATE USING (auth.uid() = vendor_id);

-- 9. Create a function to get vendor order statistics
CREATE OR REPLACE FUNCTION get_vendor_order_stats(vendor_uuid UUID)
RETURNS TABLE (
  total_orders BIGINT,
  total_items BIGINT,
  total_revenue NUMERIC,
  pending_orders BIGINT,
  completed_orders BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT oi.order_id) as total_orders,
    COUNT(oi.id) as total_items,
    COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue,
    COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN oi.order_id END) as pending_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN oi.order_id END) as completed_orders
  FROM order_items oi
  JOIN orders o ON oi.order_id::text = o.id::text
  WHERE oi.vendor_id = vendor_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
