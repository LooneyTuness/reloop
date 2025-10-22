import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

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
      itemCounts,
      orderStats
    ] = await Promise.all([
      // Get item counts (very fast with indexes)
      supabase
        .from('items')
        .select('status', { count: 'exact' })
        .eq('user_id', sellerId),
      
      // Get order stats with aggregation
      supabase
        .rpc('get_seller_order_stats', { seller_id: sellerId })
        .single()
    ]);

    // Calculate item stats from count query
    const totalItems = itemCounts.count || 0;
    
    // Get detailed item counts by status (if needed)
    const { data: itemsByStatus } = await supabase
      .from('items')
      .select('status')
      .eq('user_id', sellerId);
    
    const activeItems = itemsByStatus?.filter(i => i.status === 'active').length || 0;
    const soldItems = itemsByStatus?.filter(i => i.status === 'sold').length || 0;

    // Use RPC results if available, otherwise fallback to 0
    const stats = orderStats.data || {
      total_revenue: 0,
      total_orders: 0,
      avg_order_value: 0
    };

    const response = NextResponse.json({
      totalItems,
      activeItems,
      soldItems,
      totalRevenue: stats.total_revenue || 0,
      totalOrders: stats.total_orders || 0,
      avgOrderValue: stats.avg_order_value || 0,
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

