// Pure function — no async, no Supabase.
// Pass Bangkok calendar dates (YYYY-MM-DD) computed by the caller.
//
// Tone contract:
//   ✓ Presence  — "เราก็ยังอยู่ตรงนี้"
//   ✓ Welcome   — "พื้นที่ตรงนี้ยังเป็นของคุณเสมอ"
//   ✓ Patience  — "ค่อย ๆ กลับมาเมื่อพร้อมก็ได้"
//   ✗ Never guilt ("คุณหายไป", "อย่าลืม", "กลับมาเช็คอิน")

export type MissYouResult = {
  shouldShow: boolean
  daysAway: number
  line1: string   // quiet observation or acknowledgment
  line2: string   // welcome / presence / patience
}

export function getMissYouState(
  lastCheckinISO: string | null,
  todayISO: string,
): MissYouResult {
  const none: MissYouResult = { shouldShow: false, daysAway: 0, line1: '', line2: '' }
  if (!lastCheckinISO) return none

  // Both strings are YYYY-MM-DD Bangkok dates; treat as UTC midnight for diff
  const last  = new Date(lastCheckinISO + 'T00:00:00Z')
  const today = new Date(todayISO       + 'T00:00:00Z')
  const daysAway = Math.round((today.getTime() - last.getTime()) / 86_400_000)

  if (daysAway < 3) return { ...none, daysAway }

  let line1: string
  let line2: string

  if (daysAway >= 14) {
    line1 = 'เวลาผ่านไปพอสมควรแล้ว'
    line2 = 'แต่พื้นที่ตรงนี้ยังเป็นของคุณเสมอ'
  } else if (daysAway >= 7) {
    line1 = 'ดูเหมือนช่วงนี้จะมีหลายอย่างเกิดขึ้น'
    line2 = 'ไม่เป็นไรนะ ค่อย ๆ กลับมาเมื่อพร้อมก็ได้'
  } else {
    line1 = 'ไม่เห็นคุณมาสักพักแล้วนะ'
    line2 = 'วันนี้ถ้าอยากเล่าอะไร เราก็ยังอยู่ตรงนี้'
  }

  return { shouldShow: true, daysAway, line1, line2 }
}
