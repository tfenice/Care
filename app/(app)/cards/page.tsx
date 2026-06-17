import { redirect } from 'next/navigation'
import { drawCard } from '@/lib/actions/cards'
import { createClient } from '@/lib/supabase/server'
import CardDeck from '@/components/care/CardDeck'
import CardReveal from '@/components/care/CardReveal'
import PrimaryButton from '@/components/ui/PrimaryButton'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type DrawnCard = {
  title_th: string
  body_th: string
  reflection_prompt_th: string | null
  card_categories: { name_th: string } | null
}

function toBangkokDate(ts: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(ts))
}

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const drawn = params.drawn === '1'

  // ── State B: card already drawn — show the reveal ──────────────────────────
  if (drawn) {
    const rawId = typeof params.card === 'string' ? params.card : null
    const cardId = rawId && UUID_RE.test(rawId) ? rawId : null
    if (!cardId) redirect('/cards')

    const { data } = await supabase
      .from('ritual_cards')
      .select('title_th, body_th, reflection_prompt_th, card_categories(name_th)')
      .eq('id', cardId)
      .eq('is_active', true)
      .maybeSingle()

    const card = data as DrawnCard | null
    if (!card) redirect('/cards')

    const category = card.card_categories?.name_th ?? 'CARE'

    return (
      <div className="min-h-screen flex items-start justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <CardReveal
            category={category}
            titleTh={card.title_th}
            bodyTh={card.body_th}
            reflectionPromptTh={card.reflection_prompt_th}
          />
        </div>
      </div>
    )
  }

  // ── State A: gate checks before showing the ritual deck ───────────────────
  const now = new Date()
  const todayBK = toBangkokDate(now.toISOString())
  const todayStart = `${todayBK}T00:00:00+07:00`
  const todayEnd   = `${todayBK}T23:59:59+07:00`

  // Parallel: today's checkin count + today's card draw
  const [checkinResult, readResult] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('checked_in_at', todayStart)
      .lte('checked_in_at', todayEnd),
    supabase
      .from('reading_history')
      .select('card_id')
      .eq('user_id', user.id)
      .gte('read_at', todayStart)
      .lte('read_at', todayEnd)
      .order('read_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const hasCheckedIn = (checkinResult.count ?? 0) > 0

  // Gate: must check in today before drawing
  if (!hasCheckedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="space-y-4">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <h1 className="text-2xl font-semibold text-ink leading-relaxed">
              วันนี้คุณเป็นอย่างไรบ้าง
            </h1>
            <p className="text-muted font-light leading-8">
              เช็คอินก่อนนะ
              <br />
              แล้วการ์ดจะรอคุณอยู่
            </p>
          </div>
          <PrimaryButton href="/checkin">
            เช็คอินวันนี้
          </PrimaryButton>
        </div>
      </div>
    )
  }

  // Already drew a card today — show it instead of the deck
  const todayCardId = readResult.data?.card_id
  if (todayCardId && UUID_RE.test(todayCardId)) {
    redirect(`/cards?drawn=1&card=${todayCardId}`)
  }

  // Checked in, no card drawn yet — show the ritual deck
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">
        <CardDeck action={drawCard} />
      </div>
    </div>
  )
}
