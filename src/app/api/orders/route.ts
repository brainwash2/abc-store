import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

type CartItemInput = {
  id: string;
  title: string;
  price: number;
  image: string;
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

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { items, addressId, deliveryMethod, paymentMethod } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  if (!addressId || !deliveryMethod || !paymentMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const cartItems = items.map((item: CartItemInput) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  try {
    const { data: orderId, error } = await supabaseAdmin.rpc('create_order', {
      p_user_id: user.id,
      p_address_id: addressId,
      p_delivery_method: deliveryMethod,
      p_payment_method: paymentMethod,
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
