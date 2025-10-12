-- SQL script to create comprehensive sold items tracking system (FIXED VERSION)
-- This creates tables to track sold out items by vendor for better inventory management
-- Run this in your Supabase SQL Editor

-- 1. Create sold_items table to track all sold items (with proper type handling)
CREATE TABLE IF NOT EXISTS sold_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL, -- Using TEXT to match items.id casting
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL, -- Using TEXT to match orders.id casting
  order_item_id TEXT NOT NULL, -- Using TEXT to match order_items.id casting
  
  -- Item details at time of sale (snapshot)
  item_title TEXT NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  item_condition TEXT,
  item_size TEXT,
  item_category TEXT,
  item_photos TEXT[],
  
  -- Sale details
  quantity_sold INTEGER NOT NULL DEFAULT 1,
  sale_price DECIMAL(10,2) NOT NULL,
  total_sale_amount DECIMAL(10,2) NOT NULL,
  
  -- Buyer information
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  
  -- Sale metadata
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method TEXT,
  order_status TEXT DEFAULT 'completed',
  
  -- Tracking fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create vendor_sales_summary table for aggregated data
CREATE TABLE IF NOT EXISTS vendor_sales_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Time period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  
  -- Sales metrics
  total_items_sold INTEGER NOT NULL DEFAULT 0,
  total_sales_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  
  -- Top selling categories
  top_category TEXT,
  top_category_sales INTEGER DEFAULT 0,
  
  -- Performance metrics
  conversion_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  return_customer_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique vendor-period combinations
  UNIQUE(vendor_id, period_start, period_end, period_type)
);

-- 3. Create inventory_tracking table for stock management
CREATE TABLE IF NOT EXISTS inventory_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL, -- Using TEXT to match items.id casting
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Inventory status
  current_stock INTEGER NOT NULL DEFAULT 1,
  original_stock INTEGER NOT NULL DEFAULT 1,
  reserved_stock INTEGER DEFAULT 0,
  available_stock INTEGER NOT NULL DEFAULT 1,
  
  -- Status tracking
  is_sold_out BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Pricing history
  original_price DECIMAL(10,2),
  current_price DECIMAL(10,2),
  last_price_change TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique item-vendor combinations
  UNIQUE(item_id, vendor_id)
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sold_items_vendor_id ON sold_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_sold_items_item_id ON sold_items(item_id);
CREATE INDEX IF NOT EXISTS idx_sold_items_order_id ON sold_items(order_id);
CREATE INDEX IF NOT EXISTS idx_sold_items_sale_date ON sold_items(sale_date);
CREATE INDEX IF NOT EXISTS idx_sold_items_vendor_date ON sold_items(vendor_id, sale_date);

CREATE INDEX IF NOT EXISTS idx_vendor_sales_vendor_id ON vendor_sales_summary(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_period ON vendor_sales_summary(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_type ON vendor_sales_summary(period_type);

CREATE INDEX IF NOT EXISTS idx_inventory_item_id ON inventory_tracking(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_vendor_id ON inventory_tracking(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sold_out ON inventory_tracking(is_sold_out);
CREATE INDEX IF NOT EXISTS idx_inventory_active ON inventory_tracking(is_active);

-- 5. Create function to automatically populate sold_items when order is completed
CREATE OR REPLACE FUNCTION populate_sold_items()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when order status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Insert sold items for all items in this order
    INSERT INTO sold_items (
      item_id,
      vendor_id,
      order_id,
      order_item_id,
      item_title,
      item_price,
      item_condition,
      item_size,
      item_category,
      item_photos,
      quantity_sold,
      sale_price,
      total_sale_amount,
      buyer_name,
      buyer_email,
      buyer_phone,
      payment_method,
      order_status
    )
    SELECT 
      oi.item_id::text,
      oi.vendor_id,
      oi.order_id::text,
      oi.id::text as order_item_id,
      i.title as item_title,
      i.price as item_price,
      i.condition as item_condition,
      i.size as item_size,
      i.category as item_category,
      CASE 
        WHEN i.photos IS NOT NULL THEN 
          CASE 
            WHEN pg_typeof(i.photos) = 'text[]'::regtype THEN i.photos::text[]
            ELSE ARRAY[i.photos::text]
          END
        ELSE ARRAY[]::text[]
      END as item_photos,
      oi.quantity as quantity_sold,
      oi.price as sale_price,
      (oi.quantity * oi.price) as total_sale_amount,
      oi.buyer_name,
      oi.buyer_email,
      oi.buyer_phone,
      NEW.payment_method,
      NEW.status as order_status
    FROM order_items oi
    JOIN items i ON oi.item_id::text = i.id::text
    WHERE oi.order_id::text = NEW.id::text
      AND oi.vendor_id IS NOT NULL;
    
    -- Update inventory tracking
    UPDATE inventory_tracking 
    SET 
      current_stock = GREATEST(0, current_stock - (
        SELECT SUM(oi.quantity) 
        FROM order_items oi 
        WHERE oi.item_id::text = inventory_tracking.item_id 
          AND oi.order_id::text = NEW.id::text
      ))
    WHERE item_id IN (
      SELECT item_id::text 
      FROM order_items 
      WHERE order_id::text = NEW.id::text
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger to automatically populate sold_items
DROP TRIGGER IF EXISTS trigger_populate_sold_items ON orders;
CREATE TRIGGER trigger_populate_sold_items
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION populate_sold_items();

-- 7. Create function to initialize inventory tracking for new items
CREATE OR REPLACE FUNCTION initialize_inventory_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert inventory tracking record for new items
  -- Use SECURITY DEFINER to bypass RLS for this operation
  INSERT INTO inventory_tracking (
    item_id,
    vendor_id,
    current_stock,
    original_stock,
    original_price,
    current_price
  )
  VALUES (
    NEW.id::text,
    NEW.user_id,
    1, -- Default stock of 1 for individual items
    1,
    NEW.price,
    NEW.price
  )
  ON CONFLICT (item_id, vendor_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to initialize inventory tracking for new items
DROP TRIGGER IF EXISTS trigger_initialize_inventory ON items;
CREATE TRIGGER trigger_initialize_inventory
  AFTER INSERT ON items
  FOR EACH ROW
  EXECUTE FUNCTION initialize_inventory_tracking();

-- 8a. Create function to update inventory calculations
CREATE OR REPLACE FUNCTION update_inventory_calculations()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate available stock
  NEW.available_stock := NEW.current_stock - COALESCE(NEW.reserved_stock, 0);
  
  -- Update sold out status
  NEW.is_sold_out := (NEW.available_stock <= 0);
  
  -- Update timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8b. Create trigger to automatically update inventory calculations
DROP TRIGGER IF EXISTS trigger_update_inventory_calculations ON inventory_tracking;
CREATE TRIGGER trigger_update_inventory_calculations
  BEFORE INSERT OR UPDATE ON inventory_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_calculations();

-- 9. Create function to update vendor sales summary
CREATE OR REPLACE FUNCTION update_vendor_sales_summary(p_vendor_id UUID, p_period_type TEXT DEFAULT 'monthly')
RETURNS VOID AS $$
DECLARE
  period_start_date DATE;
  period_end_date DATE;
  sales_data RECORD;
BEGIN
  -- Calculate period dates based on type
  CASE p_period_type
    WHEN 'daily' THEN
      period_start_date := CURRENT_DATE;
      period_end_date := CURRENT_DATE;
    WHEN 'weekly' THEN
      period_start_date := DATE_TRUNC('week', CURRENT_DATE)::DATE;
      period_end_date := (DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days')::DATE;
    WHEN 'monthly' THEN
      period_start_date := DATE_TRUNC('month', CURRENT_DATE)::DATE;
      period_end_date := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    WHEN 'yearly' THEN
      period_start_date := DATE_TRUNC('year', CURRENT_DATE)::DATE;
      period_end_date := (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day')::DATE;
  END CASE;
  
  -- Get sales data for the period
  SELECT 
    COUNT(DISTINCT order_id) as total_orders,
    SUM(quantity_sold) as total_items_sold,
    SUM(total_sale_amount) as total_sales_amount,
    AVG(total_sale_amount) as average_order_value,
    MODE() WITHIN GROUP (ORDER BY item_category) as top_category,
    COUNT(*) FILTER (WHERE item_category = MODE() WITHIN GROUP (ORDER BY item_category)) as top_category_sales
  INTO sales_data
  FROM sold_items
  WHERE vendor_id = p_vendor_id
    AND sale_date::DATE BETWEEN period_start_date AND period_end_date;
  
  -- Insert or update summary
  INSERT INTO vendor_sales_summary (
    vendor_id,
    period_start,
    period_end,
    period_type,
    total_items_sold,
    total_sales_amount,
    total_orders,
    average_order_value,
    top_category,
    top_category_sales
  )
  VALUES (
    p_vendor_id,
    period_start_date,
    period_end_date,
    p_period_type,
    COALESCE(sales_data.total_items_sold, 0),
    COALESCE(sales_data.total_sales_amount, 0),
    COALESCE(sales_data.total_orders, 0),
    COALESCE(sales_data.average_order_value, 0),
    sales_data.top_category,
    COALESCE(sales_data.top_category_sales, 0)
  )
  ON CONFLICT (vendor_id, period_start, period_end, period_type)
  DO UPDATE SET
    total_items_sold = EXCLUDED.total_items_sold,
    total_sales_amount = EXCLUDED.total_sales_amount,
    total_orders = EXCLUDED.total_orders,
    average_order_value = EXCLUDED.average_order_value,
    top_category = EXCLUDED.top_category,
    top_category_sales = EXCLUDED.top_category_sales,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 10. Create views for easy querying
CREATE OR REPLACE VIEW vendor_sales_report AS
SELECT 
  vss.vendor_id,
  u.email as vendor_email,
  vss.period_start,
  vss.period_end,
  vss.period_type,
  vss.total_items_sold,
  vss.total_sales_amount,
  vss.total_orders,
  vss.average_order_value,
  vss.top_category,
  vss.top_category_sales,
  vss.created_at,
  vss.updated_at
FROM vendor_sales_summary vss
JOIN auth.users u ON vss.vendor_id = u.id
ORDER BY vss.period_start DESC, vss.total_sales_amount DESC;

CREATE OR REPLACE VIEW sold_items_detailed AS
SELECT 
  si.*,
  u.email as vendor_email,
  o.full_name as order_customer_name,
  o.email as order_customer_email,
  o.phone as order_customer_phone,
  o.address_line1,
  o.city,
  o.postal_code
FROM sold_items si
JOIN auth.users u ON si.vendor_id = u.id
JOIN orders o ON si.order_id::text = o.id::text
ORDER BY si.sale_date DESC;

CREATE OR REPLACE VIEW vendor_inventory_status AS
SELECT 
  it.*,
  i.title as item_title,
  i.category as item_category,
  i.photos as item_photos,
  u.email as vendor_email,
  CASE 
    WHEN it.available_stock <= 0 THEN 'Sold Out'
    WHEN it.available_stock <= 2 THEN 'Low Stock'
    ELSE 'In Stock'
  END as stock_status
FROM inventory_tracking it
JOIN items i ON it.item_id = i.id::text
JOIN auth.users u ON it.vendor_id = u.id
WHERE it.is_active = true
ORDER BY it.updated_at DESC;

-- 11. Create helper functions for common queries
CREATE OR REPLACE FUNCTION get_vendor_sales_stats(p_vendor_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_items_sold BIGINT,
  total_revenue DECIMAL,
  total_orders BIGINT,
  avg_order_value DECIMAL,
  top_selling_category TEXT,
  items_sold_out_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(si.id) as total_items_sold,
    SUM(si.total_sale_amount) as total_revenue,
    COUNT(DISTINCT si.order_id) as total_orders,
    AVG(si.total_sale_amount) as avg_order_value,
    MODE() WITHIN GROUP (ORDER BY si.item_category) as top_selling_category,
    COUNT(it.id) FILTER (WHERE it.is_sold_out = true) as items_sold_out_count
  FROM sold_items si
  LEFT JOIN inventory_tracking it ON si.vendor_id = it.vendor_id
  WHERE si.vendor_id = p_vendor_id
    AND si.sale_date >= NOW() - INTERVAL '1 day' * p_days;
END;
$$ LANGUAGE plpgsql;

-- 12. Add RLS (Row Level Security) policies
ALTER TABLE sold_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_sales_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Vendors can view their own sold items" ON sold_items;
DROP POLICY IF EXISTS "Vendors can view their own sales summaries" ON vendor_sales_summary;
DROP POLICY IF EXISTS "Vendors can view their own inventory" ON inventory_tracking;
DROP POLICY IF EXISTS "Vendors can insert their own inventory" ON inventory_tracking;
DROP POLICY IF EXISTS "Vendors can update their own inventory" ON inventory_tracking;

-- Policy for sold_items: vendors can only see their own sales
CREATE POLICY "Vendors can view their own sold items" ON sold_items
  FOR SELECT USING (vendor_id = auth.uid());

-- Policy for vendor_sales_summary: vendors can only see their own summaries
CREATE POLICY "Vendors can view their own sales summaries" ON vendor_sales_summary
  FOR SELECT USING (vendor_id = auth.uid());

-- Policy for inventory_tracking: vendors can only see their own inventory
CREATE POLICY "Vendors can view their own inventory" ON inventory_tracking
  FOR SELECT USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own inventory" ON inventory_tracking
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own inventory" ON inventory_tracking
  FOR UPDATE USING (vendor_id = auth.uid());

-- 13. Grant necessary permissions
GRANT SELECT ON sold_items TO authenticated;
GRANT SELECT ON vendor_sales_summary TO authenticated;
GRANT SELECT, INSERT, UPDATE ON inventory_tracking TO authenticated;
GRANT SELECT ON vendor_sales_report TO authenticated;
GRANT SELECT ON sold_items_detailed TO authenticated;
GRANT SELECT ON vendor_inventory_status TO authenticated;

-- 14. Create sample data migration for existing orders (optional)
-- Uncomment the following section if you want to populate sold_items for existing completed orders
/*
INSERT INTO sold_items (
  item_id, vendor_id, order_id, order_item_id, item_title, item_price,
  item_condition, item_size, item_category, item_photos, quantity_sold,
  sale_price, total_sale_amount, buyer_name, buyer_email, buyer_phone,
  payment_method, order_status, sale_date
)
SELECT 
  oi.item_id::text,
  oi.vendor_id,
  oi.order_id::text,
  oi.id::text as order_item_id,
  i.title as item_title,
  i.price as item_price,
  i.condition as item_condition,
  i.size as item_size,
  i.category as item_category,
  CASE 
    WHEN i.photos IS NOT NULL THEN 
      CASE 
        WHEN pg_typeof(i.photos) = 'text[]'::regtype THEN i.photos::text[]
        ELSE ARRAY[i.photos::text]
      END
    ELSE ARRAY[]::text[]
  END as item_photos,
  oi.quantity as quantity_sold,
  oi.price as sale_price,
  (oi.quantity * oi.price) as total_sale_amount,
  oi.buyer_name,
  oi.buyer_email,
  oi.buyer_phone,
  o.payment_method,
  o.status as order_status,
  o.created_at as sale_date
FROM order_items oi
JOIN orders o ON oi.order_id::text = o.id::text
JOIN items i ON oi.item_id::text = i.id::text
WHERE o.status = 'completed'
  AND oi.vendor_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM sold_items si 
    WHERE si.order_item_id = oi.id::text
  );
*/

-- Success message
SELECT 'Sold items tracking system created successfully with proper type handling!' as message;
