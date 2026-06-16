# Care — Product Map

Care is a Thai-first emotional reflection companion.
It helps people gently return to themselves through daily rituals.

Core philosophy: **Acceptance → Presence → Hope → Growth**

Care is **not** a productivity dashboard, therapy replacement, fortune-telling app, or gamified habit tracker.

---

## Current Routes

### Public (no auth required currently)

| Route | File | Description |
|---|---|---|
| `/login` | `app/(auth)/login/page.tsx` | Magic-link email login |
| `/auth/callback` | `app/auth/callback/route.ts` | Supabase PKCE callback |

### App (auth will be required post-launch hardening)

| Route | File | Description |
|---|---|---|
| `/` | `app/(app)/page.tsx` | Home dashboard |
| `/checkin` | `app/(app)/checkin/page.tsx` | Daily mood check-in |
| `/cards` | `app/(app)/cards/page.tsx` | Ritual card draw |
| `/journal` | `app/(app)/journal/page.tsx` | Daily journal entry |
| `/history` | `app/(app)/history/page.tsx` | 30-day history view |
| `/growth` | `app/(app)/growth/page.tsx` | Growth timeline + streak |
| `/memory` | `app/(app)/memory/page.tsx` | Memory explorer |
| `/profile` | `app/(app)/profile/page.tsx` | User profile + stats |
| `/settings` | `app/(app)/settings/page.tsx` | Privacy & preferences |
| `/home` | `app/(app)/home/page.tsx` | Legacy redirect → `/` |

### Internal (founder only — not yet secured)

| Route | File | Description |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | Founder analytics |

### Error handling

| Route | File | Description |
|---|---|---|
| `not-found` | `app/not-found.tsx` | Thai 404 page |
| `error` | `app/error.tsx` | Thai error boundary |

---

## Current Features

### Daily flow
- Mood check-in (4 moods: สบายดี / พอไหว / เหนื่อย / สับสน)
- Ritual card draw after check-in (40 cards, 4 categories)
- Journal entry tied to the day

### Reflection
- 30-day check-in grid
- Streak tracking (current + longest)
- Weekly reflection — deterministic, template-based Thai text
- 7-day emotional timeline

### Memory engine
- Deterministic theme extraction from journal text (8 Thai theme categories)
- Mood pattern analysis from check-in history
- Synthesis insight (mood + top theme combined)
- Memory viewer page

### Navigation
- Bottom nav: หน้าหลัก / เช็คอิน / การ์ด / บันทึก / ย้อนดู
- Secondary nav on homepage: การเติบโต / ความทรงจำ / โปรไฟล์ / ตั้งค่า

### Founder analytics
- DAU / WAU / user counts
- 7-day activity chart (CSS bars)
- Daily stats table
- Streak distribution
- Most common moods
- Most drawn card categories

---

## Ritual Card Deck

40 cards across 4 categories:
- **การยอมรับ** (Acceptance)
- **การอยู่กับปัจจุบัน** (Presence)
- **ความหวัง** (Hope)
- **การเติบโต** (Growth)

Seeded via `supabase/seed_production.sql`.

---

## Services / Engines

| File | Purpose |
|---|---|
| `lib/services/weeklyReflection.ts` | Deterministic weekly reflection generator |
| `lib/services/memoryExtractor.ts` | Theme + mood pattern extractor |

No AI APIs. All logic is pure functions operating on raw data.

---

## Future Features (planned, not built)

These are explicitly in scope for later sprints:

- **Onboarding flow** — gentle first-use experience explaining what Care is
- **Auth hardening** — restore session checks, middleware, action guards
- **Real data wiring** — replace all demo data with live Supabase queries
- **Weekly reflection persistence** — save to `weekly_reflections` table
- **Memory persistence** — save to `user_memories` table, incrementally
- **Push notifications** — daily check-in reminder (requires OS permission)
- **Weekly summary** — Sunday notification with week's reflection
- **Data export** — download journals and check-ins as JSON/CSV
- **Delete account** — GDPR-compliant data removal
- **Privacy & terms pages** — actual legal content

---

## Intentionally Out of Scope

These will **never** be built into Care:

- AI chat or conversational interface
- OpenAI / Claude / external AI API calls
- Social features (sharing, following, comments)
- Billing or subscriptions
- Gamification (badges, points, leaderboards)
- English language UI (Thai-first throughout)
- Avatar upload or custom profile photos
- Medication tracking
- Therapy or clinical features
- Integration with third-party wellness apps

---

## Tech Stack

- **Next.js 16** — App Router, Server Actions, Route Groups
- **Supabase** — Auth (magic link), Postgres, Row Level Security
- **Tailwind CSS v4** — custom color palette (cream, sand, brown, ink, muted)
- **TypeScript** — strict mode

## Database Tables

| Table | Purpose |
|---|---|
| `profiles` | User profile + streak data |
| `card_categories` | 4 card categories |
| `ritual_cards` | 40 ritual cards |
| `daily_checkins` | Daily mood records |
| `journal_entries` | Free-form reflections |
| `reading_history` | Cards seen (60-day retention) |
| `user_memories` | Extracted memory rows |
| `weekly_reflections` | Generated weekly reflection cache |
