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

  if (await isRateLimited(`adminpayout:${user.id}`, 20, 60)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { action, period_start, period_end, payoutId } = await request.json();

  if (action === 'generate') {
    if (!period_start || !period_end) return NextResponse.json({ error: 'Missing dates' }, { status: 400 });
    const { error } = await supabaseAdmin.rpc('generate_payouts', {
      p_start: period_start,
      p_end: period_end,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'mark_paid') {
    if (!payoutId) return NextResponse.json({ error: 'Missing payoutId' }, { status: 400 });
    const { error } = await supabaseAdmin.rpc('mark_payout_paid', { p_payout_id: payoutId });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
