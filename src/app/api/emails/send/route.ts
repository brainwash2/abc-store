import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOrderEmail, generateShippedEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, email, name, orderId, total } = body;

    let subject = '';
    let html = '';

    // Decide which email to send
    if (type === 'shipped') {
      subject = `Votre commande #${orderId.slice(0, 8)} est expédiée ! 🚚`;
      html = generateShippedEmail(orderId, name);
    } else {
      // Default to Order Confirmation
      subject = `Commande Confirmée #${orderId.slice(0, 8)} 🚀`;
      html = generateOrderEmail(orderId, name, total || 0);
    }

    const { data, error } = await resend.emails.send({
      from: 'ABC Informatique <onboarding@resend.dev>',
      to: [email],
      subject: subject,
      html: html,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}