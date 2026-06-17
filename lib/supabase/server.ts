// Server-side Supabase client — use in Server Components and Route Handlers.
// Creates a new instance per request so session cookies are correctly scoped.
//
// Requires: npm install @supabase/supabase-js @supabase/ssr

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { flowType: 'pkce' },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Silently ignore when called from a Server Component —
            // proxy.ts handles the actual cookie refresh.
          }
        },
      },
    }
  )
}
