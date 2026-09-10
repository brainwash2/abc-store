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
- End-to-end webhook verified: order updated to confirmed/paid.

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
- `/seller/apply` – application form with check-first logic.
- `/seller` – dashboard home showing store name/KYC status.
- `/seller/products` – list and delete own products.
- `/seller/products/add` – add product with category select.
- `/seller/orders` – list orders containing seller's items.
- `/seller/payouts` – shows payouts.
- Admin sellers page at `/admin/sellers` with approve/reject actions.
- API route `/api/admin/sellers` for admin actions.

### Testing
- Local: all seller flow tests passed.
- Live smoke test passed.

---

## Week 5 — Payouts (COMPLETE)

### Payout system
- Added `payout_id` to `order_items` for claim-based idempotency.
- Created `generate_payouts(p_start, p_end)` function:
  - Inserts placeholder payout row first (satisfies FK).
  - Atomically claims eligible `order_items` via `UPDATE ... RETURNING`.
  - Computes payout amount from claimed lines only.
  - Supports COD (`payment_method='cash_delivery'` and `status='delivered'`) and Chargily (`payment_status='paid'`).
  - Deletes placeholder if no items claimed.
- Created `mark_payout_paid(p_payout_id)` function (service_role only, pending-only guard).
- Created admin API route `/api/admin/payouts`.
- Created admin payouts page and seller payouts page.

### Testing
- Verified payout generation for delivered COD order (amount = price × 0.9).
- Verified Chargily paid order included.
- Overlapping period test: no double payout.
- Mark paid: status `paid`, `paid_at` set.
- Seller sees own payout; admin sees all payouts.

---

## Week 6 — Hardening & Performance (COMPLETE)

### Session-drop fix
- Root cause: Next.js client router cache reusing stale prefetch redirect for protected routes.
- Fix: plain `<a>` tags for protected user links.
- Verified live.

### Rate limiting (Postgres, no Upstash)
- Created `rate_limits` table and `check_rate_limit` function (atomic upsert).
- Applied to `/api/orders`, `/api/emails/send`, `/api/chargily/create-checkout`, `/api/admin/sellers`, `/api/admin/payouts`.
- Fixed window bucketing bug (was bucketing by second regardless of window).

### Input validation
- Added Zod schemas.
- Applied to order, chargily, and email routes.

### Supabase Storage
- Created public bucket `product-images`.
- Created `/api/upload` route with file type/size validation and admin/seller role check.
- Verified upload works.

### Product form polish
- Created reusable `ImageUploader` component with drag-and-drop, preview.
- Duplicate feature with seller_id scoping.
- Error clearing on input.

### Cart leakage fix
- Cleared cart on logout in Header, UserLayout, AdminLayout.

### ISR
- Added `export const revalidate = 60` to product details page.

### RLS audit
- Re-ran `pg_policies`; all policies correctly scoped.

---

## Week 7 — End-to-End UAT (COMPLETE)

### Customer flow
- Registration/login, address, browse, COD checkout, Chargily checkout all passed.

### Seller flow
- Apply, approve, dashboard, products, orders, payouts all passed.
- Seller isolation verified.

### Admin flow
- Products, orders, blog, sellers, payouts all passed.

### Edge cases
- Rejected seller, unauthenticated access, cart leakage fixed, cart tab-close noted.

---

## Week 8 — Soft Launch Preparation (IN PROGRESS)

### Security hardening (post-Qwen audit)
- Removed temporary public insert policy on `orders`.
- Removed dangerous `Users can update own pending orders` policy.
- Added `force_seller_defaults` trigger (blocks self-approval on INSERT; sets `submitted`, `false`, `10.00`).
- Added `protect_order_fields` trigger (blocks changes to `total_amount`, `payment_status`, `user_id`, `payment_method`).
- Restored safe `Users can cancel own pending orders` policy.
- Ran exploit regression tests: anonymous insert fails; seller self-approval forced to safe values.

### Chargily env refactor
- Created `CHARGILY_API_BASE` env var (test vs live switch without code change).
- Removed `webhook_url` from per-checkout payload — Chargily V2 rejects it; webhook is account-level configured in dashboard.
- Verified working.

### Password reset flow
- `/forgot-password` uses `resetPasswordForEmail`.
- `/reset-password` uses `onAuthStateChange` to wait for `PASSWORD_RECOVERY` event (fixes race).
- Login page includes "Mot de passe oublié ?" link.
- Manual fallback documented in `BUSINESS_NOTES.md`.

### Signup friction removed
- Turned OFF "Confirm email" in Supabase Auth.
- Register page redirects directly to `/user/dashboard` when session exists.
- No more double login on signup.

### Admin dashboard real metrics
- Replaced fake revenue with real paid/delivered revenue.
- Added `Réconciliation Chargily` count from view.

### Middleware resilience
- Kept `getUser()` for real auth verification.
- Added retry with backoff for transient network failures.
- Fails closed (redirect to login) — never bypass.

### UI additions
- Seller link in header dropdown (visible to sellers and admins).
- Admin sidebar has Sellers and Payouts links.

### Documented limitations
- `BUSINESS_NOTES.md`: cart persistence across tab closes, manual password reset fallback.
- Email sending deferred until domain purchase; using WhatsApp/phone for order confirmations.

### Remaining before actual soft launch
- Purchase domain and verify in Resend (deferred).
- Switch `CHARGILY_API_BASE` to `https://pay.chargily.net/api/v2` and use live key.
- Final live smoke test on Vercel.
- Optional: UptimeRobot free monitoring.

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
- Chargily API URL: test mode via env var.
- Live Vercel session drop: fixed by plain anchors for protected user links.
- Commission rate snapshot: deferred.
- Product-catalog SEO gap: deferred.
- Cart leakage on logout: fixed.
- Cart persistence across tab closes: known limitation, documented.
- Signup redirected to login unnecessarily: fixed (direct dashboard redirect).
- Password reset race condition: fixed with `PASSWORD_RECOVERY` event.
- `webhook_url` in Chargily payload: removed (V2 API rejects it).
- Admin dashboard fake revenue: replaced with real metrics.
- Middleware transient fetch failures: retry with backoff, fail closed.

## Environment
- Local dev on Kali Linux.
- Supabase project: modyvxdhongnkrwdnwhy
- Admin user: admin@mail (role admin)
- Normal users: USER1, USER2
- Remote: https://github.com/brainwash2/abc-store.git
- Live site: https://abc-store-seven.vercel.app

## Verification Habits
- Always run SQL queries to confirm actual DB state.
- Use production build for middleware/session testing.
- Use incognito window to avoid stale cookies.
- Commit after each verified step.
- Run exploit regression tests after any security-related change.
