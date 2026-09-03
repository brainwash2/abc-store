begin;
alter table public.order_items add column if not exists payout_id uuid references public.payouts(id) on delete set null;

create or replace function public.generate_payouts(p_start date, p_end date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seller record;
  v_payout_id uuid;
  v_amount numeric;
begin
  for v_seller in
    select s.id, s.commission_rate from public.sellers s
    where s.kyc_status = 'approved' and s.is_active
  loop
    v_payout_id := gen_random_uuid();
    insert into public.payouts (id, seller_id, amount, status, period_start, period_end)
    values (v_payout_id, v_seller.id, 0, 'pending', p_start, p_end);

    with claimed as (
      update public.order_items oi
      set payout_id = v_payout_id
      from public.orders o
      where oi.seller_id = v_seller.id
        and oi.payout_id is null
        and o.id = oi.order_id
        and o.created_at::date between p_start and p_end
        and (o.payment_status = 'paid' or (o.payment_method = 'cash_delivery' and o.status = 'delivered'))
      returning oi.price_at_purchase * oi.quantity * (100 - v_seller.commission_rate) / 100 as line_amount
    )
    select coalesce(sum(line_amount), 0) into v_amount from claimed;

    if v_amount > 0 then
      update public.payouts set amount = v_amount where id = v_payout_id;
    else
      delete from public.payouts where id = v_payout_id;
    end if;
  end loop;
end;
$$;

revoke execute on function public.generate_payouts(date, date) from public;
revoke execute on function public.generate_payouts(date, date) from anon;
revoke execute on function public.generate_payouts(date, date) from authenticated;
grant execute on function public.generate_payouts(date, date) to service_role;

create or replace function public.mark_payout_paid(p_payout_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.payouts set status = 'paid', paid_at = now()
  where id = p_payout_id and status = 'pending';
  if not found then raise exception 'Payout % not found or not pending', p_payout_id; end if;
end;
$$;

revoke execute on function public.mark_payout_paid(uuid) from public;
revoke execute on function public.mark_payout_paid(uuid) from anon;
revoke execute on function public.mark_payout_paid(uuid) from authenticated;
grant execute on function public.mark_payout_paid(uuid) to service_role;

commit;
