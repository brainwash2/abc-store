-- Rate limiting function (missing migration file, retroactively added)
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_key text, p_limit integer, p_window interval)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_window_start timestamptz := date_trunc('second', now());
  v_count int;
begin
  insert into public.rate_limits (key, window_start, count)
  values (p_key, v_window_start, 1)
  on conflict (key, window_start)
  do update set count = rate_limits.count + 1
  returning count into v_count;

  delete from public.rate_limits where window_start < now() - p_window;

  return v_count <= p_limit;
end;
$function$
;
