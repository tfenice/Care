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
| `FOUNDER_EMAIL` | Your personal email | Required to access `/admin` — see security note below |

**NEXT_PUBLIC_SITE_URL** is used to build the magic-link redirect URL. It must exactly match what Supabase sends users to after clicking the email link. Set it to `http://localhost:3000` for local development.

**FOUNDER_EMAIL** is checked server-side on every request to `/admin`. It is never exposed to the browser. Do not commit it to git — set it only in your Vercel dashboard.

3. Run the database migrations **in order** in the Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_profiles_insert_policy.sql
supabase/migrations/003_weekly_reflections.sql
supabase/migrations/004_private_beta_hardening.sql
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
  (app)/profile/      Account and stats
  (app)/settings/     Privacy and preferences
  admin/              Founder-only analytics
lib/actions/          Server Actions (auth, checkin, cards, journal)
lib/supabase/         Supabase client helpers (server + browser)
lib/services/         Deterministic engines (reflection, memory extractor)
lib/demo/             Demo fixture data (replace with real queries at launch)
components/care/      Shared UI components
supabase/migrations/  SQL migrations (run in order)
types/                TypeScript types (database schema, models)
docs/                 Architecture, voice guide, known tech debt
```

## Deploying to Vercel

1. Push to GitHub and import the repo in Vercel.

2. Add environment variables in the Vercel dashboard (Project → Settings → Environment Variables):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL, e.g. `https://care.vercel.app` |
| `FOUNDER_EMAIL` | Your email address (grants access to `/admin`) |

3. Configure Supabase Auth for your production domain:

In the Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: `https://your-vercel-domain.vercel.app`
- **Redirect URLs**: add `https://your-vercel-domain.vercel.app/auth/callback`

If the redirect URL is not listed, Supabase will reject the magic-link flow and users will see an auth error.

4. Run all migrations in the Supabase SQL Editor (if not already done):

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_profiles_insert_policy.sql
supabase/migrations/003_weekly_reflections.sql
supabase/migrations/004_private_beta_hardening.sql
```

5. Deploy.

## Security Notes

- `/admin` is gated to `FOUNDER_EMAIL` at the server level — any other authenticated user is redirected to `/checkin`
- All user data is scoped by `user_id` in every Server Action — no cross-user data access is possible
- `FOUNDER_EMAIL` must never be set as a `NEXT_PUBLIC_` variable — doing so would expose it to the browser bundle

## Tech Stack

- Next.js 16 (App Router, Server Actions, `proxy.ts`)
- Supabase (Auth, Postgres, RLS)
- Tailwind CSS v4
- TypeScript
