-- 1. Remove dangerous policies
drop policy if exists "Temporary public insert orders" on public.orders;
drop policy if exists "Users can update own pending orders" on public.orders;

-- 2. Prevent seller self-approval via INSERT
create or replace function public.force_seller_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'service_role' then
    new.kyc_status := 'submitted';
    new.is_active := false;
    new.commission_rate := 10.00;
  end if;
  return new;
end;
$$;

create trigger force_seller_defaults_trigger
  before insert on public.sellers
  for each row execute procedure public.force_seller_defaults();

-- 3. Immutability guard for orders
create or replace function public.protect_order_fields()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.role() = 'service_role' then return new; end if;
  if new.total_amount is distinct from old.total_amount
  or new.payment_status is distinct from old.payment_status
  or new.user_id is distinct from old.user_id
  or new.payment_method is distinct from old.payment_method then
    raise exception 'Field is immutable';
  end if;
  if new.status is distinct from old.status then
    if public.is_admin() then return new; end if;
    if auth.uid() = old.user_id and old.status = 'pending' and new.status = 'cancelled' then
      return new;
    end if;
    raise exception 'Status transition not allowed';
  end if;
  return new;
end;
$$;

create trigger protect_order_fields_trigger
  before update on public.orders
  for each row execute procedure public.protect_order_fields();

-- 4. Restore safe customer cancel policy
create policy "Users can cancel own pending orders"
  on public.orders for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id);
