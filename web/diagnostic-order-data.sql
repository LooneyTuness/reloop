-- Diagnostic Script - Check Order Data Consistency
-- Run this in Supabase SQL Editor to understand the data structure

-- 1. Check what's in the orders table
SELECT 'ORDERS TABLE' as table_name, id, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Check what's in the order_items table
SELECT 'ORDER_ITEMS TABLE' as table_name, id, order_id, item_id, vendor_id
FROM order_items 
ORDER BY id DESC 
LIMIT 5;

-- 3. Check what the vendor_orders view returns
SELECT 'VENDOR_ORDERS VIEW' as table_name, order_item_id, order_id, order_status, vendor_id
FROM vendor_orders 
ORDER BY order_date DESC 
LIMIT 5;

-- 4. Check if there are any orders with numeric IDs (like 51, 52)
SELECT 'ORDERS WITH NUMERIC IDs' as info, id, status
FROM orders 
WHERE id::text ~ '^[0-9]+$'
LIMIT 10;

-- 5. Check if there are any orders with UUID IDs
SELECT 'ORDERS WITH UUID IDs' as info, id, status
FROM orders 
WHERE id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
LIMIT 5;

-- 6. Check the data types of the columns
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('orders', 'order_items')
  AND column_name IN ('id', 'order_id')
ORDER BY table_name, column_name;
