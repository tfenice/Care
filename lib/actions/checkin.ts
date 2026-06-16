'use server'

import { redirect } from 'next/navigation'
import { MOOD_KEYS, type MoodKey } from '@/types/models'

export async function submitCheckin(formData: FormData) {
  // AUTH DISABLED: skip DB writes, just validate and redirect
  const moodKey = formData.get('mood_key') as string
  if (!MOOD_KEYS.includes(moodKey as MoodKey)) redirect('/checkin?error=mood')
  redirect('/cards')
}
