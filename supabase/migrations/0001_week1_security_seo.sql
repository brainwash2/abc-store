-- Week 1: profiles/RBAC, RLS cleanup, order_items type fix
-- Reconstructed from session history — verify against live pg_policies before treating as source of truth

alter table public.order_items enable row level security;
alter table public.posts enable row level security;
alter table public.subscribers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'seller', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile except role" on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.prevent_role_change() returns trigger as $$
begin
  if new.role is distinct from old.role and auth.role() <> 'service_role' then
    raise exception 'Only service_role can change role';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger prevent_role_change_trigger before update on public.profiles
  for each row execute procedure public.prevent_role_change();

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
    select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
  $$;

-- Drop duplicate/insecure policies
drop policy if exists "Enable insert for everyone" on public.orders;
drop policy if exists "Public can create orders" on public.orders;
drop policy if exists "Public can insert orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Allow authenticated update orders" on public.orders;
drop policy if exists "Users can see own orders" on public.orders;
drop policy if exists "Admin write access" on public.products;
drop policy if exists "Public read access" on public.products;
drop policy if exists "Admins can manage posts" on public.posts;
drop policy if exists "Public can read posts" on public.posts;
drop policy if exists "Public posts are viewable by everyone" on public.posts;
drop policy if exists "Public can insert order items" on public.order_items;

-- Fix order_items types
delete from public.order_items;
alter table public.order_items alter column product_id type bigint using product_id::text::bigint;
alter table public.order_items alter column order_id set not null, alter column product_id set not null;

-- New policies
create policy "Public can view products" on public.products for select using (true);
create policy "Admin can insert products" on public.products for insert with check (public.is_admin());
create policy "Admin can update products" on public.products for update using (public.is_admin()) with check (public.is_admin());
create policy "Admin can delete products" on public.products for delete using (public.is_admin());

create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Temporary public insert orders" on public.orders for insert with check (true);
create policy "Users can update own pending orders" on public.orders for update
  using (auth.uid() = user_id and status in ('pending', 'failed')) with check (auth.uid() = user_id);
create policy "Admin can update orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "Public can view published posts" on public.posts for select using (is_published = true or public.is_admin());
create policy "Admin can insert posts" on public.posts for insert with check (public.is_admin());
create policy "Admin can update posts" on public.posts for update using (public.is_admin()) with check (public.is_admin());
create policy "Admin can delete posts" on public.posts for delete using (public.is_admin());
