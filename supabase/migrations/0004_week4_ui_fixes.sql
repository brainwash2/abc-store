-- Add email to sellers and reject_seller function
alter table public.sellers add column email text;

create or replace function public.reject_seller(p_seller_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.sellers
  set kyc_status = 'rejected', is_active = false
  where id = p_seller_id;

  if not found then
    raise exception 'Seller % not found', p_seller_id;
  end if;

  update public.profiles
  set role = 'customer'
  where id = p_seller_id
    and role = 'seller';
end;
$$;

revoke execute on function public.reject_seller(uuid) from public;
revoke execute on function public.reject_seller(uuid) from anon;
revoke execute on function public.reject_seller(uuid) from authenticated;
grant execute on function public.reject_seller(uuid) to service_role;
