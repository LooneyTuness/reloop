-- Script to clean up sold items from vendor_sales table
-- This removes all test sales data from the simplified sales tracking
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what test data exists (optional - for verification)
-- Uncomment the following lines to see what will be deleted:
/*
SELECT 
  COUNT(*) as total_sales,
  COUNT(DISTINCT vendor_id) as unique_vendors,
  MIN(sale_date) as earliest_sale,
  MAX(sale_date) as latest_sale,
  SUM(total_amount) as total_revenue
FROM vendor_sales;

SELECT 
  vendor_id,
  COUNT(*) as sales_count,
  SUM(total_amount) as total_revenue,
  MIN(sale_date) as first_sale,
  MAX(sale_date) as last_sale
FROM vendor_sales 
GROUP BY vendor_id 
ORDER BY sales_count DESC;
*/

-- 2. Clean up ALL sales data from vendor_sales table
DELETE FROM vendor_sales;

-- 3. Optional: Reset items that were marked as sold during testing
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

-- 4. Optional: Clean up test orders if they exist
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

-- 5. Clean up any test notifications related to sales
DELETE FROM notifications 
WHERE type IN ('order_completed', 'item_sold', 'sale_notification')
  OR message LIKE '%test%'
  OR message LIKE '%Test%'
  OR message LIKE '%sold%'
  OR message LIKE '%Sold%';

-- 6. Verify cleanup (optional - shows remaining data)
-- Uncomment the following lines to verify the cleanup:
/*
SELECT 'Vendor Sales' as table_name, COUNT(*) as remaining_records FROM vendor_sales
UNION ALL
SELECT 'Items (Active)', COUNT(*) FROM items WHERE is_active = true
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
*/

-- Success message
SELECT 'Sold items cleanup completed successfully!' as message,
       'All test sales data has been removed from vendor_sales table.' as details;
