'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { supabaseDataService } from '@/lib/supabase/data-service';
import { Database } from '@/lib/supabase/supabase.types';
import { useSellerProfile } from './SellerProfileContext';

// Types based on Supabase schema
type Item = Database['public']['Tables']['items']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

interface DashboardOrder extends Order {
  customer?: string;
  customer_name?: string;
  customer_email?: string;
  product?: string;
  product_name?: string;
  product_image?: string;
  amount?: string;
  date?: string;
  order_items?: OrderItem[];
  seller_order_items?: OrderItem[];
  item_count?: number;
  // Address fields
  full_name?: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
}

interface DashboardProduct extends Omit<Item, 'price'> {
  name?: string;
  views?: number;
  price?: string;
  status?: 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive';
  category?: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  soldItems: number;
  totalEarnings: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  customerRating?: number;
  totalViews: number;
  viewsLast30Days: number;
}

interface Activity {
  id: string;
  type: 'order' | 'view' | 'payment' | 'product';
  message: string;
  timestamp: string;
  status: 'active' | 'completed';
}

interface DashboardContextType {
  // Data
  orders: DashboardOrder[];
  products: DashboardProduct[];
  stats: DashboardStats;
  activities: Activity[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  addNewProduct: (product: Partial<Item>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Item>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  searchProducts: (query: string) => Promise<DashboardProduct[]>;
  markActivityAsRead: (activityId: string) => void;
  testUpdateProductStatuses: (status: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  // Get the real seller profile from context
  const { profile: sellerProfile, loading: profileLoading } = useSellerProfile();
  const user = useMemo(() => 
    sellerProfile ? { id: sellerProfile.user_id, email: sellerProfile.email } : null,
    [sellerProfile]
  );
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    soldItems: 0,
    totalEarnings: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    customerRating: 4.5,
    totalViews: 0,
    viewsLast30Days: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [cacheTimeout] = useState<number>(10000); // 10 seconds cache (reduced for faster updates)
  const [isFetching, setIsFetching] = useState(false); // Track if a fetch is in progress


  // Function to sync product statuses with order statuses
  // Optimized: Not async, uses Map for O(1) lookups
  const syncProductStatusesWithOrders = useCallback((products: DashboardProduct[], orders: DashboardOrder[]) => {
    // Create a map for fast product lookup
    const productMap = new Map(products.map(p => [String(p.id), p]));
    
    // Process orders that already have order_items data
    for (const order of orders) {
      if (order.seller_order_items && order.seller_order_items.length > 0) {
        // Map order status to product status once
        let productStatus: string = 'active';
        switch (order.status) {
          case 'pending':
          case 'processing':
            productStatus = 'sold';
            break;
          case 'shipped':
            productStatus = 'shipped';
            break;
          case 'delivered':
            productStatus = 'delivered';
            break;
          case 'cancelled':
            productStatus = 'active';
            break;
          default:
            productStatus = 'sold';
        }
        
        // Update products in this order
        for (const item of order.seller_order_items) {
          const productId = String(item.item_id);
          const product = productMap.get(productId);
          if (product && product.status !== productStatus) {
            productMap.set(productId, {
              ...product,
              status: productStatus as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive'
            });
          }
        }
      }
    }
    
    return Array.from(productMap.values());
  }, []);

  const refreshData = useCallback(async (forceRefresh = false) => {
    console.log('🔄 refreshData called, forceRefresh:', forceRefresh);
    
    // Don't set loading to false if profile is still loading
    if (!user?.id && !profileLoading) {
      setIsLoading(false);
      return;
    }
    
    // If profile is still loading, keep loading state true
    if (profileLoading) {
      setIsLoading(true);
      return;
    }
    
    // Prevent multiple simultaneous fetches
    if (isFetching) {
      console.log('⏭️  Already fetching, skipping');
      return;
    }
    
    // Check cache timeout - only show loading for first fetch or forced refresh
    const now = Date.now();
    const hasCache = lastFetchTime > 0;
    if (!forceRefresh && hasCache && (now - lastFetchTime) < cacheTimeout) {
      console.log('📦 Using cached data');
      return;
    }
    
    // Only show loading spinner on first load (when we have no data)
    const productsLen = products.length;
    const ordersLen = orders.length;
    if (!hasCache && productsLen === 0 && ordersLen === 0) {
      setIsLoading(true);
    }
    setIsFetching(true);
    setError(null);
    
    try {
      console.time('⏱️ Total data fetch');
      
      // Fetch all data in parallel with individual error handling
      console.time('  API calls');
      const [sellerItems, sellerOrders, sellerStats] = await Promise.allSettled([
        supabaseDataService.getSellerItems(user!.id),
        supabaseDataService.getSellerOrders(user!.id),
        supabaseDataService.getSellerStats(user!.id)
      ]);
      console.timeEnd('  API calls');

      // Handle individual results
      const items = sellerItems.status === 'fulfilled' ? sellerItems.value : [];
      const orders = sellerOrders.status === 'fulfilled' ? (sellerOrders.value as DashboardOrder[]) : [];
      const stats = sellerStats.status === 'fulfilled' ? sellerStats.value : {
        totalItems: 0,
        activeItems: 0,
        soldItems: 0,
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0
      };

      console.log(`📊 Fetched: ${items.length} items, ${orders.length} orders`);

      // Transform items to dashboard products first (optimized)
      console.time('  Transform items');
      const dashboardProducts: DashboardProduct[] = items.map(item => ({
        ...item,
        name: item.title || item.name || 'Untitled',
        views: Math.floor(Math.random() * 1000) + 100,
        price: item.price?.toFixed(2) || '0.00',
        status: (item.status as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive') || 'active'
      }));
      console.timeEnd('  Transform items');

      // Sync product statuses with order statuses (now synchronous)
      console.time('  Sync statuses');
      const syncedProducts = syncProductStatusesWithOrders(dashboardProducts, orders);
      console.timeEnd('  Sync statuses');

      // Transform orders to dashboard orders
      console.time('  Transform orders');
      
      const dashboardOrders: DashboardOrder[] = (orders as DashboardOrder[]).map((order: DashboardOrder) => {
        
        // Get ALL items from this seller for display
        const sellerOrderItems = (order.order_items as (OrderItem & { items?: Item | null })[] | undefined)?.filter((item) => {
          return item.items?.user_id === user!.id;
        }) || [];
        
        
        // Create a summary for the main display
        let productName = 'Unknown Product';
        let productImage = '/api/placeholder/60/60';
        let itemCount = 0;
        
        if (sellerOrderItems.length > 0) {
          if (sellerOrderItems.length === 1) {
            // Single item - show the item name
            productName = sellerOrderItems[0]?.items?.title || 'Unknown Product';
            productImage = sellerOrderItems[0]?.items?.images ? 
              (Array.isArray(sellerOrderItems[0].items.images) ? 
                sellerOrderItems[0].items.images[0] : 
                sellerOrderItems[0].items.images) : 
              '/api/placeholder/60/60';
          } else {
            // Multiple items - show count and first item
            productName = `${sellerOrderItems.length} items (${sellerOrderItems[0]?.items?.title || 'Unknown'}, +${sellerOrderItems.length - 1} more)`;
            productImage = sellerOrderItems[0]?.items?.images ? 
              (Array.isArray(sellerOrderItems[0].items.images) ? 
                sellerOrderItems[0].items.images[0] : 
                sellerOrderItems[0].items.images) : 
              '/api/placeholder/60/60';
          }
          itemCount = sellerOrderItems.length;
        }
        
        const transformedOrder = {
          ...order,
          customer: order.full_name || 'Unknown Customer',
          customer_name: order.full_name || 'Unknown Customer',
          customer_email: order.email || '',
          product: productName,
          product_name: productName,
          product_image: productImage,
          amount: `${order.total_amount?.toFixed(2) || '0.00'} MKD`,
          date: new Date(order.created_at || '').toLocaleDateString(),
          status: (order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') || 'pending',
          // Add seller-specific order items for detailed view
          seller_order_items: sellerOrderItems,
          item_count: itemCount
        };
        
        return transformedOrder;
      });
      console.timeEnd('  Transform orders');

      // Transform stats
      console.time('  Transform stats');
      const dashboardStats: DashboardStats = {
        totalListings: stats.totalItems,
        activeListings: stats.activeItems,
        soldItems: stats.soldItems,
        totalEarnings: stats.totalRevenue,
        totalOrders: stats.totalOrders,
        avgOrderValue: stats.avgOrderValue,
        conversionRate: stats.totalOrders > 0 ? (stats.soldItems / stats.totalItems) * 100 : 0,
        customerRating: 4.5, // Default rating
        totalViews: (stats as { totalViews?: number }).totalViews || 0,
        viewsLast30Days: (stats as { viewsLast30Days?: number }).viewsLast30Days || 0
      };
      console.timeEnd('  Transform stats');

      // Generate activities from recent data
      console.time('  Generate activities');
      const recentActivities: Activity[] = [
        ...dashboardOrders.slice(0, 3).map(order => ({
          id: `order-${order.id}`,
          type: 'order' as const,
          message: `New order from ${order.customer_name}`,
          timestamp: new Date(order.created_at || '').toLocaleDateString(),
          status: 'active' as const
        })),
        ...dashboardProducts.slice(0, 2).map(product => ({
          id: `product-${product.id}`,
          type: 'product' as const,
          message: `Product "${product.title}" listed`,
          timestamp: new Date(product.created_at || '').toLocaleDateString(),
          status: 'completed' as const
        }))
      ];
      console.timeEnd('  Generate activities');

      // Use products with random view counts for now (can be optimized later with batch API)
      console.time('  Update state');
      setProducts(syncedProducts);
      setOrders(dashboardOrders);
      setStats(dashboardStats);
      setActivities(recentActivities);
      setLastFetchTime(Date.now()); // Update cache timestamp
      console.timeEnd('  Update state');
      
      console.timeEnd('⏱️ Total data fetch');
      console.log('✅ Dashboard data refresh complete');
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profileLoading, syncProductStatusesWithOrders]);
  // Note: Minimal dependencies to prevent infinite loops
  // lastFetchTime, cacheTimeout, isFetching, products, orders, user are intentionally omitted

  // Test function to manually update product statuses
  const testUpdateProductStatuses = (status: string) => {
    setProducts(prev => prev.map(product => {
      return {
        ...product,
        status: status as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive'
      };
    }));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      
      // Update order status in database first
      await supabaseDataService.updateOrderStatus(orderId, status);
      
      // Update local orders state immediately
      setOrders(prev => prev.map(order => 
        String(order.id) === String(orderId) ? { ...order, status } : order
      ));
      
      // Map order status to product status
      let productStatus: string = 'active';
      switch (status) {
        case 'pending':
          // When order is pending, product should be marked as sold (purchased but not processed)
          productStatus = 'sold';
          break;
        case 'processing':
          // When processing, product is still sold but being prepared
          productStatus = 'sold';
          break;
        case 'shipped':
          // When shipped, product moves to shipped stage
          productStatus = 'shipped';
          break;
        case 'delivered':
          // When delivered, product reaches final stage
          productStatus = 'delivered';
          break;
        case 'cancelled':
          // When cancelled, product goes back to active (available for sale)
          productStatus = 'active';
          break;
        default:
          // Default to sold for any other status
          productStatus = 'sold';
      }
      
      // Get the specific products in this order
      const orderIdStr = String(orderId);
      const orderItems = await supabaseDataService.getOrderItems(orderIdStr);
      const productIdsInOrder = orderItems.map(item => String(item.item_id));
      
      // Update products in local state immediately for real-time UI updates
      if (productIdsInOrder.length > 0) {
        setProducts(prev => {
          const productIdsInOrderSet = new Set(productIdsInOrder.map(String));
          const updatedProducts = prev.map(product => {
            if (productIdsInOrderSet.has(String(product.id))) {
              return {
                ...product,
                status: productStatus as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive'
              };
            }
            return product; // Keep other products unchanged
          });
          return updatedProducts;
        });
        
        // Update the database status for the specific products in this order (server-side admin API)
        try {
          const response = await fetch('/api/orders/update-items-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemIds: productIdsInOrder, status: productStatus })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Failed to update product statuses: ${errorData.error || 'Unknown error'}`);
          }
          
          await response.json();
        } catch (dbError) {
          console.error('Error updating product statuses via admin API:', dbError);
          // Don't throw here - we've already updated local state
          // The user will see the change immediately, and it will sync on next refresh
        }
      } else {
      }
      
      // Add activity
      const newActivity: Activity = {
        id: `update-${Date.now()}`,
        type: 'order',
        message: `Order ${orderId} status updated to ${status}`,
        timestamp: 'Just now',
        status: 'active'
      };
      setActivities(prev => [newActivity, ...prev]);
      
      
    } catch (err) {
      console.error('❌ Error updating order status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const addNewProduct = async (productData: Partial<Item>) => {
    if (!user?.id) {
      console.error('No user ID available for product creation');
      return;
    }
    
    // Seller verification is handled by SellerVerification component
    // No need to duplicate the check here
    
    try {
      
      // Validate that user.id is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(user.id)) {
        throw new Error(`Invalid user ID format: ${user.id}`);
      }
      
      // Create item data with required fields
      const itemData = {
        name: productData.name || productData.title || 'Test Product',
        title: productData.title || productData.name || 'Test Product',
        price: productData.price || 0,
        user_id: user.id,
        user_email: user.email,
        description: productData.description || null,
        category_id: productData.category_id || null,
        condition: productData.condition || 'excellent',
        size: productData.size || null,
        brand: productData.brand && productData.brand.trim() !== '' ? productData.brand.trim() : null,
        quantity: productData.quantity || 1,
        status: productData.status || 'active',
        images: productData.images || ['/api/placeholder/400/400']
      };
      
      // Log the exact data being sent
      
      
      const newProduct = await supabaseDataService.createItem(itemData as Item);

      // Add to local state
      const dashboardProduct: DashboardProduct = {
        ...newProduct,
        views: 0,
        price: newProduct.price?.toFixed(2) || '0.00',
        status: 'active'
      };
      setProducts(prev => [dashboardProduct, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalListings: prev.totalListings + 1,
        activeListings: prev.activeListings + 1
      }));
      
      // Add activity
      const newActivity: Activity = {
        id: `product-${Date.now()}`,
        type: 'product',
        message: `New product "${newProduct.title || newProduct.name}" listed`,
        timestamp: 'Just now',
        status: 'active'
      };
      setActivities(prev => [newActivity, ...prev]);
      
    } catch (err) {
      console.error('Error adding product:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        productData,
        user: user?.id
      });
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err; // Re-throw to show error in UI
    }
  };


  const updateProduct = async (productId: string, updates: Partial<Item>) => {
    try {
      const updatedProduct = await supabaseDataService.updateItem(productId, updates);
      
      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId ? { 
          ...product, 
          ...updatedProduct,
          price: updatedProduct.price ? updatedProduct.price.toFixed(2) : product.price,
          status: (updatedProduct.status as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive') || product.status
        } : product
      ));
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await supabaseDataService.deleteItem(productId);
      
      // Remove from local state
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalListings: prev.totalListings - 1,
        activeListings: prev.activeListings - 1
      }));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const searchProducts = async (query: string): Promise<DashboardProduct[]> => {
    if (!user?.id) return [];
    
    try {
      const searchResults = await supabaseDataService.searchItems(user.id, query);
      return searchResults.map(item => ({
        ...item,
        views: Math.floor(Math.random() * 1000) + 100,
        price: item.price?.toFixed(2) || '0.00',
        status: (item.status as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive') || 'active'
      }));
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to search products');
      return [];
    }
  };

  const markActivityAsRead = (activityId: string) => {
    setActivities(prev => prev.map(activity =>
      activity.id === activityId ? { ...activity, status: 'completed' } : activity
    ));
  };

  useEffect(() => {
    if (user?.id && !profileLoading) {
      console.log('🚀 Initial data load for user:', user.id);
      refreshData();
    } else if (!profileLoading) {
      // Only set loading to false if profile loading is complete
      setIsLoading(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profileLoading]);
  // refreshData intentionally omitted to prevent infinite loops

  const value: DashboardContextType = {
    orders,
    products,
    stats,
    activities,
    isLoading,
    error,
    refreshData,
    updateOrderStatus,
    addNewProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    markActivityAsRead,
    testUpdateProductStatuses
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}