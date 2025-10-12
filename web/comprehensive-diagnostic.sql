-- Comprehensive Diagnostic - Check for Triggers and Functions
-- Run this in Supabase SQL Editor to find what's causing the UUID error

-- 1. Check for triggers on the orders table
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'orders';

-- 2. Check for functions that might be called by triggers
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines 
WHERE routine_name LIKE '%order%' 
  OR routine_name LIKE '%completion%'
  OR routine_name LIKE '%status%';

-- 3. Check the actual orders table structure again
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 4. Check if there are any constraints causing issues
SELECT 
  constraint_name,
  constraint_type,
  check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'orders';

-- 5. Try a simple direct update to see what happens
-- (This will help us see the exact error)
UPDATE orders 
SET status = 'completed' 
WHERE id = 52 
RETURNING id, status;
