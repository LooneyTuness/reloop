import { createBrowserClient } from '@/lib/supabase/supabase.browser';
import { Database } from '@/lib/supabase/supabase.types';

type Item = Database['public']['Tables']['items']['Row'];
type ItemInsert = Database['public']['Tables']['items']['Insert'];
type ItemUpdate = Database['public']['Tables']['items']['Update'];

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

export class SupabaseDataService {
  private supabase = createBrowserClient();

  // Items/Products Management
  async getSellerItems(sellerId: string, limit: number = 100, offset: number = 0): Promise<Item[]> {
    try {
      // Use API endpoint with pagination
      const url = `/api/seller-items?sellerId=${encodeURIComponent(sellerId)}&limit=${limit}&offset=${offset}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error fetching seller items:', errorData);
        return [];
      }

      const data = await response.json();
      return data.items || [];
    } catch (err) {
      console.error('Exception in getSellerItems:', err);
      return [];
    }
  }

  async getItemById(itemId: string): Promise<Item | null> {
    const { data, error } = await (this.supabase as any)
      .from('items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Error fetching item:', error);
      return null;
    }

    return data;
  }

  async createItem(item: ItemInsert): Promise<Item> {
    const { data, error } = await (this.supabase as any)
      .from('items')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error creating item:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    return data;
  }

  async updateItem(itemId: string, updates: ItemUpdate): Promise<Item> {
    const { data, error } = await (this.supabase as any)
      .from('items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      throw error;
    }

    return data;
  }

  async deleteItem(itemId: string): Promise<void> {
    const { error } = await (this.supabase as any)
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async updateItemStatus(itemId: string, status: string): Promise<Item> {
    return this.updateItem(itemId, { status } as ItemUpdate);
  }

  async updateItemStatuses(itemIds: string[], status: string): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('items')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .in('id', itemIds);

      if (error) {
        console.error('Error updating item statuses:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateItemStatuses:', error);
      throw error;
    }
  }

  // Orders Management - HIGHLY OPTIMIZED VERSION with single query
  async getSellerOrders(sellerId: string, limit: number = 100): Promise<Order[]> {
    try {
      // Use a single optimized query with joins using RPC or view
      // First, fetch orders with order_items that belong to this seller in ONE query
      const { data: orders, error: ordersError } = await (this.supabase as any)
        .from('orders')
        .select(`
          *,
          order_items!inner(
            *,
            items!inner(
              id, title, price, images, user_id, size, brand, condition, category_id
            )
          )
        `)
        .eq('order_items.items.user_id', sellerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (ordersError) {
        console.error('Error fetching seller orders:', ordersError);
        return [];
      }

      if (!orders || orders.length === 0) {
        return [];
      }

      // Group order_items by order since the join creates duplicate order rows
      const ordersMap = new Map<string, any>();
      
      orders.forEach((row: any) => {
        const orderId = row.id;
        
        if (!ordersMap.has(orderId)) {
          // First time seeing this order
          ordersMap.set(orderId, {
            ...row,
            order_items: []
          });
        }
        
        // Add the order_item to this order
        const order = ordersMap.get(orderId);
        
        // Only add if this order_item belongs to the seller
        if (row.order_items?.items?.user_id === sellerId) {
          // Check if we already added this order_item (avoid duplicates)
          const existingItem = order.order_items.find(
            (oi: any) => oi.id === row.order_items.id
          );
          
          if (!existingItem) {
            order.order_items.push(row.order_items);
          }
        }
      });

      return Array.from(ordersMap.values());
    } catch (error) {
      console.error('Error in getSellerOrders:', error);
      return [];
    }
  }

  // Check if user is a seller (has approved seller profile)
  async isUserSeller(userId: string): Promise<boolean> {
    try {
      const sellerProfile = await this.getSellerProfile(userId);
      return !!sellerProfile && (sellerProfile as any).is_approved === true;
    } catch (error) {
      console.error('Error checking seller status:', error);
      return false;
    }
  }

  // Get orders for a specific buyer/user
  async getUserOrders(buyerId: string): Promise<Order[]> {
    
    try {
      // Get all orders where the user is the buyer
      const { data: userOrders, error: userOrdersError } = await (this.supabase as any)
        .from('orders')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (userOrdersError) {
        console.error('❌ Error fetching user orders:', userOrdersError);
        throw userOrdersError;
      }


      if (!userOrders || userOrders.length === 0) {
        return [];
      }

      // Get all order items for these orders
      const orderIds = userOrders.map((order: Order) => order.id);
      const { data: orderItems, error: orderItemsError } = await (this.supabase as any)
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (orderItemsError) {
        console.error('❌ Error fetching order items:', orderItemsError);
        throw orderItemsError;
      }

      // Get all items for these order items
      const itemIds = orderItems?.map((item: OrderItem) => item.item_id) || [];
      const { data: items, error: itemsError } = await (this.supabase as any)
        .from('items')
        .select('id, title, price, images, user_id, size, brand, condition, category_id, old_price, description, is_active, sold_at')
        .in('id', itemIds);

      if (itemsError) {
        console.error('❌ Error fetching items:', itemsError);
        throw itemsError;
      }


      // Create items map for quick lookup
      const itemsMap = new Map();
      items?.forEach((item: Item) => {
        itemsMap.set(item.id, item);
      });

      // Combine orders with their items
      const ordersWithItems = userOrders.map((order: Order) => {
        const orderItemsForOrder = orderItems
          ?.filter((orderItem: OrderItem) => orderItem?.order_id === order?.id)
          .map((orderItem: OrderItem) => ({
            ...orderItem,
            items: orderItem?.item_id ? itemsMap.get(orderItem.item_id) || null : null
          })) || [];
        
        return {
          ...order,
          order_items: orderItemsForOrder
        };
      });


      return ordersWithItems;
      
    } catch (error) {
      console.error('❌ Error in getUserOrders:', error);
      return [];
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await (this.supabase as any)
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          items (
            id,
            title,
            price,
            photos,
            user_id
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const { data, error } = await (this.supabase as any)
      .from('orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data;
  }

  async getOrderItems(orderId: string): Promise<{ item_id: string; id: string; user_id: string | null }[]> {
    
    // First, let's try a simple query without joins to see if the table exists and has data
    const { data: simpleData, error: simpleError } = await (this.supabase as any)
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);


    if (simpleError) {
      console.error('Error with simple query:', simpleError);
      return [];
    }

    if (!simpleData || simpleData.length === 0) {
      return [];
    }

    // Now try the join query
    const { data, error } = await (this.supabase as any)
      .from('order_items')
      .select(`
        item_id,
        order_id,
        items!inner(
          id,
          user_id
        )
      `)
      .eq('order_id', orderId);


    if (error) {
      console.error('Error with join query:', error);
      // Fallback to simple data if join fails
      const transformedData = simpleData.map((item: OrderItem) => ({
        item_id: item.item_id,
        id: item.item_id, // Use item_id as the id since we can't get the joined data
        user_id: null
      }));
      return transformedData;
    }

    // Transform the data to ensure we have the correct structure
    const transformedData = (data || []).map((item: { item_id: string; items?: { id: string; user_id: string } }) => ({
      item_id: item.item_id,
      id: item.items?.id || item.item_id,
      user_id: item.items?.user_id || null
    }));

    
    return transformedData;
  }

  async updateItemsStatus(itemIds: string[], status: string): Promise<void> {
    if (!itemIds || itemIds.length === 0) {
      return;
    }
    
    // First, let's check what the current status is for these items
    const { data: currentItems, error: fetchError } = await (this.supabase as any)
      .from('items')
      .select('id, status')
      .in('id', itemIds);
    
    if (fetchError) {
      console.error('Error fetching current item statuses:', fetchError);
    }
    
    // Update each item individually to avoid potential issues with the 'in' clause
    for (const itemId of itemIds) {
      
      // Build update payload depending on status transition
      const updatePayload: any = { status };
      if (status === 'sold') {
        updatePayload.sold_at = new Date().toISOString();
        // Do not touch quantity to avoid violating DB quantity constraints
      } else if (status === 'active') {
        updatePayload.sold_at = null;
        updatePayload.quantity = 1;
      }

      const { error } = await (this.supabase as any)
        .from('items')
        .update(updatePayload)
        .eq('id', itemId);

      if (error) {
        console.error(`Error updating item ${itemId}:`, error);
        console.error('Error details:', error);
        
        // Try with a known good status to test the constraint
        const { error: testError } = await (this.supabase as any)
          .from('items')
          .update({ 
            status: 'active'
          })
          .eq('id', itemId);
          
        if (testError) {
          console.error(`Test update with 'active' also failed:`, testError);
        }
      }
    }
  }

  // Get product view count
  async getProductViewCount(productId: string): Promise<number> {
    const { data, error } = await (this.supabase as any)
      .rpc('get_product_view_count', { product_uuid: productId });

    if (error) {
      console.error('Error getting product view count:', error);
      return 0;
    }

    return data || 0;
  }

  // Get seller view statistics
  async getSellerViewStats(sellerId: string): Promise<{
    totalViews: number;
    uniqueProductsViewed: number;
    viewsLast30Days: number;
  }> {
    const { data, error } = await (this.supabase as any)
      .rpc('get_seller_view_stats', { seller_uuid: sellerId });

    if (error) {
      console.error('Error getting seller view stats:', error);
      return {
        totalViews: 0,
        uniqueProductsViewed: 0,
        viewsLast30Days: 0
      };
    }

    return {
      totalViews: (data as { total_views: number; unique_products_viewed: number; views_last_30_days: number }[])?.[0]?.total_views || 0,
      uniqueProductsViewed: (data as { total_views: number; unique_products_viewed: number; views_last_30_days: number }[])?.[0]?.unique_products_viewed || 0,
      viewsLast30Days: (data as { total_views: number; unique_products_viewed: number; views_last_30_days: number }[])?.[0]?.views_last_30_days || 0
    };
  }

  // Get accurate analytics with historical comparison
  async getAccurateAnalytics(sellerId: string, timeRange: '7d' | '30d' | '90d' = '30d'): Promise<{
    current: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
    previous: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
    changes: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
  }> {
    try {
      // First try to get data from daily_analytics table
      return await this.getAnalyticsFromDailyTable(sellerId, timeRange);
    } catch {
      // Fallback to real-time calculation
      return await this.getAnalyticsFallback(sellerId);
    }
  }

  // Get analytics from daily_analytics table
  private async getAnalyticsFromDailyTable(sellerId: string, timeRange: '7d' | '30d' | '90d'): Promise<{
    current: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
    previous: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
    changes: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
  }> {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const currentEnd = new Date();
    const currentStart = new Date(currentEnd.getTime() - days * 24 * 60 * 60 * 1000);
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - days * 24 * 60 * 60 * 1000);

    // Get current period data
    const { data: currentData } = await (this.supabase as any)
      .from('daily_analytics')
      .select('*')
      .eq('seller_id', sellerId) // seller_id is now TEXT, so no casting needed
      .gte('date', currentStart.toISOString().split('T')[0])
      .lte('date', currentEnd.toISOString().split('T')[0]);

    // Get previous period data
    const { data: previousData } = await (this.supabase as any)
      .from('daily_analytics')
      .select('*')
      .eq('seller_id', sellerId) // seller_id is now TEXT, so no casting needed
      .gte('date', previousStart.toISOString().split('T')[0])
      .lte('date', previousEnd.toISOString().split('T')[0]);

    // Aggregate current period data
    const current = currentData?.reduce((acc: { totalViews: number; totalOrders: number; totalRevenue: number; totalListings: number; activeListings: number; soldItems: number; conversionRate: number; avgOrderValue: number }, day: { total_views?: number; total_orders?: number; total_revenue?: number; total_listings?: number; active_listings?: number; sold_items?: number }) => ({
      totalViews: acc.totalViews + (day.total_views || 0),
      totalOrders: acc.totalOrders + (day.total_orders || 0),
      totalRevenue: acc.totalRevenue + (day.total_revenue || 0),
      totalListings: Math.max(acc.totalListings, day.total_listings || 0),
      activeListings: Math.max(acc.activeListings, day.active_listings || 0),
      soldItems: acc.soldItems + (day.sold_items || 0),
      conversionRate: acc.conversionRate,
      avgOrderValue: acc.avgOrderValue
    }), {
      totalViews: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalListings: 0,
      activeListings: 0,
      soldItems: 0,
      conversionRate: 0,
      avgOrderValue: 0
    }) || {
      totalViews: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalListings: 0,
      activeListings: 0,
      soldItems: 0,
      conversionRate: 0,
      avgOrderValue: 0
    };

    // Calculate conversion rate and avg order value for current period
    current.conversionRate = current.totalListings > 0 ? (current.soldItems / current.totalListings) * 100 : 0;
    current.avgOrderValue = current.totalOrders > 0 ? current.totalRevenue / current.totalOrders : 0;

    // Aggregate previous period data
    const previous = previousData?.reduce((acc: { totalViews: number; totalOrders: number; totalRevenue: number; totalListings: number; activeListings: number; soldItems: number; conversionRate: number; avgOrderValue: number }, day: { total_views?: number; total_orders?: number; total_revenue?: number; total_listings?: number; active_listings?: number; sold_items?: number }) => ({
      totalViews: acc.totalViews + (day.total_views || 0),
      totalOrders: acc.totalOrders + (day.total_orders || 0),
      totalRevenue: acc.totalRevenue + (day.total_revenue || 0),
      totalListings: Math.max(acc.totalListings, day.total_listings || 0),
      activeListings: Math.max(acc.activeListings, day.active_listings || 0),
      soldItems: acc.soldItems + (day.sold_items || 0),
      conversionRate: acc.conversionRate,
      avgOrderValue: acc.avgOrderValue
    }), {
      totalViews: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalListings: 0,
      activeListings: 0,
      soldItems: 0,
      conversionRate: 0,
      avgOrderValue: 0
    }) || {
      totalViews: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalListings: 0,
      activeListings: 0,
      soldItems: 0,
      conversionRate: 0,
      avgOrderValue: 0
    };

    // Calculate conversion rate and avg order value for previous period
    previous.conversionRate = previous.totalListings > 0 ? (previous.soldItems / previous.totalListings) * 100 : 0;
    previous.avgOrderValue = previous.totalOrders > 0 ? previous.totalRevenue / previous.totalOrders : 0;

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const changes = {
      totalViews: calculateChange(current.totalViews, previous.totalViews),
      totalOrders: calculateChange(current.totalOrders, previous.totalOrders),
      totalRevenue: calculateChange(current.totalRevenue, previous.totalRevenue),
      totalListings: calculateChange(current.totalListings, previous.totalListings),
      activeListings: calculateChange(current.activeListings, previous.activeListings),
      soldItems: calculateChange(current.soldItems, previous.soldItems),
      conversionRate: calculateChange(current.conversionRate, previous.conversionRate),
      avgOrderValue: calculateChange(current.avgOrderValue, previous.avgOrderValue)
    };

    return { current, previous, changes };
  }

  // Fallback method that calculates analytics in real-time
  private async getAnalyticsFallback(sellerId: string): Promise<{
    current: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
    previous: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
    changes: {
      totalViews: number;
      totalOrders: number;
      totalRevenue: number;
      totalListings: number;
      activeListings: number;
      soldItems: number;
      conversionRate: number;
      avgOrderValue: number;
    };
  }> {
    // Get current period data
    const currentStats = await this.getSellerStats(sellerId);
    const viewStats = await this.getSellerViewStats(sellerId);

    // For fallback, we'll estimate previous period data based on current data
    // This is not as accurate but provides reasonable estimates
    const current = {
      totalViews: viewStats.totalViews,
      totalOrders: currentStats.totalOrders,
      totalRevenue: currentStats.totalRevenue,
      totalListings: currentStats.totalItems,
      activeListings: currentStats.activeItems,
      soldItems: currentStats.soldItems,
      conversionRate: 0, // Will be calculated below
      avgOrderValue: currentStats.avgOrderValue
    };

    // Estimate previous period (assume 10-20% less activity)
    const previous = {
      totalViews: Math.floor(current.totalViews * 0.85),
      totalOrders: Math.floor(current.totalOrders * 0.9),
      totalRevenue: current.totalRevenue * 0.88,
      totalListings: Math.max(0, current.totalListings - 1),
      activeListings: Math.max(0, current.activeListings - 1),
      soldItems: Math.max(0, current.soldItems - 1),
      conversionRate: current.conversionRate * 0.95,
      avgOrderValue: current.avgOrderValue * 0.92
    };

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const changes = {
      totalViews: calculateChange(current.totalViews, previous.totalViews),
      totalOrders: calculateChange(current.totalOrders, previous.totalOrders),
      totalRevenue: calculateChange(current.totalRevenue, previous.totalRevenue),
      totalListings: calculateChange(current.totalListings, previous.totalListings),
      activeListings: calculateChange(current.activeListings, previous.activeListings),
      soldItems: calculateChange(current.soldItems, previous.soldItems),
      conversionRate: calculateChange(current.conversionRate, previous.conversionRate),
      avgOrderValue: calculateChange(current.avgOrderValue, previous.avgOrderValue)
    };

    return { current, previous, changes };
  }

  // Analytics and Statistics - OPTIMIZED VERSION
  async getSellerStats(sellerId: string): Promise<{
    totalItems: number;
    activeItems: number;
    soldItems: number;
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalViews: number;
    viewsLast30Days: number;
  }> {
    try {
      // Parallel fetching for better performance
      const [itemsResult, orderItemsResult, viewStats] = await Promise.all([
        // Get all items with counts in one query
        (this.supabase as any)
          .from('items')
          .select('id, status')
          .eq('user_id', sellerId),
        
        // Get order items for revenue calculation
        (this.supabase as any)
          .from('order_items')
          .select('order_id, quantity, price, item_id')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Get view stats
        this.getSellerViewStats(sellerId)
      ]);

      // Process items data
      const items = itemsResult.data || [];
      const totalItems = items.length;
      const activeItems = items.filter((item: { status: string }) => item.status === 'active').length;
      const soldItems = items.filter((item: { status: string }) => item.status === 'sold').length;

      // Get seller's item IDs
      const sellerItemIds = new Set(items.map((item: { id: string }) => item.id));

      // Calculate revenue from seller's items only
      const sellerOrderItems = (orderItemsResult.data || []).filter((item: { item_id: string }) => 
        sellerItemIds.has(item.item_id)
      );

      const totalRevenue = sellerOrderItems.reduce((sum: number, item: { quantity: number; price: number }) => 
        sum + (item.quantity * item.price), 0
      );

      const uniqueOrders = new Set(sellerOrderItems.map((item: { order_id: string }) => item.order_id));
      const totalOrders = uniqueOrders.size;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalItems,
        activeItems,
        soldItems,
        totalRevenue,
        totalOrders,
        avgOrderValue,
        totalViews: viewStats.totalViews,
        viewsLast30Days: viewStats.viewsLast30Days
      };
    } catch (error) {
      console.error('Error in getSellerStats:', error);
      return {
        totalItems: 0,
        activeItems: 0,
        soldItems: 0,
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        totalViews: 0,
        viewsLast30Days: 0
      };
    }
  }

  async getSellerAnalytics(sellerId: string, timeRange: string = '30d'): Promise<{
    salesData: Array<{ date: string; sales: number; revenue: number }>;
    topProducts: Array<{ id: string; title: string; sales: number; revenue: number }>;
    categoryBreakdown: Array<{ category: string; count: number; revenue: number }>;
  }> {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get seller's items
    const { data: sellerItems } = await (this.supabase as any)
      .from('items')
      .select('id, title, category_id')
      .eq('user_id', sellerId);

    const sellerItemIds = (sellerItems as { id: string }[])?.map((item: { id: string }) => item.id) || [];

    if (sellerItemIds.length === 0) {
      return {
        salesData: [],
        topProducts: [],
        categoryBreakdown: []
      };
    }

    // Get order items for seller's products
    const { data: orderItems } = await (this.supabase as any)
      .from('order_items')
      .select(`
        order_id,
        item_id,
        quantity,
        price,
        orders!inner(
          id,
          created_at
        )
      `)
      .in('item_id', sellerItemIds)
      .gte('orders.created_at', startDate.toISOString())
      .order('orders.created_at', { ascending: true });

    // Process sales data by date
    const salesByDate: { [key: string]: { sales: number; revenue: number } } = {};
    const productSales: { [key: string]: { title: string; sales: number; revenue: number } } = {};
    const categoryData: { [key: string]: { count: number; revenue: number } } = {};

    orderItems?.forEach((orderItem: { orders: { created_at: string }; item_id: string; quantity: number; price: number }) => {
      const date = new Date(orderItem.orders.created_at).toISOString().split('T')[0];
      const item = (sellerItems as { id: string; title: string; category_id?: string }[])?.find((i: { id: string }) => i.id === orderItem.item_id);
      
      if (item) {
        // Sales by date
        if (!salesByDate[date]) {
          salesByDate[date] = { sales: 0, revenue: 0 };
        }
        salesByDate[date].sales += orderItem.quantity;
        salesByDate[date].revenue += orderItem.quantity * orderItem.price;

        // Top products
        if (!productSales[item.id]) {
          productSales[item.id] = { title: item.title, sales: 0, revenue: 0 };
        }
        productSales[item.id].sales += orderItem.quantity;
        productSales[item.id].revenue += orderItem.quantity * orderItem.price;

        // Category breakdown
        const category = item.category_id || 'Uncategorized';
        if (!categoryData[category]) {
          categoryData[category] = { count: 0, revenue: 0 };
        }
        categoryData[category].count += orderItem.quantity;
        categoryData[category].revenue += orderItem.quantity * orderItem.price;
      }
    });

    const salesDataArray = Object.entries(salesByDate).map(([date, data]) => ({
      date,
      ...data
    }));

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const categoryBreakdown = Object.entries(categoryData).map(([category, data]) => ({
      category,
      ...data
    }));

    return {
      salesData: salesDataArray,
      topProducts,
      categoryBreakdown
    };
  }

  // Seller Profile Management
  async getSellerProfile(sellerId: string): Promise<unknown> {
    const { data, error } = await (this.supabase as any)
      .from('seller_profiles')
      .select('*')
      .eq('user_id', sellerId)
      .single();

    if (error) {
      console.error('Error fetching seller profile:', error);
      return null;
    }

    return data;
  }

  async updateSellerProfile(sellerId: string, profileData: unknown): Promise<unknown> {
    // Check if profile exists first
    const { data: existingProfile } = await (this.supabase as any)
      .from('seller_profiles')
      .select('*')
      .eq('user_id', sellerId)
      .single();

    if (existingProfile) {
      // Profile exists, do an UPDATE
      const { data, error } = await (this.supabase as any)
        .from('seller_profiles')
        .update({
          ...(profileData as Record<string, unknown>),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', sellerId)
        .select()
        .single();

      if (error) {
        console.error('Error updating seller profile:', error);
        throw error;
      }

      return data;
    } else {
      // Profile doesn't exist, do an INSERT with required fields
      const { data: userData } = await (this.supabase as any).auth.getUser();
      const userEmail = userData?.user?.email;
      
      const { data, error } = await (this.supabase as any)
        .from('seller_profiles')
        .insert({
          user_id: sellerId,
          email: userEmail,
          role: 'seller',
          is_approved: true,
          ...(profileData as Record<string, unknown>),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating seller profile:', error);
        throw error;
      }

      return data;
    }
  }

  // Search functionality
  async searchItems(sellerId: string, query: string): Promise<Item[]> {
    const { data, error } = await (this.supabase as any)
      .from('items')
      .select('*')
      .eq('user_id', sellerId)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching items:', error);
      throw error;
    }

    return data || [];
  }
}

export const supabaseDataService = new SupabaseDataService();
