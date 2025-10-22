import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

// GET /api/featured-products - Get featured products for homepage
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
    const limit = parseInt(searchParams.get('limit') || '4');

    console.log('🔍 API: Fetching featured products, limit:', limit);

    // First, get the items
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('is_active', true)
      // Show all active items that aren't deleted and aren't sold, hidden, or draft
      .is('deleted_at', null)
      .neq('status', 'sold')
      .neq('status', 'hidden')
      .neq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (itemsError) {
      console.error('Error fetching featured products:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch featured products', details: itemsError.message },
        { status: 500 }
      );
    }

    console.log('✅ API: Found', items?.length || 0, 'featured products');

    if (!items || items.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Get seller profiles for the items
    const userIds = [...new Set(items.map(item => item.user_id).filter(Boolean))] as string[];
    let sellerProfiles: Record<string, { business_name: string | null; full_name: string | null }> = {};
    
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('seller_profiles')
        .select('user_id, business_name, full_name')
        .in('user_id', userIds);
      
      if (!profilesError && profiles) {
        sellerProfiles = profiles.reduce((acc, profile) => {
          acc[profile.user_id] = {
            business_name: profile.business_name || null,
            full_name: profile.full_name || null
          };
          return acc;
        }, {} as Record<string, { business_name: string | null; full_name: string | null }>);
      }
    }

    // Merge seller profile data with items
    const itemsWithSellerInfo = items.map(item => ({
      ...item,
      seller_profiles: item.user_id ? sellerProfiles[item.user_id] || null : null
    }));

    console.log('✅ API: Returning', itemsWithSellerInfo.length, 'items with seller info');
    return NextResponse.json({ items: itemsWithSellerInfo });
  } catch (error) {
    console.error('Error in featured-products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

