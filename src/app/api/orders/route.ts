import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isRateLimited } from '@/lib/rate-limit';
import { orderSchema } from '@/lib/validation/schemas';

type CartItemInput = {
  id: string;
  quantity: number;
};

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (await isRateLimited(`order:${user.id}`, 10, 60)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map(i => i.message).join(', ') }, { status: 400 });
  }

  const cartItems = parsed.data.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  try {
    const { data: orderId, error } = await supabaseAdmin.rpc('create_order', {
      p_user_id: user.id,
      p_address_id: parsed.data.addressId,
      p_delivery_method: parsed.data.deliveryMethod,
      p_payment_method: parsed.data.paymentMethod,
      p_items: cartItems,
    });

    if (error) throw error;

    const { data: order, error: orderFetchError } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .eq('id', orderId)
      .single();

    if (orderFetchError) throw orderFetchError;

    return NextResponse.json({ orderId, total: order.total_amount });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
