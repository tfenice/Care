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

2. Copy the env template and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Set these values from your Supabase project dashboard (Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the database migrations **in order** in the Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_profiles_insert_policy.sql
```

4. Seed the ritual card deck:

```
supabase/seed_production.sql
```

Verify: `card_categories` has 4 rows, `ritual_cards` has 40 rows.

5. Start the dev server:

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
lib/actions/          Server Actions (auth, checkin, cards, journal)
lib/supabase/         Supabase client helpers (server + browser)
components/care/      Shared UI components
supabase/migrations/  SQL migrations (run in order)
types/                TypeScript types (database schema, models)
```

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

Set your Supabase Auth redirect URL to `https://your-vercel-domain.vercel.app/auth/callback`.

## Tech Stack

- Next.js 16 (App Router, Server Actions)
- Supabase (Auth, Postgres, RLS)
- Tailwind CSS v4
- TypeScript
