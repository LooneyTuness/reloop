import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

// GET /api/items - Get all items with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const condition = searchParams.get('condition');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const mainCategory = searchParams.get('mainCategory');
    const subcategory = searchParams.get('subcategory');
    const type = searchParams.get('type');

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build the items query
    let query = supabase
      .from('items')
      .select(`
        *,
        categories(
          id,
          name,
          slug,
          level,
          parent_id
        )
      `)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }
    if (condition) {
      query = query.eq('condition', condition);
    }
    if (brand) {
      query = query.ilike('brand', `%${brand}%`);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    // Apply category filters
    if (mainCategory) {
      console.log('Applying mainCategory filter:', mainCategory);
      query = query.eq('main_category_id', mainCategory);
    }
    if (subcategory) {
      console.log('Applying subcategory filter:', subcategory);
      query = query.eq('subcategory_id', subcategory);
    }
    if (type) {
      console.log('Applying type filter:', type);
      query = query.eq('type_id', type);
    }
    if (brand) {
      console.log('Applying brand filter:', brand);
    }

    const { data: items, error: itemsError } = await query;

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch items' },
        { status: 500 }
      );
    }

    // Fetch seller profiles for the items
    let sellerProfiles: Record<string, { user_id: string; business_name: string | null; full_name: string | null }> = {};
    if (items && items.length > 0) {
      const userIds = [...new Set(items.map(item => item.user_id).filter(Boolean))] as string[];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('seller_profiles')
          .select('user_id, business_name, full_name')
          .in('user_id', userIds);
        
        if (!profilesError && profiles) {
          sellerProfiles = profiles.reduce((acc, profile) => {
            acc[profile.user_id] = {
              user_id: profile.user_id,
              business_name: profile.business_name || null,
              full_name: profile.full_name || null
            };
            return acc;
          }, {} as Record<string, { user_id: string; business_name: string | null; full_name: string | null }>);
        }
      }
    }

    // Merge seller profile data with items
    const itemsWithSellerInfo = items.map(item => ({
      ...item,
      seller_profiles: item.user_id ? sellerProfiles[item.user_id] || null : null
    }));

    // Debug: Log the first item to see what data we're getting
    if (itemsWithSellerInfo && itemsWithSellerInfo.length > 0) {
      console.log('=== DEBUGGING SELLER INFO ===');
      console.log('First item user_id:', itemsWithSellerInfo[0].user_id);
      console.log('Seller profiles data:', sellerProfiles);
      console.log('First item seller_profiles:', itemsWithSellerInfo[0].seller_profiles);
      console.log('First item seller field:', itemsWithSellerInfo[0].seller);
      console.log('================================');
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .is('deleted_at', null);

    // Apply same filters to count query
    if (minPrice) {
      countQuery = countQuery.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      countQuery = countQuery.lte('price', parseFloat(maxPrice));
    }
    if (condition) {
      countQuery = countQuery.eq('condition', condition);
    }
    if (brand) {
      countQuery = countQuery.ilike('brand', `%${brand}%`);
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    // Apply same category filters to count query
    if (mainCategory) {
      countQuery = countQuery.eq('main_category_id', mainCategory);
    }
    if (subcategory) {
      countQuery = countQuery.eq('subcategory_id', subcategory);
    }
    if (type) {
      countQuery = countQuery.eq('type_id', type);
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error('Error getting count:', countError);
      return NextResponse.json(
        { error: 'Failed to get item count' },
        { status: 500 }
      );
    }

    const total = totalCount || 0;
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      items: itemsWithSellerInfo || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error('Error in items API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
