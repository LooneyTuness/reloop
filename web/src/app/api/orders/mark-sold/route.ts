import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin service not available' },
        { status: 503 }
      );
    }

    const { itemIds } = (await req.json()) as { itemIds?: string[] };

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        { error: 'itemIds array is required' },
        { status: 400 }
      );
    }

    const ids = itemIds.map(String);

    const { error } = await (supabaseAdmin as any)
      .from('items')
      .update({
        status: 'sold',
        quantity: 0,
        sold_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .in('id', ids);

    if (error) {
      console.error('mark-sold update error:', error);
      return NextResponse.json(
        { error: 'Failed to mark items as sold' },
        { status: 500 }
      );
    }

    // Revalidate key pages that show listings
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/catalog');
    } catch (e) {
      console.warn('Revalidate failed (non-blocking):', e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Error in mark-sold API:', e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


