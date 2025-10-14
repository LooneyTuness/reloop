-- Simple step-by-step analytics setup
-- Run these commands one by one in your Supabase SQL Editor

-- Step 1: Check if tables exist
SELECT 
  table_name,
  CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('daily_analytics', 'product_views', 'items', 'orders', 'order_items');

-- Step 2: Create a simple function to populate today's analytics
CREATE OR REPLACE FUNCTION populate_today_analytics(seller_uuid TEXT)
RETURNS VOID AS $$
DECLARE
  analytics_data RECORD;
  seller_uuid_typed UUID;
BEGIN
  -- Convert string to UUID
  seller_uuid_typed := seller_uuid::UUID;
  
  -- Calculate analytics for today
  SELECT * INTO analytics_data
  FROM calculate_daily_analytics(seller_uuid_typed, CURRENT_DATE);
  
  -- Insert today's analytics
  INSERT INTO daily_analytics (
    seller_id, date, total_views, total_orders, total_revenue,
    total_listings, active_listings, sold_items, conversion_rate, avg_order_value
  ) VALUES (
    seller_uuid_typed, CURRENT_DATE, 
    analytics_data.total_views, analytics_data.total_orders, analytics_data.total_revenue,
    analytics_data.total_listings, analytics_data.active_listings, analytics_data.sold_items,
    analytics_data.conversion_rate, analytics_data.avg_order_value
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

-- Step 3: Populate today's analytics
SELECT populate_today_analytics('9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98');

-- Step 4: Create some sample historical data for the last 7 days
INSERT INTO daily_analytics (
  seller_id, date, total_views, total_orders, total_revenue,
  total_listings, active_listings, sold_items, conversion_rate, avg_order_value
)
SELECT 
  '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98'::UUID as seller_id,
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

-- Step 5: Verify the data
SELECT 
  date,
  total_views,
  total_orders,
  total_revenue,
  conversion_rate
FROM daily_analytics 
WHERE seller_id = '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98'
ORDER BY date DESC;

-- Step 6: Test the percentage change calculation
SELECT 
  'total_views' as metric,
  CASE 
    WHEN LAG(total_views) OVER (ORDER BY date) = 0 THEN 
      CASE WHEN total_views > 0 THEN 100 ELSE 0 END
    ELSE 
      ROUND(((total_views - LAG(total_views) OVER (ORDER BY date))::DECIMAL / LAG(total_views) OVER (ORDER BY date)) * 100, 2)
  END as percentage_change,
  date
FROM daily_analytics 
WHERE seller_id = '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98'
ORDER BY date DESC
LIMIT 5;

