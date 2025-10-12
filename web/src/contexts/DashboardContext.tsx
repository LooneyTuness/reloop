'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseDataService } from '@/lib/supabase/data-service';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/lib/supabase/supabase.types';

// Types based on Supabase schema
type Item = Database['public']['Tables']['items']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

interface DashboardOrder extends Order {
  customer_name?: string;
  customer_email?: string;
  product_name?: string;
  product_image?: string;
  order_items?: OrderItem[];
}

interface DashboardProduct extends Item {
  views?: number;
  status?: 'active' | 'sold' | 'draft' | 'inactive';
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
    customerRating: 4.5
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('DashboardProvider - User:', user);
  console.log('DashboardProvider - User ID:', user?.id);

  const refreshData = async () => {
    if (!user?.id) {
      console.log('No user ID available, skipping data refresh');
      setIsLoading(false);
      return;
    }
    
    console.log('Refreshing dashboard data for user:', user.id);
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel with individual error handling
      const [sellerItems, sellerOrders, sellerStats] = await Promise.allSettled([
        supabaseDataService.getSellerItems(user.id),
        supabaseDataService.getSellerOrders(user.id),
        supabaseDataService.getSellerStats(user.id)
      ]);

      // Handle individual results
      const items = sellerItems.status === 'fulfilled' ? sellerItems.value : [];
      const orders = sellerOrders.status === 'fulfilled' ? sellerOrders.value : [];
      const stats = sellerStats.status === 'fulfilled' ? sellerStats.value : {
        totalItems: 0,
        activeItems: 0,
        soldItems: 0,
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0
      };

      // Log any rejected promises
      if (sellerItems.status === 'rejected') {
        console.error('Failed to fetch items:', sellerItems.reason);
      }
      if (sellerOrders.status === 'rejected') {
        console.error('Failed to fetch orders:', sellerOrders.reason);
      }
      if (sellerStats.status === 'rejected') {
        console.error('Failed to fetch stats:', sellerStats.reason);
      }

      // Transform items to dashboard products
      const dashboardProducts: DashboardProduct[] = items.map(item => ({
        ...item,
        views: Math.floor(Math.random() * 1000) + 100, // Mock views for now
        status: (item.status as any) || 'active'
      }));

      // Transform orders to dashboard orders
      const dashboardOrders: DashboardOrder[] = orders.map(order => {
        const firstOrderItem = order.order_items?.[0];
        const firstItem = firstOrderItem?.items;
        
        return {
          ...order,
          customer_name: order.full_name || 'Unknown Customer',
          customer_email: order.email || '',
          product_name: firstItem?.title || 'Unknown Product',
          product_image: Array.isArray(firstItem?.photos) 
            ? firstItem.photos[0] 
            : firstItem?.photos || '/api/placeholder/60/60'
        };
      });

      // Transform stats
      const dashboardStats: DashboardStats = {
        totalListings: stats.totalItems,
        activeListings: stats.activeItems,
        soldItems: stats.soldItems,
        totalEarnings: stats.totalRevenue,
        totalOrders: stats.totalOrders,
        avgOrderValue: stats.avgOrderValue,
        conversionRate: stats.totalOrders > 0 ? (stats.soldItems / stats.totalItems) * 100 : 0,
        customerRating: 4.5 // Default rating
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

      setProducts(dashboardProducts);
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
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await supabaseDataService.updateOrderStatus(orderId, status);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
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
      console.error('Error updating order status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const addNewProduct = async (productData: Partial<Item>) => {
    if (!user?.id) return;
    
    try {
      const newProduct = await supabaseDataService.createItem({
        ...productData,
        user_id: user.id,
        user_email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any);

      // Add to local state
      const dashboardProduct: DashboardProduct = {
        ...newProduct,
        views: 0,
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
        message: `New product "${newProduct.title}" listed`,
        timestamp: 'Just now',
        status: 'active'
      };
      setActivities(prev => [newActivity, ...prev]);
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Item>) => {
    try {
      const updatedProduct = await supabaseDataService.updateItem(productId, updates);
      
      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, ...updatedProduct } : product
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
        status: (item.status as any) || 'active'
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
  }, [user?.id]);

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
    markActivityAsRead
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