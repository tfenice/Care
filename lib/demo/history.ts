// Demo-only until Launch Hardening Sprint.
// Replace with user-scoped Supabase queries after auth is restored.

export const DEMO_HISTORY_ENTRIES: Array<{
  key: string
  displayDate: string
  moodKey: string
  cardTitle: string | null
  journalBody: string | null
}> = [
  { key: '1', displayDate: '16 มิถุนายน', moodKey: 'พอไหว',  cardTitle: 'ให้เวลากับตัวเองสักนิด',     journalBody: 'วันนี้รู้สึกเหมือนมีอะไรหลายอย่างที่ต้องทำ แต่ก็พยายามจัดการทีละอย่าง' },
  { key: '2', displayDate: '15 มิถุนายน', moodKey: 'สบายดี', cardTitle: 'ความเงียบคือพื้นที่ให้ใจพัก', journalBody: null },
  { key: '3', displayDate: '14 มิถุนายน', moodKey: 'เหนื่อย', cardTitle: null,                          journalBody: 'เหนื่อยมากวันนี้ แต่ก็ผ่านมาได้' },
  { key: '4', displayDate: '13 มิถุนายน', moodKey: 'สบายดี', cardTitle: 'หยุดพักแล้วไปต่อได้เสมอ',    journalBody: null },
  { key: '5', displayDate: '12 มิถุนายน', moodKey: 'สับสน',  cardTitle: null,                          journalBody: null },
]
