// Pure function — no async, no Supabase.
// Pass Bangkok calendar dates (YYYY-MM-DD) computed by the caller.

export type MissYouResult = {
  shouldShow: boolean
  daysAway: number
  message: string
  sub: string
}

export function getMissYouState(
  lastCheckinISO: string | null,
  todayISO: string,
): MissYouResult {
  const none = { shouldShow: false, daysAway: 0, message: '', sub: '' }
  if (!lastCheckinISO) return none

  // Both strings are YYYY-MM-DD Bangkok dates; treat as UTC midnight for diff
  const last  = new Date(lastCheckinISO + 'T00:00:00Z')
  const today = new Date(todayISO       + 'T00:00:00Z')
  const daysAway = Math.round((today.getTime() - last.getTime()) / 86_400_000)

  if (daysAway < 3) return { ...none, daysAway }

  let message: string
  let sub: string
  if (daysAway >= 14) {
    message = 'ไม่ว่าจะนานแค่ไหน Care ยังรอคุณอยู่เสมอ'
    sub = 'ยินดีต้อนรับกลับมานะ'
  } else if (daysAway >= 7) {
    message = 'ผ่านมาสักพักแล้ว ยินดีต้อนรับกลับมาค่ะ'
    sub = `ห่างกันไป ${daysAway} วัน`
  } else {
    message = 'อยากให้รู้ว่า Care คิดถึงคุณนะ'
    sub = `ห่างกันไป ${daysAway} วัน`
  }

  return { shouldShow: true, daysAway, message, sub }
}
