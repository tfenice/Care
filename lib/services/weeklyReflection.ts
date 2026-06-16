// Weekly Reflection Engine — deterministic, no LLM
// Input: raw checkin/journal/card data for a 7-day window
// Output: structured reflection row ready to upsert

import { MOOD_KEYS, type MoodKey } from '@/types/models'

/**
 * Input contract for generateWeeklyReflection().
 *
 * Limits enforced inside the function — caller does not need to pre-slice:
 *   checkins  — at most 7 entries processed (one per day in a 7-day window)
 *   journals  — at most 7 entries processed
 *   cards     — at most 50 entries processed
 *   body      — truncated to 2 000 chars per journal before analysis
 */
export interface WeekInput {
  checkins: Array<{ mood_key: string; note: string | null }>
  journals: Array<{ body: string }>
  cards: Array<{ category_name_th: string | null; title_th: string }>
}

export interface WeekOutput {
  checkin_count: number
  dominant_mood: string | null
  mood_theme: string | null
  top_card_category: string | null
  journal_count: number
  reflection_text: string
}

// Input bounds — guard against oversized payloads from future real-data wiring
const MAX_CHECKINS   = 7     // one per day
const MAX_JOURNALS   = 7
const MAX_CARDS      = 50
const MAX_BODY_CHARS = 2_000

// ── Mood → theme mapping ────────────────────────────────────────────────────

const MOOD_THEMES: Record<string, string> = {
  สบายดี: 'ความสุขและความสมดุล',
  พอไหว:  'ความพยายามและความอดทน',
  เหนื่อย: 'การดูแลตัวเองและการพักผ่อน',
  สับสน:  'การค้นหาและการยอมรับ',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function topKey<T extends string>(map: Map<T, number>): T | null {
  let best: T | null = null
  let bestCount = 0
  for (const [k, v] of map) {
    if (v > bestCount) { best = k; bestCount = v }
  }
  return best
}

function countBy<T>(arr: T[], key: (item: T) => string | null): Map<string, number> {
  const m = new Map<string, number>()
  for (const item of arr) {
    const k = key(item)
    if (k) m.set(k, (m.get(k) ?? 0) + 1)
  }
  return m
}

// ── Reflection text builder ──────────────────────────────────────────────────
// Template-based; warm, non-clinical, non-judgmental Thai.

function buildReflectionText(p: {
  dominantMood: string | null
  checkinCount: number
  journalCount: number
  topCategory: string | null
}): string {
  const lines: string[] = []

  // 1. Consistency opening
  if (p.checkinCount >= 6) {
    lines.push('สัปดาห์นี้คุณกลับมาฟังใจตัวเองทุกวันเลยนะ')
  } else if (p.checkinCount >= 4) {
    lines.push('สัปดาห์นี้คุณดูแลตัวเองได้ดีมาก')
  } else if (p.checkinCount >= 2) {
    lines.push('สัปดาห์นี้คุณแวะมาฟังใจตัวเองบ้าง')
  } else {
    lines.push('สัปดาห์นี้อาจเป็นช่วงที่ยุ่งและวุ่นวาย')
  }

  // 2. Mood reflection
  if (p.dominantMood === 'สบายดี') {
    lines.push('ดูเหมือนว่าสัปดาห์นี้ใจคุณอยู่ในที่ที่ดี — ขอให้เก็บความรู้สึกนี้ไว้นะ')
  } else if (p.dominantMood === 'พอไหว') {
    lines.push('คุณยังคงเดินหน้าต่อไปทีละก้าว แม้บางวันจะรู้สึกหนักก็ตาม')
  } else if (p.dominantMood === 'เหนื่อย') {
    lines.push('ที่คุณยังคงกลับมาแม้จะเหนื่อย — นั่นคือความกล้าหาญที่แท้จริง')
  } else if (p.dominantMood === 'สับสน') {
    lines.push('ความสับสนไม่ใช่ความล้มเหลว มันคือส่วนหนึ่งของการเติบโต')
  }

  // 3. Journal note
  if (p.journalCount >= 3) {
    lines.push(`คุณเขียนบันทึก ${p.journalCount} ครั้ง — การเขียนช่วยให้เราเข้าใจตัวเองได้ลึกขึ้น`)
  } else if (p.journalCount === 1) {
    lines.push('คุณเขียนบันทึกไว้ครั้งหนึ่ง — บางครั้งแค่ครั้งเดียวก็มีความหมายมาก')
  }

  // 4. Card category note
  if (p.topCategory) {
    lines.push(`สัปดาห์นี้การ์ดในหมวด "${p.topCategory}" ดึงดูดคุณมากที่สุด`)
  }

  return lines.join(' ')
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateWeeklyReflection(input: WeekInput): WeekOutput {
  // Apply bounds before processing
  const checkins = input.checkins.slice(0, MAX_CHECKINS)
  const journals  = input.journals
    .slice(0, MAX_JOURNALS)
    .map(j => ({ body: j.body.slice(0, MAX_BODY_CHARS) }))
  const cards = input.cards.slice(0, MAX_CARDS)

  const moodCounts = countBy(checkins, c =>
    MOOD_KEYS.includes(c.mood_key as MoodKey) ? c.mood_key : null
  )
  const catCounts = countBy(cards, c => c.category_name_th)

  const dominantMood    = topKey(moodCounts)
  const topCardCategory = topKey(catCounts)
  const moodTheme       = dominantMood ? (MOOD_THEMES[dominantMood] ?? null) : null

  const reflectionText = buildReflectionText({
    dominantMood,
    checkinCount: checkins.length,
    journalCount: journals.length,
    topCategory:  topCardCategory,
  })

  return {
    checkin_count:     checkins.length,
    dominant_mood:     dominantMood,
    mood_theme:        moodTheme,
    top_card_category: topCardCategory,
    journal_count:     journals.length,
    reflection_text:   reflectionText,
  }
}

// ── Week boundary helpers ─────────────────────────────────────────────────────
// Always derive the day-of-week from the Bangkok calendar date to avoid
// server-local-timezone skew (e.g. a UTC server on Sunday night is already
// Monday morning in Bangkok).

export function getWeekBounds(date: Date, tz = 'Asia/Bangkok'): { start: string; end: string } {
  // 1. Get the calendar date in the target timezone as 'YYYY-MM-DD'
  const bangkokDate = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(date)
  // 2. Treat that date as a UTC midnight reference — getUTCDay() is then
  //    unaffected by the server's local timezone.
  const ref = new Date(bangkokDate + 'T00:00:00Z')
  // 3. Shift so Mon=0 … Sun=6
  const dow = (ref.getUTCDay() + 6) % 7
  const monday = new Date(ref.getTime() - dow * 86_400_000)
  const sunday = new Date(ref.getTime() + (6 - dow) * 86_400_000)
  // 4. Slice ISO string — safe since both dates are at UTC midnight
  return {
    start: monday.toISOString().slice(0, 10),
    end:   sunday.toISOString().slice(0, 10),
  }
}

export function getPreviousWeekBounds(tz = 'Asia/Bangkok'): { start: string; end: string } {
  const lastWeek = new Date(Date.now() - 7 * 86_400_000)
  return getWeekBounds(lastWeek, tz)
}
