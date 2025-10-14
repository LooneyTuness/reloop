-- Quick fix: Add the missing 'seller' column to items table
-- Run this in your Supabase SQL Editor

ALTER TABLE items 
ADD COLUMN IF NOT EXISTS seller TEXT NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'items' 
AND column_name = 'seller';

