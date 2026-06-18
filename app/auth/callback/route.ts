import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/checkin'
  // Reject `//evil.com` (double-slash open-redirect bypass)
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/checkin'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', origin))
  }

  // Create the redirect response first so we can attach session cookies to it
  const redirectResponse = NextResponse.redirect(new URL(next, origin))

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { flowType: 'pkce' },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    // Log raw details server-side only — never forward to browser URL.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error('[auth/callback] exchange error:', `name=${error.name}|msg=${error.message}|status=${(error as any).status}|code=${(error as any).code}`)
    return NextResponse.redirect(
      new URL('/login?error=link_invalid', origin)
    )
  }

  return redirectResponse
}
