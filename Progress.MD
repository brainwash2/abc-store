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
- **Fixed open email relay** in `/api/emails/send`.
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
- Dropped duplicate/insecure policies (list of old policies recorded).
- Fixed `order_items.product_id` type from uuid to bigint, set `order_id` and `product_id` NOT NULL.
- Created new policies using `is_admin()` and `auth.uid()`.
- Seeded admin role for admin user.
- Verified: `pg_policies` shows only intended policies; `order_items` columns correct.
- Committed migration file `supabase/migrations/0001_week1_security_seo.sql`.

### Day 2: Middleware
- Migrated to `@supabase/ssr` in `middleware.ts`.
- Used `rpc('is_admin')` for admin check.
- Removed client-side admin email check from `admin/layout.tsx`.
- Verified: logged-out /admin redirects to /login, normal user redirected to /user/dashboard, admin can access.
- Discovered and fixed Turbopack middleware not running in dev mode: use production mode for testing.
- Applied cookie-transplant fix on redirects (from Claude's research).
- Committed.

### Day 3: Client Supabase migration & remaining admin checks
- Replaced `src/lib/supabase.ts` with `createBrowserClient` from `@supabase/ssr` to store session in cookies.
- This fixed login persistence and middleware seeing session.
- Updated `login/page.tsx` and `Header.tsx` to query `profiles` role directly (client-side).
- Verified: normal user no admin link, admin has admin link.
- Committed.

### Day 4: RLS policies cleanup (part of Day 1 block)
- Verified no duplicate policies left.
- `order_items` has zero policies (intentional locked-down until Week 2).
- All RLS enabled.

### Day 5: Product SEO & wilayas
- Replaced `product-details/[id]/page.tsx` with server component.
- Added `generateMetadata` and JSON-LD Product schema.
- Updated `DeliverySection.tsx` wilaya list to 69 wilayas (including new Loi 26-06 additions).
- Verified: product page source shows title/meta/JSON-LD; wilaya dropdown shows 69 options.
- Committed.

### Week 1 Final
- All changes committed and pushed to GitHub (origin).
- `Progress.MD` created (this file).
- Migration file committed as history.

---

## Week 2 — Server-side Writes & Addresses (IN PROGRESS)

### Step 1: Addresses table
- Created `addresses` table with RLS, linked to `auth.users`.
- Policy: "Users can manage own addresses".
- Verified: table created, policy present.

### Step 2: Real address management in checkout
- Replaced mock address list in `CheckoutInteractive.tsx` with real fetch from `addresses`.
- Updated `DeliverySection.tsx` to accept real addresses, controlled form, save new address to Supabase.
- Verified: normal user can add address, persists after refresh, multiple addresses possible.

### Step 3 (PENDING): Use selected address in order creation
- Need to run provided `cat` command for `CheckoutInteractive.tsx` to use selected address fields.
- Not yet executed.

### Next Steps in Week 2
- Move order creation to server route `/api/orders` (replace direct client insert).
- Start writing to `order_items` instead of `orders.items`.
- Remove temporary public insert policy on `orders` and replace with authenticated insert.
- Deprecate `orders.items` JSON column.
- Update order details and user orders pages to read from `order_items`.

---

## Known Issues / Resolved
- **Middleware not running in dev mode**: solved by using production build (`npm run build && npm run start`) for testing.
- **Session not persisting after login**: fixed by using `createBrowserClient` from `@supabase/ssr`.
- **Email relay open**: fixed with auth + order ownership check.
- **Duplicate policies**: all cleaned.
- **Type mismatch (order_items.product_id)**: fixed to bigint.
- **Supabase signup rate limit**: resolved by waiting or using dashboard user creation.
- **Google Fonts fetch error in build**: removed Google Fonts imports from layout/globals.
- **Git push network failure**: resolved; remote configured, credentials stored.

## Environment
- Local dev on Kali Linux.
- Supabase project: ..........
- Admin user: admin@mail (role admin)
- Normal users: USER1 , USER2 
- Remote: https://github.com/brainwash2/abc-store.git

## Verification Habits
- Always run SQL queries to confirm actual DB state.
- Use production build for middleware/session testing.
- Use incognito window to avoid stale cookies.
- Commit after each verified step.
