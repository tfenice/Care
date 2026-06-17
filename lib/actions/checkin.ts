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

  redirect('/cards')
}
