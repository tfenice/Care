# Known Technical Debt

This document tracks intentional shortcuts taken during early product development.
All items below must be resolved before a public beta or production launch.

---

## Critical (must fix before launch)

### AUTH-01 — Auth guards removed from all routes
**Impact:** Any user can access any route without logging in.
**Files:** `middleware.ts`, `app/(app)/layout.tsx`, all Server Actions
**Fix:** Restore `getUser()` check in middleware; redirect unauthenticated users to `/login`

### AUTH-02 — Server Actions do not verify session
**Impact:** All mutation actions (checkin, journal, cards) accept requests without a valid session.
**Files:** `lib/actions/checkin.ts`, `lib/actions/journal.ts`, `lib/actions/cards.ts`
**Fix:** Add `const { data: { user } } = await supabase.auth.getUser()` at top of every action; return error if `!user`

### AUTH-03 — Admin route is unprotected
**Impact:** `/admin` is publicly accessible.
**Files:** `app/admin/page.tsx`
**Fix:** Add middleware rule to gate `/admin` to a specific founder email only, return 404 or redirect otherwise

### AUTH-04 — Resend SMTP 500 error unresolved
**Impact:** Magic link email delivery fails in production.
**Status:** User manually paused this to continue building. Supabase returns `AuthRetryableFetchError|500|{}` when calling `/auth/v1/otp`
**Fix:** In Resend dashboard, verify sender domain is fully verified AND API key has "Sending access". SMTP host: `smtp.resend.com`, port 465, user: `resend`, password: API key, sender must be a verified domain.

---

## High (fix before user growth)

### DATA-01 — All pages display demo data
**Impact:** Nothing shown is real user data. Every page returns hardcoded demo values.
**Files:** `app/(app)/page.tsx`, `app/(app)/growth/page.tsx`, `app/(app)/memory/page.tsx`, `app/(app)/profile/page.tsx`, `app/(app)/history/page.tsx`, `app/admin/page.tsx`
**Fix:** Replace each `DEMO` constant and `getDemoXxx()` function with user-scoped Supabase queries using the authenticated user's ID

### DATA-02 — Server Actions redirect without DB writes
**Impact:** Check-ins, journals, and card draws are not persisted to Supabase.
**Files:** `lib/actions/checkin.ts`, `lib/actions/journal.ts`, `lib/actions/cards.ts`
**Fix:** Restore real `supabase.from('daily_checkins').insert(...)` calls after auth is restored

### DATA-03 — Weekly reflection not persisted
**Impact:** `generateWeeklyReflection()` runs on every page load; result is never saved to `weekly_reflections` table.
**Fix:** Upsert result to `weekly_reflections` after generation, and load from DB on subsequent views

### DATA-04 — Memory extraction not persisted
**Impact:** `extractMemories()` runs on every page load; result is never saved to `user_memories` table.
**Fix:** Write extracted memories to `user_memories` table after journal save or on a periodic basis

---

## Medium (fix before retention features)

### TYPE-01 — weekly_reflections missing from Supabase CLI codegen
**Impact:** `types/database.ts` is hand-maintained. When the Supabase CLI is set up (`supabase gen types typescript`), it will overwrite the file and `weekly_reflections` must be re-added (or ideally auto-generated).
**Files:** `types/database.ts`, `supabase/migrations/003_weekly_reflections.sql`
**Status:** Table definition hand-written and correct. Once the CLI is wired up, delete the hand-written block and let codegen own the file.

### DEMO-01 — demo fixtures at lib/demo/* must be replaced with real queries
**Impact:** All pages import from `lib/demo/`. When auth is restored, each import must be replaced with a user-scoped Supabase query that filters by the authenticated `user_id`.
**Files:** `lib/demo/dashboard.ts`, `lib/demo/memory.ts`, `lib/demo/growth.ts`, `lib/demo/admin.ts`, `lib/demo/history.ts`
**Fix:** In Launch Hardening Sprint, delete `lib/demo/` and replace every import site with a real fetch. Each fixture file has a "Demo-only until Launch Hardening Sprint" comment marking the replacement point.

### TZ-01 — Bangkok week-boundary must be verified before persistence
**Status:** `getWeekBounds()` in `lib/services/weeklyReflection.ts` was fixed to derive day-of-week from `bangkokDate + 'T00:00:00Z'` via `getUTCDay()` — server-local timezone no longer affects the result. The fix must be verified end-to-end with real Bangkok timestamps before `weekly_reflections` rows are persisted.
**Files:** `lib/services/weeklyReflection.ts` (`getWeekBounds`, `getPreviousWeekBounds`)
**Fix:** When wiring real data, write an integration test: simulate a date at `23:55 UTC` on a Sunday and assert the bounds land on the correct Bangkok Monday.

### ADMIN-01 — Admin route must remain server-side only
**Impact:** If any admin data-fetching logic is moved to a Client Component, service-role credentials could be bundled into the browser.
**Files:** `app/admin/page.tsx`
**Fix:** Keep `app/admin/page.tsx` as a Server Component. Never add `"use client"` to it or import admin queries from Client Components. Service role access belongs only in Server Components, Server Actions, or Route Handlers.

### DB-01 — Migration 003 not run in production
**File:** `supabase/migrations/003_weekly_reflections.sql`
**Fix:** Run in Supabase SQL Editor or via `supabase db push`

### DB-02 — RLS review required
**Impact:** All RLS policies were written at design time and have not been verified end-to-end under a real authenticated session.
**Fix:** Run integration test: sign in as real user, verify SELECT/INSERT/UPDATE policies for each table

### VERCEL-01 — Supabase redirect URL may be wrong
**Impact:** Auth callback may fail if `NEXT_PUBLIC_SITE_URL` doesn't match Vercel deployment URL.
**Fix:** In Supabase Auth settings, set `Site URL` to `https://your-vercel-domain.vercel.app` and add `https://your-vercel-domain.vercel.app/auth/callback` to Redirect URLs

---

## Low (polish before launch)

### UI-01 — Notification toggles are static
All toggle switches in profile and settings are visual only. No actual notification system exists.

### UI-02 — Privacy policy and terms links go to `/`
Links in profile and settings point to the homepage. Real pages needed before launch.

### UI-03 — Delete account and export data are disabled placeholders
No backend implementation exists. Users cannot currently delete their account or export data.

### UI-04 — Profile email shows demo value
The profile page shows `demo@care.app`. Must read from auth session when auth is restored.

---

## Out of scope (intentionally not built)

- AI chat / OpenAI API integration
- Push notifications
- Social features
- Billing / subscriptions
- Avatar upload
- i18n (English) — Thai-first throughout
