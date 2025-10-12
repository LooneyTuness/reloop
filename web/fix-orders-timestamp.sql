-- First, let's check what columns exist in the orders table
-- Run this query first to see the actual structure:

-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
-- ORDER BY ordinal_position;

-- If orders table doesn't have created_at, let's add it
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing orders to have a created_at timestamp
UPDATE orders 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- Now let's create the view with proper order date
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
