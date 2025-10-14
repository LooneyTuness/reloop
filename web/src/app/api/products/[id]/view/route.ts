import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // Get the product ID from params
    const productId = params.id;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get request data
    const body = await request.json();
    const { sessionId, referrer } = body;

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();

    // Verify the product exists and is active
    const { data: product, error: productError } = await supabase
      .from('items')
      .select('id, user_id, is_active')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product_views table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('product_views')
      .select('id')
      .limit(1);

    if (tableError) {
      console.log('Product views table does not exist, skipping view tracking');
      return NextResponse.json({ 
        success: true, 
        viewCount: 0,
        message: 'View tracking not available - table not found'
      });
    }

    // Insert view record
    const { error: insertError } = await supabase
      .from('product_views')
      .insert({
        product_id: productId,
        user_id: user?.id || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionId,
        referrer: referrer,
        viewed_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting product view:', insertError);
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }

    // Get updated view count for this product
    const { data: viewCount, error: viewCountError } = await supabase
      .rpc('get_product_view_count', { product_uuid: productId });

    if (viewCountError) {
      console.log('View count function not available, using fallback');
      // Fallback: count views manually
      const { count } = await supabase
        .from('product_views')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId);
      
      return NextResponse.json({ 
        success: true, 
        viewCount: count || 0 
      });
    }

    return NextResponse.json({ 
      success: true, 
      viewCount: viewCount || 0 
    });

  } catch (error) {
    console.error('Error in product view tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    const productId = params.id;
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product_views table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('product_views')
      .select('id')
      .limit(1);

    if (tableError) {
      console.log('Product views table does not exist');
      return NextResponse.json({ 
        viewCount: 0,
        message: 'View tracking not available - table not found'
      });
    }

    // Get view count for the product
    const { data: viewCount, error } = await supabase
      .rpc('get_product_view_count', { product_uuid: productId });

    if (error) {
      console.log('View count function not available, using fallback');
      // Fallback: count views manually
      const { count } = await supabase
        .from('product_views')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId);
      
      return NextResponse.json({ 
        viewCount: count || 0 
      });
    }

    return NextResponse.json({ 
      viewCount: viewCount || 0 
    });

  } catch (error) {
    console.error('Error getting product view count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
