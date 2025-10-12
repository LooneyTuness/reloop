-- SQL script to clean up test notifications and orders
-- Run this in your Supabase SQL Editor

-- Complete cleanup: Remove all test data
DELETE FROM notifications;
DELETE FROM order_items;
DELETE FROM orders;

-- Verify cleanup
SELECT COUNT(*) as remaining_notifications FROM notifications;
SELECT COUNT(*) as remaining_orders FROM orders;
SELECT COUNT(*) as remaining_order_items FROM order_items;
