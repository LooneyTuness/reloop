-- Update Orders Table Constraint
-- This migration updates the orders table constraint to require only essential fields
-- while keeping optional fields for enhanced user experience

-- Step 1: Drop the existing constraint if it exists
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_required_fields_check;

-- Step 2: Add the new constraint with only essential required fields
ALTER TABLE orders ADD CONSTRAINT orders_essential_fields_check 
CHECK (
  -- Order Status (Required)
  status IS NOT NULL AND 
  status IN ('pending', 'completed') AND
  
  -- Financial Data (Required)
  total_amount IS NOT NULL AND 
  total_amount > 0 AND
  payment_method IS NOT NULL AND
  
  -- Customer Contact (Required)
  full_name IS NOT NULL AND 
  full_name != '' AND
  phone IS NOT NULL AND 
  phone != '' AND
  email IS NOT NULL AND 
  email != '' AND
  
  -- Delivery Address (Required)
  address_line1 IS NOT NULL AND 
  address_line1 != '' AND
  city IS NOT NULL AND 
  city != ''
);

-- Step 3: Add NOT NULL constraints to essential fields
ALTER TABLE orders ALTER COLUMN status SET NOT NULL;
ALTER TABLE orders ALTER COLUMN total_amount SET NOT NULL;
ALTER TABLE orders ALTER COLUMN payment_method SET NOT NULL;
ALTER TABLE orders ALTER COLUMN full_name SET NOT NULL;
ALTER TABLE orders ALTER COLUMN phone SET NOT NULL;
ALTER TABLE orders ALTER COLUMN email SET NOT NULL;
ALTER TABLE orders ALTER COLUMN address_line1 SET NOT NULL;
ALTER TABLE orders ALTER COLUMN city SET NOT NULL;

-- Step 4: Add default values for optional fields to prevent issues
-- These fields remain optional but have sensible defaults
UPDATE orders SET 
  address_line2 = COALESCE(address_line2, ''),
  postal_code = COALESCE(postal_code, ''),
  notes = COALESCE(notes, '')
WHERE 
  address_line2 IS NULL OR 
  postal_code IS NULL OR 
  notes IS NULL;

-- Step 5: Add indexes for better performance on frequently queried fields
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Step 6: Add comments for documentation
COMMENT ON CONSTRAINT orders_essential_fields_check ON orders IS 
'Ensures essential fields are present: status, total_amount, payment_method, full_name, phone, email, address_line1, city';

COMMENT ON COLUMN orders.status IS 'Order status: pending or completed';
COMMENT ON COLUMN orders.total_amount IS 'Total order amount (required for payment processing)';
COMMENT ON COLUMN orders.payment_method IS 'Payment method used (required for processing)';
COMMENT ON COLUMN orders.full_name IS 'Customer full name (required for delivery)';
COMMENT ON COLUMN orders.phone IS 'Customer phone number (required for delivery coordination)';
COMMENT ON COLUMN orders.email IS 'Customer email address (required for notifications)';
COMMENT ON COLUMN orders.address_line1 IS 'Primary delivery address (required for delivery)';
COMMENT ON COLUMN orders.city IS 'Delivery city (required for delivery routing)';

COMMENT ON COLUMN orders.address_line2 IS 'Additional address information (optional)';
COMMENT ON COLUMN orders.postal_code IS 'Postal/ZIP code (optional)';
COMMENT ON COLUMN orders.notes IS 'Special delivery instructions (optional)';
COMMENT ON COLUMN orders.user_id IS 'Registered user ID (optional - guest orders allowed)';

-- Verification query to check constraint is working
-- This should return 0 rows if all orders meet the constraint
SELECT COUNT(*) as violating_orders
FROM orders 
WHERE 
  status IS NULL OR 
  status NOT IN ('pending', 'completed') OR
  total_amount IS NULL OR 
  total_amount <= 0 OR
  payment_method IS NULL OR
  full_name IS NULL OR 
  full_name = '' OR
  phone IS NULL OR 
  phone = '' OR
  email IS NULL OR 
  email = '' OR
  address_line1 IS NULL OR 
  address_line1 = '' OR
  city IS NULL OR 
  city = '';

-- Success message
SELECT 'Orders table constraint updated successfully!' as message;
