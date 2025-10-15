'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabaseDataService } from '@/lib/supabase/data-service';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/lib/supabase/supabase.types';

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
  const { user } = useAuth();
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

  // Debug logging - only log when user is available
  useEffect(() => {
    if (user) {
      console.log('DashboardProvider - User:', user);
      console.log('DashboardProvider - User ID:', user.id);
    } else {
      console.log('DashboardProvider - No user available yet');
    }
  }, [user]);

  const refreshData = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available, skipping data refresh');
      setIsLoading(false);
      return;
    }
    
    // Seller verification is handled by SellerVerification component
    // No need to duplicate the check here
    
    console.log('Refreshing dashboard data for user:', user.id);
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel with individual error handling
      console.log('Fetching seller items for user:', user.id);
      const [sellerItems, sellerOrders, sellerStats] = await Promise.allSettled([
        supabaseDataService.getSellerItems(user.id),
        supabaseDataService.getSellerOrders(user.id),
        supabaseDataService.getSellerStats(user.id)
      ]);
      
      console.log('Seller items result:', sellerItems);
      console.log('Seller orders result:', sellerOrders);
      console.log('Seller stats result:', sellerStats);

      // Handle individual results
      const items = sellerItems.status === 'fulfilled' ? sellerItems.value : [];
      const orders = sellerOrders.status === 'fulfilled' ? (sellerOrders.value as any[]) : [];
      const stats = sellerStats.status === 'fulfilled' ? sellerStats.value : {
        totalItems: 0,
        activeItems: 0,
        soldItems: 0,
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0
      };

      console.log('🔍 DashboardContext - Items result:', items);
      console.log('🔍 DashboardContext - Orders result:', orders);
      console.log('🔍 DashboardContext - Stats result:', stats);

      // Log any rejected promises
      if (sellerItems.status === 'rejected') {
        console.error('❌ Failed to fetch items:', sellerItems.reason);
      }
      if (sellerOrders.status === 'rejected') {
        console.error('❌ Failed to fetch orders:', sellerOrders.reason);
      }
      if (sellerStats.status === 'rejected') {
        console.error('❌ Failed to fetch stats:', sellerStats.reason);
      }

      // Log the actual status of each promise
      console.log('🔍 Promise statuses:');
      console.log('🔍 Items status:', sellerItems.status);
      console.log('🔍 Orders status:', sellerOrders.status);
      console.log('🔍 Stats status:', sellerStats.status);

      // Transform items to dashboard products
      const dashboardProducts: DashboardProduct[] = items.map(item => {
        // Map database status to Product Lifecycle status
        let lifecycleStatus = 'listed';
        switch (item.status) {
          case 'active':
            lifecycleStatus = 'listed';
            break;
          case 'sold':
            lifecycleStatus = 'sold';
            break;
          case 'shipped':
            lifecycleStatus = 'shipped';
            break;
          case 'delivered':
            lifecycleStatus = 'delivered';
            break;
          default:
            lifecycleStatus = 'listed';
        }
        
        return {
          ...item,
          name: item.title,
          views: 0, // Will be updated with real data after fetching
          price: `${item.price?.toFixed(2) || '0.00'} MKD`,
          status: lifecycleStatus as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive'
        };
      });

      // Transform orders to dashboard orders
      console.log('🔄 Transforming orders to dashboard orders:', orders.length);
      console.log('🔄 User ID for filtering:', user.id);
      
      const dashboardOrders: DashboardOrder[] = orders.map((order, index) => {
        console.log(`🔄 Processing order ${index + 1}:`, order.id);
        console.log(`🔄 Order items:`, order.order_items);
        
        // Get ALL items from this seller for display
        const sellerOrderItems = order.order_items?.filter((item: any) => {
          console.log(`🔄 Checking item:`, item);
          console.log(`🔄 Item user_id:`, item.items?.user_id);
          console.log(`🔄 Current user ID:`, user.id);
          console.log(`🔄 Match:`, item.items?.user_id === user.id);
          return item.items?.user_id === user.id;
        }) || [];
        
        console.log(`🔄 Seller order items found:`, sellerOrderItems.length, sellerOrderItems);
        
        // Create a summary for the main display
        let productName = 'Unknown Product';
        let productImage = '/api/placeholder/60/60';
        let itemCount = 0;
        
        if (sellerOrderItems.length > 0) {
          if (sellerOrderItems.length === 1) {
            // Single item - show the item name
            productName = sellerOrderItems[0]?.items?.title || 'Unknown Product';
            productImage = sellerOrderItems[0]?.items?.photos ? 
              (Array.isArray(sellerOrderItems[0].items.photos) ? 
                sellerOrderItems[0].items.photos[0] : 
                sellerOrderItems[0].items.photos) : 
              '/api/placeholder/60/60';
          } else {
            // Multiple items - show count and first item
            productName = `${sellerOrderItems.length} items (${sellerOrderItems[0]?.items?.title || 'Unknown'}, +${sellerOrderItems.length - 1} more)`;
            productImage = sellerOrderItems[0]?.items?.photos ? 
              (Array.isArray(sellerOrderItems[0].items.photos) ? 
                sellerOrderItems[0].items.photos[0] : 
                sellerOrderItems[0].items.photos) : 
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
        
        console.log(`🔄 Transformed order:`, transformedOrder);
        return transformedOrder;
      });
      
      console.log('✅ Final dashboard orders:', dashboardOrders.length);

      // Transform stats
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

      // Generate activities from recent data
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

      // Fetch real view counts for products
      const productsWithViews = await Promise.all(
        dashboardProducts.map(async (product) => {
          const viewCount = await supabaseDataService.getProductViewCount(product.id);
          return {
            ...product,
            views: viewCount
          };
        })
      );

      setProducts(productsWithViews);
      setOrders(dashboardOrders);
      setStats(dashboardStats);
      setActivities(recentActivities);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        user: user?.id
      });
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Test function to manually update product statuses
  const testUpdateProductStatuses = (status: string) => {
    console.log(`🧪 Manually updating all products to status: ${status}`);
    setProducts(prev => prev.map(product => {
      console.log(`✅ Updating product ${product.id} (${product.name}) from '${product.status}' to '${status}'`);
      return {
        ...product,
        status: status as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive'
      };
    }));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      console.log('🚀 updateOrderStatus called with:', { orderId, status });
      
      await supabaseDataService.updateOrderStatus(orderId, status);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      // Map order status to product status for Product Lifecycle
      // Use database-compatible status values
      let productStatus: string = 'active';
      switch (status) {
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
      
      console.log(`📦 Mapped order status '${status}' to product status '${productStatus}'`);
      
      // Get the specific products in this order
      console.log('🔍 Fetching order items for order:', orderId, 'type:', typeof orderId);
      
      // Convert orderId to string if it's a number (database might return numbers)
      const orderIdStr = String(orderId);
      console.log('🔍 Using order ID as string:', orderIdStr);
      
      const orderItems = await supabaseDataService.getOrderItems(orderIdStr);
      console.log('📦 Order items found:', orderItems);
      const productIdsInOrder = orderItems.map(item => item.item_id);
      console.log('🆔 Product IDs in order:', productIdsInOrder);
      
      // Only update products that are actually in this order
      if (productIdsInOrder.length > 0) {
        console.log('✅ Updating products with new status:', productStatus);
        setProducts(prev => {
          const updatedProducts = prev.map(product => {
            if (productIdsInOrder.includes(product.id)) {
              console.log(`🔄 Updating product ${product.id} (${product.name}) from ${product.status} to ${productStatus}`);
              return {
                ...product,
                status: productStatus as 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive'
              };
            }
            return product; // Keep other products unchanged
          });
          console.log('📊 Updated products:', updatedProducts);
          return updatedProducts;
        });
      } else {
        console.log('⚠️ No products found in order, skipping product updates');
      }
      
      // Update the database status for the specific products in this order
      if (productIdsInOrder.length > 0) {
        try {
          await supabaseDataService.updateItemsStatus(productIdsInOrder, productStatus);
        } catch (dbError) {
          console.error('Error updating product statuses in database:', dbError);
          // Don't throw here - the order status was already updated successfully
        }
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
      console.log('Creating product with data:', productData);
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      
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
        category: productData.category || null,
        category_id: productData.category_id || null,
        condition: productData.condition || 'excellent',
        size: productData.size || null,
        brand: productData.brand || null,
        quantity: productData.quantity || 1,
        status: productData.status || 'active',
        photos: productData.photos || ['/api/placeholder/400/400']
      };
      
      // Log the exact data being sent
      console.log('User ID type:', typeof user.id, 'value:', user.id);
      console.log('User email type:', typeof user.email, 'value:', user.email);
      console.log('Item data user_id type:', typeof itemData.user_id, 'value:', itemData.user_id);
      
      console.log('Final item data being sent to database:', itemData);
      
      const newProduct = await supabaseDataService.createItem(itemData as Item);
      console.log('Product created successfully:', newProduct);

      // Add to local state
      const dashboardProduct: DashboardProduct = {
        ...newProduct,
        views: 0,
        price: `${newProduct.price?.toFixed(2) || '0.00'} MKD`,
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
      
      // Refresh data from database to ensure consistency
      console.log('Refreshing data after product creation...');
      await refreshData();
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
          price: updatedProduct.price ? `${updatedProduct.price.toFixed(2)} MKD` : product.price,
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
        price: `${item.price?.toFixed(2) || '0.00'} MKD`,
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
    if (user?.id) {
      refreshData();
    } else {
      console.log('No user authenticated, setting loading to false');
      setIsLoading(false);
      setError(null);
    }
  }, [user?.id, refreshData]);

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