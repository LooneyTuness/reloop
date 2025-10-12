-- Rollback Script for Orders Constraint Update
-- This script reverts the orders table constraint changes if needed

-- Step 1: Drop the new constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_essential_fields_check;

-- Step 2: Remove NOT NULL constraints from essential fields
ALTER TABLE orders ALTER COLUMN status DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN total_amount DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN payment_method DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN email DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN address_line1 DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN city DROP NOT NULL;

-- Step 3: Drop performance indexes (optional - keep if you want them)
-- DROP INDEX IF EXISTS idx_orders_status;
-- DROP INDEX IF EXISTS idx_orders_email;
-- DROP INDEX IF EXISTS idx_orders_created_at;
-- DROP INDEX IF EXISTS idx_orders_user_id;

-- Step 4: Restore original constraint if it existed
-- Note: You may need to adjust this based on your original constraint
-- ALTER TABLE orders ADD CONSTRAINT orders_status_check 
-- CHECK (status IN ('pending', 'completed'));

-- Success message
SELECT 'Orders table constraint rollback completed!' as message;
