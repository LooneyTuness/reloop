-- Create Stub Functions to Prevent 404 Errors
-- Run this in your Supabase SQL Editor

-- 1. Create get_seller_view_stats function (returns zeros for now)
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
        0::BIGINT as total_views,
        0::BIGINT as unique_views,
        0::BIGINT as views_today,
        0::BIGINT as views_this_week,
        0::BIGINT as views_this_month;
END;
$$;

-- 2. Create get_product_view_count function (returns 0 for now)
CREATE OR REPLACE FUNCTION get_product_view_count(product_uuid UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN 0::BIGINT;
END;
$$;

-- 3. Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_seller_view_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_view_count(UUID) TO authenticated;

-- 4. Test the functions
SELECT 'Functions created successfully!' as info;
SELECT * FROM get_seller_view_stats('62838da9-e9cc-4c54-907b-925bbe947279'::UUID);
SELECT get_product_view_count('62838da9-e9cc-4c54-907b-925bbe947279'::UUID);
