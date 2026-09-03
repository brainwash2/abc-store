import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOrderEmail, generateShippedEmail } from '@/lib/email-templates';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isRateLimited } from '@/lib/rate-limit';
import { emailSendSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (await isRateLimited(`email:${user.id}`, 5, 60)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = emailSendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map(i => i.message).join(', ') }, { status: 400 });
  }

  const { type, orderId } = parsed.data;

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

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('RESEND_API_KEY missing');
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
