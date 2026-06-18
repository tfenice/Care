import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategoryToken } from '@/lib/card-tokens'
import { CardSignature } from '@/components/care/CardSignature'
import ChapterCard from '@/components/care/ChapterCard'
import PageShell from '@/components/ui/PageShell'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type CardDetail = {
  title_th: string
  body_th: string
  reflection_prompt_th: string | null
  sort_order: number
  card_categories: { slug: string; name_th: string } | null
}

function formatThaiDate(iso: string): string {
  const d = new Date(iso)
  const day   = new Intl.DateTimeFormat('en-CA', { day: 'numeric',   timeZone: 'Asia/Bangkok' }).format(d)
  const month = new Intl.DateTimeFormat('th-TH', { month: 'long',    timeZone: 'Asia/Bangkok' }).format(d)
  const year  = new Intl.DateTimeFormat('en-CA', { year: 'numeric',  timeZone: 'Asia/Bangkok' }).format(d)
  return `${day} ${month} ${year}`
}

export default async function CollectionCardPage({
  params,
}: {
  params: Promise<{ cardId: string }>
}) {
  const { cardId } = await params
  if (!UUID_RE.test(cardId)) redirect('/collection')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [cardResult, historyResult] = await Promise.all([
    supabase
      .from('ritual_cards')
      .select('title_th, body_th, reflection_prompt_th, sort_order, card_categories(slug, name_th)')
      .eq('id', cardId)
      .eq('is_active', true)
      .maybeSingle(),
    supabase
      .from('reading_history')
      .select('read_at')
      .eq('user_id', user.id)
      .eq('card_id', cardId)
      .order('read_at', { ascending: true }),
  ])

  if (cardResult.error || !cardResult.data) redirect('/collection')

  const card = cardResult.data as unknown as CardDetail

  const category = card.card_categories?.name_th ?? 'ไม่ทราบหมวด'
  const token = getCategoryToken(category)
  const code = `${token.code}-${String(card.sort_order).padStart(2, '0')}`

  if (historyResult.error) {
    console.error('[CollectionCardPage] reading_history query failed:', historyResult.error.message)
    return (
      <PageShell className="space-y-8">
        <Link
          href="/collection"
          className="inline-flex items-center gap-1.5 text-sm font-light text-muted hover:text-ink transition-colors"
        >
          ← ที่เก็บการ์ด
        </Link>
        <div className="text-center space-y-3 py-16">
          <p className="text-sm font-light text-ink">ไม่สามารถโหลดข้อมูลการ์ดนี้ได้</p>
          <p className="text-xs font-light text-muted">ลองอีกครั้งในภายหลัง</p>
        </div>
      </PageShell>
    )
  }

  const history = historyResult.data ?? []
  const seen = history.length > 0
  const count = history.length
  const firstSeen = history[0]?.read_at ?? null
  const lastSeen  = history[history.length - 1]?.read_at ?? null

  return (
    <PageShell className="space-y-8">
      <Link
        href="/collection"
        className="inline-flex items-center gap-1.5 text-sm font-light text-muted hover:text-ink transition-colors"
      >
        ← ที่เก็บการ์ด
      </Link>

      {seen ? (
        <>
          <ChapterCard
            category={category}
            titleTh={card.title_th}
            bodyTh={card.body_th}
            reflectionPromptTh={card.reflection_prompt_th}
            sortOrder={card.sort_order}
          />

          {/* Encounter record */}
          <div className="space-y-4">
            <p className="text-xs tracking-[0.2em] uppercase font-light" style={{ color: token.color }}>
              การพบกัน
            </p>
            <div className="space-y-2">
              <p className="text-sm font-light text-ink">
                {count === 1 ? 'พบกันครั้งแรก' : `พบกัน ${count} ครั้ง`}
              </p>
              {firstSeen && (
                <p className="text-sm font-light text-muted">
                  ครั้งแรก · {formatThaiDate(firstSeen)}
                </p>
              )}
              {lastSeen && count > 1 && (
                <p className="text-sm font-light text-muted">
                  ล่าสุด · {formatThaiDate(lastSeen)}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Unseen state — show presence without content */
        <div className="flex flex-col items-center justify-center gap-8 py-16 text-center">
          <div style={{ color: token.color, opacity: 0.25 }}>
            <CardSignature code={code} category={category} size="lg" />
          </div>
          <div className="space-y-3">
            <p
              className="text-[11px] tracking-[0.3em] uppercase font-light"
              style={{ color: `rgb(${token.rgb} / 0.5)` }}
            >
              {code}
            </p>
            <p className="text-sm font-light text-muted leading-7">
              การ์ดนี้ยังรอคุณอยู่
              <br />
              จะมาเมื่อถึงเวลา
            </p>
          </div>
        </div>
      )}
    </PageShell>
  )
}
