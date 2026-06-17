'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MOOD_KEYS, type MoodKey } from '@/types/models'

export async function submitCheckin(formData: FormData) {
  const moodKey = formData.get('mood_key') as string
  if (!MOOD_KEYS.includes(moodKey as MoodKey)) redirect('/checkin?error=mood')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('daily_checkins').insert({
    user_id: user.id,
    mood_key: moodKey,
    note: String(formData.get('note') ?? '').trim() || null,
  })

  if (error) redirect('/checkin?error=save')

  // Update streak via SECURITY DEFINER function — bypasses the removed profile
  // UPDATE policy while still running trusted server-side logic.
  const todayBK = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())
  const { error: streakError } = await supabase.rpc('update_streak_after_checkin', {
    p_user_id: user.id,
    p_today:   todayBK,
  })
  if (streakError) {
    // Non-fatal: the checkin was saved. Streak will self-correct on the next
    // successful checkin. Log for debugging in Vercel function logs.
    console.error('[checkin] streak update failed:', streakError.message)
  }

  redirect('/cards')
}
