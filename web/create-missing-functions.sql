-- Create Missing Database Functions
-- Run this in your Supabase SQL Editor

-- 1. Create get_seller_view_stats function
CREATE OR REPLACE FUNCTION get_seller_view_stats(seller_uuid UUID)
RETURNS TABLE(
    total_views BIGINT,
    unique_views BIGINT,
    views_today BIGINT,
    views_this_week BIGINT,
    views_this_month BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(pv.view_count), 0) as total_views,
        COALESCE(COUNT(DISTINCT pv.id), 0) as unique_views,
        COALESCE(SUM(CASE WHEN pv.created_at >= CURRENT_DATE THEN pv.view_count ELSE 0 END), 0) as views_today,
        COALESCE(SUM(CASE WHEN pv.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN pv.view_count ELSE 0 END), 0) as views_this_week,
        COALESCE(SUM(CASE WHEN pv.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN pv.view_count ELSE 0 END), 0) as views_this_month
    FROM product_views pv
    JOIN items i ON pv.item_id = i.id
    WHERE i.user_id = seller_uuid;
END;
$$;

-- 2. Create get_product_view_count function
CREATE OR REPLACE FUNCTION get_product_view_count(product_uuid UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    view_count BIGINT;
BEGIN
    SELECT COALESCE(SUM(pv.view_count), 0) INTO view_count
    FROM product_views pv
    WHERE pv.item_id = product_uuid;
    
    RETURN view_count;
END;
$$;

-- 3. Create product_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    view_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_views_item_id ON product_views(item_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views(created_at);

-- 5. Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_seller_view_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_view_count(UUID) TO authenticated;
GRANT SELECT, INSERT, UPDATE ON product_views TO authenticated;

-- 6. Enable RLS on product_views table
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for product_views
CREATE POLICY "Enable read access for all users" ON product_views
    FOR SELECT 
    TO public 
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON product_views
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON product_views
    FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- 8. Test the functions
SELECT 'Testing get_seller_view_stats function...' as info;
SELECT * FROM get_seller_view_stats('62838da9-e9cc-4c54-907b-925bbe947279'::UUID);

SELECT 'Testing get_product_view_count function...' as info;
SELECT get_product_view_count('62838da9-e9cc-4c54-907b-925bbe947279'::UUID);
