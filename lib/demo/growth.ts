// Demo-only until Launch Hardening Sprint.
// Replace with user-scoped Supabase queries after auth is restored.

export type DayMood = { day: string; mood: string | null }

export const DEMO_GROWTH = {
  streak: 3,
  longest: 7,
  totalCheckins: 12,
  totalCards: 9,
  totalJournals: 5,
  moodBreakdown: [
    { mood: 'สบายดี', count: 5 },
    { mood: 'พอไหว',  count: 4 },
    { mood: 'เหนื่อย', count: 2 },
    { mood: 'สับสน',  count: 1 },
  ],
  last30: [
    false, false, false, false, false, false, false,
    false, false, false, false, false, false, false,
    false, false, false, false, true,  false, false,
    true,  true,  false, true,  true,  false, true,
    true,  true,
  ],
  last7: [
    { day: 'จ',  mood: 'เหนื่อย' },
    { day: 'อ',  mood: 'พอไหว' },
    { day: 'พ',  mood: null },
    { day: 'พฤ', mood: 'เหนื่อย' },
    { day: 'ศ',  mood: 'สบายดี' },
    { day: 'ส',  mood: 'พอไหว' },
    { day: 'อา', mood: 'พอไหว' },
  ] as DayMood[],
}

// Journals used for the weekly reflection section on /growth
export const DEMO_GROWTH_WEEK_JOURNALS: Array<{ body: string }> = [
  { body: 'วันนี้รู้สึกดีขึ้น' },
  { body: 'เหนื่อยแต่ก็ไหว' },
]

// Cards used for the weekly reflection section on /growth
export const DEMO_GROWTH_WEEK_CARDS: Array<{ category_name_th: string | null; title_th: string }> = [
  { category_name_th: 'การยอมรับ', title_th: '' },
  { category_name_th: 'การยอมรับ', title_th: '' },
]
