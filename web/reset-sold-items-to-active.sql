-- Script to reset sold items back to active status
-- This fixes items that were marked as sold during testing
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what sold items exist (optional - for verification)
-- Uncomment the following lines to see what will be reset:
/*
SELECT 
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE status = 'sold') as sold_items,
  COUNT(*) FILTER (WHERE status = 'active') as active_items,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_items
FROM items;

SELECT 
  id,
  title,
  price,
  status,
  is_active,
  sold_at,
  buyer_id
FROM items 
WHERE status = 'sold' OR is_active = false
ORDER BY created_at DESC;
*/

-- 2. Reset all sold items back to active status
UPDATE items 
SET 
  status = 'active',
  sold_at = NULL,
  buyer_id = NULL,
  reserved_until = NULL,
  reserved_by = NULL,
  is_active = true,
  updated_at = NOW()
WHERE status = 'sold' OR is_active = false;

-- 3. Optional: Clean up any test orders that might be causing confusion
-- Uncomment the following lines if you want to remove test orders:
/*
-- First, remove order_items for test orders
DELETE FROM order_items 
WHERE order_id IN (
  SELECT id FROM orders 
  WHERE notes LIKE '%test%' 
     OR notes LIKE '%Test%'
     OR email LIKE '%test%'
     OR email LIKE '%@example.com'
     OR full_name LIKE '%test%'
     OR full_name LIKE '%Test%'
);

-- Then remove the test orders
DELETE FROM orders 
WHERE notes LIKE '%test%' 
   OR notes LIKE '%Test%'
   OR email LIKE '%test%'
   OR email LIKE '%@example.com'
   OR full_name LIKE '%test%'
   OR full_name LIKE '%Test%';
*/

-- 4. Clean up any test notifications
DELETE FROM notifications 
WHERE type IN ('order_completed', 'item_sold', 'sale_notification')
  OR message LIKE '%test%'
  OR message LIKE '%Test%'
  OR message LIKE '%sold%'
  OR message LIKE '%Sold%';

-- 5. Verify the reset (optional - shows current status)
-- Uncomment the following lines to verify the reset:
/*
SELECT 
  'Items Status After Reset:' as info,
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE status = 'active') as active_items,
  COUNT(*) FILTER (WHERE status = 'sold') as sold_items,
  COUNT(*) FILTER (WHERE is_active = true) as active_by_flag
FROM items;

SELECT 
  'Sample Active Items:' as info,
  id,
  title,
  price,
  status,
  is_active
FROM items 
WHERE status = 'active' AND is_active = true
LIMIT 5;
*/

-- Success message
SELECT 'Items reset completed successfully!' as message,
       'All sold items have been reset to active status.' as details;
