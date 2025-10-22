import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

// GET /api/seller-items - Get items for a specific seller
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

    console.log('🔍 API: Fetching items for seller:', sellerId);

    const { data: items, error } = await supabase
      .from('items')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('user_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seller items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch seller items', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ API: Found', items?.length || 0, 'items for seller');
    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error('Error in seller-items API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

