// Browser Supabase client — use in Client Components and hooks.
// Returns a singleton so the same connection is reused across renders.
//
// Requires: npm install @supabase/supabase-js @supabase/ssr

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
