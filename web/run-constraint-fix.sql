-- Quick fix for orders constraint issue
-- Run this in Supabase SQL Editor

-- Step 1: Drop the problematic constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Add a new constraint that allows all valid status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Step 3: Test updating order 42
UPDATE orders 
SET 
  status = 'completed',
  updated_at = NOW()
WHERE id = 42;

-- Step 4: Verify the update worked
SELECT 
  id, 
  status, 
  full_name, 
  email, 
  updated_at
FROM orders 
WHERE id = 42;

-- Success message
SELECT 'Orders constraint fixed and order 42 updated!' as message;
