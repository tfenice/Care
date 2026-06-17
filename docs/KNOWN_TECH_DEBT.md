# Known Technical Debt

This document tracks intentional shortcuts taken during early product development.
Items in **Critical** and **High** must be resolved before a public beta.

---

## Critical (must fix before public launch)

### AUTH-04 — Resend SMTP 500 error unresolved
**Impact:** Magic link email delivery fails in production.
**Status:** User manually paused this to continue building. Supabase returns `AuthRetryableFetchError|500|{}` when calling `/auth/v1/otp`
**Fix:** In Resend dashboard, verify sender domain is fully verified AND API key has "Sending access". SMTP host: `smtp.resend.com`, port 465, user: `resend`, password: API key, sender must be a verified domain.

### AUTH-05 — Login error messages expose raw Supabase error strings
**Impact:** When `signIn()` fails, the raw error message (including Supabase internal error names and status codes) is forwarded to the browser via the `?error=` query param and rendered in the login form. This leaks internal implementation details.
**Files:** `lib/actions/auth.ts`, `app/(auth)/login/page.tsx`
**Fix:** Map known error types to user-facing Thai messages; log the raw error server-side only.

---

## High (fix before user growth)

### DATA-01 — Most pages display demo data
**Impact:** Nothing shown is real user data. Every page returns hardcoded demo values.
**Files:** `app/(app)/page.tsx`, `app/(app)/growth/page.tsx`, `app/(app)/memory/page.tsx`, `app/(app)/profile/page.tsx`, `app/(app)/history/page.tsx`, `app/admin/page.tsx`
**Fix:** Replace each `DEMO` constant with user-scoped Supabase queries using the authenticated user's ID.

### DATA-02 — Card draw is not persisted
**Impact:** `drawCard()` does not insert a `reading_history` row — the drawn card is hardcoded demo content.
**Files:** `lib/actions/cards.ts`
**Note:** `daily_checkins` and `journal_entries` inserts are now wired (Launch Hardening Sprint).
**Fix:** Implement card selection query (prefer unseen cards, fallback to oldest-seen) and insert `reading_history` row scoped to `user.id`.

### DATA-03 — Weekly reflection not persisted
**Impact:** `generateWeeklyReflection()` runs on every page load; result is never saved to `weekly_reflections` table.
**Fix:** Upsert result to `weekly_reflections` after generation, and load from DB on subsequent views.

### DATA-04 — Memory extraction not persisted
**Impact:** `extractMemories()` runs on every page load; result is never saved to `user_memories` table.
**Fix:** Write extracted memories to `user_memories` table after journal save or on a periodic basis.

---

## Medium (fix before retention features)

### RLS-01 — Profile system fields have no write protection
**Impact:** The `profiles: owner update` RLS policy was removed in migration 004 (no current feature requires client-side profile updates). However, when streak tracking and profile editing are implemented, system fields (`current_streak`, `longest_streak`, `last_checkin_date`) must be protected from direct client writes.
**Files:** `supabase/migrations/004_private_beta_hardening.sql`
**Fix:** When streak tracking is added:
  1. Create a `SECURITY DEFINER` function that updates streak fields — this bypasses RLS and runs as a trusted role.
  2. Add back a narrowed UPDATE policy that allows only user-editable fields (`display_name`, `locale`, `timezone`).

### TYPE-01 — weekly_reflections missing from Supabase CLI codegen
**Impact:** `types/database.ts` is hand-maintained. When the Supabase CLI is set up (`supabase gen types typescript`), it will overwrite the file and `weekly_reflections` must be re-added.
**Files:** `types/database.ts`, `supabase/migrations/003_weekly_reflections.sql`
**Fix:** Once CLI is wired, delete the hand-written block and let codegen own the file.

### DEMO-01 — demo fixtures at lib/demo/* must be replaced with real queries
**Impact:** All pages import from `lib/demo/`. When real data queries are wired, each import must be replaced with a user-scoped Supabase query filtered by the authenticated `user_id`.
**Files:** `lib/demo/dashboard.ts`, `lib/demo/memory.ts`, `lib/demo/growth.ts`, `lib/demo/admin.ts`, `lib/demo/history.ts`

### TZ-01 — Bangkok week-boundary must be verified before persistence
**Status:** `getWeekBounds()` was fixed to derive day-of-week from UTC midnight reference. Must be verified end-to-end with real Bangkok timestamps before `weekly_reflections` rows are persisted.
**Fix:** Write an integration test: simulate a date at `23:55 UTC` on a Sunday and assert the bounds land on the correct Bangkok Monday.

### ADMIN-01 — Admin route must remain server-side only
**Impact:** If any admin data-fetching logic is moved to a Client Component, service-role credentials could be bundled into the browser.
**Fix:** Keep `app/admin/page.tsx` as a Server Component. Never add `"use client"` to it.

### DB-01 — Migrations 003 and 004 not run in production
**Files:** `supabase/migrations/003_weekly_reflections.sql`, `supabase/migrations/004_private_beta_hardening.sql`
**Fix:** Run both in Supabase SQL Editor or via `supabase db push`.

### DB-02 — RLS review required
**Impact:** All RLS policies were written at design time and have not been verified end-to-end under a real authenticated session.
**Fix:** Run integration test: sign in as real user, verify SELECT/INSERT policies for each table.

### VERCEL-01 — Supabase redirect URL may be wrong
**Impact:** Auth callback fails if `NEXT_PUBLIC_SITE_URL` doesn't match Vercel deployment URL or is missing from Supabase Auth → Redirect URLs.
**Fix:** In Supabase Auth settings, set Site URL and add `{NEXT_PUBLIC_SITE_URL}/auth/callback` to Redirect URLs list.

---

## Low (polish before launch)

### UI-01 — Notification toggles are static
All toggle switches in profile and settings are visual only. No actual notification system exists.

### UI-02 — Privacy policy and terms links go to `/`
Links in profile and settings point to the homepage. Real pages needed before launch.

### UI-03 — Delete account and export data are disabled placeholders
No backend implementation exists. Users cannot currently delete their account or export data.

### UI-04 — Profile email shows demo value
The profile page shows `demo@care.app`. Must read from auth session when real data queries are wired.

---

## Out of scope (intentionally not built)

- AI chat / OpenAI API integration
- Push notifications
- Social features
- Billing / subscriptions
- Avatar upload
- i18n (English) — Thai-first throughout
