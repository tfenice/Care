'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function bangkokDateString(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(date)
}

export async function saveJournal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const body = String(formData.get('body') ?? '').trim()
  // Silently discard empty submissions rather than showing an error
  if (!body) redirect('/journal')

  const entryId = String(formData.get('entry_id') ?? '').trim() || null

  if (entryId) {
    // Update — user owns this entry (RLS enforces; .eq(user_id) is defense-in-depth)
    await supabase
      .from('journal_entries')
      .update({ body })
      .eq('id', entryId)
      .eq('user_id', user.id)
  } else {
    // Insert — derive checkin_id server-side, never trust a hidden input
    const today = bangkokDateString(new Date())
    const { data: todayCheckin } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('checked_in_at', `${today}T00:00:00+07:00`)
      .order('checked_in_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    await supabase.from('journal_entries').insert({
      user_id: user.id,
      checkin_id: todayCheckin?.id ?? null,
      body,
    })
  }

  redirect('/journal?saved=1')
}
