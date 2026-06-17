'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function drawCard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Server-side randomization lives in the action, not in a component
  const { data: cards } = await supabase
    .from('ritual_cards')
    .select('id')
    .eq('is_active', true)
    .limit(100)

  if (!cards || cards.length === 0) redirect('/cards')

  const picked = cards[Math.floor(Math.random() * cards.length)]

  // Persist draw (best-effort — don't block on RLS error)
  await supabase.from('reading_history').insert({
    user_id: user.id,
    card_id: picked.id,
  })

  redirect(`/cards?drawn=1&card=${picked.id}`)
}
