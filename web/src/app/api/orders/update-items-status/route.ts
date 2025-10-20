import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Admin not available' }, { status: 503 });
    }

    const { orderId, status, itemIds } = (await req.json()) as { orderId?: string; status?: string; itemIds?: string[] };
    if (!status || (!orderId && (!itemIds || itemIds.length === 0))) {
      return NextResponse.json({ error: 'status and either orderId or itemIds are required' }, { status: 400 });
    }

    // Determine target item ids
    let targetItemIds: string[] = Array.isArray(itemIds) && itemIds.length > 0 ? itemIds : [];
    if (!targetItemIds.length && orderId) {
      // Fallback to loading by orderId if explicit itemIds weren't provided
      const { data: orderItems, error: oiError } = await (supabaseAdmin as unknown as {
        from: (table: string) => {
          select: (cols: string) => {
            eq: (col: string, val: string) => Promise<{ data: { item_id: string }[] | null; error: { message: string } | null }>;
          };
        };
      })
        .from('order_items')
        .select('item_id')
        .eq('order_id', orderId);

      if (oiError) {
        console.error('update-items-status: order_items error', oiError);
        return NextResponse.json({ error: 'Failed to load order items' }, { status: 500 });
      }
      targetItemIds = (orderItems || []).map((oi: { item_id: string }) => oi.item_id);
    }

    if (targetItemIds.length === 0) {
      return NextResponse.json({ ok: true, updatedCount: 0, itemIds: [] });
    }

    // Update items status (status only, avoid quantity constraints)
    const { error: updError } = await (supabaseAdmin as unknown as {
      from: (table: string) => {
        update: (data: { status: string; updated_at: string }) => {
          in: (col: string, vals: string[]) => Promise<{ error: { message: string } | null }>;
        };
      };
    })
      .from('items')
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', targetItemIds);

    if (updError) {
      console.error('update-items-status: items update error', updError);
      return NextResponse.json({ error: 'Failed to update items status' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, updatedCount: targetItemIds.length, itemIds: targetItemIds });
  } catch (e) {
    console.error('update-items-status: unexpected error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


