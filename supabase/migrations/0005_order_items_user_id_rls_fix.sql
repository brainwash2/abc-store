-- Add user_id to order_items and fix RLS recursion with backfill

begin;

alter table public.order_items
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

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
      seller_id,
      user_id
    )
    values (
      v_order_id,
      v_item.id,
      v_item.quantity,
      v_product.price,
      v_product.seller_id,
      p_user_id
    );

    update public.products
    set stock = stock - v_item.quantity
    where id = v_item.id;
  end loop;

  return v_order_id;
end;
$$;

-- Backfill existing rows
update public.order_items oi
set user_id = o.user_id
from public.orders o
where oi.order_id = o.id
  and oi.user_id is null;

update public.order_items oi
set seller_id = p.seller_id
from public.products p
where oi.product_id = p.id
  and oi.seller_id is null
  and p.seller_id is not null;

alter table public.order_items alter column user_id set not null;

drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Sellers can view own order items" on public.order_items;
drop policy if exists "Sellers can view orders containing their items" on public.orders;

create policy "Users can view own order items"
  on public.order_items for select
  using (user_id = auth.uid() or seller_id = auth.uid() or public.is_admin());

create policy "Sellers can view own order items"
  on public.order_items for select
  using (seller_id = auth.uid() or public.is_admin());

create policy "Sellers can view orders containing their items"
  on public.orders for select
  using (
    public.is_admin()
    or auth.uid() = user_id
    or exists (
      select 1 from public.order_items oi
      where oi.order_id = orders.id
        and oi.seller_id = auth.uid()
    )
  );

commit;
