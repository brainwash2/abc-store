-- =========================================================
-- Week 4 Marketplace Schema (with all corrections)
-- =========================================================

begin;

-- 1. Sellers table
create table public.sellers (
  id uuid primary key references auth.users(id) on delete cascade,
  store_name text not null,
  legal_name text,
  registre_commerce text,
  kyc_status text not null default 'pending'
    check (kyc_status in ('pending','submitted','approved','rejected')),
  commission_rate numeric(5,2) not null default 10.00,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sellers enable row level security;

create policy "Sellers can view own seller profile"
  on public.sellers for select
  using (auth.uid() = id);

create policy "Sellers can insert own seller profile"
  on public.sellers for insert
  with check (auth.uid() = id);

create policy "Sellers can update own seller profile"
  on public.sellers for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Public can view approved sellers"
  on public.sellers for select
  using (kyc_status = 'approved' and is_active);

create policy "Admin can view all sellers"
  on public.sellers for select
  using (public.is_admin());

create or replace function public.prevent_seller_status_change()
returns trigger as $$
begin
  if (new.kyc_status is distinct from old.kyc_status
      or new.is_active is distinct from old.is_active
      or new.commission_rate is distinct from old.commission_rate)
     and auth.role() <> 'service_role' then
    raise exception 'Only service_role can change kyc_status, is_active, or commission_rate';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger prevent_seller_status_change_trigger
  before update on public.sellers
  for each row execute procedure public.prevent_seller_status_change();

-- 2. Add seller_id to products
alter table public.products
  add column seller_id uuid references public.sellers(id) on delete set null;

drop policy if exists "Admin can insert products" on public.products;
drop policy if exists "Admin can update products" on public.products;
drop policy if exists "Admin can delete products" on public.products;

create policy "Admin can insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admin can update products"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete products"
  on public.products for delete
  using (public.is_admin());

create policy "Sellers can insert own products"
  on public.products for insert
  with check (
    seller_id = auth.uid()
    and exists (
      select 1 from public.sellers s
      where s.id = auth.uid()
        and s.kyc_status = 'approved'
        and s.is_active
    )
  );

create policy "Sellers can update own products"
  on public.products for update
  using (
    seller_id = auth.uid()
    and exists (
      select 1 from public.sellers s
      where s.id = auth.uid()
        and s.kyc_status = 'approved'
        and s.is_active
    )
  )
  with check (seller_id = auth.uid());

create policy "Sellers can delete own products"
  on public.products for delete
  using (
    seller_id = auth.uid()
    and exists (
      select 1 from public.sellers s
      where s.id = auth.uid()
        and s.kyc_status = 'approved'
        and s.is_active
    )
  );

-- 3. Add seller_id to order_items
alter table public.order_items
  add column seller_id uuid references public.sellers(id);

-- 4. Update create_order() to snapshot seller_id into order_items
create or replace function public.create_order(
  p_user_id uuid,
  p_address_id uuid,
  p_delivery_method text,
  p_payment_method text,
  p_items jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_address record;
  v_subtotal numeric := 0;
  v_delivery numeric;
  v_tax numeric;
  v_total numeric;
  v_order_id uuid;
  v_item record;
  v_product record;
begin
  select * into v_address
  from public.addresses
  where id = p_address_id and user_id = p_user_id;

  if not found then
    raise exception 'Address not found';
  end if;

  for v_item in
    select (elem->>'id')::bigint as id, sum((elem->>'quantity')::int) as quantity
    from jsonb_array_elements(p_items) as elem
    group by (elem->>'id')::bigint
  loop
    select * into v_product
    from public.products
    where id = v_item.id
    for update;

    if not found then
      raise exception 'Product % not found', v_item.id;
    end if;

    if v_product.stock < v_item.quantity then
      raise exception 'Insufficient stock for product %', v_item.id;
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_item.quantity);
  end loop;

  v_delivery := case
    when p_delivery_method = 'express' then 1200
    when p_delivery_method = 'standard' then 500
    else 0
  end;

  v_tax := round(v_subtotal * 0.19);
  v_total := v_subtotal + v_delivery + v_tax;

  insert into public.orders (
    user_id,
    customer_name,
    customer_phone,
    wilaya,
    address,
    total_amount,
    payment_method,
    status
  )
  values (
    p_user_id,
    v_address.full_name,
    v_address.phone,
    v_address.wilaya,
    v_address.street || ', ' || v_address.commune || ' ' || coalesce(v_address.postal_code, ''),
    v_total,
    p_payment_method,
    'pending'
  )
  returning id into v_order_id;

  for v_item in
    select (elem->>'id')::bigint as id, sum((elem->>'quantity')::int) as quantity
    from jsonb_array_elements(p_items) as elem
    group by (elem->>'id')::bigint
  loop
    select * into v_product
    from public.products
    where id = v_item.id;

    insert into public.order_items (
      order_id,
      product_id,
      quantity,
      price_at_purchase,
      seller_id
    )
    values (
      v_order_id,
      v_item.id,
      v_item.quantity,
      v_product.price,
      v_product.seller_id
    );

    update public.products
    set stock = stock - v_item.quantity
    where id = v_item.id;
  end loop;

  return v_order_id;
end;
$$;

revoke execute on function public.create_order(uuid, uuid, text, text, jsonb) from public;
revoke execute on function public.create_order(uuid, uuid, text, text, jsonb) from anon;
revoke execute on function public.create_order(uuid, uuid, text, text, jsonb) from authenticated;
grant execute on function public.create_order(uuid, uuid, text, text, jsonb) to service_role;

-- 5. Payouts table
create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending','processing','paid','failed')),
  period_start date,
  period_end date,
  reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.payouts enable row level security;

create policy "Sellers can view own payouts"
  on public.payouts for select
  using (seller_id = auth.uid());

create policy "Admin can view all payouts"
  on public.payouts for select
  using (public.is_admin());

-- 6. Update order_items RLS policies for sellers
create policy "Sellers can view own order items"
  on public.order_items for select
  using (seller_id = auth.uid() or public.is_admin());

-- 7. Update orders RLS for sellers
create policy "Sellers can view orders containing their items"
  on public.orders for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.order_items oi
      where oi.order_id = orders.id
        and oi.seller_id = auth.uid()
    )
  );

-- 8. Atomic seller approval function
create or replace function public.approve_seller(p_seller_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.sellers
  set kyc_status = 'approved', is_active = true
  where id = p_seller_id;

  if not found then
    raise exception 'Seller % not found', p_seller_id;
  end if;

  update public.profiles
  set role = 'seller'
  where id = p_seller_id
    and role = 'customer';
end;
$$;

revoke execute on function public.approve_seller(uuid) from public;
revoke execute on function public.approve_seller(uuid) from anon;
revoke execute on function public.approve_seller(uuid) from authenticated;
grant execute on function public.approve_seller(uuid) to service_role;

commit;
