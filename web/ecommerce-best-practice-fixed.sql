-- E-commerce Best Practice: Product Management (Fixed Version)
-- This script handles existing policies and constraints properly

-- Step 1: Check what constraints and policies already exist
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'items'::regclass 
AND conname LIKE '%status%';

-- Step 2: Drop existing status-related constraints if they exist
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_status_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_is_active_check;

-- Step 3: Add the status field if it doesn't exist
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Step 4: Add constraint for valid statuses
ALTER TABLE items 
ADD CONSTRAINT items_status_check 
CHECK (status IN ('active', 'sold', 'reserved', 'inactive', 'draft', 'archived'));

-- Step 5: Add inventory tracking
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Step 6: Add sale tracking
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES auth.users(id);

-- Step 7: Add reservation system for cart holds
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS reserved_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS reserved_by UUID REFERENCES auth.users(id);

-- Step 8: Add soft delete for data integrity
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Step 9: Update existing items to have proper status based on is_active
UPDATE items 
SET status = CASE 
  WHEN is_active = true THEN 'active'
  WHEN is_active = false THEN 'inactive'
  ELSE 'active'
END
WHERE status IS NULL OR status = '';

-- Step 10: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_quantity ON items(quantity);
CREATE INDEX IF NOT EXISTS idx_items_sold_at ON items(sold_at);
CREATE INDEX IF NOT EXISTS idx_items_buyer_id ON items(buyer_id);
CREATE INDEX IF NOT EXISTS idx_items_reserved_until ON items(reserved_until);
CREATE INDEX IF NOT EXISTS idx_items_deleted_at ON items(deleted_at);

-- Step 11: Create inventory management functions
CREATE OR REPLACE FUNCTION reserve_item(item_uuid UUID, user_uuid UUID, reserve_minutes INTEGER DEFAULT 15)
RETURNS BOOLEAN AS $$
DECLARE
  current_quantity INTEGER;
BEGIN
  -- Check current quantity
  SELECT quantity INTO current_quantity 
  FROM items 
  WHERE id = item_uuid AND status = 'active' AND deleted_at IS NULL;
  
  -- If no quantity available, return false
  IF current_quantity IS NULL OR current_quantity <= 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Reserve the item
  UPDATE items 
  SET 
    status = 'reserved',
    reserved_until = NOW() + INTERVAL '1 minute' * reserve_minutes,
    reserved_by = user_uuid,
    quantity = quantity - 1
  WHERE id = item_uuid AND status = 'active';
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Step 12: Create function to release reservations
CREATE OR REPLACE FUNCTION release_reservation(item_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE items 
  SET 
    status = 'active',
    reserved_until = NULL,
    reserved_by = NULL,
    quantity = quantity + 1
  WHERE id = item_uuid AND status = 'reserved';
END;
$$ LANGUAGE plpgsql;

-- Step 13: Create function to mark as sold
CREATE OR REPLACE FUNCTION mark_item_sold(item_uuid UUID, buyer_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE items 
  SET 
    status = 'sold',
    sold_at = NOW(),
    buyer_id = buyer_uuid,
    reserved_until = NULL,
    reserved_by = NULL,
    is_active = false
  WHERE id = item_uuid;
END;
$$ LANGUAGE plpgsql;

-- Step 14: Create automatic cleanup for expired reservations
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS VOID AS $$
BEGIN
  UPDATE items 
  SET 
    status = 'active',
    reserved_until = NULL,
    reserved_by = NULL,
    quantity = quantity + 1
  WHERE status = 'reserved' 
  AND reserved_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Step 15: Create trigger for automatic order completion
CREATE OR REPLACE FUNCTION handle_order_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- When order status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Mark all items in the order as sold
    UPDATE items 
    SET 
      status = 'sold',
      sold_at = NOW(),
      buyer_id = NEW.user_id,
      reserved_until = NULL,
      reserved_by = NULL,
      is_active = false
    WHERE id IN (
      SELECT item_id 
      FROM order_items 
      WHERE order_id = NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 16: Create the trigger
DROP TRIGGER IF EXISTS trigger_order_completion ON orders;
CREATE TRIGGER trigger_order_completion
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_completion();

-- Step 17: Handle RLS policies safely
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active items" ON items;
DROP POLICY IF EXISTS "Users can view their own items" ON items;
DROP POLICY IF EXISTS "Users can manage their own items" ON items;

-- Create new policies
CREATE POLICY "Anyone can view active items" ON items
  FOR SELECT USING (status = 'active' AND deleted_at IS NULL);

CREATE POLICY "Users can view their own items" ON items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own items" ON items
  FOR ALL USING (auth.uid() = user_id);

-- Step 18: Update the vendor_orders view with new fields
CREATE OR REPLACE VIEW vendor_orders AS
SELECT 
  oi.id as order_item_id,
  oi.order_id,
  oi.item_id,
  oi.vendor_id,
  oi.buyer_name,
  oi.buyer_email,
  oi.buyer_phone,
  oi.quantity,
  oi.price,
  o.created_at as order_date,
  o.status as order_status,
  o.full_name as order_full_name,
  o.email as order_email,
  o.phone as order_phone,
  o.address_line1,
  o.address_line2,
  o.city,
  o.postal_code,
  o.notes as order_notes,
  i.title as item_title,
  i.photos as item_photos,
  i.status as item_status,
  i.quantity as item_quantity,
  i.sold_at,
  i.buyer_id,
  i.reserved_until,
  i.reserved_by
FROM order_items oi
JOIN orders o ON oi.order_id::text = o.id::text
JOIN items i ON oi.item_id::text = i.id::text
WHERE oi.vendor_id IS NOT NULL;

-- Step 19: Verify the setup
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'items' 
AND column_name IN ('status', 'quantity', 'sold_at', 'buyer_id', 'reserved_until', 'reserved_by', 'deleted_at')
ORDER BY ordinal_position;

-- Step 20: Test status distribution
SELECT 
  status,
  COUNT(*) as count,
  SUM(quantity) as total_quantity
FROM items 
WHERE deleted_at IS NULL
GROUP BY status;

-- Step 21: Test the functions
-- Test reservation (replace with actual item ID)
-- SELECT reserve_item('your-item-id-here', 'your-user-id-here', 15);

-- Test cleanup
-- SELECT cleanup_expired_reservations();

-- Success message
SELECT 'E-commerce best practice product lifecycle management implemented successfully!' as message;
