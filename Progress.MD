# ABC Store — Refactor Progress

## Project Overview
Next.js + Supabase e-commerce app for Algerian electronics retailer, evolving to multi-vendor marketplace. Stack: Next.js (App Router), TypeScript, Tailwind, Supabase (Postgres + Auth + Storage).

## Goals
- Security: Row Level Security, role-based admin access, server-side write validation.
- SEO: Product metadata and JSON-LD.
- Regional: 69 wilayas, real address management.
- Payments: COD + Chargily (later).
- Marketplace: sellers, order_items, payouts (later).

---

## Week 1 — Security & SEO (COMPLETE)

### Priority 0: Email relay security
- Fixed open email relay in `/api/emails/send`.
- Replaced direct `Resend` client instantiation with lazy init.
- Added auth check via `@supabase/ssr` server client.
- Verified: logged-out returns 401, logged-in with own order returns 200, other user's order returns 403.
- Committed.

### Day 1: Database & RLS
- Created `profiles` table with role (customer/seller/admin), RLS enabled.
- Created `handle_new_user` trigger to auto-create profile on signup.
- Created `prevent_role_change` trigger to block role changes except service_role.
- Created `is_admin()` Postgres function.
- Enabled RLS on all public tables (products, orders, order_items, posts, subscribers).
- Dropped duplicate/insecure policies.
- Fixed `order_items.product_id` type from uuid to bigint, set `order_id` and `product_id` NOT NULL.
- Created new policies using `is_admin()` and `auth.uid()`.
- Seeded admin role.
- Verified policies and column types.
- Committed migration file `supabase/migrations/0001_week1_security_seo.sql`.

### Day 2: Middleware
- Migrated to `@supabase/ssr` in `middleware.ts`.
- Used `rpc('is_admin')` for admin check.
- Removed client-side admin email check.
- Verified logged-out, normal user, admin redirects.
- Fixed Turbopack middleware not running in dev by testing in production mode.
- Applied cookie-transplant fix on redirects.
- Committed.

### Day 3: Client Supabase migration & remaining admin checks
- Replaced `src/lib/supabase.ts` with `createBrowserClient` from `@supabase/ssr`.
- Fixed login persistence and middleware session visibility.
- Updated `login/page.tsx` and `Header.tsx` to query `profiles` role.
- Verified no admin link for normal user, admin link for admin.
- Committed.

### Day 4: RLS policies cleanup
- Verified no duplicate policies left.
- `order_items` initially had zero policies (locked down until Week 2).
- All RLS enabled.

### Day 5: Product SEO & wilayas
- Replaced `product-details/[id]/page.tsx` with server component.
- Added `generateMetadata` and JSON-LD Product schema.
- Updated `DeliverySection.tsx` wilaya list to 69 wilayas.
- Verified SEO tags and 69 options.
- Committed.

### Week 1 Final
- All changes committed and pushed to GitHub.
- `Progress.MD` created.
- Migration file committed.

---

## Week 2 — Server-side Writes & Addresses (COMPLETE)

### Step 1: Addresses table
- Created `addresses` table with RLS.
- Policy: "Users can manage own addresses".
- Verified.

### Step 2: Real address management
- Replaced mock addresses with real fetch and save to Supabase.
- Verified multiple addresses persist.

### Step 3: Use selected address in order creation
- Updated `CheckoutInteractive` to use selected address fields.
- Verified order row contains real address data.

### Step 4: Server-side order creation + order_items
- Added `SUPABASE_SERVICE_ROLE_KEY`.
- Created `src/lib/supabase-admin.ts`.
- Created `src/app/api/orders/route.ts`:
  - Authenticates via `@supabase/ssr`.
  - Calls `create_order()` SQL function using service role.
  - Strips client-sent price/title; only sends `id` and `quantity`.
  - Returns `orderId` and `total`.
- Created Postgres function `create_order()`:
  - Atomic transaction with `FOR UPDATE` row locks.
  - Aggregates duplicate product IDs in cart before stock check.
  - Validates address ownership inside function.
  - Fetches real product prices.
  - Computes delivery/tax/total server-side.
  - Inserts into `orders` and `order_items`.
  - Decrements stock.
  - Restricted execute to `service_role`.
- Verified:
  - POST `/api/orders` returns 200 and real total.
  - No direct POST to Supabase `/rest/v1/orders`.
  - Duplicate product IDs in a crafted request aggregated correctly.
  - Stock decremented correctly.
  - Normal UI order still works.

### Step 5: Order details & user orders migration to order_items
- Added foreign keys on `order_items` (order_id cascade, product_id restrict).
- Added SELECT policy "Users can view own order items" scoped to order owner or admin.
- Replaced `order-details/page.tsx` to read from `order_items` joined with `products`.
- Replaced `user/page.tsx` and `user/orders/page.tsx` to fetch order items with product info.
- Verified:
  - Order details page shows product name, image, quantity, line total.
  - `/user/orders` and `/user` show product thumbnails.
  - No "Détails des articles non disponibles" when items exist.

### Step 6: Drop legacy orders.items column
- Dropped `orders.items` after pages migrated.
- Verified column removed; orders table now has only normalized fields.
- Placed a final test order successfully.

### Current Database State
- `orders`: id, created_at, customer_name, customer_phone, wilaya, address, total_amount, status, payment_method, user_id, email. No `items` column.
- `order_items`: id, order_id (FK to orders), product_id (FK to products), quantity, price_at_purchase.
- `addresses`: id, user_id, full_name, phone, street, wilaya, commune, postal_code, is_default, created_at.
- `orders` policies: Admin can update orders, Users can update own pending orders, Users can view own orders. No public insert.
- `order_items` policies: Users can view own order items.

### Week 2 Final
- All changes committed to git.
- Pending push to remote? (confirm after commit)
- Ready for Week 3.

---

## Known Issues / Resolved
- Middleware not running in dev: use production build.
- Session not persisting: fixed with `createBrowserClient`.
- Email relay open: fixed.
- Duplicate policies: cleaned.
- Type mismatch `order_items.product_id`: fixed.
- Signup rate limit: resolved by waiting or dashboard user creation.
- Google Fonts fetch error: removed imports.
- Git push network failure: resolved.
- Order creation client-side: moved to server route.
- Stock overselling risk: fixed with atomic `FOR UPDATE` and aggregation.
- Duplicate product ID in cart: fixed by aggregating before check.
- order_items had no SELECT policy: added "Users can view own order items".

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
