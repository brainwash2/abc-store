-- Add payment_status column to orders
-- Originally added during Week 3 testing to support Chargily webhook updates.
alter table public.orders
  add column payment_status text not null default 'pending';

-- Add check constraint to prevent invalid values
alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('pending', 'paid', 'failed', 'refunded'));
