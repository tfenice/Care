'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function drawCard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Card selection and reading_history insert deferred — no deck query exists yet.
  // See DATA-02 in docs/KNOWN_TECH_DEBT.md.
  redirect('/cards?drawn=1')
}
