// Memory Extractor — deterministic NLP-lite, no LLM
// Extracts themes, recurring topics, and emotional patterns from journal text.

export interface MemoryInput {
  journals: Array<{ body: string; created_at: string }>
  checkins: Array<{ mood_key: string; note: string | null; checked_in_at: string }>
}

export interface ExtractedMemory {
  content: string
  source_type: 'journal' | 'checkin' | 'synthesis'
  themes: string[]
}

// ── Keyword dictionaries ──────────────────────────────────────────────────────
// Each theme maps to Thai keywords that signal it.

const THEME_KEYWORDS: Record<string, string[]> = {
  'ครอบครัว': ['แม่', 'พ่อ', 'ครอบครัว', 'น้อง', 'พี่', 'ลูก', 'สามี', 'ภรรยา', 'บ้าน'],
  'การงาน': ['งาน', 'ออฟฟิศ', 'เพื่อนร่วมงาน', 'หัวหน้า', 'ประชุม', 'โปรเจกต์', 'เส้นตาย', 'ลูกค้า'],
  'ความสัมพันธ์': ['เพื่อน', 'แฟน', 'คนรัก', 'คุย', 'ทะเลาะ', 'คิดถึง', 'เหงา', 'ขาดหาย'],
  'สุขภาพ': ['นอน', 'กิน', 'ออกกำลังกาย', 'เจ็บ', 'ป่วย', 'หมอ', 'พักผ่อน', 'เหนื่อย'],
  'ความกังวล': ['กังวล', 'กลัว', 'ไม่แน่ใจ', 'สับสน', 'ไม่รู้', 'กดดัน', 'เครียด', 'ยาก'],
  'ความหวัง': ['หวัง', 'อยาก', 'ฝัน', 'ตั้งใจ', 'พยายาม', 'เริ่ม', 'ดีขึ้น', 'ก้าวหน้า'],
  'ความสุข': ['สนุก', 'ดีใจ', 'ชอบ', 'รัก', 'มีความสุข', 'ยิ้ม', 'หัวเราะ', 'สบาย'],
  'การยอมรับ': ['ยอมรับ', 'ปล่อยวาง', 'ผ่านมาได้', 'โอเค', 'ไม่เป็นไร', 'เข้าใจ', 'ให้อภัย'],
}

// ── Theme extractor ────────────────────────────────────────────────────────────

export function extractThemes(text: string): string[] {
  const lower = text.toLowerCase()
  const found: string[] = []
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      found.push(theme)
    }
  }
  return found
}

// ── Mood pattern analyzer ──────────────────────────────────────────────────────

function analyzeMoodPattern(checkins: MemoryInput['checkins']): string | null {
  if (checkins.length < 3) return null

  const counts: Record<string, number> = {}
  for (const c of checkins) {
    counts[c.mood_key] = (counts[c.mood_key] ?? 0) + 1
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const dominant = sorted[0]
  if (!dominant) return null

  const pct = Math.round((dominant[1] / checkins.length) * 100)
  if (pct >= 60) {
    return `อารมณ์ที่พบบ่อยที่สุดในช่วงนี้คือ "${dominant[0]}" (${pct}% ของวันที่บันทึก)`
  }
  if (sorted.length >= 2) {
    return `อารมณ์ในช่วงนี้หลากหลาย — "${sorted[0][0]}" และ "${sorted[1][0]}" สลับกันบ่อย`
  }
  return null
}

// ── Journal memory extractor ───────────────────────────────────────────────────

function extractJournalMemories(journals: MemoryInput['journals']): ExtractedMemory[] {
  const memories: ExtractedMemory[] = []

  // Theme frequency across all journals
  const themeCount: Record<string, number> = {}
  for (const j of journals) {
    const themes = extractThemes(j.body)
    for (const t of themes) {
      themeCount[t] = (themeCount[t] ?? 0) + 1
    }
  }

  // Recurring themes (appeared in 2+ journals)
  const recurring = Object.entries(themeCount)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([theme]) => theme)

  if (recurring.length > 0) {
    memories.push({
      content: `เรื่องที่ปรากฏซ้ำในบันทึก: ${recurring.slice(0, 3).join(', ')}`,
      source_type: 'journal',
      themes: recurring.slice(0, 3),
    })
  }

  return memories
}

// ── Main export ────────────────────────────────────────────────────────────────

export function extractMemories(input: MemoryInput): ExtractedMemory[] {
  const memories: ExtractedMemory[] = []

  // 1. Journal theme patterns
  memories.push(...extractJournalMemories(input.journals))

  // 2. Mood pattern memory
  const moodPattern = analyzeMoodPattern(input.checkins)
  if (moodPattern) {
    memories.push({
      content: moodPattern,
      source_type: 'checkin',
      themes: [],
    })
  }

  // 3. Synthesis: combine mood + themes
  const allThemes = input.journals.flatMap(j => extractThemes(j.body))
  const topTheme = allThemes.length > 0
    ? Object.entries(
        allThemes.reduce<Record<string, number>>((acc, t) => {
          acc[t] = (acc[t] ?? 0) + 1; return acc
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null

  if (topTheme && input.checkins.length >= 3) {
    const dominantMood = Object.entries(
      input.checkins.reduce<Record<string, number>>((acc, c) => {
        acc[c.mood_key] = (acc[c.mood_key] ?? 0) + 1; return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0]

    if (dominantMood) {
      memories.push({
        content: `ช่วงนี้คุณมักรู้สึก "${dominantMood}" เกี่ยวกับเรื่อง "${topTheme}"`,
        source_type: 'synthesis',
        themes: [topTheme],
      })
    }
  }

  return memories
}
