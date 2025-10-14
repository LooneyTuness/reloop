-- Simplified analytics migration that avoids type casting issues
-- Run this in your Supabase SQL Editor

-- Create daily analytics snapshot table
CREATE TABLE IF NOT EXISTS daily_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id TEXT NOT NULL, -- Use TEXT instead of UUID to avoid casting issues
  date DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  active_listings INTEGER DEFAULT 0,
  sold_items INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  avg_order_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_analytics_seller_date ON daily_analytics(seller_id, date);

-- Simple function to populate today's analytics
CREATE OR REPLACE FUNCTION populate_today_analytics_simple(seller_id_text TEXT)
RETURNS VOID AS $$
DECLARE
  analytics_data RECORD;
  total_views_count INTEGER := 0;
  total_orders_count INTEGER := 0;
  total_revenue_amount DECIMAL := 0;
  total_listings_count INTEGER := 0;
  active_listings_count INTEGER := 0;
  sold_items_count INTEGER := 0;
  conversion_rate_calc DECIMAL := 0;
  avg_order_value_calc DECIMAL := 0;
BEGIN
  -- Get total views for this seller's products
  SELECT COUNT(*) INTO total_views_count
  FROM product_views pv
  JOIN items i ON pv.product_id = i.id
  WHERE i.user_id = seller_id_text
  AND pv.viewed_at >= CURRENT_DATE
  AND pv.viewed_at < CURRENT_DATE + INTERVAL '1 day';
  
  -- Get total orders and revenue for this seller's products
  SELECT 
    COUNT(DISTINCT o.id),
    COALESCE(SUM(o.total_amount), 0)
  INTO total_orders_count, total_revenue_amount
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN items i ON oi.item_id = i.id
  WHERE i.user_id = seller_id_text
  AND o.created_at >= CURRENT_DATE
  AND o.created_at < CURRENT_DATE + INTERVAL '1 day';
  
  -- Get item counts
  SELECT 
    COUNT(*),
    COUNT(CASE WHEN status = 'active' THEN 1 END),
    COUNT(CASE WHEN status = 'sold' THEN 1 END)
  INTO total_listings_count, active_listings_count, sold_items_count
  FROM items
  WHERE user_id = seller_id_text;
  
  -- Calculate conversion rate
  IF total_listings_count > 0 THEN
    conversion_rate_calc := (sold_items_count::DECIMAL / total_listings_count::DECIMAL) * 100;
  END IF;
  
  -- Calculate average order value
  IF total_orders_count > 0 THEN
    avg_order_value_calc := total_revenue_amount / total_orders_count;
  END IF;
  
  -- Insert today's analytics
  INSERT INTO daily_analytics (
    seller_id, date, total_views, total_orders, total_revenue,
    total_listings, active_listings, sold_items, conversion_rate, avg_order_value
  ) VALUES (
    seller_id_text, CURRENT_DATE, 
    total_views_count, total_orders_count, total_revenue_amount,
    total_listings_count, active_listings_count, sold_items_count,
    conversion_rate_calc, avg_order_value_calc
  )
  ON CONFLICT (seller_id, date) 
  DO UPDATE SET
    total_views = EXCLUDED.total_views,
    total_orders = EXCLUDED.total_orders,
    total_revenue = EXCLUDED.total_revenue,
    total_listings = EXCLUDED.total_listings,
    active_listings = EXCLUDED.active_listings,
    sold_items = EXCLUDED.sold_items,
    conversion_rate = EXCLUDED.conversion_rate,
    avg_order_value = EXCLUDED.avg_order_value,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own analytics data
CREATE POLICY "Users can read own daily analytics" ON daily_analytics
  FOR SELECT USING (seller_id = auth.uid()::TEXT);

-- Allow system to insert/update analytics data
CREATE POLICY "System can manage daily analytics" ON daily_analytics
  FOR ALL USING (true);

-- Populate today's analytics
SELECT populate_today_analytics_simple('9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98');

-- Create some sample historical data for the last 7 days
INSERT INTO daily_analytics (
  seller_id, date, total_views, total_orders, total_revenue,
  total_listings, active_listings, sold_items, conversion_rate, avg_order_value
)
SELECT 
  '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98' as seller_id,
  (CURRENT_DATE - INTERVAL '1 day' * generate_series(1, 7))::DATE as date,
  (RANDOM() * 50 + 10)::INTEGER as total_views,
  (RANDOM() * 5)::INTEGER as total_orders,
  (RANDOM() * 1000 + 100)::DECIMAL(10,2) as total_revenue,
  4 as total_listings,
  4 as active_listings,
  (RANDOM() * 2)::INTEGER as sold_items,
  (RANDOM() * 20 + 10)::DECIMAL(5,2) as conversion_rate,
  (RANDOM() * 200 + 50)::DECIMAL(10,2) as avg_order_value
ON CONFLICT (seller_id, date) DO NOTHING;

-- Verify the data
SELECT 
  date,
  total_views,
  total_orders,
  total_revenue,
  conversion_rate
FROM daily_analytics 
WHERE seller_id = '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98'
ORDER BY date DESC;

