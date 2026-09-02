import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  const rawBody = await request.text();

  const secret = process.env.CHARGILY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('CHARGILY_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Chargily's actual header name is "signature"
  const signature = request.headers.get('signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Real shape: { type: "checkout.paid", data: { status, metadata, ... } }
  if (event.type !== 'checkout.paid') {
    return NextResponse.json({ received: true });
  }

  const orderId = event.data?.metadata?.order_id;
  if (!orderId) {
    console.error('checkout.paid webhook missing metadata.order_id', event.data?.id);
    return NextResponse.json({ received: true });
  }

  const { data: updated, error } = await supabaseAdmin
    .from('orders')
    .update({ payment_status: 'paid', status: 'confirmed' })
    .eq('id', orderId)
    .eq('payment_method', 'chargily')
    .eq('status', 'pending')
    .select('id');

  if (error) {
    console.error('Webhook update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!updated || updated.length === 0) {
    console.error(`chargily webhook: order ${orderId} was paid but not in 'pending' state — needs manual reconciliation`);
  }

  return NextResponse.json({ received: true });
}
