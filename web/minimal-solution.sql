-- Minimal Solution - Just Fix the Constraint
-- This is the simplest possible fix - just remove the blocking constraint
-- Run this in Supabase SQL Editor

-- Step 1: Fix the orders constraint (this is likely the only issue)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 2: Test with a direct update
UPDATE orders 
SET 
  status = 'completed',
  updated_at = NOW()
WHERE id = 42;

-- Step 3: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Success message
SELECT 'Minimal fix applied! The constraint was likely the only issue.' as message;
