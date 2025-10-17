import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

// GET /api/items/category/[categoryId] - Get items filtered by category
export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin service not available" },
        { status: 503 }
      );
    }
    
    const supabase = supabaseAdmin;
    const { categoryId } = params;
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
    const includeSubcategories = searchParams.get('include_subcategories') !== 'false';

    // Calculate offset
    const offset = (page - 1) * limit;

    // First, get the category to determine its level
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id, level, name')
      .eq('id', categoryId)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    let categoryIds: string[] = [categoryId];

    // If including subcategories, get all child categories
    if (includeSubcategories) {
      const { data: subcategories } = await supabase
        .from('categories')
        .select('id')
        .or(`parent_id.eq.${categoryId},parent_id.in.(${categoryId})`);

      if (subcategories) {
        categoryIds = [categoryId, ...subcategories.map(c => c.id)];
        
        // If this is a main category, also get all subcategories and types
        if (category.level === 0) {
          const { data: allSubcategories } = await supabase
            .from('categories')
            .select('id')
            .in('parent_id', subcategories.map(c => c.id));

          if (allSubcategories) {
            categoryIds = [...categoryIds, ...allSubcategories.map(c => c.id)];
          }
        }
      }
    }

    // Build the items query
    let query = supabase
      .from('items')
      .select(`
        *,
        categories!inner(
          id,
          name,
          slug,
          level,
          parent_id
        )
      `)
      .in('category_id', categoryIds)
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
      // Handle special case for "All" option
      if (brand === 'сите') {
        // Don't apply any brand filter - show all products
        console.log('Showing all products (сите selected)');
      } else if (brand === 'Other (Друго)' || brand === 'Other') {
        query = query.or('brand.ilike.%Other%,brand.ilike.%Друго%,brand.is.null');
      } else {
        query = query.ilike('brand', `%${brand}%`);
      }
    }

    const { data: items, error: itemsError, count } = await query;

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

    // Get total count for pagination
    let countQuery = supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .in('category_id', categoryIds)
      .eq('is_active', true)
      .is('deleted_at', null);

    // Apply same filters for count
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
      // Handle special case for "Other" brand variations
      if (brand === 'Other (Друго)' || brand === 'Other') {
        countQuery = countQuery.or('brand.ilike.%Other%,brand.ilike.%Друго%,brand.is.null');
      } else {
        countQuery = countQuery.ilike('brand', `%${brand}%`);
      }
    }

    const { count: totalCount } = await countQuery;

    // Get category hierarchy for breadcrumbs
    const { data: categoryHierarchy } = await supabase
      .from('category_hierarchy')
      .select('*')
      .eq('id', categoryId);

    return NextResponse.json({
      items: itemsWithSellerInfo || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
        hasNext: page < Math.ceil((totalCount || 0) / limit),
        hasPrev: page > 1,
      },
      category: categoryHierarchy?.[0] || null,
      filters: {
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        condition,
        brand,
        includeSubcategories,
      },
    });
  } catch (error) {
    console.error('Error in items by category API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
