-- Migration script to create accurate analytics tracking
-- Run this in your Supabase SQL Editor

-- Create daily analytics snapshot table
CREATE TABLE IF NOT EXISTS daily_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create monthly analytics snapshot table
CREATE TABLE IF NOT EXISTS monthly_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
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
  UNIQUE(seller_id, year, month)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_analytics_seller_date ON daily_analytics(seller_id, date);
CREATE INDEX IF NOT EXISTS idx_monthly_analytics_seller_year_month ON monthly_analytics(seller_id, year, month);

-- Function to calculate daily analytics for a seller
CREATE OR REPLACE FUNCTION calculate_daily_analytics(seller_uuid UUID, target_date DATE)
RETURNS TABLE(
  total_views BIGINT,
  total_orders BIGINT,
  total_revenue DECIMAL,
  total_listings BIGINT,
  active_listings BIGINT,
  sold_items BIGINT,
  conversion_rate DECIMAL,
  avg_order_value DECIMAL
) AS $$
DECLARE
  start_date TIMESTAMP;
  end_date TIMESTAMP;
BEGIN
  start_date := target_date::timestamp;
  end_date := (target_date + INTERVAL '1 day')::timestamp;
  
  RETURN QUERY
  WITH   seller_items AS (
    SELECT id FROM items WHERE user_id::UUID = seller_uuid
  ),
  daily_views AS (
    SELECT COUNT(*) as view_count
    FROM product_views pv
    JOIN seller_items si ON pv.product_id = si.id
    WHERE pv.viewed_at >= start_date AND pv.viewed_at < end_date
  ),
  daily_orders AS (
    SELECT 
      COUNT(DISTINCT o.id) as order_count,
      COALESCE(SUM(o.total_amount), 0) as revenue
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN seller_items si ON oi.item_id = si.id
    WHERE o.created_at >= start_date AND o.created_at < end_date
  ),
  daily_items AS (
    SELECT 
      COUNT(*) as total_count,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
      COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_count
    FROM items
    WHERE user_id = seller_uuid
  )
  SELECT 
    COALESCE(dv.view_count, 0) as total_views,
    COALESCE(daily_orders.order_count, 0) as total_orders,
    COALESCE(daily_orders.revenue, 0) as total_revenue,
    di.total_count as total_listings,
    di.active_count as active_listings,
    di.sold_count as sold_items,
    CASE 
      WHEN di.total_count > 0 THEN (di.sold_count::DECIMAL / di.total_count::DECIMAL) * 100
      ELSE 0
    END as conversion_rate,
    CASE 
      WHEN daily_orders.order_count > 0 THEN daily_orders.revenue / daily_orders.order_count
      ELSE 0
    END as avg_order_value
  FROM daily_views dv
  CROSS JOIN daily_orders
  CROSS JOIN daily_items di;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate monthly analytics for a seller
CREATE OR REPLACE FUNCTION calculate_monthly_analytics(seller_uuid UUID, target_year INTEGER, target_month INTEGER)
RETURNS TABLE(
  total_views BIGINT,
  total_orders BIGINT,
  total_revenue DECIMAL,
  total_listings BIGINT,
  active_listings BIGINT,
  sold_items BIGINT,
  conversion_rate DECIMAL,
  avg_order_value DECIMAL
) AS $$
DECLARE
  start_date TIMESTAMP;
  end_date TIMESTAMP;
BEGIN
  start_date := make_date(target_year, target_month, 1);
  end_date := (start_date + INTERVAL '1 month')::timestamp;
  
  RETURN QUERY
  WITH   seller_items AS (
    SELECT id FROM items WHERE user_id::UUID = seller_uuid
  ),
  monthly_views AS (
    SELECT COUNT(*) as view_count
    FROM product_views pv
    JOIN seller_items si ON pv.product_id = si.id
    WHERE pv.viewed_at >= start_date AND pv.viewed_at < end_date
  ),
  monthly_orders AS (
    SELECT 
      COUNT(DISTINCT o.id) as order_count,
      COALESCE(SUM(o.total_amount), 0) as revenue
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN seller_items si ON oi.item_id = si.id
    WHERE o.created_at >= start_date AND o.created_at < end_date
  ),
  monthly_items AS (
    SELECT 
      COUNT(*) as total_count,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
      COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_count
    FROM items
    WHERE user_id = seller_uuid
  )
  SELECT 
    COALESCE(mv.view_count, 0) as total_views,
    COALESCE(mo.order_count, 0) as total_orders,
    COALESCE(mo.revenue, 0) as total_revenue,
    mi.total_count as total_listings,
    mi.active_count as active_listings,
    mi.sold_count as sold_items,
    CASE 
      WHEN mi.total_count > 0 THEN (mi.sold_count::DECIMAL / mi.total_count::DECIMAL) * 100
      ELSE 0
    END as conversion_rate,
    CASE 
      WHEN mo.order_count > 0 THEN mo.revenue / mo.order_count
      ELSE 0
    END as avg_order_value
  FROM monthly_views mv
  CROSS JOIN monthly_orders mo
  CROSS JOIN monthly_items mi;
END;
$$ LANGUAGE plpgsql;

-- Function to get accurate percentage change
CREATE OR REPLACE FUNCTION get_percentage_change(seller_uuid UUID, metric_name TEXT, current_period_start DATE, current_period_end DATE, previous_period_start DATE, previous_period_end DATE)
RETURNS DECIMAL AS $$
DECLARE
  current_value DECIMAL;
  previous_value DECIMAL;
  change_percentage DECIMAL;
BEGIN
  -- Get current period value
  EXECUTE format('
    SELECT COALESCE(SUM(%I), 0)
    FROM daily_analytics 
    WHERE seller_id = $1 AND date >= $2 AND date <= $3
  ', metric_name) INTO current_value USING seller_uuid, current_period_start, current_period_end;
  
  -- Get previous period value
  EXECUTE format('
    SELECT COALESCE(SUM(%I), 0)
    FROM daily_analytics 
    WHERE seller_id = $1 AND date >= $2 AND date <= $3
  ', metric_name) INTO previous_value USING seller_uuid, previous_period_start, previous_period_end;
  
  -- Calculate percentage change
  IF previous_value = 0 THEN
    change_percentage := CASE WHEN current_value > 0 THEN 100 ELSE 0 END;
  ELSE
    change_percentage := ((current_value - previous_value) / previous_value) * 100;
  END IF;
  
  RETURN ROUND(change_percentage, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to populate historical data (run this to backfill data)
CREATE OR REPLACE FUNCTION populate_historical_analytics(seller_uuid UUID, start_date DATE, end_date DATE)
RETURNS VOID AS $$
DECLARE
  current_day DATE;
  analytics_data RECORD;
BEGIN
  current_day := start_date;
  
  WHILE current_day <= end_date LOOP
    -- Calculate analytics for this date
    SELECT * INTO analytics_data
    FROM calculate_daily_analytics(seller_uuid, current_day);
    
    -- Insert or update daily analytics
    INSERT INTO daily_analytics (
      seller_id, date, total_views, total_orders, total_revenue,
      total_listings, active_listings, sold_items, conversion_rate, avg_order_value
    ) VALUES (
      seller_uuid, current_day, 
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
    
    current_day := current_day + INTERVAL '1 day';
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Alternative function with explicit type casting for compatibility
CREATE OR REPLACE FUNCTION populate_historical_analytics_v2(seller_uuid TEXT, start_date TEXT, end_date TEXT)
RETURNS VOID AS $$
DECLARE
  current_day DATE;
  analytics_data RECORD;
  seller_uuid_typed UUID;
  start_date_typed DATE;
  end_date_typed DATE;
BEGIN
  -- Convert string parameters to proper types
  seller_uuid_typed := seller_uuid::UUID;
  start_date_typed := start_date::DATE;
  end_date_typed := end_date::DATE;
  
  current_day := start_date_typed;
  
  WHILE current_day <= end_date_typed LOOP
    -- Calculate analytics for this date
    SELECT * INTO analytics_data
    FROM calculate_daily_analytics(seller_uuid_typed, current_day);
    
    -- Insert or update daily analytics
    INSERT INTO daily_analytics (
      seller_id, date, total_views, total_orders, total_revenue,
      total_listings, active_listings, sold_items, conversion_rate, avg_order_value
    ) VALUES (
      seller_uuid_typed, current_day, 
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
    
    current_day := current_day + INTERVAL '1 day';
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_analytics ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own analytics data
CREATE POLICY "Users can read own daily analytics" ON daily_analytics
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Users can read own monthly analytics" ON monthly_analytics
  FOR SELECT USING (seller_id = auth.uid());

-- Allow system to insert/update analytics data
CREATE POLICY "System can manage daily analytics" ON daily_analytics
  FOR ALL USING (true);

CREATE POLICY "System can manage monthly analytics" ON monthly_analytics
  FOR ALL USING (true);

-- Create a trigger to automatically update daily analytics
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS TRIGGER AS $$
DECLARE
  seller_id UUID;
  target_date DATE;
BEGIN
  -- Get seller ID from the affected item
  IF TG_TABLE_NAME = 'items' THEN
    seller_id := NEW.user_id;
  ELSIF TG_TABLE_NAME = 'product_views' THEN
    SELECT i.user_id INTO seller_id FROM items i WHERE i.id = NEW.product_id;
  ELSIF TG_TABLE_NAME = 'orders' THEN
    -- For orders, we need to check if any items belong to the seller
    -- This is more complex and might need a different approach
    RETURN NULL;
  END IF;
  
  IF seller_id IS NOT NULL THEN
    target_date := CURRENT_DATE;
    
    -- Update daily analytics for this seller and date
    PERFORM populate_historical_analytics(seller_id, target_date, target_date);
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_daily_analytics_items
  AFTER INSERT OR UPDATE OR DELETE ON items
  FOR EACH ROW EXECUTE FUNCTION update_daily_analytics();

CREATE TRIGGER trigger_update_daily_analytics_views
  AFTER INSERT ON product_views
  FOR EACH ROW EXECUTE FUNCTION update_daily_analytics();
