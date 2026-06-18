import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UUID_RE, toBangkokDate, formatBangkokDisplay } from '@/lib/utils'
import { getCategoryToken } from '@/lib/card-tokens'
import { getSecondPageContent } from '@/lib/card-second-page'
import { SecondPage } from '@/components/care/SecondPage'
import PrimaryButton from '@/components/ui/PrimaryButton'

function formatThaiDate(ts: string): string {
  return formatBangkokDisplay(ts, { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function SecondPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const rawId = typeof params.card === 'string' ? params.card : null
  const cardId = rawId && UUID_RE.test(rawId) ? rawId : null
  if (!cardId) redirect('/cards')

  // Fetch card + reading history in parallel.
  // History rows limited to 2: [0] = current draw, [1] = previous (if exists).
  const [cardResult, historyResult] = await Promise.all([
    supabase
      .from('ritual_cards')
      .select('title_th, sort_order, card_categories(name_th)')
      .eq('id', cardId)
      .eq('is_active', true)
      .maybeSingle(),
    supabase
      .from('reading_history')
      .select('read_at')
      .eq('user_id', user.id)
      .eq('card_id', cardId)
      .order('read_at', { ascending: false })
      .limit(2),
  ])

  // Card not found or inactive
  if (!cardResult.data) redirect('/cards')

  // Ownership check: user must have at least one reading_history row
  if (historyResult.error || !historyResult.data || historyResult.data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="space-y-4">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <h1 className="text-xl font-semibold text-ink leading-relaxed">
              การ์ดใบนี้ยังไม่ได้เดินทางมาหาคุณ
            </h1>
          </div>
          <PrimaryButton href="/cards">กลับ</PrimaryButton>
        </div>
      </div>
    )
  }

  const card = cardResult.data as unknown as {
    title_th: string
    sort_order: number
    card_categories: { name_th: string } | null
  }
  const category = card.card_categories?.name_th ?? 'CARE'
  const token = getCategoryToken(category)
  const code = card.sort_order
    ? `${token.code}-${String(card.sort_order).padStart(2, '0')}`
    : null

  const content = getSecondPageContent(code, category)

  // ── Previous encounter (optional) ─────────────────────────────────────────
  // If there are 2+ history rows, index [1] is the most recent prior draw.
  let previousEncounter: { date: string; excerpt: string | null } | null = null

  if (historyResult.data.length >= 2) {
    const prevRow = historyResult.data[1]
    const prevDate = toBangkokDate(prevRow.read_at)
    const prevStart = `${prevDate}T00:00:00+07:00`
    const prevEnd   = `${prevDate}T23:59:59+07:00`

    // Look for a journal entry written on the same Bangkok date as the previous draw.
    // This is a heuristic: the user likely journalled after drawing the card.
    const journalResult = await supabase
      .from('journal_entries')
      .select('body')
      .eq('user_id', user.id)
      .gte('created_at', prevStart)
      .lte('created_at', prevEnd)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    const rawExcerpt = journalResult.data?.body ?? null
    const excerpt = rawExcerpt
      ? rawExcerpt.length > 120
        ? rawExcerpt.slice(0, 117).trimEnd() + '...'
        : rawExcerpt
      : null

    previousEncounter = {
      date: formatThaiDate(prevRow.read_at),
      excerpt,
    }
  }

  return (
    <SecondPage
      code={code}
      category={category}
      origin={content.origin}
      reflection={content.reflection}
      previousEncounter={previousEncounter}
    />
  )
}
