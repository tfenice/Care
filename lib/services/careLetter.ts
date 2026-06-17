// Care Letter — template-driven, no AI.
// Rolling 7-day window (not a calendar week).
//
// Tone contract:
//   ✓ Observe  — state what happened
//   ✓ Reflect  — name what was there
//   ✓ Accompany — quiet presence
//   ✗ Never teach, diagnose, coach, or evaluate

export type CareLetterInput = {
  weekMoods: string[]           // mood_key per checkin in the last 7 days (0–7 items)
  journalCount: number
  journalExcerpt: string | null // first line of most recent journal entry (max 48 chars)
  streak: number
}

export type CareLetter = {
  // Each string is one short paragraph — 1 sentence or phrase.
  // Last item is always the quiet closing.
  lines: string[]
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function countMoods(moods: string[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const mood of moods) m.set(mood, (m.get(mood) ?? 0) + 1)
  return m
}

type TopMoodResult = { mood: string; freq: number; tied: boolean }

// Returns null if no moods. Returns tied:true when multiple moods share the top count.
function topMoodResult(counts: Map<string, number>): TopMoodResult | null {
  if (counts.size === 0) return null
  let bestN = 0
  for (const [, v] of counts) if (v > bestN) bestN = v
  const leaders = [...counts.entries()].filter(([, v]) => v === bestN)
  if (leaders.length > 1) return { mood: leaders[0][0], freq: bestN, tied: true }
  return { mood: leaders[0][0], freq: bestN, tied: false }
}

// "หลายวัน" / "บางวัน" / "ทุกวัน" / "" (single checkin — no qualifier needed)
function qualifier(freq: number, total: number): string {
  if (total <= 1) return ''
  if (freq === total) return 'ทุกวัน'
  if (freq >= 3 || freq > total / 2) return 'หลายวัน'
  return 'บางวัน'
}

// Internal safety cap: first line only, max 48 chars, ellipsis if trimmed.
// The caller should already pass a short excerpt, but this defends against longer text.
function safeExcerpt(text: string): string {
  const t = text.trim()
  const nl = t.indexOf('\n')
  const line = nl > 0 ? t.slice(0, nl).trimEnd() : t
  if (line.length <= 48) return line
  return line.slice(0, 48).trimEnd() + '…'
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateCareLetter(input: CareLetterInput): CareLetter {
  const { weekMoods, journalCount, journalExcerpt, streak } = input
  const n = weekMoods.length
  const counts = countMoods(weekMoods)
  const top = topMoodResult(counts)
  const dominant = (!top || top.tied) ? null : top.mood
  const domFreq = (dominant && top) ? top.freq : 0

  const lines: string[] = []

  // ── 1. Presence — what actually happened in the last 7 days ──────────────
  if (n === 0) {
    lines.push('7 วันที่ผ่านมาเราไม่ได้เจอกัน')
  } else if (n === 1) {
    lines.push('ช่วง 7 วันที่ผ่านมาคุณแวะมาหนึ่งครั้ง')
  } else if (n <= 3) {
    lines.push(`7 วันที่ผ่านมาคุณกลับมา ${n} ครั้ง`)
  } else if (n <= 5) {
    lines.push(`7 วันที่ผ่านมาคุณกลับมาหาตัวเอง ${n} ครั้ง`)
  } else if (n === 6) {
    lines.push('ช่วงนี้คุณกลับมาเกือบทุกวัน')
  } else {
    lines.push('ช่วงนี้คุณกลับมาทุกวัน')
  }

  // ── 2. Mood — observe without evaluation ─────────────────────────────────
  if (n > 0) {
    if (top?.tied) {
      // Multiple moods share the top count — don't pick one arbitrarily
      lines.push('หลายอารมณ์ผลัดกันเข้ามาในช่วงนี้')
    } else if (dominant) {
      const q = qualifier(domFreq, n)
      const prefix = q ? `${q}คุณ` : 'คุณ'

      if (dominant === 'เหนื่อย') {
        lines.push(`${prefix}เลือกคำว่า "เหนื่อย"`)
      } else if (dominant === 'สับสน') {
        lines.push(`${prefix}บอกว่าสับสน`)
      } else if (dominant === 'พอไหว' && n >= 3) {
        lines.push(`${prefix}บอกว่าพอไหว`)
      } else if (dominant === 'สบายดี' && n >= 3) {
        lines.push(`${prefix}บอกว่าสบายดี`)
      }
    }
  }

  // ── 3. Contrast or quiet acknowledgment ──────────────────────────────────
  if (n === 0) {
    if (journalCount > 0) {
      // Has journals but no checkins — warm combined mention (also serves as closing)
      lines.push('แม้เราไม่ได้เช็คอินกัน แต่คุณยังได้กลับมาเขียนบางอย่างไว้')
    } else {
      lines.push('Care ยังคิดถึงนะ')
    }
  } else if (dominant === 'เหนื่อย' || dominant === 'สับสน') {
    lines.push('แต่คุณก็ยังกลับมา')
  }

  // ── 4. Journal — only when checkins exist (zero-checkin case handled above) ──
  if (n > 0) {
    const excerpt = journalExcerpt ? safeExcerpt(journalExcerpt) : null
    if (excerpt) {
      lines.push(`คุณเขียนว่า "${excerpt}"`)
    } else if (journalCount === 1) {
      lines.push('คุณยังเขียนบันทึกไว้ด้วย')
    } else if (journalCount > 1) {
      lines.push(`คุณยังเขียนบันทึกไว้ ${journalCount} ครั้งด้วย`)
    }
  }

  // ── 5. Streak — observe the fact, nothing more ────────────────────────────
  if (streak >= 7 && n > 0) {
    lines.push(`${streak} วันติดต่อกันแล้ว`)
  }

  // ── 6. Closing — always last when there were checkins ────────────────────
  if (n > 0) {
    lines.push('ขอบคุณนะ')
  }
  // Zero-checkin closing is already appended in step 3.

  return { lines }
}

// ── Exported utility (used by diary/page.tsx) ─────────────────────────────────

export function firstLine(text: string, max = 72): string {
  const t = text.trim()
  const nl = t.indexOf('\n')
  const cut = nl > 0 && nl <= max ? t.slice(0, nl) : t.slice(0, max)
  return cut.trimEnd() + (cut.length < t.length && nl < 0 ? '…' : '')
}
