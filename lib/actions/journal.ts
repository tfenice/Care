'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function saveJournal(formData: FormData) {
  const body = String(formData.get('body') ?? '').trim()
  if (!body) redirect('/journal')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('journal_entries').insert({ user_id: user.id, body })

  if (error) redirect('/journal?error=save')

  redirect('/journal?saved=1')
}
