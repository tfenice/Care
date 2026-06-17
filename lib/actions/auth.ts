'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email) redirect('/login?error=invalid_email')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    console.error('[signIn] NEXT_PUBLIC_SITE_URL is not set')
    redirect('/login?error=config')
  }

  const emailRedirectTo = `${siteUrl}/auth/callback?next=/checkin`

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })
    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('[signIn] OTP send failed:', error.name, (error as any).status, error.message)
      redirect('/login?error=send_failed')
    }
  } catch (e: unknown) {
    console.error('[signIn] OTP threw:', e instanceof Error ? e.message : String(e))
    redirect('/login?error=send_failed')
  }

  redirect('/login?sent=1')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
