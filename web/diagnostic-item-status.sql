-- Diagnostic Script - Check Item Status After Order Completion
-- Run this in Supabase SQL Editor to see what's happening with items

-- 1. Check what items are in order 51
SELECT 'ITEMS IN ORDER 51' as info, oi.item_id, i.title, i.status, i.is_active
FROM order_items oi
JOIN items i ON oi.item_id::text = i.id::text
WHERE oi.order_id = 51;

-- 2. Check the order status
SELECT 'ORDER 51 STATUS' as info, id, status, updated_at
FROM orders 
WHERE id = 51;

-- 3. Check if the RPC function exists
SELECT 'RPC FUNCTION CHECK' as info, routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name = 'update_order_complete';

-- 4. Test the RPC function manually
SELECT update_order_complete('51');

-- 5. Check items again after the test
SELECT 'ITEMS AFTER TEST' as info, oi.item_id, i.title, i.status, i.is_active
FROM order_items oi
JOIN items i ON oi.item_id::text = i.id::text
WHERE oi.order_id = 51;
