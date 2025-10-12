-- Script to clean up test sold items from dashboard
-- This removes test data while keeping the system structure intact
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what test data exists (optional - for verification)
-- Uncomment the following lines to see what will be deleted:
/*
SELECT 
  COUNT(*) as total_sold_items,
  COUNT(DISTINCT vendor_id) as unique_vendors,
  MIN(sale_date) as earliest_sale,
  MAX(sale_date) as latest_sale
FROM sold_items;

SELECT 
  vendor_id,
  COUNT(*) as items_sold,
  SUM(total_sale_amount) as total_revenue
FROM sold_items 
GROUP BY vendor_id 
ORDER BY items_sold DESC;
*/

-- 2. Clean up sold_items table (removes all test sales data)
DELETE FROM sold_items;

-- 3. Clean up vendor_sales_summary table (removes all test analytics)
DELETE FROM vendor_sales_summary;

-- 4. Reset inventory_tracking table (resets stock levels to original)
UPDATE inventory_tracking 
SET 
  current_stock = original_stock,
  reserved_stock = 0,
  available_stock = original_stock,
  is_sold_out = false,
  updated_at = NOW();

-- 5. Optional: Reset items table if they were marked as sold during testing
-- Uncomment the following lines if you want to reactivate items that were marked as sold:
/*
UPDATE items 
SET 
  status = 'active',
  sold_at = NULL,
  buyer_id = NULL,
  reserved_until = NULL,
  reserved_by = NULL,
  is_active = true
WHERE status = 'sold' OR is_active = false;
*/

-- 6. Clean up any test notifications related to sales
DELETE FROM notifications 
WHERE type IN ('order_completed', 'item_sold', 'sale_notification')
  OR message LIKE '%test%'
  OR message LIKE '%Test%';

-- 7. Optional: Clean up test orders if they exist
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
);

-- Then remove the test orders
DELETE FROM orders 
WHERE notes LIKE '%test%' 
   OR notes LIKE '%Test%'
   OR email LIKE '%test%'
   OR email LIKE '%@example.com';
*/

-- 8. Verify cleanup (optional - shows remaining data)
-- Uncomment the following lines to verify the cleanup:
/*
SELECT 'Sold Items' as table_name, COUNT(*) as remaining_records FROM sold_items
UNION ALL
SELECT 'Vendor Sales Summary', COUNT(*) FROM vendor_sales_summary
UNION ALL
SELECT 'Inventory Tracking', COUNT(*) FROM inventory_tracking
UNION ALL
SELECT 'Items (Active)', COUNT(*) FROM items WHERE is_active = true
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders;
*/

-- Success message
SELECT 'Test sold items cleanup completed successfully!' as message,
       'All test sales data has been removed from the dashboard.' as details;
