'use server'

import { redirect } from 'next/navigation'

export async function drawCard() {
  // AUTH DISABLED: skip DB, go straight to demo card
  redirect('/cards?drawn=1')
}
