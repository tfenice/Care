// Weekly Care Letter — template-driven, no AI.
//
// Tone contract:
//   ✓ Observe  — state what happened ("คุณกลับมา 5 ครั้ง")
//   ✓ Reflect  — name what was there ("หลายวันคุณเลือกคำว่า 'เหนื่อย'")
//   ✓ Accompany — quiet presence ("แต่คุณก็ยังกลับมา")
//   ✗ Never teach, diagnose, coach, or evaluate

export type CareLetterInput = {
  weekMoods: string[]           // mood_key per checkin this week (0–7 items)
  journalCount: number
  journalExcerpt: string | null // first line of most recent journal entry
  streak: number
}

export type CareLetter = {
  // Each string is one short paragraph — 1 sentence or phrase.
  // Last item is always the quiet closing ("ขอบคุณนะ", etc.).
  lines: string[]
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function countMoods(moods: string[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const mood of moods) m.set(mood, (m.get(mood) ?? 0) + 1)
  return m
}

function topMood(counts: Map<string, number>): string | null {
  let best: string | null = null
  let bestN = 0
  for (const [k, v] of counts) {
    if (v > bestN) { best = k; bestN = v }
  }
  return best
}

// "หลายวัน" / "บางวัน" / "ทุกวัน" / "" (single checkin)
function qualifier(freq: number, total: number): string {
  if (total <= 1) return ''
  if (freq === total) return 'ทุกวัน'
  if (freq >= 3 || freq > total / 2) return 'หลายวัน'
  return 'บางวัน'
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateCareLetter(input: CareLetterInput): CareLetter {
  const { weekMoods, journalCount, journalExcerpt, streak } = input
  const n = weekMoods.length
  const counts = countMoods(weekMoods)
  const dominant = topMood(counts)
  const domFreq = dominant ? (counts.get(dominant) ?? 0) : 0

  const lines: string[] = []

  // ── 1. Presence — what actually happened ─────────────────────────────────
  if (n === 0) {
    lines.push('สัปดาห์ที่ผ่านมาเราไม่ได้เจอกัน')
  } else if (n === 1) {
    lines.push('สัปดาห์นี้คุณแวะมาหนึ่งครั้ง')
  } else if (n <= 3) {
    lines.push(`สัปดาห์นี้คุณกลับมา ${n} ครั้ง`)
  } else if (n <= 5) {
    lines.push(`สัปดาห์นี้คุณกลับมาหาตัวเอง ${n} ครั้ง`)
  } else if (n === 6) {
    lines.push('สัปดาห์นี้คุณกลับมาเกือบทุกวัน')
  } else {
    lines.push('สัปดาห์นี้คุณกลับมาทุกวัน')
  }

  // ── 2. Mood — observe without evaluation ─────────────────────────────────
  if (dominant && n > 0) {
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

  // ── 3. Contrast or quiet acknowledgment ──────────────────────────────────
  if (n === 0) {
    lines.push('Care ยังคิดถึงนะ')
  } else if (dominant === 'เหนื่อย' || dominant === 'สับสน') {
    lines.push('แต่คุณก็ยังกลับมา')
  }

  // ── 4. Journal — if the user wrote, note it ───────────────────────────────
  if (journalExcerpt) {
    lines.push(`คุณเขียนว่า "${journalExcerpt}"`)
  } else if (journalCount === 1) {
    lines.push('คุณยังเขียนบันทึกไว้ด้วย')
  } else if (journalCount > 1) {
    lines.push(`คุณยังเขียนบันทึกไว้ ${journalCount} ครั้งด้วย`)
  }

  // ── 5. Streak — observe the fact, nothing more ────────────────────────────
  if (streak >= 7 && n > 0) {
    lines.push(`${streak} วันติดต่อกันแล้ว`)
  }

  // ── 6. Closing — always last, always short ────────────────────────────────
  if (n === 0) {
    // closing already handled in step 3 — no duplicate
  } else {
    lines.push('ขอบคุณนะ')
  }

  return { lines }
}

// ── Exported utility (used by diary/page.tsx) ─────────────────────────────────

export function firstLine(text: string, max = 72): string {
  const t = text.trim()
  const nl = t.indexOf('\n')
  const cut = nl > 0 && nl <= max ? t.slice(0, nl) : t.slice(0, max)
  return cut.trimEnd() + (cut.length < t.length && nl < 0 ? '…' : '')
}
