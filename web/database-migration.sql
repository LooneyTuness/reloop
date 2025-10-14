-- Migration script to add missing columns to items table
-- Run this in your Supabase SQL Editor

-- Add missing columns to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE NULL,
ADD COLUMN IF NOT EXISTS seller TEXT NULL;

-- Update existing records to have proper defaults
UPDATE items 
SET 
  is_active = COALESCE(is_active, true),
  quantity = COALESCE(quantity, 1)
WHERE is_active IS NULL OR quantity IS NULL;

-- Create index for better performance on filtering
CREATE INDEX IF NOT EXISTS idx_items_is_active ON items(is_active);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_deleted_at ON items(deleted_at);

-- Add check constraint to ensure quantity is positive
ALTER TABLE items 
ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);

-- Add check constraint to ensure status is valid
ALTER TABLE items 
ADD CONSTRAINT check_status_valid CHECK (
  status IS NULL OR status IN (
    'active', 'inactive', 'draft', 'sold', 'reserved', 
    'listed', 'viewed', 'in_cart', 'shipped', 'delivered'
  )
);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'items' 
AND column_name IN ('is_active', 'quantity', 'deleted_at')
ORDER BY column_name;
