import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { drawCard } from '@/lib/actions/cards'
import DrawCardButton from '@/components/care/DrawCardButton'

export default async function CardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const checkedInToday = profile?.last_checkin_date === today

  // ── State A: not yet checked in ──────────────────────────────────────────────
  if (!checkedInToday) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="space-y-5">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <h1 className="text-2xl font-semibold text-ink leading-relaxed">
              เช็คอินใจ
              <br />
              ก่อนนะ
            </h1>
            <p className="text-muted font-light leading-8">
              บอกเราก่อนว่าวันนี้
              <br />
              ใจของคุณเป็นยังไงบ้าง
            </p>
          </div>
          <Link
            href="/checkin"
            className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
          >
            ไปเช็คอิน
          </Link>
        </div>
      </div>
    )
  }

  // ── Check if card already drawn today ────────────────────────────────────────
  const { data: todayHistory } = await supabase
    .from('reading_history')
    .select('card_id')
    .eq('user_id', user.id)
    .gte('read_at', `${today}T00:00:00+07:00`)
    .order('read_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // ── State B: checked in, no card drawn yet → Pause Moment ────────────────────
  if (!todayHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-12">
          <div className="space-y-6">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <h1 className="text-3xl font-semibold text-ink leading-relaxed">
              หายใจลึก ๆ
              <br />
              สักครั้ง
            </h1>
            <p className="text-muted font-light leading-8">
              วันนี้คุณไม่จำเป็นต้องรีบ
              <br />
              ไม่ต้องรู้คำตอบก็ได้
            </p>
          </div>
          <form action={drawCard}>
            <DrawCardButton />
          </form>
        </div>
      </div>
    )
  }

  // ── State C: card drawn → fetch card + category ───────────────────────────────
  const { data: card } = await supabase
    .from('ritual_cards')
    .select('*')
    .eq('id', todayHistory.card_id)
    .single()

  if (!card) redirect('/checkin')

  const { data: category } = await supabase
    .from('card_categories')
    .select('*')
    .eq('id', card.category_id)
    .maybeSingle()

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="rounded-3xl border border-sand bg-white/40 px-8 py-10 space-y-6">
          <p className="text-xs tracking-[0.25em] uppercase text-brown font-light">
            {category?.name_th ?? 'CARE'}
          </p>
          <h2 className="text-2xl font-semibold text-ink leading-relaxed">
            {card.title_th}
          </h2>
          <p className="text-ink font-light leading-8">
            {card.body_th}
          </p>
          {card.reflection_prompt_th && (
            <div className="border-l-2 border-sand pl-5 pt-1">
              <p className="text-muted font-light leading-8 text-sm">
                {card.reflection_prompt_th}
              </p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <Link
            href="/journal"
            className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
          >
            เขียนบันทึก
          </Link>
          <p className="text-center text-xs text-muted font-light">
            ลองเขียนสิ่งที่นึกขึ้นมาหลังอ่าน
          </p>
        </div>
      </div>
    </div>
  )
}
