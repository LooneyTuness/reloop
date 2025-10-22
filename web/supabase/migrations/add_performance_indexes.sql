-- Performance Optimization Indexes for Reloop
-- Run this migration to dramatically improve query performance

-- =============================================================================
-- Items table indexes
-- =============================================================================

-- Index for fetching seller items (used in listings page)
CREATE INDEX IF NOT EXISTS idx_items_user_id_created_at 
ON items(user_id, created_at DESC);

-- Index for item lookups by ID
CREATE INDEX IF NOT EXISTS idx_items_id 
ON items(id) WHERE deleted_at IS NULL;

-- Index for item status filtering
CREATE INDEX IF NOT EXISTS idx_items_status 
ON items(status) WHERE deleted_at IS NULL;

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_items_category_id 
ON items(category_id) WHERE deleted_at IS NULL;

-- Composite index for seller items with status filtering
CREATE INDEX IF NOT EXISTS idx_items_user_status_created 
ON items(user_id, status, created_at DESC) WHERE deleted_at IS NULL;

-- =============================================================================
-- Orders table indexes
-- =============================================================================

-- Index for fetching orders by creation date
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
ON orders(created_at DESC);

-- Index for order status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders(status);

-- Index for buyer orders
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id_created 
ON orders(buyer_id, created_at DESC) WHERE buyer_id IS NOT NULL;

-- Composite index for order filtering and sorting
CREATE INDEX IF NOT EXISTS idx_orders_status_created 
ON orders(status, created_at DESC);

-- =============================================================================
-- Order Items table indexes
-- =============================================================================

-- Index for fetching order items by order_id (most common query)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
ON order_items(order_id);

-- Index for fetching order items by item_id (seller's products)
CREATE INDEX IF NOT EXISTS idx_order_items_item_id 
ON order_items(item_id);

-- Composite index for seller order queries (critical for performance)
CREATE INDEX IF NOT EXISTS idx_order_items_item_order 
ON order_items(item_id, order_id);

-- =============================================================================
-- Seller Applications table indexes
-- =============================================================================

-- Index for fetching applications by status (used in admin panel)
CREATE INDEX IF NOT EXISTS idx_seller_applications_status_created 
ON seller_applications(status, created_at DESC);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_seller_applications_email 
ON seller_applications(email);

-- =============================================================================
-- Seller Profiles table indexes
-- =============================================================================

-- Index for user_id lookups (most common)
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id 
ON seller_profiles(user_id);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_seller_profiles_email 
ON seller_profiles(email);

-- Index for approved sellers only
CREATE INDEX IF NOT EXISTS idx_seller_profiles_approved 
ON seller_profiles(is_approved) WHERE is_approved = true;

-- =============================================================================
-- Categories table indexes
-- =============================================================================

-- Index for slug lookups (used in URLs)
CREATE INDEX IF NOT EXISTS idx_categories_slug 
ON categories(slug);

-- Index for active categories
CREATE INDEX IF NOT EXISTS idx_categories_active 
ON categories(is_active) WHERE is_active = true;

-- =============================================================================
-- Optimized RPC Functions for aggregated queries
-- =============================================================================

-- Function to get seller order statistics in one query
CREATE OR REPLACE FUNCTION get_seller_order_stats(seller_id UUID)
RETURNS TABLE (
  total_revenue NUMERIC,
  total_orders BIGINT,
  avg_order_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH seller_items AS (
    SELECT id FROM items WHERE user_id = seller_id
  ),
  seller_order_items AS (
    SELECT 
      oi.order_id,
      oi.quantity * oi.price as item_revenue
    FROM order_items oi
    INNER JOIN seller_items si ON oi.item_id = si.id
  )
  SELECT 
    COALESCE(SUM(item_revenue), 0) as total_revenue,
    COUNT(DISTINCT order_id) as total_orders,
    CASE 
      WHEN COUNT(DISTINCT order_id) > 0 
      THEN COALESCE(SUM(item_revenue), 0) / COUNT(DISTINCT order_id)
      ELSE 0 
    END as avg_order_value
  FROM seller_order_items;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_seller_order_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_seller_order_stats(UUID) TO service_role;

COMMENT ON FUNCTION get_seller_order_stats IS 
'Optimized function to calculate seller revenue and order stats in a single query';

-- =============================================================================
-- Performance statistics
-- =============================================================================

-- Analyze tables to update statistics for query planner
ANALYZE items;
ANALYZE orders;
ANALYZE order_items;
ANALYZE seller_applications;
ANALYZE seller_profiles;
ANALYZE categories;

-- =============================================================================
-- Comments for documentation
-- =============================================================================

COMMENT ON INDEX idx_items_user_id_created_at IS 
'Optimizes seller listings page - fetches all items for a seller sorted by date';

COMMENT ON INDEX idx_order_items_item_id IS 
'Critical for seller orders query - finds all orders containing seller items';

COMMENT ON INDEX idx_seller_applications_status_created IS 
'Optimizes admin panel - filters and sorts applications by status and date';

