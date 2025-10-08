-- SQL script to add missing columns to the items table
-- Run this in your Supabase SQL Editor

-- Add user_id column (references auth.users)
ALTER TABLE items 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_email column
ALTER TABLE items 
ADD COLUMN user_email TEXT;

-- Add category column
ALTER TABLE items 
ADD COLUMN category TEXT;

-- Make name column nullable (optional) since title serves the same purpose
ALTER TABLE items 
ALTER COLUMN name DROP NOT NULL;

-- Add indexes for better performance
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_user_email ON items(user_email);

-- Optional: Add a check constraint for user_email format
ALTER TABLE items 
ADD CONSTRAINT check_user_email_format 
CHECK (user_email IS NULL OR user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Optional: Add a trigger to automatically set user_email when user_id is provided
CREATE OR REPLACE FUNCTION set_user_email_from_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL AND NEW.user_email IS NULL THEN
    SELECT email INTO NEW.user_email 
    FROM auth.users 
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_user_email
  BEFORE INSERT OR UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION set_user_email_from_user_id();

-- Optional: Add RLS (Row Level Security) policies
-- Enable RLS on items table
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own items
CREATE POLICY "Users can view their own items" ON items
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own items
CREATE POLICY "Users can insert their own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own items
CREATE POLICY "Users can update their own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own items
CREATE POLICY "Users can delete their own items" ON items
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Allow public to view items (for browsing)
CREATE POLICY "Public can view items" ON items
  FOR SELECT USING (true);
