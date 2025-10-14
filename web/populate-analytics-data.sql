-- Script to populate historical analytics data
-- Run this after running the analytics-accuracy-migration.sql

-- Replace 'YOUR_USER_ID' with your actual user ID
-- You can find your user ID in the Supabase Auth users table

-- First, let's check if the daily_analytics table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'daily_analytics'
) as table_exists;

-- Populate historical data for the last 90 days using the v2 function
-- This will create daily snapshots of analytics data
SELECT populate_historical_analytics_v2(
  '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98',       -- Replace with your user ID (as string)
  (CURRENT_DATE - INTERVAL '90 days')::TEXT,     -- Start date (90 days ago) as string
  CURRENT_DATE::TEXT                              -- End date (today) as string
);

-- Verify the data was populated
SELECT 
  date,
  total_views,
  total_orders,
  total_revenue,
  total_listings,
  active_listings,
  sold_items,
  conversion_rate,
  avg_order_value
FROM daily_analytics 
WHERE seller_id = '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98'  -- Replace with your user ID
ORDER BY date DESC
LIMIT 10;

-- Test the percentage change function
SELECT 
  'total_views' as metric,
  get_percentage_change(
    '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98'::UUID,  -- Replace with your user ID
    'total_views',
    CURRENT_DATE - INTERVAL '7 days',               -- Current period start
    CURRENT_DATE,                                   -- Current period end
    CURRENT_DATE - INTERVAL '14 days',              -- Previous period start
    CURRENT_DATE - INTERVAL '8 days'                -- Previous period end
  ) as percentage_change;

-- Test the monthly analytics function
SELECT * FROM calculate_monthly_analytics(
  '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98'::UUID,  -- Replace with your user ID
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,       -- Current year
  EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER       -- Current month
);
