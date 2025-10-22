import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

// GET /api/seller-items - Get items for a specific seller (OPTIMIZED with pagination)
export async function GET(request: NextRequest) {
  try {
    console.time('GET /api/seller-items');
    
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin service not available" },
        { status: 503 }
      );
    }

    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!sellerId) {
      return NextResponse.json(
        { error: 'sellerId parameter is required' },
        { status: 400 }
      );
    }

    console.log(`📦 Fetching items for seller: ${sellerId} (limit: ${limit}, offset: ${offset})`);

    // Get total count for pagination (lightweight query)
    const countStart = performance.now();
    const { count, error: countError } = await supabase
      .from('items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', sellerId);
    console.log(`  Count query: ${(performance.now() - countStart).toFixed(0)}ms`);

    // Fetch items with optimized query and pagination
    const itemsStart = performance.now();
    const { data: items, error } = await supabase
      .from('items')
      .select(`
        id,
        title,
        name,
        price,
        images,
        status,
        condition,
        size,
        brand,
        quantity,
        user_id,
        user_email,
        created_at,
        updated_at,
        category_id,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('user_id', sellerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    console.log(`  Items query: ${(performance.now() - itemsStart).toFixed(0)}ms`);

    if (error) {
      console.error('❌ Error fetching seller items:', error);
      console.timeEnd('GET /api/seller-items');
      return NextResponse.json(
        { error: 'Failed to fetch seller items', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${items?.length || 0} items (total: ${count})`);
    console.timeEnd('GET /api/seller-items');

    // Return with pagination metadata and caching headers
    const response = NextResponse.json({ 
      items: items || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });

    // Add cache headers for better performance (5 seconds)
    response.headers.set('Cache-Control', 'private, max-age=5, stale-while-revalidate=10');
    
    return response;
  } catch (error) {
    console.error('❌ Error in seller-items API:', error);
    console.timeEnd('GET /api/seller-items');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

