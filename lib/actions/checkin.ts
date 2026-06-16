'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MOOD_KEYS, type MoodKey } from '@/types/models'

function bangkokDateString(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(date)
}

export async function submitCheckin(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const moodKey = formData.get('mood_key') as string
  if (!MOOD_KEYS.includes(moodKey as MoodKey)) redirect('/checkin?error=mood')

  const note = String(formData.get('note') ?? '').trim() || null

  const now = new Date()
  const today = bangkokDateString(now)
  const yesterday = bangkokDateString(new Date(now.getTime() - 86_400_000))

  // Guarantee a profile row exists. The on_auth_user_created trigger handles new users
  // going forward, but any user who authenticated before the migration ran has no row.
  await supabase
    .from('profiles')
    .upsert({ id: user.id, updated_at: new Date().toISOString() }, { onConflict: 'id' })

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Idempotency guard — skip insert and go straight to /cards if already done today
  if (profile?.last_checkin_date === today) {
    redirect('/cards')
  }

  const { error: insertError } = await supabase
    .from('daily_checkins')
    .insert({ user_id: user.id, mood_key: moodKey, note })

  if (insertError) redirect('/checkin?error=save')

  const prevStreak = profile?.current_streak ?? 0
  const newStreak = profile?.last_checkin_date === yesterday ? prevStreak + 1 : 1
  const newLongest = Math.max(newStreak, profile?.longest_streak ?? 0)

  await supabase
    .from('profiles')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_checkin_date: today,
    })
    .eq('id', user.id)

  redirect('/cards')
}
