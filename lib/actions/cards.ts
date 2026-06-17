'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function drawCard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cards, error: cardsError } = await supabase
    .from('ritual_cards')
    .select('id')
    .eq('is_active', true)
    .limit(100)

  if (cardsError) {
    console.error('[drawCard] cards fetch failed:', cardsError.message)
    redirect('/cards?error=draw')
  }

  if (!cards || cards.length === 0) {
    console.error('[drawCard] no active cards found in ritual_cards')
    redirect('/cards?error=draw')
  }

  const picked = cards[Math.floor(Math.random() * cards.length)]

  const { error: historyError } = await supabase.from('reading_history').insert({
    user_id: user.id,
    card_id: picked.id,
  })

  if (historyError) {
    // Non-fatal: the card was selected and the user experience continues.
    // The reading_history row is missing for this draw — card deduplication
    // will have a gap, but the user still sees their card.
    console.error('[drawCard] reading_history insert failed:', historyError.message)
  }

  redirect(`/cards?drawn=1&card=${picked.id}`)
}
