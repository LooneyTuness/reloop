import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

// GET /api/brands - Get available brands for a category
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
    
    // Query parameters
    const categoryId = searchParams.get('categoryId');
    const mainCategory = searchParams.get('mainCategory');
    const subcategory = searchParams.get('subcategory');
    const type = searchParams.get('type');

    // Build category filter
    let categoryIds: string[] = [];
    
    if (type) {
      // For type, only include that specific type
      categoryIds = [type];
    } else if (subcategory) {
      // For subcategory, include the subcategory and its types
      const { data: types } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', subcategory);
      
      categoryIds = [
        subcategory,
        ...(types?.map(t => t.id) || [])
      ];
    } else if (mainCategory) {
      // For main category, get all subcategories and types under it
      const { data: subcategories } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', mainCategory);
      
      const { data: types } = await supabase
        .from('categories')
        .select('id')
        .in('parent_id', subcategories?.map(s => s.id) || []);
      
      categoryIds = [
        mainCategory,
        ...(subcategories?.map(s => s.id) || []),
        ...(types?.map(t => t.id) || [])
      ];
    } else if (categoryId) {
      // Single category ID
      categoryIds = [categoryId];
    }

    // Build the query to get unique brands
    let query = supabase
      .from('items')
      .select('brand')
      .eq('is_active', true)
      .is('deleted_at', null)
      .not('brand', 'is', null);

    // Apply category filter if specified
    if (categoryIds.length > 0) {
      query = query.in('category_id', categoryIds);
    }

    const { data: items, error } = await query;

    if (error) {
      console.error('Error fetching brands:', error);
      return NextResponse.json(
        { error: 'Failed to fetch brands' },
        { status: 500 }
      );
    }

    // Extract unique brands and filter out empty/null values
    const brands = [...new Set(
      items
        ?.map(item => item.brand)
        .filter(brand => brand && brand.trim() !== '')
    )] || [];

    // Sort brands alphabetically
    brands.sort();

    // Add "Other" option at the end
    const brandsWithOther = [...brands, 'Other (Друго)'];

    return NextResponse.json({
      brands: brandsWithOther,
      count: brandsWithOther.length
    });

  } catch (error) {
    console.error('Error in brands API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
