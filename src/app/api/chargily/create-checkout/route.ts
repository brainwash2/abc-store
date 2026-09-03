import { NextResponse } from 'next/server';
import https from 'https';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isRateLimited } from '@/lib/rate-limit';
import { chargilyCheckoutSchema } from '@/lib/validation/schemas';

function chargilyRequest(path: string, apiKey: string, body: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const options = {
      hostname: 'pay.chargily.net',
      path,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      family: 4,
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 0, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode || 0, data: { message: 'Invalid JSON from Chargily' } });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy(new Error('Chargily request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (await isRateLimited(`chargily:${user.id}`, 5, 60)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = chargilyCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map(i => i.message).join(', ') }, { status: 400 });
  }

  const cartItems = parsed.data.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  let orderId: string;
  try {
    const { data: createdOrderId, error } = await supabaseAdmin.rpc('create_order', {
      p_user_id: user.id,
      p_address_id: parsed.data.addressId,
      p_delivery_method: parsed.data.deliveryMethod,
      p_payment_method: 'chargily',
      p_items: cartItems,
    });
    if (error) throw error;
    orderId = createdOrderId as string;
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }

  const { data: order, error: orderFetchError } = await supabaseAdmin
    .from('orders')
    .select('total_amount')
    .eq('id', orderId)
    .single();

  if (orderFetchError || !order) {
    return NextResponse.json({ error: 'Failed to fetch order total' }, { status: 500 });
  }

  const chargilyAmount = Math.round(order.total_amount);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  try {
    const chargilyResponse = await chargilyRequest(
      '/test/api/v2/checkouts',
      process.env.CHARGILY_SECRET_KEY!,
      {
        amount: chargilyAmount,
        currency: 'dzd',
        success_url: `${siteUrl}/order-details?order_id=${orderId}&status=success`,
        failure_url: `${siteUrl}/checkout?status=failed`,
        description: `Commande #${orderId.slice(0, 8)}`,
        metadata: { order_id: orderId },
      }
    );

    if (chargilyResponse.status < 200 || chargilyResponse.status >= 300) {
      console.error('Chargily API error:', chargilyResponse.data);
      return NextResponse.json({ error: chargilyResponse.data.message || 'Chargily API error' }, { status: 500 });
    }

    return NextResponse.json({ checkout_url: chargilyResponse.data.checkout_url, order_id: orderId });
  } catch (error: any) {
    console.error('Chargily request failed:', error);
    return NextResponse.json({ error: error.message || 'Chargily request failed' }, { status: 500 });
  }
}
