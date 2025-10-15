-- Production Database Schema Setup
-- Run this in your production Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create seller_profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    business_name TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Sweden',
    role TEXT DEFAULT 'seller',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    level INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create category_hierarchy view/table
CREATE TABLE IF NOT EXISTS category_hierarchy (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    parent_id UUID,
    level INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    condition TEXT,
    brand TEXT,
    category_id UUID REFERENCES categories(id),
    images TEXT[],
    is_active BOOLEAN DEFAULT true,
    quantity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    seller TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Sweden',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    buyer_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    item_id UUID NOT NULL REFERENCES items(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    item_id UUID NOT NULL REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    order_id UUID REFERENCES orders(id),
    item_name TEXT,
    order_date TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seller_applications table
CREATE TABLE IF NOT EXISTS seller_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    store_name TEXT,
    website_social TEXT,
    product_description TEXT NOT NULL,
    understands_application BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    interests TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_views table
CREATE TABLE IF NOT EXISTS product_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id UUID NOT NULL REFERENCES items(id),
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT
);

-- Create daily_analytics table
CREATE TABLE IF NOT EXISTS daily_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_items INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    active_sellers INTEGER DEFAULT 0,
    new_items INTEGER DEFAULT 0,
    sold_items INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_sales table
CREATE TABLE IF NOT EXISTS vendor_sales (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vendor_id UUID NOT NULL,
    item_id UUID REFERENCES items(id),
    sale_date DATE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.10,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seller_invites table
CREATE TABLE IF NOT EXISTS seller_invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    invited_by UUID NOT NULL,
    token TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_sales_summary table
CREATE TABLE IF NOT EXISTS vendor_sales_summary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vendor_id UUID NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0,
    total_items_sold INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vendor_id, period_start, period_end)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_is_active ON items(is_active);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_deleted_at ON items(deleted_at);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_is_dismissed ON notifications(is_dismissed);
CREATE INDEX IF NOT EXISTS idx_seller_applications_email ON seller_applications(email);
CREATE INDEX IF NOT EXISTS idx_seller_applications_status ON seller_applications(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_product_views_item_id ON product_views(item_id);
CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_vendor_id ON vendor_sales(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_item_id ON vendor_sales(item_id);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_sale_date ON vendor_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_seller_invites_email ON seller_invites(email);
CREATE INDEX IF NOT EXISTS idx_seller_invites_token ON seller_invites(token);
CREATE INDEX IF NOT EXISTS idx_seller_invites_status ON seller_invites(status);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_summary_vendor_id ON vendor_sales_summary(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_summary_period ON vendor_sales_summary(period_start, period_end);

-- Add constraints (only if they don't exist)
DO $$ 
BEGIN
    -- Add quantity constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_quantity_positive' 
        AND conrelid = 'items'::regclass
    ) THEN
        ALTER TABLE items ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);
    END IF;
    
    -- Add status constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_status_valid' 
        AND conrelid = 'items'::regclass
    ) THEN
        ALTER TABLE items ADD CONSTRAINT check_status_valid CHECK (
            status IS NULL OR status IN (
                'active', 'inactive', 'draft', 'sold', 'reserved', 
                'listed', 'viewed', 'in_cart', 'shipped', 'delivered'
            )
        );
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_sales_summary ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (adjust as needed)
DO $$ 
BEGIN
    -- Categories policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for categories' AND tablename = 'categories') THEN
        CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for category_hierarchy' AND tablename = 'category_hierarchy') THEN
        CREATE POLICY "Public read access for category_hierarchy" ON category_hierarchy FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for active items' AND tablename = 'items') THEN
        CREATE POLICY "Public read access for active items" ON items FOR SELECT USING (is_active = true AND deleted_at IS NULL);
    END IF;
END $$;

-- Notifications policies - users can only see their own notifications
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Seller applications policies - public can insert, admins can view all
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can submit seller applications' AND tablename = 'seller_applications') THEN
        CREATE POLICY "Anyone can submit seller applications" ON seller_applications FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all seller applications' AND tablename = 'seller_applications') THEN
        CREATE POLICY "Admins can view all seller applications" ON seller_applications FOR SELECT USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update seller applications' AND tablename = 'seller_applications') THEN
        CREATE POLICY "Admins can update seller applications" ON seller_applications FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
END $$;

-- Waitlist policies - public can insert and view
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can join waitlist' AND tablename = 'waitlist') THEN
        CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view waitlist' AND tablename = 'waitlist') THEN
        CREATE POLICY "Anyone can view waitlist" ON waitlist FOR SELECT USING (true);
    END IF;
END $$;

-- Product views policies - anyone can insert, users can view their own
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can track product views' AND tablename = 'product_views') THEN
        CREATE POLICY "Anyone can track product views" ON product_views FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own product views' AND tablename = 'product_views') THEN
        CREATE POLICY "Users can view own product views" ON product_views FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
    END IF;
END $$;

-- Daily analytics policies - admins only
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view daily analytics' AND tablename = 'daily_analytics') THEN
        CREATE POLICY "Admins can view daily analytics" ON daily_analytics FOR SELECT USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update daily analytics' AND tablename = 'daily_analytics') THEN
        CREATE POLICY "Admins can update daily analytics" ON daily_analytics FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert daily analytics' AND tablename = 'daily_analytics') THEN
        CREATE POLICY "Admins can insert daily analytics" ON daily_analytics FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
END $$;

-- Vendor sales policies - vendors can see their own sales
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Vendors can view own sales' AND tablename = 'vendor_sales') THEN
        CREATE POLICY "Vendors can view own sales" ON vendor_sales FOR SELECT USING (auth.uid() = vendor_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Vendors can insert own sales' AND tablename = 'vendor_sales') THEN
        CREATE POLICY "Vendors can insert own sales" ON vendor_sales FOR INSERT WITH CHECK (auth.uid() = vendor_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all vendor sales' AND tablename = 'vendor_sales') THEN
        CREATE POLICY "Admins can view all vendor sales" ON vendor_sales FOR SELECT USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
END $$;

-- Seller invites policies - admins and invited users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage seller invites' AND tablename = 'seller_invites') THEN
        CREATE POLICY "Admins can manage seller invites" ON seller_invites FOR ALL USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view invites for their email' AND tablename = 'seller_invites') THEN
        CREATE POLICY "Users can view invites for their email" ON seller_invites FOR SELECT USING (email = auth.jwt() ->> 'email');
    END IF;
END $$;

-- Vendor sales summary policies - vendors and admins
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Vendors can view own sales summary' AND tablename = 'vendor_sales_summary') THEN
        CREATE POLICY "Vendors can view own sales summary" ON vendor_sales_summary FOR SELECT USING (auth.uid() = vendor_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all sales summaries' AND tablename = 'vendor_sales_summary') THEN
        CREATE POLICY "Admins can view all sales summaries" ON vendor_sales_summary FOR SELECT USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage sales summaries' AND tablename = 'vendor_sales_summary') THEN
        CREATE POLICY "Admins can manage sales summaries" ON vendor_sales_summary FOR ALL USING (auth.uid() IN (SELECT user_id FROM seller_profiles WHERE role = 'admin'));
    END IF;
END $$;

-- Insert some basic categories (adjust as needed)
INSERT INTO categories (name, slug, description, level, sort_order) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories', 0, 1),
('Clothing', 'clothing', 'Fashion and apparel', 0, 2),
('Home & Garden', 'home-garden', 'Home and garden items', 0, 3),
('Sports', 'sports', 'Sports and outdoor equipment', 0, 4),
('Books', 'books', 'Books and literature', 0, 5)
ON CONFLICT (slug) DO NOTHING;

-- Copy to category_hierarchy
INSERT INTO category_hierarchy (name, slug, description, level, sort_order, is_active)
SELECT name, slug, description, level, sort_order, is_active FROM categories
WHERE NOT EXISTS (SELECT 1 FROM category_hierarchy WHERE category_hierarchy.slug = categories.slug);

-- Verify tables were created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('seller_profiles', 'items', 'categories', 'category_hierarchy', 'orders', 'order_items', 'cart_items', 'user_profiles', 'notifications', 'seller_applications', 'waitlist', 'product_views', 'daily_analytics', 'vendor_sales', 'seller_invites', 'vendor_sales_summary')
ORDER BY table_name, ordinal_position;
