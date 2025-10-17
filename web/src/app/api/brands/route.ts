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
      .is('deleted_at', null);

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
    const brands = items 
      ? [...new Set(
          items
            .map(item => item.brand)
            .filter(brand => {
              // More lenient filtering - allow brands that are not null/undefined and have some content
              return brand !== null && brand !== undefined && String(brand).trim() !== '';
            })
            .map(brand => {
              // Normalize brands: trim, capitalize first letter, handle common variations
              const normalized = String(brand).trim();
              
              // Handle common brand name variations
              const brandMap: { [key: string]: string } = {
                'nike': 'Nike',
                'adidas': 'Adidas',
                'apple': 'Apple',
                'samsung': 'Samsung',
                'sony': 'Sony',
                'lg': 'LG',
                'hp': 'HP',
                'dell': 'Dell',
                'lenovo': 'Lenovo',
                'asus': 'ASUS',
                'msi': 'MSI',
                'intel': 'Intel',
                'amd': 'AMD',
                'nvidia': 'NVIDIA',
                'zara': 'Zara',
                'h&m': 'H&M',
                'uniqlo': 'Uniqlo',
                'gap': 'Gap',
                'levi\'s': 'Levi\'s',
                'calvin klein': 'Calvin Klein',
                'tommy hilfiger': 'Tommy Hilfiger',
                'ralph lauren': 'Ralph Lauren',
                'gucci': 'Gucci',
                'prada': 'Prada',
                'versace': 'Versace',
                'armani': 'Armani',
                'hugo boss': 'Hugo Boss',
                'diesel': 'Diesel',
                'guess': 'Guess',
                'michael kors': 'Michael Kors',
                'coach': 'Coach',
                'kate spade': 'Kate Spade',
                'tory burch': 'Tory Burch',
                'mk': 'Michael Kors',
                'ck': 'Calvin Klein',
                'rl': 'Ralph Lauren',
                'hb': 'Hugo Boss',
                'dkny': 'DKNY',
                'dk': 'DKNY',
                'ysl': 'YSL',
                'chanel': 'Chanel',
                'dior': 'Dior',
                'louis vuitton': 'Louis Vuitton',
                'lv': 'Louis Vuitton',
                'hermes': 'Hermès',
                'cartier': 'Cartier',
                'rolex': 'Rolex',
                'omega': 'Omega',
                'tag heuer': 'Tag Heuer',
                'breitling': 'Breitling',
                'tissot': 'Tissot',
                'seiko': 'Seiko',
                'citizen': 'Citizen',
                'casio': 'Casio',
                'fossil': 'Fossil',
                // Popular brands in Macedonia
                'bershka': 'Bershka',
                'stradivarius': 'Stradivarius',
                'pull & bear': 'Pull & Bear',
                'mango': 'Mango',
                'springfield': 'Springfield',
                'tom tailor': 'Tom Tailor',
                'timberland': 'Timberland',
                'vans': 'Vans',
                'skechers': 'Skechers',
                'converse': 'Converse',
                'karl lagerfeld': 'Karl Lagerfeld',
                'liu jo': 'Liu Jo',
                'hatemoglu': 'Hatemoğlu',
                'hatemoğlu': 'Hatemoğlu',
                'kigili': 'Kiğılı',
                'kiğılı': 'Kiğılı',
                'mavi jeans': 'Mavi Jeans',
                'mavi': 'Mavi Jeans',
                'modanisa': 'Modanisa',
                'ipekyol': 'Ipekyol',
                'defacto': 'DeFacto',
                'damat tween': 'Damat Tween',
                'derimod': 'Derimod',
                // Local Macedonian brands
                'valdrin sahiti': 'Valdrin Sahiti',
                'valdrin sahiti official': 'Valdrin Sahiti',
                'sara fashion': 'Sara Fashion',
                'luxuryshoes': 'Luxuryshoes',
                'perla shoes': 'Perla Shoes',
                'fashion group macedonia': 'Fashion Group Macedonia'
              };
              
              const lowerBrand = normalized.toLowerCase();
              return brandMap[lowerBrand] || normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
            })
        )]
      : [];

    // Sort brands alphabetically
    brands.sort();

    // Add "All" option at the beginning for better UX
    const brandsWithAll = ['Сите', ...brands];

    return NextResponse.json({
      brands: brandsWithAll,
      count: brandsWithAll.length
    });

  } catch (error) {
    console.error('Error in brands API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
