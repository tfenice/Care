# Known Technical Debt

This document tracks intentional shortcuts taken during early product development.
Items in **Critical** and **High** must be resolved before a public beta.

---

## Critical (must fix before public launch)

### AUTH-04 — Resend SMTP 500 error unresolved
**Impact:** Magic link email delivery fails in production.
**Status:** Supabase returns `AuthRetryableFetchError|500|{}` when calling `/auth/v1/otp`.
**Fix:** In Resend dashboard, verify sender domain is fully verified AND API key has "Sending access". SMTP host: `smtp.resend.com`, port 465, user: `resend`, password: API key, sender must be a verified domain.

### AUTH-05 — Raw Supabase error code visible in browser URL
**Impact:** When `signIn()` fails, the raw error string (e.g. `SEND:AuthRetryableFetchError|500|{}`) is forwarded via `?error=` and is visible in the address bar, even though the page renders a friendly Thai message.
**Files:** `lib/actions/auth.ts`
**Fix:** Log raw error server-side only. Redirect with a short opaque code (`?error=send_failed`) instead of the raw string.

---

## High (fix before user growth)

### DATA-03 — Weekly reflection not persisted
**Impact:** `generateWeeklyReflection()` runs on every page load; result is never saved to `weekly_reflections` table. Adds latency; result is never cacheable.
**Fix:** Upsert result to `weekly_reflections` after generation, keyed on `(user_id, week_start)`.

### DATA-04 — Memory extraction not persisted
**Impact:** `extractMemories()` runs on every page load from the last 50 journals and 50 checkins. Result is never saved to `user_memories`. Will degrade as data grows.
**Fix:** Write extracted memories to `user_memories` after journal save, or in a background upsert on the memory page load.

### RLS-01 — User-editable profile fields have no UPDATE policy
**Impact:** Migration 004 removed the broad `profiles: owner update` policy. The streak function (migration 005) handles system fields via SECURITY DEFINER. However, `display_name`, `locale`, and `timezone` cannot currently be updated by the user at all.
**Files:** `supabase/migrations/004_private_beta_hardening.sql`
**Fix:** Add a narrow UPDATE policy restricted to `(display_name, locale, timezone)` only. System fields are excluded by omission.

### DB-01 — Migrations 003, 004, and 005 not applied in production
**Files:** `supabase/migrations/003_weekly_reflections.sql`, `supabase/migrations/004_private_beta_hardening.sql`, `supabase/migrations/005_streak_function.sql`
**Fix:** Run all three in Supabase SQL Editor or via `supabase db push`. **005 is required for streak tracking to work.**

### DB-02 — RLS policies not verified end-to-end
**Impact:** All RLS policies were written at design time and have not been verified under a real authenticated session.
**Fix:** Sign in as a real user; verify SELECT/INSERT policies for each table. Especially verify that `reading_history: owner insert` allows the drawCard action to succeed.

### VERCEL-01 — Supabase redirect URL must be configured
**Impact:** Auth callback fails if `NEXT_PUBLIC_SITE_URL` doesn't match the Vercel deployment URL or is missing from Supabase Auth → Redirect URLs.
**Fix:** In Supabase Auth settings, set Site URL and add `{NEXT_PUBLIC_SITE_URL}/auth/callback` to the Redirect URLs allowlist.

---

## Medium (fix before retention features)

### TYPE-01 — Database types are hand-maintained
**Impact:** `types/database.ts` is hand-written. When the Supabase CLI is set up (`supabase gen types typescript`), it will overwrite the file and the hand-written blocks (including `weekly_reflections` and the `Functions` entry for `update_streak_after_checkin`) must be re-added.
**Files:** `types/database.ts`
**Fix:** Once CLI is wired, delete hand-written blocks and let codegen own the file. Add custom function types in a separate `types/rpc.ts` that is not overwritten.

### TZ-01 — Bangkok week-boundary not integration tested
**Status:** `getWeekBounds()` derives day-of-week from UTC midnight reference. Must be verified end-to-end with real Bangkok timestamps before `weekly_reflections` rows are persisted.
**Fix:** Write an integration test: simulate a date at `23:55 UTC` on a Sunday and assert the bounds land on the correct Bangkok Monday.

### ADMIN-01 — Admin route must stay server-side
**Impact:** If any admin data-fetching logic is moved to a Client Component, credentials could leak to the browser.
**Fix:** Keep `app/admin/page.tsx` as a Server Component. Never add `"use client"` to it. Enforce via code review.

### DEMO-01 — Stale demo library files remain on disk
**Impact:** `lib/demo/` contains `dashboard.ts`, `history.ts`, `memory.ts`, `growth.ts`, `admin.ts`. These are no longer imported by any page. They add noise and could confuse future contributors.
**Fix:** Delete `lib/demo/` entirely.

---

## Low (polish before launch)

### UI-01 — Notification toggles are visual only
All toggle switches in profile and settings are decorative. No actual notification system exists. Labeled "เร็วๆ นี้" so users understand.

### UI-02 — Privacy policy and terms links are dead
Links in settings point to placeholder text. Real pages needed before public launch.

### UI-03 — Delete account and export data are disabled
No backend implementation. Users cannot currently delete or export their data. Contact info is provided as a workaround.

---

## Resolved (removed from active tracking)

| Item | Resolution |
|---|---|
| DATA-01 — Profile page demo data | Profile page now uses real Supabase queries (email, streak, counts, member since). |
| DATA-02 — Card draw not persisted | `drawCard()` inserts into `reading_history` with error logging. Resolved in launch hardening sprint. |
| UI-04 — Profile email shows demo value | Profile page now reads `user.email` from the auth session. |
