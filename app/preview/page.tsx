// Visual specification for the Care Card System.
// Production components only — no prototypes, no duplicates.
// Reference: docs/CARD_SYSTEM.md
//
// Access: founder-only (FOUNDER_EMAIL env var). Same gate as /admin.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCardCode } from '@/lib/utils'
import ChapterCard, { CardPaper, EditorialWindow } from '@/components/care/ChapterCard'
import CardBack from '@/components/care/CardBack'
import { getCategoryToken } from '@/lib/card-tokens'

const SPEC_CARDS = [
  {
    category: 'การยอมรับ',
    sortOrder: 5,
    titleTh: 'วันนี้ก็พอแล้ว',
    bodyTh: 'ไม่ต้องทำให้มากกว่านี้ ไม่ต้องพิสูจน์อะไร วันนี้ที่คุณผ่านมาได้คือเพียงพอแล้ว',
    reflectionPromptTh: 'มีอะไรเล็กๆ ในวันนี้ที่ทำให้คุณยิ้มได้บ้าง?',
  },
  {
    category: 'ความใจจดจ่อ',
    sortOrder: 10,
    titleTh: 'ไม่ต้องทำอะไร',
    bodyTh: 'บางครั้งการไม่ทำอะไรเลยคือสิ่งที่ดีที่สุดที่คุณจะมอบให้ตัวเองได้',
    reflectionPromptTh: 'ตอนนี้ร่างกายของคุณรู้สึกอย่างไร?',
  },
  {
    category: 'ความหวัง',
    sortOrder: 4,
    titleTh: 'เมล็ดที่ยังไม่งอก',
    bodyTh: 'ความหวังบางอย่างต้องใช้เวลา รากกำลังเติบโตในที่ที่มองไม่เห็น',
    reflectionPromptTh: 'มีอะไรที่คุณกำลังรอคอยอยู่อย่างอดทน?',
  },
  {
    category: 'การเติบโต',
    sortOrder: 3,
    titleTh: 'การเติบโตที่มองไม่เห็น',
    bodyTh: 'สิ่งที่เติบโตขึ้นในตัวคุณมักไม่ปรากฏให้ใครเห็น รวมถึงตัวคุณเอง',
    reflectionPromptTh: 'คุณแตกต่างจากตัวเองเมื่อปีที่แล้วอย่างไรบ้าง?',
  },
]

export default async function PreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !process.env.FOUNDER_EMAIL || user.email !== process.env.FOUNDER_EMAIL) {
    redirect('/home')
  }

  return (
    <div className="min-h-screen bg-cream py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Header */}
        <div className="space-y-2 border-b pb-8" style={{ borderColor: 'var(--paper-border)' }}>
          <p className="text-[10px] tracking-[0.28em] uppercase text-muted font-light">CARE / CARD_SYSTEM</p>
          <h1 className="text-2xl font-semibold text-ink">Visual Specification</h1>
          <p className="text-sm text-muted font-light max-w-md leading-7">
            The canonical rendering of every card surface in Care.
            Production components. No prototypes. No duplicates.
          </p>
        </div>

        {/* ── 01 ChapterCard ── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light">01 — ChapterCard</p>
            <h2 className="text-base font-semibold text-ink">The canonical chapter object</h2>
            <p className="text-sm text-muted font-light">
              Used in: /cards (reveal), /collection/[cardId]. Static — no animation props.
              Pass <code className="text-xs bg-sand/30 px-1 rounded">className=&quot;care-card-in&quot;</code> externally for arrival.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPEC_CARDS.map((card) => (
              <ChapterCard
                key={card.category}
                category={card.category}
                titleTh={card.titleTh}
                bodyTh={card.bodyTh}
                reflectionPromptTh={card.reflectionPromptTh}
                sortOrder={card.sortOrder}
              />
            ))}
          </div>
        </section>

        {/* ── 02 CardBack ── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light">02 — CardBack</p>
            <h2 className="text-base font-semibold text-ink">Japanese Letterpress V2</h2>
            <p className="text-sm text-muted font-light">
              Used in: /cards (deck + waiting state). lg=208×312, sm=56×88.
              <code className="text-xs bg-sand/30 px-1 rounded mx-1">animate</code>prop activates breathing while the reader pauses.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-10">
            <div className="space-y-3">
              <CardBack size="lg" className="w-52 h-[312px]" />
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light text-center">lg · static</p>
            </div>
            <div className="space-y-3">
              <CardBack size="lg" animate className="w-52 h-[312px]" />
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light text-center">lg · breathing</p>
            </div>
            <div className="space-y-3">
              <div className="relative h-24 flex items-end" style={{ width: '220px' }}>
                {[-84, -56, -28, 0, 28, 56, 84].map((x, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: `translateX(calc(${x}px - 50%)) rotate(${[-15,-10,-5,0,5,10,15][i]}deg)`,
                      zIndex: i === 3 ? 7 : i + 1,
                    }}
                  >
                    <CardBack className="w-14 h-[88px]" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light text-center">sm · fan ×7</p>
            </div>
          </div>
        </section>

        {/* ── 03 EditorialWindow standalone ── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light">03 — EditorialWindow (standalone)</p>
            <h2 className="text-base font-semibold text-ink">Visual zone without card content</h2>
            <p className="text-sm text-muted font-light">
              Used in: /cards/second (SecondPage). Same V3 illustration pipeline as ChapterCard.
              Wrapped in CardPaper with page-weight shadow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPEC_CARDS.map((card) => {
              const token = getCategoryToken(card.category)
              const code = formatCardCode(token.code, card.sortOrder)
              return (
                <div key={card.category} className="space-y-2">
                  <CardPaper style={{ boxShadow: 'var(--paper-shadow-page)' }}>
                    <EditorialWindow
                      code={code}
                      category={card.category}
                      token={token}
                      showFloor={false}
                    />
                  </CardPaper>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light text-center">
                    {code}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 04 Illustration Motion ── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light">04 — Illustration Motion</p>
            <h2 className="text-base font-semibold text-ink">Category-specific breath</h2>
            <p className="text-sm text-muted font-light max-w-lg leading-7">
              Same pipeline as static. Plays once on mount, holds final state.
              Pass <code className="text-xs bg-sand/30 px-1 rounded">animated</code> to EditorialWindow
              or <code className="text-xs bg-sand/30 px-1 rounded">animateIllustration</code> to ChapterCard.
              Cancelled by prefers-reduced-motion.
            </p>
            <p className="text-xs text-muted font-light opacity-60 pt-1">
              A — settle 1.0s · P — breathe 1.0s · H — open 1.2s · G — emerge 1.5s
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPEC_CARDS.map((card) => {
              const token = getCategoryToken(card.category)
              const code = formatCardCode(token.code, card.sortOrder)
              return (
                <div key={card.category} className="space-y-2">
                  <CardPaper style={{ boxShadow: 'var(--paper-shadow-page)' }}>
                    <EditorialWindow
                      code={code}
                      category={card.category}
                      token={token}
                      showFloor={false}
                      animated
                    />
                  </CardPaper>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light text-center">
                    {code}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
