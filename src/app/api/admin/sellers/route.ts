import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Rate limiting: 20 admin actions per 60 sec
  if (await isRateLimited(`admin:${user.id}`, 20, 60)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { action, sellerId } = await request.json();
  if (!action || !sellerId) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

  if (action === 'approve') {
    const { error } = await supabaseAdmin.rpc('approve_seller', { p_seller_id: sellerId });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'reject') {
    const { error } = await supabaseAdmin.rpc('reject_seller', { p_seller_id: sellerId });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
