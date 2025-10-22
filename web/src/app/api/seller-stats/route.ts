import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

interface ItemData {
  id: string;
  status?: string;
}

interface OrderItemData {
  order_id: string;
  quantity: number;
  price: number;
  item_id: string;
}

// GET /api/seller-stats - Get optimized stats for a seller
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin service not available" },
        { status: 503 }
      );
    }

    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    
    if (!sellerId) {
      return NextResponse.json(
        { error: 'sellerId parameter is required' },
        { status: 400 }
      );
    }

    // Execute all queries in parallel for maximum performance
    const [
      itemsByStatus,
      sellerItemIds,
      orderItems
    ] = await Promise.all([
      // Get items with status (for counting)
      supabase
        .from('items')
        .select('id, status')
        .eq('user_id', sellerId),
      
      // Get seller's item IDs for order filtering
      supabase
        .from('items')
        .select('id')
        .eq('user_id', sellerId),
      
      // Get order items (limited to last 6 months for performance)
      supabase
        .from('order_items')
        .select('order_id, quantity, price, item_id')
        .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Calculate item stats
    const items = itemsByStatus.data || [];
    const totalItems = items.length;
    const activeItems = items.filter(i => i.status === 'active').length;
    const soldItems = items.filter(i => i.status === 'sold').length;

    // Calculate revenue stats
    const sellerIds = new Set((sellerItemIds.data || []).map((item: ItemData) => item.id));
    const sellerOrderItems = (orderItems.data || []).filter((oi: OrderItemData) => 
      sellerIds.has(oi.item_id)
    );

    const totalRevenue = sellerOrderItems.reduce((sum: number, item: OrderItemData) => 
      sum + (item.quantity * item.price), 0
    );

    const uniqueOrders = new Set(sellerOrderItems.map((item: OrderItemData) => item.order_id));
    const totalOrders = uniqueOrders.size;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const response = NextResponse.json({
      totalItems,
      activeItems,
      soldItems,
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalViews: 0, // Can be added later with view tracking
      viewsLast30Days: 0
    });

    // Aggressive caching for stats (20 seconds)
    response.headers.set('Cache-Control', 'private, max-age=20, stale-while-revalidate=40');
    
    return response;
  } catch (error) {
    console.error('Error in seller-stats API:', error);
    // Return zero stats instead of error for better UX
    return NextResponse.json({
      totalItems: 0,
      activeItems: 0,
      soldItems: 0,
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      totalViews: 0,
      viewsLast30Days: 0
    });
  }
}

