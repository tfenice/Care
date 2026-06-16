# Care — Technical Architecture

## Overview

Care is a Thai-first emotional reflection application. Users check in with their mood, draw ritual cards, and write journal entries. The experience is gentle and non-prescriptive — the app facilitates reflection, not advice.

**Philosophy → Code mapping:**

| Philosophy | Feature |
|---|---|
| Acceptance | Daily mood check-ins (`daily_checkins`) |
| Presence | Ritual cards (`ritual_cards`, `reading_history`) |
| Hope | Journal entries (`journal_entries`) |
| Growth | Streak tracking (`profiles`), AI memory (`user_memories`), reflection review |

---

## Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Hosting | Vercel |

---

## Before You Start

Install Supabase client libraries:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Copy environment variables and fill them in:

```bash
cp .env.example .env.local
```

Seed the database after running migrations:

```bash
supabase db reset   # wipes, migrates, and seeds
```

---

## Folder Structure

```
care/
├── app/                           # Next.js App Router — routing only, no business logic
│   ├── (auth)/                    # Route group: unauthenticated pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (app)/                     # Route group: session-protected pages
│   │   ├── checkin/
│   │   │   └── page.tsx
│   │   ├── cards/
│   │   │   └── page.tsx
│   │   ├── journal/
│   │   │   └── page.tsx
│   │   └── layout.tsx             # Checks session; redirects to /login if absent
│   ├── api/                       # Route Handlers (mutation endpoints)
│   │   ├── checkins/
│   │   │   └── route.ts
│   │   ├── cards/
│   │   │   └── route.ts
│   │   └── journal/
│   │       └── route.ts
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Supabase Auth token exchange (required for magic link + OAuth)
│   ├── layout.tsx                 # Root layout: HTML shell, fonts, global providers
│   ├── page.tsx                   # Landing / mood selector (public)
│   └── globals.css
│
├── components/
│   ├── ui/                        # Primitive design system: Button, Card, Input, etc.
│   └── care/                      # Domain components: MoodPicker, RitualCard, JournalEditor
│
├── hooks/                         # Client-side React hooks
│   ├── useCheckin.ts
│   ├── useUser.ts
│   └── useCards.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser singleton (use in Client Components + hooks)
│   │   └── server.ts              # Per-request server client (use in Server Components + Route Handlers)
│   └── db/                        # Typed query helpers — no auth checks (RLS enforces that)
│       ├── profiles.ts
│       ├── checkins.ts
│       ├── cards.ts
│       └── journal.ts
│
├── types/
│   ├── database.ts                # Raw DB types — mirrors schema exactly; replace with CLI output later
│   ├── models.ts                  # Domain models — ergonomic shapes for the app layer
│   └── api.ts                     # Route Handler request/response contracts
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                   # 4 categories + 13 Thai ritual cards
│
├── middleware.ts                  # Session refresh on every request; route protection
├── .env.example
├── next.config.ts
└── tsconfig.json
```

### Layer Responsibilities

| Layer | Owns | Does NOT own |
|---|---|---|
| `app/` | Route structure, page composition, Server Component data fetching | Business logic, direct DB calls |
| `components/` | Presentation — receives data, emits events | Data fetching, auth |
| `lib/db/` | Typed Supabase queries | Auth checks (RLS handles those), data transformation |
| `hooks/` | Client-side state, optimistic updates, real-time subscriptions | Server-side data fetching |
| `types/` | Shared contracts | Imports from `lib/` or `components/` |
| `middleware.ts` | Session cookie refresh | Route-level auth decisions (use layout redirects for those) |

---

## Database Design

### Tables

| Table | Purpose |
|---|---|
| `profiles` | User settings, locale, streak tracking |
| `card_categories` | Four categories (Acceptance, Presence, Hope, Growth) |
| `ritual_cards` | Thai-first reflection cards, ordered by `sort_order` |
| `daily_checkins` | Mood check-in per session — immutable after insert |
| `journal_entries` | Free-form reflections — soft-deleted via `deleted_at` |
| `reading_history` | Which cards a user has seen — 60-day rolling window |
| `user_memories` | AI-generated summaries and insights — written by service role only |

### AI Memory Design

`user_memories` is the AI context layer. Instead of feeding raw journal entries and check-ins to an AI on every session (expensive and token-heavy), the backend periodically synthesizes compact memories:

```
source_type = 'checkin'    → summary of recent mood patterns
source_type = 'journal'    → themes and key phrases from recent writing
source_type = 'synthesis'  → cross-source insight (e.g. "tends to feel heaviest on Mondays")
```

At session start, load the 5–10 most recent memories as compact context. Source rows are referenced in `source_ids` for traceability.

**Future:** Add `embedding vector(1536)` to `user_memories` for semantic search over past reflections. The schema is compatible with this addition without a breaking migration.

### Card Pool Exhaustion

When a user has seen all active cards, the draw query falls back gracefully:

```
Primary:  SELECT cards NOT IN (user's reading_history) → draw at random
Fallback: SELECT the card with the oldest read_at for this user → draw the most "refreshed" card
```

This avoids a hard wall. The user continues their experience without a reset notification or empty state.

### Reading History Retention

`reading_history` is capped at 60 days per user via an AFTER INSERT trigger. The trigger runs a targeted DELETE using `(user_id, read_at)` — the covering index makes this O(log n). No external cron job needed.

### i18n

Care is Thai-first and currently Thai-only. If English content is needed:
- Add a `ritual_cards_translations (card_id, locale, title, body, reflection_prompt)` join table
- Do not add `_en` columns to the main content tables

### Growth: Streak Tracking

`profiles` carries `current_streak`, `longest_streak`, and `last_checkin_date`. These are updated server-side on each check-in submission — no aggregation query needed at display time. A streak increments when `last_checkin_date = TODAY - 1 day` and resets to 1 otherwise.

---

## Security Model

### Row Level Security (RLS)

RLS is the primary authorization boundary. The anon key used in the browser cannot bypass it.

| Table | Who can read | Who can write |
|---|---|---|
| `profiles` | Owner only | Owner only (UPDATE) |
| `card_categories` | Anyone (active rows) | Service role only |
| `ritual_cards` | Anyone (active rows) | Service role only |
| `daily_checkins` | Owner only | Owner only (INSERT) |
| `journal_entries` | Owner only (non-deleted) | Owner only (INSERT, UPDATE) |
| `reading_history` | Owner only | Owner only (INSERT) |
| `user_memories` | Owner only | Service role only (AI backend) |

### Auth Flow

1. User signs in via Supabase Auth (magic link or OAuth)
2. Supabase redirects to `/auth/callback?code=...`
3. `app/auth/callback/route.ts` exchanges the code for a session and sets the cookie
4. `middleware.ts` refreshes the session cookie on every subsequent request
5. Pages under `app/(app)/` check session in their layout and redirect to `/login` if absent

### Secrets

- `NEXT_PUBLIC_*` variables are embedded in client bundles — only safe with RLS in place
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — server-side only, never in `NEXT_PUBLIC_*`
- `user_memories` has no INSERT policy for authenticated users — only the service role can write AI memories

### Content Safety

- All journal entries are owner-private by RLS — no application-level privacy flag needed
- `deleted_at` soft-delete on `journal_entries` preserves data but RLS excludes it from user reads
- Input length validation belongs in Route Handlers — do not rely on DB constraints alone

---

## Performance & Scalability

### Indexes

```sql
-- Time-range queries on user check-ins
CREATE INDEX idx_checkins_user_time    ON public.daily_checkins (user_id, checked_in_at DESC);

-- "Cards you haven't seen recently" queries + card pool exhaustion fallback
CREATE INDEX idx_reading_user_time     ON public.reading_history (user_id, read_at DESC);
CREATE INDEX idx_reading_card          ON public.reading_history (card_id);

-- Active journal entries per user
CREATE INDEX idx_journal_user_active   ON public.journal_entries (user_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- Tag-based card filtering (future)
CREATE INDEX idx_cards_tags_gin        ON public.ritual_cards USING GIN (tags);

-- Category filtering on active cards
CREATE INDEX idx_cards_category_active ON public.ritual_cards (category_id)
  WHERE is_active = TRUE;

-- AI memory context loading
CREATE INDEX idx_memories_user_time    ON public.user_memories (user_id, created_at DESC);
```

### Caching Strategy

- `ritual_cards` and `card_categories` are content-managed and change rarely — cache with `use cache` / `cacheLife('days')`
- `daily_checkins` and `journal_entries` are user-specific and must not be cached across users
- Reading history inserts can be fire-and-forget (non-blocking) from the client
- `user_memories` reads can be cached per-user with short TTL (minutes) — they change only when the AI writes

### At 100,000 Users

- Supabase Pro uses PgBouncer for connection pooling — no application-level pooling needed
- Separate analytics queries (mood trends, card popularity) to a read replica to avoid primary contention
- `reading_history` is self-bounding at 60 days — no partition strategy needed at this scale
- `user_memories` grows slowly (AI writes, not user writes) — no special handling needed
- `ritual_cards` and `card_categories` are ideal for Supabase CDN caching (`Cache-Control: public`)
