# Memory Garden — System Design

The Memory Garden is Care's long-term growth model.
It is not a gamification layer. It is an attempt to make time visible in a way that feels true.

---

## Philosophy

Most apps treat engagement as growth.
Care does not.

A person who returns once after six months is not behind someone who checked in every day.
A person who wrote one deeply honest journal is not less than someone who wrote thirty short ones.

The Memory Garden exists to reflect the honest texture of a person's relationship with themselves — not to score it.

Growth in Care is:
- **Cumulative, not linear** — past moments remain, even through absence
- **Qualitative, not quantitative** — depth matters as much as frequency
- **Patient** — stages do not expire; you do not fall backward
- **Private** — growth is visible only to the user; it is never social

The garden is a record. It is not a report card.

---

## Growth Stages

Five stages, in order of emergence. Stages are additive — reaching ต้นไม้ does not replace ใบ or ต้นอ่อน. The whole history is always there.

### 1. เมล็ด — Seed

> คุณเพิ่งเริ่มต้น

The moment of arrival. Something has been planted. Nothing is visible yet, but the intention is here.

A seed does not look like much. That is not the point. The point is that it exists.

**Triggers:**
- First login (automatic)
- OR first checkin

**What Care might say:**
> "การเริ่มต้นมักเงียบที่สุด"

---

### 2. ต้นอ่อน — Sprout

> คุณกลับมาซ้ำๆ แล้ว

Something is taking root. The person has returned enough times that a pattern of returning has begun.

A sprout is fragile. It does not need praise. It just needs to not be pulled up.

**Triggers (any one of):**
- 7 checkins (not necessarily consecutive)
- 3 journal entries
- Returned after first absence of 3+ days

**What Care might say:**
> "มีบางอย่างกำลังงอกขึ้นมา"

---

### 3. ใบ — Leaf

> มีจังหวะบางอย่างในชีวิตของคุณแล้ว

A rhythm is forming. Not a goal, not a streak — a texture to the days. The person has been through at least one quiet phase and returned.

Leaves are not permanent. They can fall. But more grow.

**Triggers (all of):**
- 30 checkins (total, any time range)
- At least 1 journal entry
- Used Care on at least 2 different calendar months

**What Care might say:**
> "ช่วงนี้คุณเริ่มมีจังหวะของตัวเองแล้ว"

---

### 4. ต้นไม้ — Tree

> คุณผ่านช่วงเวลาหลายแบบมาแล้ว

Seasons have passed. The person has been through different emotional states, different streaks, different silences, and kept returning. This is not just frequency — it is survival through contrast.

A tree is not defined by one good week. It is shaped by many weathers.

**Triggers (all of):**
- 90+ days since first checkin (age of relationship, not streak)
- 90+ checkins total
- At least 10 journal entries
- At least one return after 7+ day absence

**What Care might say:**
> "Care ได้อยู่กับคุณผ่านหลายช่วงเวลาแล้ว"

---

### 5. สวน — Garden

> พื้นที่ตรงนี้กลายเป็นบ้านเล็กๆ ของคุณแล้ว

A whole world has grown. This is not a destination — it is the recognition that something lasting has been built. The person has a history here now. It belongs to them.

A garden is never finished. It changes with seasons. It has places that bloom and places that rest.

**Triggers (all of):**
- 180+ days since first checkin
- 50+ journals
- Multiple returns after absence (at least 3 separate absence-return cycles)
- All 4 card categories explored at least once

**What Care might say:**
> "สวนของคุณค่อยๆ เติบโตมาสักพักแล้ว
> มีทั้งช่วงที่รก ช่วงที่เงียบ และช่วงที่บาน
> แต่มันยังเป็นของคุณเสมอ"

---

## Growth Signals

What counts toward growth, and why.

### Primary signals

| Signal | What it represents | Weight |
|---|---|---|
| Checkin | Showing up — the most basic act of return | Frequency |
| Journal entry | Depth — the willingness to put something into words | Depth |
| Return after absence | Resilience — the act of coming back matters more than never leaving | Qualitative |
| First time (any type) | Beginning — every first is a stage transition candidate | Qualitative |

### Secondary signals

| Signal | What it represents |
|---|---|
| Diary page visit | Reflection — the user is revisiting their own history |
| Card draw | Engagement with Care's ritual layer |
| On This Day triggered | A memory surfaced and the user saw it |

### What does NOT count

| Non-signal | Why excluded |
|---|---|
| Streak length alone | A long streak does not mean depth; a broken streak does not mean failure |
| Daily login without action | Passive presence is not self-care |
| Speed of stage completion | The point is not to grow fast |
| Perfect moods | A person who checks in as เหนื่อย every day is equally present |

---

## Milestone Moments

Moments that are individually meaningful — not stages, but quiet recognitions.

These are surfaced gently (in a Care Letter or diary reflection), never as pop-ups or badges.

| Milestone | Trigger | How Care might surface it |
|---|---|---|
| First checkin | `daily_checkins count = 1` | Care Letter: "วันแรกที่คุณแวะมา ยังอยู่ในความทรงจำ" |
| First journal | `journal_entries count = 1` | Quiet: "คุณเริ่มเขียนแล้ว" |
| First return | First checkin after 7+ day gap | "คุณกลับมาแล้ว Care ดีใจที่ได้เจอ" — once only |
| 10 checkins | Cumulative | Care Letter: mention of a quiet pattern forming |
| 30 checkins | Cumulative | Stage transition to ใบ (if other conditions met) |
| 10 journals | Cumulative | On This Day can now reach back further |
| 90 checkins | Cumulative | Stage transition candidate for ต้นไม้ |
| All 4 card categories | Reading history coverage | Surfaced in memory page: "คุณได้สัมผัสทุกด้านของตัวเองแล้ว" |
| First anniversary | 365 days since `profiles.created_at` | Care Letter: "ปีที่แล้วคุณเริ่มต้นกับ Care" |
| Return after 30+ days | Absence → return | Miss You message (already implemented) |

---

## Emotional Meaning by Stage

How Care describes each stage without evaluating it.

| Stage | Care's internal reading | What is never said |
|---|---|---|
| เมล็ด | "คุณตัดสินใจเริ่มต้น" | "ยังเป็นแค่จุดเริ่มต้น" (belittling) |
| ต้นอ่อน | "คุณกลับมาซ้ำๆ แล้ว" | "ดีมาก เก่งมาก" (praise) |
| ใบ | "มีจังหวะกำลังก่อตัว" | "คุณทำได้ตามเป้า" (goal-framing) |
| ต้นไม้ | "คุณผ่านหลายช่วงเวลามาแล้ว" | "คุณแข็งแกร่งขึ้น" (evaluative) |
| สวน | "พื้นที่ตรงนี้เป็นของคุณแล้ว" | "คุณสำเร็จแล้ว" (finality/achievement) |

---

## Stage Computation

Stages are computed deterministically from Supabase data. No stage data is stored — it is derived fresh each time it is needed.

```typescript
// Pseudocode — not yet implemented
type GardenStage = 'เมล็ด' | 'ต้นอ่อน' | 'ใบ' | 'ต้นไม้' | 'สวน'

function computeStage(stats: {
  totalCheckins: number
  totalJournals: number
  daysSinceFirstCheckin: number
  returnAfterAbsenceCount: number
  cardCategoriesExplored: number
  hadAbsenceOf7Plus: boolean
  calendarMonthsActive: number
}): GardenStage {
  // Garden: all criteria met
  if (
    stats.daysSinceFirstCheckin >= 180 &&
    stats.totalJournals >= 50 &&
    stats.returnAfterAbsenceCount >= 3 &&
    stats.cardCategoriesExplored >= 4
  ) return 'สวน'

  // Tree: has weathered multiple seasons
  if (
    stats.daysSinceFirstCheckin >= 90 &&
    stats.totalCheckins >= 90 &&
    stats.totalJournals >= 10 &&
    stats.hadAbsenceOf7Plus
  ) return 'ต้นไม้'

  // Leaf: rhythm forming
  if (
    stats.totalCheckins >= 30 &&
    stats.totalJournals >= 1 &&
    stats.calendarMonthsActive >= 2
  ) return 'ใบ'

  // Sprout: returning regularly
  if (
    stats.totalCheckins >= 7 ||
    stats.totalJournals >= 3 ||
    stats.returnAfterAbsenceCount >= 1
  ) return 'ต้นอ่อน'

  return 'เมล็ด'
}
```

**Implementation notes:**
- `returnAfterAbsenceCount` requires scanning checkin timestamps for gaps ≥ 7 days followed by a return — query from `daily_checkins` ordered by `checked_in_at`
- `calendarMonthsActive` = count of distinct `(year, month)` pairs in checkin history
- `daysSinceFirstCheckin` = difference between today (Bangkok) and earliest checkin date
- This function belongs in `lib/services/gardenStage.ts` when implemented

---

## Future UI Ideas

These are not planned sprints — they are directions the system could grow if the stage model proves meaningful.

### Garden View (`/garden`)
A spatial page built from `MEMORY_GARDEN.md` (root). Plants are journal entries, weather is mood, paths are streaks. See root doc for visual language.

### Stage Reveal (Diary page)
When a user crosses a stage boundary, the Care Letter for that week includes a quiet one-line observation — not a congratulation. Example: "สัปดาห์นี้ดูเหมือนจะมีบางอย่างเติบโตขึ้นเงียบๆ ในสวน"

### Milestone Stones (Garden detail)
Milestone moments appear as small stones in the garden — tappable, showing the original entry or the date. No labels like "Achievement". Just a date and, if the milestone was a journal, the first line.

### Seasonal Variation
The garden's visual state shifts with the Thai calendar seasons — not with the user's mood. This keeps the garden grounded in shared reality, not just personal data.

### Stage-aware Care Letter
The Care Letter generator could receive the current stage and slightly adjust its closing line. A เมล็ด-stage user receives: "ขอบคุณที่เริ่มต้น". A สวน-stage user receives: "ขอบคุณที่ยังอยู่ตรงนี้".

---

## Future Risks

Things to watch for as this model grows.

### Gamification Creep
The biggest risk. Once stages are visible, users will try to optimize for them. Signs this is happening: users rushing to write 50 journals before reading them, or checking in multiple times per day.
**Mitigation:** Never show stage-progress indicators (like "28/30 checkins"). Show only current stage. Never show what comes next.

### Stage Anxiety
A user who has been in เมล็ด for six months may feel stuck. If stages are surfaced without care, they become pressure.
**Mitigation:** Stage labels are never shown on a prominent UI surface. If shown at all, they appear in a quiet info section, with the note that stages reflect the past, not a to-do list.

### Depth vs Frequency Bias
The current trigger model leans toward quantity (30 checkins, 50 journals). A person who writes three deeply honest journals and checks in thirty times may advance faster than a person who writes thirty journals but only checks in ten times.
**Mitigation:** Watch for this in early user data. If frequency-heavy users advance first, weight journal entries more heavily in stage triggers.

### The Perfect User Illusion
If the สวน stage requires all 4 card categories explored, a user who never draws cards is permanently excluded from the final stage. That is unfair to users who use Care primarily for journaling.
**Mitigation:** Make `cardCategoriesExplored` a soft signal, not a hard gate. In the implementation, consider `OR` conditions rather than `AND` for the top stage.

### Absence Misreading
A person who was away for 30 days and returned is more experienced in self-care than many daily users. The current model rewards their return (as an absence-return cycle) but they may still be in ต้นอ่อน if total counts are low.
**Mitigation:** Consider a `significantReturn` bonus: a return after 14+ days earns the same weight as 5 checkins.

### Privacy
Stage data reveals behavioral patterns. A user in สวน has been in Care for 6+ months with 50+ journals — that is a lot of private history. If stage data is ever sent to analytics, it should be aggregated and never tied to individual users.
**Mitigation:** Stage computation stays client-side (server-render only, never stored). Do not add a `garden_stage` column to `profiles`.

---

## Relationship to Existing Docs

| Document | Scope |
|---|---|
| `MEMORY_GARDEN.md` (root) | Visual/spatial metaphor — the garden as a place |
| `docs/MEMORY_GARDEN.md` (this file) | System design — stages, triggers, philosophy |
| `docs/CARE_PRODUCT_MAP.md` | Routes, features, what is built |
| `docs/CARE_VOICE_GUIDE.md` | Language and tone for all copy including garden labels |

When implementing, use the Voice Guide to write stage descriptions. Use this document for logic. Use the root doc for visual decisions.
