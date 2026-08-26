import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOrderEmail, generateShippedEmail } from '@/lib/email-templates';
import { createServerSupabaseClient } from '@/lib/supabase-server';

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

  const { type, orderId } = body;

  if (!orderId || !type) {
    return NextResponse.json({ error: 'Missing orderId or type' }, { status: 400 });
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, user_id, email, customer_name, total_amount')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!order.email) {
    return NextResponse.json({ error: 'No email on order' }, { status: 400 });
  }

  // Lazy-initialize Resend to avoid build-time error if key is missing
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('RESEND_API_KEY is missing');
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

  let subject = '';
  let html = '';

  if (type === 'shipped') {
    subject = `Votre commande #${orderId.slice(0, 8)} est expédiée ! 🚚`;
    html = generateShippedEmail(orderId, order.customer_name || 'Client');
  } else {
    subject = `Commande Confirmée #${orderId.slice(0, 8)} 🚀`;
    html = generateOrderEmail(orderId, order.customer_name || 'Client', order.total_amount || 0);
  }

  const { data, error: resendError } = await resend.emails.send({
    from: 'ABC Informatique <onboarding@resend.dev>',
    to: [order.email],
    subject,
    html,
  });

  if (resendError) {
    return NextResponse.json({ error: resendError }, { status: 400 });
  }

  return NextResponse.json({ data });
}
