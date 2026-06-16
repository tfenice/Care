'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function bangkokDateString(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(date)
}

export async function drawCard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = bangkokDateString(new Date())

  // Idempotency: if card already drawn today, skip to reveal
  const { data: existing } = await supabase
    .from('reading_history')
    .select('id')
    .eq('user_id', user.id)
    .gte('read_at', `${today}T00:00:00+07:00`)
    .limit(1)
    .maybeSingle()

  if (existing) redirect('/cards')

  // Get today's checkin_id to link reading_history back to the check-in
  const { data: todayCheckin } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('user_id', user.id)
    .gte('checked_in_at', `${today}T00:00:00+07:00`)
    .order('checked_in_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const checkinId = todayCheckin?.id ?? null

  // Parallel: all active cards + user's full reading history
  const [{ data: allCards }, { data: seenHistory }] = await Promise.all([
    supabase.from('ritual_cards').select('id').eq('is_active', true),
    supabase.from('reading_history').select('card_id').eq('user_id', user.id),
  ])

  if (!allCards || allCards.length === 0) redirect('/checkin')

  const seenSet = new Set((seenHistory ?? []).map(h => h.card_id))
  const unseenIds = allCards.filter(c => !seenSet.has(c.id)).map(c => c.id)

  let cardId: string

  if (unseenIds.length > 0) {
    // Pick a random unseen card
    cardId = unseenIds[Math.floor(Math.random() * unseenIds.length)]
  } else {
    // All cards seen — fall back to the card seen longest ago
    const { data: oldest } = await supabase
      .from('reading_history')
      .select('card_id')
      .eq('user_id', user.id)
      .order('read_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!oldest) redirect('/checkin')
    cardId = oldest.card_id
  }

  await supabase
    .from('reading_history')
    .insert({ user_id: user.id, card_id: cardId, checkin_id: checkinId })

  redirect('/cards')
}
