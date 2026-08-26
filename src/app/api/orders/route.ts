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

  // 1. Authenticate
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse and validate body
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

  // 3. Verify address belongs to user
  const { data: address, error: addressError } = await supabaseAdmin
    .from('addresses')
    .select('*')
    .eq('id', addressId)
    .eq('user_id', user.id)
    .single();

  if (addressError || !address) {
    return NextResponse.json({ error: 'Address not found' }, { status: 400 });
  }

  // 4. Fetch product prices and build order items
  const orderItems = [];
  let subtotal = 0;

  for (const item of items as CartItemInput[]) {
    const productId = parseInt(item.id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, price, stock')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 });
    }

    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for ${product.id}` }, { status: 400 });
    }

    const unitPrice = product.price;
    subtotal += unitPrice * item.quantity;

    orderItems.push({
      product_id: product.id,
      quantity: item.quantity,
      price_at_purchase: unitPrice,
    });
  }

  // 5. Delivery price
  const deliveryPrice =
    deliveryMethod === 'express' ? 1200 :
    deliveryMethod === 'standard' ? 500 : 0;

  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + deliveryPrice + tax;

  // 6. Insert order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert([
      {
        user_id: user.id,
        customer_name: address.full_name,
        customer_phone: address.phone,
        wilaya: address.wilaya,
        address: `${address.street}, ${address.commune} ${address.postal_code || ''}`,
        total_amount: total,
        payment_method: paymentMethod,
        status: 'pending',
      },
    ])
    .select('id')
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  // 7. Insert order items
  const orderItemsToInsert = orderItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_purchase: item.price_at_purchase,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItemsToInsert);

  if (itemsError) {
    // If items insertion fails, delete the order to avoid partial state
    await supabaseAdmin.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id, total });
}
