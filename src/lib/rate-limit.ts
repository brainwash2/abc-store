import { supabaseAdmin } from '@/lib/supabase-admin';

export async function isRateLimited(key: string, limit: number, windowSeconds: number) {
  const interval = `${windowSeconds} seconds`;
  const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
    p_key: key,
    p_limit: limit,
    p_window: interval,
  });
  if (error) {
    console.error('Rate limit check error:', error);
    return true; // fail closed
  }
  return !data;
}
