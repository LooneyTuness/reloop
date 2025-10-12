import { createBrowserClient } from '@/lib/supabase/supabase.browser';
import { Database } from '@/lib/supabase/supabase.types';

type Item = Database['public']['Tables']['items']['Row'];
type ItemInsert = Database['public']['Tables']['items']['Insert'];
type ItemUpdate = Database['public']['Tables']['items']['Update'];

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

type OrderItem = Database['public']['Tables']['order_items']['Row'];

export class SupabaseDataService {
  private supabase = createBrowserClient();

  // Items/Products Management
  async getSellerItems(sellerId: string): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('user_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seller items:', error);
      throw error;
    }

    return data || [];
  }

  async getItemById(itemId: string): Promise<Item | null> {
    const { data, error } = await this.supabase
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
    const { data, error } = await this.supabase
      .from('items')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error creating item:', error);
      throw error;
    }

    return data;
  }

  async updateItem(itemId: string, updates: ItemUpdate): Promise<Item> {
    const { data, error } = await this.supabase
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
    const { error } = await this.supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async updateItemStatus(itemId: string, status: string): Promise<Item> {
    return this.updateItem(itemId, { status });
  }

  // Orders Management
  async getSellerOrders(sellerId: string): Promise<Order[]> {
    const { data, error } = await this.supabase
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
      .eq('order_items.items.user_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seller orders:', error);
      throw error;
    }

    return data || [];
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await this.supabase
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
    const { data, error } = await this.supabase
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

  // Analytics and Statistics
  async getSellerStats(sellerId: string): Promise<{
    totalItems: number;
    activeItems: number;
    soldItems: number;
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  }> {
    // Get total items
    const { count: totalItems } = await this.supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', sellerId);

    // Get active items
    const { count: activeItems } = await this.supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', sellerId)
      .eq('status', 'active');

    // Get sold items
    const { count: soldItems } = await this.supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', sellerId)
      .eq('status', 'sold');

    // Get orders and revenue
    const { data: orders } = await this.supabase
      .from('orders')
      .select(`
        total_amount,
        order_items (
          items (
            user_id
          )
        )
      `)
      .eq('order_items.items.user_id', sellerId);

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const totalOrders = orders?.length || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalItems: totalItems || 0,
      activeItems: activeItems || 0,
      soldItems: soldItems || 0,
      totalRevenue,
      totalOrders,
      avgOrderValue
    };
  }

  async getSellerAnalytics(sellerId: string, timeRange: string = '30d'): Promise<{
    salesData: Array<{ date: string; sales: number; revenue: number }>;
    topProducts: Array<{ id: string; title: string; sales: number; revenue: number }>;
    categoryBreakdown: Array<{ category: string; count: number; revenue: number }>;
  }> {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get sales data by date
    const { data: salesData } = await this.supabase
      .from('orders')
      .select(`
        created_at,
        total_amount,
        order_items (
          items (
            user_id,
            title,
            category
          )
        )
      `)
      .eq('order_items.items.user_id', sellerId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Process sales data
    const salesByDate: { [key: string]: { sales: number; revenue: number } } = {};
    salesData?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = { sales: 0, revenue: 0 };
      }
      salesByDate[date].sales += 1;
      salesByDate[date].revenue += order.total_amount;
    });

    const salesDataArray = Object.entries(salesByDate).map(([date, data]) => ({
      date,
      ...data
    }));

    // Get top products
    const productSales: { [key: string]: { title: string; sales: number; revenue: number } } = {};
    salesData?.forEach(order => {
      order.order_items?.forEach(orderItem => {
        const item = orderItem.items;
        if (item && item.user_id === sellerId) {
          if (!productSales[item.id]) {
            productSales[item.id] = { title: item.title, sales: 0, revenue: 0 };
          }
          productSales[item.id].sales += 1;
          productSales[item.id].revenue += order.total_amount;
        }
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get category breakdown
    const categoryData: { [key: string]: { count: number; revenue: number } } = {};
    salesData?.forEach(order => {
      order.order_items?.forEach(orderItem => {
        const item = orderItem.items;
        if (item && item.user_id === sellerId && item.category) {
          if (!categoryData[item.category]) {
            categoryData[item.category] = { count: 0, revenue: 0 };
          }
          categoryData[item.category].count += 1;
          categoryData[item.category].revenue += order.total_amount;
        }
      });
    });

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
  async getSellerProfile(sellerId: string): Promise<any> {
    const { data, error } = await this.supabase
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

  async updateSellerProfile(sellerId: string, profileData: any): Promise<any> {
    // Check if profile exists first
    const { data: existingProfile } = await this.supabase
      .from('seller_profiles')
      .select('*')
      .eq('user_id', sellerId)
      .single();

    if (existingProfile) {
      // Profile exists, do an UPDATE
      const { data, error } = await this.supabase
        .from('seller_profiles')
        .update({
          ...profileData,
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
      const { data: userData } = await this.supabase.auth.getUser();
      const userEmail = userData?.user?.email;
      
      const { data, error } = await this.supabase
        .from('seller_profiles')
        .insert({
          user_id: sellerId,
          email: userEmail,
          role: 'seller',
          is_approved: true,
          ...profileData,
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
    const { data, error } = await this.supabase
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
