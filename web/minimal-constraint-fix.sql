-- Minimal Fix - Just Fix the Constraint for BIGINT IDs
-- This only fixes the constraint that's blocking the update
-- Run this in Supabase SQL Editor

-- Fix the orders constraint (this is the main issue)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'processing', 'shipped', 'delivered'));

-- Success message
SELECT 'Constraint fixed! BIGINT order updates should work now.' as message;
