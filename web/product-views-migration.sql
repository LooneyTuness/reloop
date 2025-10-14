-- Migration script to create product_views table for tracking real product views
-- Run this in your Supabase SQL Editor

-- Create product_views table
CREATE TABLE IF NOT EXISTS product_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_session_id ON product_views(session_id);

-- Create a function to get view counts for products
CREATE OR REPLACE FUNCTION get_product_view_count(product_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM product_views
    WHERE product_id = product_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get view counts for a seller's products
CREATE OR REPLACE FUNCTION get_seller_view_stats(seller_uuid UUID)
RETURNS TABLE(
  total_views BIGINT,
  unique_products_viewed BIGINT,
  views_last_30_days BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_views,
    COUNT(DISTINCT pv.product_id) as unique_products_viewed,
    COUNT(CASE WHEN pv.viewed_at >= NOW() - INTERVAL '30 days' THEN 1 END) as views_last_30_days
  FROM product_views pv
  JOIN items i ON pv.product_id = i.id
  WHERE i.user_id = seller_uuid;
END;
$$ LANGUAGE plpgsql;

-- Add RLS (Row Level Security) policies
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert view records (for tracking)
CREATE POLICY "Allow insert for product views" ON product_views
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own product views
CREATE POLICY "Allow read own product views" ON product_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM items 
      WHERE items.id = product_views.product_id 
      AND items.user_id = auth.uid()
    )
  );

-- Allow users to read aggregated view data for their products
CREATE POLICY "Allow read aggregated views" ON product_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM items 
      WHERE items.id = product_views.product_id 
      AND items.user_id = auth.uid()
    )
  );

