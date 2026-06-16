// Demo-only until Launch Hardening Sprint.
// Replace with user-scoped Supabase queries after auth is restored.

export const DEMO_JOURNALS: Array<{ body: string; created_at: string }> = [
  { body: 'วันนี้คุยกับแม่แล้วรู้สึกดีขึ้นมาก ครอบครัวสำคัญมากจริงๆ',                created_at: '2026-06-14' },
  { body: 'งานเยอะมาก เหนื่อยจริงๆ แต่ก็พยายามต่อไป เพื่อนร่วมงานช่วยได้เยอะ',       created_at: '2026-06-13' },
  { body: 'นอนไม่หลับ คิดเรื่องงานตลอด กังวลเรื่องเส้นตายที่จะมาถึง',                created_at: '2026-06-12' },
  { body: 'วันหยุดอยู่บ้านกับครอบครัว มีความสุขมาก สบายใจมากกว่าวันธรรมดา',           created_at: '2026-06-11' },
  { body: 'เริ่มออกกำลังกายใหม่ หวังว่าจะทำได้ต่อเนื่อง รู้สึกดีขึ้นนิดหน่อย',        created_at: '2026-06-10' },
]

export const DEMO_CHECKINS: Array<{ mood_key: string; note: string | null; checked_in_at: string }> = [
  { mood_key: 'เหนื่อย', note: null, checked_in_at: '2026-06-14' },
  { mood_key: 'พอไหว',  note: null, checked_in_at: '2026-06-13' },
  { mood_key: 'เหนื่อย', note: null, checked_in_at: '2026-06-12' },
  { mood_key: 'สบายดี', note: null, checked_in_at: '2026-06-11' },
  { mood_key: 'พอไหว',  note: null, checked_in_at: '2026-06-10' },
  { mood_key: 'เหนื่อย', note: null, checked_in_at: '2026-06-09' },
]
