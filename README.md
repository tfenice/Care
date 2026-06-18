# Care

A quiet daily check-in app for emotional wellbeing. Built with Next.js 16 and Supabase.

## Features

- Magic-link authentication (no passwords)
- Daily mood check-in with optional note
- Ritual reflection card drawn after each check-in
- Journal entry tied to the day's card
- 30-day history view with streaks

## Local Setup

**Prerequisites:** Node.js 20+, a Supabase project

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the env template and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public | Required |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL, e.g. `https://care.vercel.app` | For local dev: `http://localhost:3000` |
| `FOUNDER_EMAIL` | Your personal email | Required to access `/admin` and `/preview` — see security note below |

**NEXT_PUBLIC_SITE_URL** is used to build the magic-link redirect URL. It must exactly match what Supabase sends users to after clicking the email link. Set it to `http://localhost:3000` for local development.

**FOUNDER_EMAIL** is checked server-side on every request to `/admin` and `/preview`. It is never exposed to the browser. Do not commit it to git — set it only in your Vercel dashboard.

3. Run the database migrations **in order** in the Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_profiles_insert_policy.sql
supabase/migrations/003_weekly_reflections.sql
supabase/migrations/004_private_beta_hardening.sql
supabase/migrations/005_streak_function.sql        ← required for streak tracking
```

4. Seed the ritual card deck:

```
supabase/seed_production.sql
```

Verify: `card_categories` has 4 rows, `ritual_cards` has 40 rows.

5. Configure Supabase Auth redirect URL:

In the Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

6. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (auth)/login/       Magic-link login
  (app)/checkin/      Daily mood check-in
  (app)/cards/        Ritual card draw
  (app)/journal/      Daily journal entry
  (app)/history/      30-day history view
  (app)/growth/       Streak + mood timeline
  (app)/memory/       Care's pattern observations
  (app)/profile/      Account and stats (Your Book)
  (app)/settings/     Privacy and preferences
  admin/              Founder-only analytics
  preview/            Card system visual specification (founder-only)
lib/actions/          Server Actions (auth, checkin, cards, journal)
lib/supabase/         Supabase client helpers (server + browser)
lib/services/         Deterministic engines (reflection, memory extractor)
lib/utils.ts          Shared utilities (Bangkok date, UUID, card code, excerpt)
lib/card-domain.ts    Card domain utilities (id validation, code formatting)
components/care/      Care-specific components (cards, illustrations, nav)
components/ui/        Shared primitives (PaperSurface, Eyebrow, QuietLink, EmptyState, …)
supabase/migrations/  SQL migrations (run in order)
types/                TypeScript types (database schema)
docs/                 Architecture, voice guide, known tech debt
```

## Deploying to Vercel

1. Push to GitHub and import the repo in Vercel.

2. Add environment variables in the Vercel dashboard (Project → Settings → Environment Variables):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL, e.g. `https://care-eight-kappa.vercel.app` |
| `FOUNDER_EMAIL` | Your email address (grants access to `/admin` and `/preview`) |

3. Configure Supabase Auth for your production domain:

In Supabase → Authentication → URL Configuration:
- **Site URL**: `https://your-vercel-domain.vercel.app`
- **Redirect URLs**: add `https://your-vercel-domain.vercel.app/auth/callback`

`NEXT_PUBLIC_SITE_URL` must exactly match the Site URL above. If they differ, magic links will redirect to the wrong domain and users will see an auth error.

4. Run all migrations in the Supabase SQL Editor (if not already done):

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_profiles_insert_policy.sql
supabase/migrations/003_weekly_reflections.sql
supabase/migrations/004_private_beta_hardening.sql
supabase/migrations/005_streak_function.sql        ← required for streak tracking
```

5. Configure email delivery — see [Email / SMTP](#email--smtp) below.

6. Deploy.

## Email / SMTP (Resend)

Supabase's default SMTP has strict rate limits and is not suitable for production. Configure Resend for reliable magic-link delivery.

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your sender domain (DNS verification — unverified domains will bounce)
3. Create an API key with **Sending access**
4. In Supabase → Project Settings → Auth → SMTP Settings:
   - **Enable Custom SMTP**: on
   - **Host**: `smtp.resend.com`
   - **Port**: `465`
   - **User**: `resend`
   - **Password**: your Resend API key
   - **Sender name**: `Care`
   - **Sender email**: `care@yourdomain.com` (must be on the verified domain)
5. Send a test magic link to yourself and verify delivery

If delivery fails, check Vercel function logs for `[signIn] OTP send failed` to see the Supabase error detail.

## Security Notes

- `/admin` and `/preview` are gated to `FOUNDER_EMAIL` at the server level — any other authenticated user is redirected to `/home`
- All user data is scoped by `user_id` in every Server Action — no cross-user data access is possible
- `FOUNDER_EMAIL` must never be set as a `NEXT_PUBLIC_` variable — doing so would expose it to the browser bundle
- Auth callback errors are logged server-side only — no raw error details appear in browser URLs

## Production Smoke Test

Run after every deployment and every migration. Every item must pass before inviting beta users.

### Prerequisites
- [ ] All 5 migrations applied in Supabase SQL Editor (001 → 005)
- [ ] `ritual_cards` has 40 rows · `card_categories` has 4 rows
- [ ] Resend SMTP configured, sender domain verified
- [ ] `NEXT_PUBLIC_SITE_URL` in Vercel matches the Supabase Site URL exactly

### Auth
- [ ] Navigate to `/login` — form renders, no console errors
- [ ] Enter your email → "เช็คอีเมลของคุณด้วยนะ" confirmation screen appears
- [ ] Check inbox — magic link email arrives within 60 seconds
- [ ] Click the link → redirected to `/checkin` (not to an error page)
- [ ] Check browser URL — no raw error codes visible after the redirect

### Core loop
- [ ] `/checkin` — select a mood, add a note, tap submit
- [ ] Redirected to `/cards` — card deck appears without error
- [ ] Tap the deck → card back breathes, then flips to card face
- [ ] Verify in Vercel logs: no `[checkin] streak update failed` message
- [ ] Navigate to `/profile` — streak shows as 1 (or correctly incremented)

### Card & journal
- [ ] On revealed card, tap "อยู่กับการ์ดใบนี้อีกสักครู่" → `/cards/second` loads with illustration and origin text
- [ ] Navigate to `/journal` — today's card is shown, text area is editable
- [ ] Write a journal entry → submit → redirected without error
- [ ] Navigate to `/collection` → today's card appears in the seen section
- [ ] Click the card → `/collection/[cardId]` shows card face + encounter date

### History & memory
- [ ] `/history` → today's checkin entry appears
- [ ] `/memory` → renders without error (may be empty for new accounts)
- [ ] `/diary` → renders without error

### Founder access
- [ ] `/admin` → loads with user stats (as founder), or redirects to `/home` (as non-founder)
- [ ] `/preview` → loads card system specification (as founder), or redirects to `/home` (as non-founder)

### Sign out
- [ ] Profile → sign out → redirected to `/`
- [ ] Navigate to `/checkin` → redirected to `/login` (session cleared)

## Tech Stack

- Next.js 16 (App Router, Server Actions)
- Supabase (Auth, Postgres, RLS)
- Tailwind CSS v4
- TypeScript
