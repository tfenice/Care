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
  sort_order: number
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

  // ── Error state: draw failed (card not persisted) ─────────────────────────
  if (params.error === 'draw') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="space-y-4">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <h1 className="text-xl font-semibold text-ink leading-relaxed">
              การ์ดยังไม่ได้ถูกบันทึก
            </h1>
            <p className="text-muted font-light leading-8">
              ลองเลือกใหม่อีกครั้งได้เลย
            </p>
          </div>
          <PrimaryButton href="/cards">
            ลองใหม่
          </PrimaryButton>
        </div>
      </div>
    )
  }

  // ── State B: card already drawn — show the reveal ──────────────────────────
  if (drawn) {
    const rawId = typeof params.card === 'string' ? params.card : null
    const cardId = rawId && UUID_RE.test(rawId) ? rawId : null
    if (!cardId) redirect('/cards')

    // Fetch card content and ownership proof in parallel.
    // The history check is the discovery gate — card content must not render
    // unless a reading_history row exists for this user and card.
    const [cardResult, historyCheck] = await Promise.all([
      supabase
        .from('ritual_cards')
        .select('title_th, body_th, reflection_prompt_th, sort_order, card_categories(name_th)')
        .eq('id', cardId)
        .eq('is_active', true)
        .maybeSingle(),
      supabase
        .from('reading_history')
        .select('card_id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('card_id', cardId),
    ])

    const card = cardResult.data as DrawnCard | null
    if (!card) redirect('/cards')

    // History query error — cannot verify ownership, show recoverable state
    if (historyCheck.error) {
      console.error('[CardsPage] reading_history ownership check failed:', historyCheck.error.message)
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-10">
            <div className="space-y-4">
              <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
              <h1 className="text-xl font-semibold text-ink leading-relaxed">
                ตอนนี้ยังเปิดการ์ดนี้ไม่ได้
              </h1>
              <p className="text-muted font-light leading-8">
                ลองกลับมาใหม่อีกครั้งนะ
              </p>
            </div>
            <PrimaryButton href="/cards">
              กลับ
            </PrimaryButton>
          </div>
        </div>
      )
    }

    // No history row — this card has not been drawn by this user
    if ((historyCheck.count ?? 0) === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-10">
            <div className="space-y-4">
              <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
              <h1 className="text-xl font-semibold text-ink leading-relaxed">
                การ์ดใบนี้ยังไม่ได้เดินทางมาหาคุณ
              </h1>
            </div>
            <PrimaryButton href="/cards">
              กลับ
            </PrimaryButton>
          </div>
        </div>
      )
    }

    const category = card.card_categories?.name_th ?? 'CARE'

    return (
      <div className="min-h-screen flex items-start justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <CardReveal
            category={category}
            titleTh={card.title_th}
            bodyTh={card.body_th}
            reflectionPromptTh={card.reflection_prompt_th}
            sortOrder={card.sort_order}
            cardId={cardId}
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
