// Demo-only until Launch Hardening Sprint.
// Replace with user-scoped Supabase queries after auth is restored.

export const DEMO_DASHBOARD = {
  name: null as string | null,
  streak: 3,
  longestStreak: 7,
  totalCheckins: 12,
  totalJournals: 5,
  totalCards: 9,
  latestJournal: {
    body: 'วันนี้รู้สึกเหนื่อยนิดหน่อย แต่ก็ผ่านมาได้ทุกครั้ง บางทีการแค่หยุดพักก็เพียงพอแล้วสำหรับวันนี้',
  },
  latestCard: {
    categoryNameTh: 'การยอมรับ',
    titleTh: 'ให้เวลากับตัวเองสักนิด',
    bodyTh: 'บางวันแค่ได้หยุดพักก็เพียงพอแล้ว คุณไม่จำเป็นต้องทำทุกอย่างให้สมบูรณ์แบบ',
  },
}

// Input for generateWeeklyReflection() on the home dashboard
export const DEMO_WEEK_CHECKINS: Array<{ mood_key: string; note: string | null }> = [
  { mood_key: 'เหนื่อย', note: null },
  { mood_key: 'พอไหว',  note: null },
  { mood_key: 'พอไหว',  note: null },
  { mood_key: 'สบายดี', note: null },
  { mood_key: 'พอไหว',  note: null },
]

export const DEMO_WEEK_JOURNALS: Array<{ body: string }> = [
  { body: 'วันนี้รู้สึกดีขึ้นมาก' },
  { body: 'เหนื่อยแต่ก็ยังไหว' },
]

export const DEMO_WEEK_CARDS: Array<{ category_name_th: string | null; title_th: string }> = [
  { category_name_th: 'การยอมรับ', title_th: 'ให้เวลากับตัวเองสักนิด' },
  { category_name_th: 'การยอมรับ', title_th: 'ความเป็นมนุษย์ที่ไม่สมบูรณ์' },
  { category_name_th: 'ความหวัง',  title_th: 'แสงเล็กๆ ที่ยังมีอยู่' },
]

// Input for extractMemories() on the home dashboard
export const DEMO_MEMORY_JOURNALS: Array<{ body: string; created_at: string }> = [
  { body: 'วันนี้คุยกับแม่แล้วรู้สึกดีขึ้น ครอบครัวสำคัญมาก', created_at: '2026-06-14' },
  { body: 'งานเยอะมาก เหนื่อย แต่ก็พยายามต่อไป',             created_at: '2026-06-13' },
  { body: 'วันหยุดอยู่บ้านกับครอบครัว มีความสุข',             created_at: '2026-06-11' },
]

export const DEMO_MEMORY_CHECKINS: Array<{ mood_key: string; note: string | null; checked_in_at: string }> = [
  { mood_key: 'เหนื่อย', note: null, checked_in_at: '2026-06-14' },
  { mood_key: 'พอไหว',  note: null, checked_in_at: '2026-06-13' },
  { mood_key: 'สบายดี', note: null, checked_in_at: '2026-06-11' },
  { mood_key: 'เหนื่อย', note: null, checked_in_at: '2026-06-10' },
]
