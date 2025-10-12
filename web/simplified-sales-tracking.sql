-- Simplified Sold Items Tracking System
-- This creates a single, easy-to-understand table for tracking sales
-- Run this in your Supabase SQL Editor

-- First, let's clean up the complex system if it exists
DROP TABLE IF EXISTS sold_items CASCADE;
DROP TABLE IF EXISTS vendor_sales_summary CASCADE;
DROP TABLE IF EXISTS inventory_tracking CASCADE;
DROP VIEW IF EXISTS vendor_sales_report CASCADE;
DROP VIEW IF EXISTS sold_items_detailed CASCADE;
DROP VIEW IF EXISTS vendor_inventory_status CASCADE;
DROP FUNCTION IF EXISTS populate_sold_items() CASCADE;
DROP FUNCTION IF EXISTS initialize_inventory_tracking() CASCADE;
DROP FUNCTION IF EXISTS update_inventory_calculations() CASCADE;
DROP FUNCTION IF EXISTS update_vendor_sales_summary(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_vendor_sales_stats(UUID, INTEGER) CASCADE;

-- Create ONE simple table to track all sales
CREATE TABLE vendor_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic sale info
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  
  -- Item details (snapshot at time of sale)
  item_title TEXT NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  item_category TEXT,
  item_photos TEXT[],
  
  -- Sale details
  quantity_sold INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Customer info
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Sale metadata
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method TEXT,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_vendor_sales_vendor_id ON vendor_sales(vendor_id);
CREATE INDEX idx_vendor_sales_item_id ON vendor_sales(item_id);
CREATE INDEX idx_vendor_sales_date ON vendor_sales(sale_date);
CREATE INDEX idx_vendor_sales_vendor_date ON vendor_sales(vendor_id, sale_date);

-- Simple function to automatically record sales when orders are completed
CREATE OR REPLACE FUNCTION record_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when order status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Insert sales records for all items in this order
    INSERT INTO vendor_sales (
      vendor_id,
      item_id,
      order_id,
      item_title,
      item_price,
      item_category,
      item_photos,
      quantity_sold,
      total_amount,
      customer_name,
      customer_email,
      customer_phone,
      payment_method
    )
    SELECT 
      oi.vendor_id,
      oi.item_id::text,
      oi.order_id::text,
      i.title as item_title,
      i.price as item_price,
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
      (oi.quantity * oi.price) as total_amount,
      oi.buyer_name,
      oi.buyer_email,
      oi.buyer_phone,
      NEW.payment_method
    FROM order_items oi
    JOIN items i ON oi.item_id::text = i.id::text
    WHERE oi.order_id::text = NEW.id::text
      AND oi.vendor_id IS NOT NULL;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically record sales
DROP TRIGGER IF EXISTS trigger_record_sale ON orders;
CREATE TRIGGER trigger_record_sale
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION record_sale();

-- Enable Row Level Security
ALTER TABLE vendor_sales ENABLE ROW LEVEL SECURITY;

-- Simple policy: vendors can only see their own sales
DROP POLICY IF EXISTS "Vendors can view their own sales" ON vendor_sales;
CREATE POLICY "Vendors can view their own sales" ON vendor_sales
  FOR SELECT USING (vendor_id = auth.uid());

-- Grant permissions
GRANT SELECT ON vendor_sales TO authenticated;

-- Create a simple view for easy querying
CREATE OR REPLACE VIEW vendor_sales_summary AS
SELECT 
  vendor_id,
  COUNT(*) as total_sales,
  SUM(total_amount) as total_revenue,
  SUM(quantity_sold) as total_items_sold,
  AVG(total_amount) as average_sale_value,
  MIN(sale_date) as first_sale,
  MAX(sale_date) as last_sale,
  COUNT(DISTINCT item_category) as categories_sold
FROM vendor_sales
GROUP BY vendor_id;

-- Grant permissions for the view
GRANT SELECT ON vendor_sales_summary TO authenticated;

-- Success message
SELECT 'Simplified sales tracking system created successfully!' as message,
       'Use the vendor_sales table to track all sales by vendor.' as details;
