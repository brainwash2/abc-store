# ABC Store — Refactor Progress

## Project Overview
Next.js + Supabase e-commerce app for Algerian electronics retailer, evolving to multi-vendor marketplace. Stack: Next.js (App Router), TypeScript, Tailwind, Supabase (Postgres + Auth + Storage).

## Goals
- Security: Row Level Security, role-based admin access, server-side write validation.
- SEO: Product metadata and JSON-LD.
- Regional: 69 wilayas, real address management.
- Payments: COD + Chargily.
- Marketplace: sellers, order_items, payouts (later).

---

## Week 1 — Security & SEO (COMPLETE)

### Priority 0: Email relay security
- Fixed open email relay in `/api/emails/send`.
- Lazy-init Resend client, auth check via @supabase/ssr.
- Verified 401/200/403 behavior.
- Committed.

### Day 1: Database & RLS
- Created `profiles` table with roles, RLS enabled.
- Added `handle_new_user` trigger and `prevent_role_change` trigger.
- Created `is_admin()` function.
- Enabled RLS on all public tables.
- Dropped duplicate/insecure policies.
- Fixed `order_items.product_id` type to bigint, set NOT NULL.
- Created new policies using `is_admin()` and `auth.uid()`.
- Seeded admin role.
- Verified policies and columns.
- Committed migration file.

### Day 2: Middleware
- Migrated to `@supabase/ssr`.
- Used `rpc('is_admin')` for admin check.
- Removed client-side admin email check.
- Fixed Turbopack middleware not running in dev by using production mode.
- Applied cookie-transplant fix on redirects.
- Verified logged-out, normal user, admin redirects.
- Committed.

### Day 3: Client Supabase migration & admin checks
- Replaced client with `createBrowserClient` from `@supabase/ssr`.
- Fixed login persistence and middleware session visibility.
- Updated login/Header to query profiles role.
- Committed.

### Day 4: RLS cleanup
- Confirmed no duplicate policies.
- `order_items` intentionally had no policies until Week 2.

### Day 5: Product SEO & wilayas
- Server component for product details with `generateMetadata` and JSON-LD.
- Updated wilaya list to 69.
- Committed.

---

## Week 2 — Server-side Writes & Addresses (COMPLETE)

### Addresses & RLS
- Created `addresses` table with `Users can manage own addresses` policy (ALL, auth.uid() = user_id).
- Replaced mock addresses with real CRUD.

### Server-side order creation
- Added `SUPABASE_SERVICE_ROLE_KEY`.
- Created `src/lib/supabase-admin.ts`.
- Created `src/app/api/orders/route.ts`.
- Created Postgres function `create_order()`:
  - Atomic transaction with `FOR UPDATE` row locks.
  - Aggregates duplicate product IDs.
  - Validates address ownership.
  - Fetches real product prices.
  - Computes delivery/tax/total server-side.
  - Inserts `orders` and `order_items`.
  - Decrements stock.
  - Restricted to service_role.
- Verified duplicate product aggregation and stock decrement.

### Order details & user orders migration
- Added foreign keys on `order_items`.
- Added SELECT policy "Users can view own order items".
- Updated `order-details`, `user`, and `user/orders` to read from `order_items`.
- Dropped legacy `orders.items` column.

---

## Week 3 — Chargily Pay Integration (CORE COMPLETE, webhook pending local testing)

### Chargily keys & env
- Added `CHARGILY_SECRET_KEY` and `CHARGILY_WEBHOOK_SECRET` to `.env.local`.

### Checkout creation
- Created `/api/chargily/create-checkout`:
  - Authenticates via @supabase/ssr.
  - Calls `create_order()` with `payment_method='chargily'`.
  - Fetches order total.
  - Sends to Chargily test endpoint `https://pay.chargily.net/test/api/v2/checkouts` with correct amount (plain DZD), currency `dzd`.
  - Removed `webhook_url` (not allowed by Chargily v2 per-checkout).
- Verified redirect to Chargily test payment page and correct amount.

### Webhook
- Created `/api/chargily/webhook`:
  - Uses correct header name `signature`.
  - Parses real event shape `{ type: "checkout.paid", data: { ... } }`.
  - Uses timing-safe HMAC comparison.
  - Mandatory webhook secret.
  - Updates order to `status='confirmed', payment_status='paid'` only if currently pending and payment_method='chargily'.
- Fixed `orders` table by adding `payment_status` column.

### Abandoned order cleanup
- Enabled `pg_cron`.
- Created `cleanup_abandoned_chargily_orders()`:
  - Finds pending Chargily orders older than 60 minutes.
  - Restores stock and cancels order.
- Scheduled every 10 minutes.

### Baridi Mob
- Removed Baridi Mob from payment options to prevent stock-lock from unpaid orders.

### Testing
- Successfully created Chargily checkout, redirected, paid in sandbox, verified order/amount.
- Webhook not testable on localhost; requires ngrok for real delivery.

---

## Current Database State
- `orders`: id, created_at, customer_name, customer_phone, wilaya, address, total_amount, status, payment_method, user_id, email, payment_status.
- `order_items`: id, order_id (FK), product_id (FK), quantity, price_at_purchase.
- `addresses`: id, user_id, full_name, phone, street, wilaya, commune, postal_code, is_default, created_at.
- `orders` policies: Users can view own orders, Users can update own pending orders, Admin can update orders. No public insert.
- `order_items` policies: Users can view own order items.
- `addresses` policy: Users can manage own addresses.

---

## Known Issues / Resolved
- Middleware not running in dev: use production build.
- Session not persisting: fixed with `createBrowserClient`.
- Email relay open: fixed.
- Duplicate policies: cleaned.
- Type mismatch order_items.product_id: fixed.
- Signup rate limit: resolved.
- Google Fonts fetch error: removed imports.
- Git push network failure: resolved.
- Order creation client-side: moved to server route.
- Stock overselling: fixed with atomic `FOR UPDATE` and aggregation.
- Duplicate product ID in cart: fixed by aggregation.
- order_items SELECT policy: added.
- Chargily amount format: corrected to plain DZD.
- Chargily webhook header/payload: fixed.
- `payment_status` column missing: added.
- Chargily API URL: test mode `/test/api/v2`.

## Environment
- Local dev on Kali Linux.
- Supabase project: modyvxdhongnkrwdnwhy
- Admin user: admin@mail (role admin)
- Normal users: USER1, USER2
- Remote: https://github.com/brainwash2/abc-store.git

## Verification Habits
- Always run SQL queries to confirm actual DB state.
- Use production build for middleware/session testing.
- Use incognito window to avoid stale cookies.
- Commit after each verified step.
