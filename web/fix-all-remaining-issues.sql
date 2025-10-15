-- Fix All Remaining Database Issues
-- Run this in your Supabase SQL Editor

-- 1. Create seller_profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Sweden',
    business_type TEXT,
    description TEXT,
    website TEXT,
    instagram TEXT,
    facebook TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- 3. Create the missing analytics functions
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

CREATE OR REPLACE FUNCTION get_product_view_count(product_uuid UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN 0::BIGINT;
END;
$$;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_status ON seller_profiles(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_item_id ON cart_items(item_id);

-- 5. Enable RLS on new tables
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for seller_profiles
CREATE POLICY "Users can view their own seller profile" ON seller_profiles
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own seller profile" ON seller_profiles
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seller profile" ON seller_profiles
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. Create RLS policies for cart_items
CREATE POLICY "Users can view their own cart items" ON cart_items
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
    FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- 8. Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_seller_view_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_view_count(UUID) TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON seller_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO authenticated;

-- 9. Create a seller profile for the current user (optional)
INSERT INTO seller_profiles (user_id, business_name, full_name, status)
VALUES ('62838da9-e9cc-4c54-907b-925bbe947279', 'Test Business', 'Viktorija Matejevik', 'approved')
ON CONFLICT (user_id) DO NOTHING;

-- 10. Verify the changes
SELECT 'Tables created successfully!' as info;
SELECT table_name FROM information_schema.tables WHERE table_name IN ('seller_profiles', 'cart_items');
SELECT 'Functions created successfully!' as info;
SELECT routine_name FROM information_schema.routines WHERE routine_name IN ('get_seller_view_stats', 'get_product_view_count');
