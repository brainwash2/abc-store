import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOrderEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, orderId, total } = body;

    const { data, error } = await resend.emails.send({
      from: 'ABC Informatique <onboarding@resend.dev>', // Use this default for testing
      to: [email], // In test mode, this must be YOUR email (the one you signed up with)
      subject: `Commande Confirmée #${orderId.slice(0, 8)} 🚀`,
      html: generateOrderEmail(orderId, name, total),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}