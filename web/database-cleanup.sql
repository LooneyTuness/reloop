-- Database Cleanup Script
-- Removes redundant tables and keeps only the essential ones
-- Run this in your Supabase SQL Editor

-- 1. Remove redundant sales tracking tables (if they exist)
DROP TABLE IF EXISTS sold_items CASCADE;
DROP TABLE IF EXISTS inventory_tracking CASCADE;

-- 2. Remove any complex views that are no longer needed
DROP VIEW IF EXISTS vendor_sales_summary CASCADE;
DROP VIEW IF EXISTS vendor_sales_report CASCADE;
DROP VIEW IF EXISTS sold_items_detailed CASCADE;
DROP VIEW IF EXISTS vendor_inventory_status CASCADE;

-- 3. Remove complex functions that are no longer needed
DROP FUNCTION IF EXISTS populate_sold_items() CASCADE;
DROP FUNCTION IF EXISTS initialize_inventory_tracking() CASCADE;
DROP FUNCTION IF EXISTS update_inventory_calculations() CASCADE;
DROP FUNCTION IF EXISTS update_vendor_sales_summary(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_vendor_sales_stats(UUID, INTEGER) CASCADE;

-- 4. Verify what tables remain
SELECT 
  'Current Database Tables:' as info,
  table_name,
  CASE 
    WHEN table_name IN ('items', 'cart_items', 'orders', 'order_items', 'notifications', 'vendor_sales') 
    THEN '✅ Essential'
    ELSE '❓ Check if needed'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Success message
SELECT 'Database cleanup completed!' as message,
       'Only essential tables remain: items, cart_items, orders, order_items, notifications, vendor_sales' as details;
