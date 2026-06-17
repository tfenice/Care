import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategoryToken } from '@/lib/card-tokens'
import { CategorySymbol } from '@/components/care/card-symbols'
import { CardSignature } from '@/components/care/CardSignature'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'

type CategoryRef = {
  slug: string
  name_th: string
  sort_order: number
}

type RawCard = {
  id: string
  title_th: string
  sort_order: number
  card_categories: CategoryRef | null
}

type CardEntry = {
  id: string
  code: string
  categoryName: string
  seen: boolean
}

type Section = {
  slug: string
  name_th: string
  cards: CardEntry[]
}

function CollectionTile({ card }: { card: CardEntry }) {
  const token = getCategoryToken(card.categoryName)
  const seenLabel = card.seen ? 'เคยพบแล้ว' : 'ยังไม่เคยพบ'
  return (
    <Link
      href={`/collection/${card.id}`}
      aria-label={`${card.code} ${card.categoryName} ${seenLabel}`}
    >
      <div
        className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-opacity hover:opacity-75"
        style={card.seen ? {
          background: `rgb(${token.rgb} / 0.07)`,
          border: `1px solid rgb(${token.rgb} / 0.22)`,
        } : {
          background: 'rgba(201,169,122,0.05)',
          border: '1px solid rgba(201,169,122,0.14)',
        }}
      >
        <div style={{ color: card.seen ? token.color : 'rgba(201,169,122,0.35)' }}>
          <CardSignature code={card.code} category={card.categoryName} size="md" />
        </div>
        <span
          className="text-[9px] tracking-[0.15em] font-light"
          style={{ color: card.seen ? `rgb(${token.rgb} / 0.55)` : 'rgba(201,169,122,0.45)' }}
        >
          {card.code}
        </span>
      </div>
    </Link>
  )
}

export default async function CollectionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [cardsResult, historyResult] = await Promise.all([
    supabase
      .from('ritual_cards')
      .select('id, title_th, sort_order, card_categories(slug, name_th, sort_order)')
      .eq('is_active', true),
    supabase
      .from('reading_history')
      .select('card_id')
      .eq('user_id', user.id),
  ])

  if (cardsResult.error) {
    return (
      <PageShell className="space-y-10">
        <PageHeader title="ที่เก็บการ์ด" />
        <div className="text-center space-y-3 py-16">
          <p className="text-sm font-light text-ink">ไม่สามารถโหลดที่เก็บได้</p>
          <p className="text-xs font-light text-muted">ลองอีกครั้งในภายหลัง</p>
        </div>
      </PageShell>
    )
  }

  if (historyResult.error) {
    console.error('[CollectionPage] reading_history query failed:', historyResult.error.message)
    return (
      <PageShell className="space-y-10">
        <PageHeader title="ที่เก็บการ์ด" />
        <div className="text-center space-y-3 py-16">
          <p className="text-sm font-light text-ink">ไม่สามารถโหลดประวัติการ์ดได้</p>
          <p className="text-xs font-light text-muted">ลองอีกครั้งในภายหลัง</p>
        </div>
      </PageShell>
    )
  }

  const seenCardIds = new Set((historyResult.data ?? []).map(r => r.card_id))

  // Sort by category sort_order, then card sort_order
  const rawCards = (cardsResult.data ?? []) as unknown as RawCard[]
  const sorted = [...rawCards].sort((a, b) => {
    const ca = a.card_categories?.sort_order ?? 99
    const cb = b.card_categories?.sort_order ?? 99
    if (ca !== cb) return ca - cb
    return a.sort_order - b.sort_order
  })

  // Group into category sections
  const sections: Section[] = []
  for (const card of sorted) {
    const cat = card.card_categories
    if (!cat) continue

    const token = getCategoryToken(cat.name_th)
    const code = `${token.code}-${String(card.sort_order).padStart(2, '0')}`
    const entry: CardEntry = {
      id: card.id,
      code,
      categoryName: cat.name_th,
      seen: seenCardIds.has(card.id),
    }

    let section = sections.find(s => s.slug === cat.slug)
    if (!section) {
      section = { slug: cat.slug, name_th: cat.name_th, cards: [] }
      sections.push(section)
    }
    section.cards.push(entry)
  }

  const hasSeen   = seenCardIds.size > 0
  const hasUnseen = sections.some(s => s.cards.some(c => !c.seen))

  const subtitle = hasSeen ? 'การ์ดที่เคยเดินทางมาหาคุณ' : 'การ์ดทุกใบกำลังรอคุณ'

  return (
    <PageShell className="space-y-10">
      <PageHeader
        eyebrow={null}
        title="ที่เก็บการ์ด"
        subtitle={subtitle}
      />

      {hasSeen && hasUnseen && (
        <p className="text-xs font-light text-muted -mt-4">บางใบยังเงียบอยู่</p>
      )}

      {sections.map(section => {
        const token = getCategoryToken(section.name_th)
        return (
          <section key={section.slug} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div style={{ color: token.color }}>
                <CategorySymbol category={section.name_th} size="lg" />
              </div>
              <h2 className="text-sm font-light text-ink tracking-wide">
                {section.name_th}
              </h2>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {section.cards.map(card => (
                <CollectionTile key={card.id} card={card} />
              ))}
            </div>
          </section>
        )
      })}
    </PageShell>
  )
}
