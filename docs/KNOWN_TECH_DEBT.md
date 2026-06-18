# Known Technical Debt

This document tracks intentional shortcuts taken during early product development.
Items in **Critical** must be resolved before a public beta.
Items marked **POST-BETA** are explicitly deferred and will not block the private beta.

---

## Critical (must fix before public launch)

### AUTH-04 — Resend SMTP delivery not verified end-to-end
**Impact:** Magic link email may fail silently in production if Resend SMTP is misconfigured.
**Status:** SMTP configuration documented in README. Must be manually verified per deployment.
**Fix:** Follow the Email / SMTP section in README. Confirm a live magic link arrives in your inbox before inviting beta users. Check Vercel logs for `[signIn] OTP send failed` if delivery fails.

---

## High (fix before user growth)

### RLS-01 — User-editable profile fields have no UPDATE policy
**Impact:** Migration 004 removed the broad `profiles: owner update` policy. The streak function (migration 005) handles system fields via SECURITY DEFINER. However, `display_name`, `locale`, and `timezone` cannot currently be updated by the user at all.
**Files:** `supabase/migrations/004_private_beta_hardening.sql`
**Fix:** Add a narrow UPDATE policy restricted to `(display_name, locale, timezone)` only. System fields are excluded by omission.

### DB-01 — Migrations must be applied in production
**Files:** `supabase/migrations/001` → `005`
**Fix:** Run all five migrations in Supabase SQL Editor in order. Migration 005 (`005_streak_function.sql`) is required for streak tracking — without it, every checkin logs `streak update failed` and streaks never increment. See the Production Smoke Test in README.

### DB-02 — RLS policies not verified end-to-end
**Impact:** All RLS policies were written at design time and have not been verified under a real authenticated session.
**Fix:** Complete the Production Smoke Test in README. Specifically verify that `reading_history: owner insert` succeeds when `drawCard()` runs.

### VERCEL-01 — Supabase redirect URL must match deployment URL exactly
**Impact:** Auth callback fails if `NEXT_PUBLIC_SITE_URL` does not match the Supabase Auth Site URL, or if the callback URL is not in the Redirect URLs allowlist.
**Fix:** In Supabase Auth → URL Configuration: set Site URL to the exact Vercel URL. Add `{NEXT_PUBLIC_SITE_URL}/auth/callback` to the Redirect URLs allowlist. Set the same value as `NEXT_PUBLIC_SITE_URL` in Vercel environment variables.

---

## Post-Beta (explicitly deferred — do not implement during private beta)

### DATA-03 — Weekly reflection not persisted  *(POST-BETA)*
**Impact:** `generateWeeklyReflection()` runs on every page load; result is never saved to `weekly_reflections` table. Adds latency; result is not cacheable.
**Priority:** Low during private beta — user base is small, latency is acceptable.
**Fix:** Upsert result to `weekly_reflections` after generation, keyed on `(user_id, week_start)`. Requires TZ-01 to be verified first.

### DATA-04 — Memory extraction not persisted  *(POST-BETA)*
**Impact:** `extractMemories()` runs on every page load from the last 50 journals and 50 checkins. Result is never saved to `user_memories`. Will degrade as data grows.
**Priority:** Low during private beta — user base is small.
**Fix:** Write extracted memories to `user_memories` after journal save, or in a background upsert on the memory page load.

### TZ-01 — Bangkok week-boundary not integration tested  *(POST-BETA)*
**Status:** `getWeekBounds()` derives day-of-week from UTC midnight reference. Must be verified before `weekly_reflections` rows are persisted (DATA-03).
**Fix:** Write an integration test: simulate a date at `23:55 UTC` on a Sunday and assert the bounds land on the correct Bangkok Monday.

---

## Medium (fix before retention features)

### COLL-01 — Collection depends on reading_history with 60-day retention
**Impact:** The card collection (seen/unseen state and encounter history) is derived from `reading_history`. If rows are purged after 60 days, long-term users will silently lose their encounter records — the collection will revert cards to unseen.
**Scope:** `app/(app)/collection/page.tsx`, `app/(app)/collection/[cardId]/page.tsx`
**Fix:** Introduce a `card_encounters` summary table tracking `(user_id, card_id, first_seen_at, last_seen_at, count)`. Increment on each draw. Collection UI reads from `card_encounters`, not raw `reading_history`.

### TYPE-01 — Database types are hand-maintained
**Impact:** `types/database.ts` is hand-written. When the Supabase CLI is wired (`supabase gen types typescript`), it will overwrite the file and custom blocks (including `weekly_reflections` and `update_streak_after_checkin`) must be re-added.
**Fix:** Once CLI is wired, move custom function types to `types/rpc.ts` (not overwritten by codegen).

### ADMIN-01 — Admin route must stay server-side
**Impact:** If any admin data-fetching logic is moved to a Client Component, credentials could leak to the browser.
**Fix:** Keep `app/admin/page.tsx` as a Server Component. Never add `"use client"` to it.

### DEMO-01 — Stale demo library files remain on disk
**Impact:** `lib/demo/` contains `dashboard.ts`, `history.ts`, `memory.ts`, `growth.ts`, `admin.ts`. These are no longer imported by any page. They add noise and could confuse future contributors.
**Fix:** Delete `lib/demo/` entirely. Update README project structure accordingly.

---

## Low (polish before public launch)

### UI-01 — Notification toggles are visual only
All toggle switches in profile and settings are decorative. No actual notification system exists. Labeled "เร็วๆ นี้" so users understand.

### UI-02 — Privacy policy and terms links are dead
Links in settings point to placeholder text. Real pages needed before public launch.

### UI-03 — Delete account and export data are disabled
No backend implementation. Users cannot currently delete or export their data. Contact info is provided as a workaround.

---

## Resolved

| Item | Resolution |
|---|---|
| DATA-01 — Profile page demo data | Profile page now uses real Supabase queries (email, streak, counts, member since). |
| DATA-02 — Card draw not persisted | `drawCard()` inserts into `reading_history`. If insert fails, redirect to `?error=draw` — card is never revealed without a persisted record. |
| UI-04 — Profile email shows demo value | Profile page now reads `user.email` from the auth session. |
| AUTH-05 — Raw error code in browser URL | `auth/callback/route.ts` now logs raw error server-side only; redirects with opaque `link_invalid` code. `auth.ts` already used opaque codes. Login page maps all codes to friendly Thai. |
| PREVIEW-01 — `/preview` was publicly accessible | `/preview` now requires `FOUNDER_EMAIL` authentication, same gate as `/admin`. |
