# ABC Store — Refactor Progress

## Project Overview
Next.js + Supabase e-commerce app for Algerian electronics retailer, evolving to multi-vendor marketplace. Stack: Next.js (App Router), TypeScript, Tailwind, Supabase (Postgres + Auth + Storage).

## Goals
- Security: Row Level Security, role-based admin access, server-side write validation.
- SEO: Product metadata and JSON-LD.
- Regional: 69 wilayas, real address management.
- Payments: COD + Chargily.
- Marketplace: sellers, order_items, payouts.

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
- Created `addresses` table with `Users can manage own addresses` policy.
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

## Week 3 — Chargily Pay Integration (COMPLETE)

### Chargily keys & env
- Added `CHARGILY_SECRET_KEY` and `CHARGILY_WEBHOOK_SECRET`.

### Checkout creation
- Created `/api/chargily/create-checkout`:
  - Authenticates via @supabase/ssr.
  - Calls `create_order()` with `payment_method='chargily'`.
  - Fetches order total.
  - Sends to Chargily test endpoint with correct amount, currency `dzd`.
  - Removed `webhook_url`.
- Verified redirect to Chargily test payment page.

### Webhook
- Created `/api/chargily/webhook`:
  - Correct header `signature`.
  - Parses event shape `{ type: "checkout.paid", data: { ... } }`.
  - Timing-safe HMAC comparison.
  - Mandatory webhook secret.
  - Updates order to confirmed/paid.
- Added `payment_status` column to `orders`.
- Added check constraint on `payment_status`.
- End-to-end webhook verified via ngrok: order updated to confirmed/paid.

### Abandoned order cleanup
- Enabled `pg_cron`.
- Created cleanup function for pending Chargily orders older than 60 minutes.
- Scheduled every 10 minutes.

### Baridi Mob
- Removed to prevent unpaid stock lock.

---

## Week 4 — Marketplace Schema & Seller Dashboard (COMPLETE)

### Marketplace schema
- Created `sellers` table with KYC fields, commission_rate, is_active.
- Added `seller_id` to `products`.
- Added `seller_id` and `user_id` to `order_items` (snapshot for historical accuracy).
- Created `payouts` table.
- Added RLS policies:
  - Sellers can view/update own profile (except sensitive fields protected by trigger).
  - Admin can view all sellers.
  - Public can view approved sellers.
  - Sellers can insert/update/delete own products only if approved/active.
  - Sellers can view own order items.
  - Sellers can view orders containing their items.
- Created `prevent_seller_status_change` trigger.
- Created `approve_seller` and `reject_seller` functions (service_role only).
- Backfilled `user_id` on existing order_items and fixed RLS recursion.

### Seller dashboard UI
- `/seller/apply` – application form with check-first logic (uses `.maybeSingle()`).
- `/seller` – dashboard home showing store name/KYC status.
- `/seller/products` – list and delete own products.
- `/seller/products/add` – add product with category select.
- `/seller/orders` – list orders containing seller's items (grouped client-side).
- `/seller/payouts` – placeholder, will be populated in Week 5.
- Admin sellers page at `/admin/sellers` with approve/reject actions.
- API route `/api/admin/sellers` for admin actions.

### Testing
- Local: all seller flow tests passed (apply, approve, dashboard, add product, customer order, seller orders, reject redirect).
- Live smoke test passed: homepage, admin, rejected seller redirect, seller apply, product SEO.
- Known issue: live session drops when navigating to `/user/orders` via header link; direct URL works. Deferred to Week 6 hardening.

---

## Week 5 — Payouts & Seller Data Scoping (NEXT)

Planned:
- `generate_payouts` SQL function to calculate seller payouts based on paid orders.
- Admin payouts page and API route to trigger generation.
- Seller payouts page showing real data.
- Multi-seller order visibility tightening (deferred to Week 6 if time-constrained, but noted for real third-party sellers).

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
- `payment_status` column missing: added with check constraint.
- Chargily API URL: test mode `/test/api/v2`.
- Live Vercel: session drops when navigating to /user/orders from header. Direct URL works. Defer to Week 6.

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
