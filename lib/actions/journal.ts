'use server'

import { redirect } from 'next/navigation'

export async function saveJournal(formData: FormData) {
  // AUTH DISABLED: skip DB write
  const body = String(formData.get('body') ?? '').trim()
  if (!body) redirect('/journal')
  redirect('/journal?saved=1')
}
