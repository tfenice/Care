# Memory Garden — Design Foundation

Design document. No code yet. Implementation sprint follows.

---

## Concept

The Memory Garden is a spatial metaphor for the user's emotional history.
Rather than a list or timeline, memories become living things in a garden
the user tends over time.

Every return to Care plants something. Every absence lets things rest.
The garden reflects the honest rhythm of self-care — not perfect, but real.

---

## Elements

### Seeds → Plants (Journal Entries)

Each journal entry becomes a seed in the garden.
Seeds grow into plants based on:
- **Recency**: recent entries glow; old ones settle into the soil
- **Length**: longer entries grow taller
- **Themes**: entries sharing themes cluster together

Plant states:
| State      | Condition                        |
|------------|----------------------------------|
| Seedling   | Written within the past 7 days   |
| Growing    | 8–30 days old                    |
| Blooming   | 31–90 days, still being returned |
| Resting    | 90+ days, no related new entries |
| Memory     | 180+ days — a gentle stone marker|

### Weather (Mood via Check-ins)

Daily mood determines the garden's atmosphere for that day:

| Mood     | Weather         |
|----------|-----------------|
| สบายดี   | Clear, warm     |
| พอไหว    | Partly cloudy   |
| เหนื่อย  | Soft rain       |
| สับสน    | Misty morning   |

Weather is historical — the garden shows the actual weather each day had,
not the user's current state.

### Paths (Streaks)

A streak of checkins becomes a visible path through the garden.
Gaps in streaks leave gaps in the path — neither bad nor good, just honest.

### Sections (Card Categories)

The four card categories map to garden areas:
- **การยอมรับ** (Acceptance) — stone garden, still water
- **ความใจจดจ่อ** (Presence) — open clearing, sunlight
- **ความหวัง** (Hope) — climbing plants, upward growth
- **การเติบโต** (Growth) — deep roots, tall trees

Entries tagged via the card drawn that day are placed in the corresponding area.

---

## Visual Language

**Palette**: Stays within the Care design system.
- Cream background: `#F7F2EB`
- Plants: muted greens, browns — no neon, no gamification colors
- Weather overlays: soft opacity layers, not full-bleed

**No numbers in the garden view**: The garden is felt, not scored.
Counters and streaks live on `/growth`. The garden is just the garden.

**Accessibility**: Full garden is decorative (aria-hidden). All meaningful
content is also available as a text list below the visual.

---

## Interaction

- **Tap a plant**: opens the journal entry it came from (read-only)
- **Tap a stone marker**: shows "วันนี้เมื่อ X เดือนที่แล้ว" — the On This Day view
- **Tap a path section**: shows the checkin + mood for that day
- **Scroll**: garden scrolls left→right through time (oldest on left)
- **No editing from the garden**: it is a museum, not a workspace

---

## Data Model (no schema changes needed)

The garden reads from existing tables:
- `journal_entries` → plants (body, created_at, themes via memoryExtractor)
- `daily_checkins` → weather + path (mood_key, checked_in_at)
- `reading_history` → section placement (card category via join)
- `profiles` → streak → path length

No new columns or tables required for the foundation.

---

## What "Foundation Only" Means

The current `/memory` page already surfaces the algorithmic layer
(themes, mood frequency, pattern detection).

The Memory Garden adds the **spatial, emotional layer** on top.
It is the same data, expressed as place rather than list.

Foundation sprint will build:
1. `components/care/GardenView.tsx` — SVG/Canvas layout engine
2. `components/care/PlantMark.tsx` — individual plant element
3. `components/care/WeatherLayer.tsx` — mood atmosphere overlay
4. `app/(app)/garden/page.tsx` — full page with text fallback

Graphics sprint follows: actual SVG plant shapes, animation, seasonal variants.

---

## What It Is Not

- Not a gamification system (no points, badges, levels)
- Not a data dashboard (no numbers in the main view)
- Not social (private to the user, never shared)
- Not AI-generated (deterministic from user's own data)
