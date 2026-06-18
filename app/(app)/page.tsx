import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { toBangkokDate, excerptText } from '@/lib/utils'
import { extractMemories, type ExtractedMemory } from '@/lib/services/memoryExtractor'
import { getMissYouState } from '@/lib/services/missYou'
import PrimaryButton from '@/components/ui/PrimaryButton'
import QuietLink from '@/components/ui/QuietLink'

// ── Types ─────────────────────────────────────────────────────────────────────

type LatestCard = { categoryNameTh: string; titleTh: string; bodyTh: string }
type CardJoin = { title_th: string; body_th: string; card_categories: { name_th: string } | null }
type ReadingHistoryJoin = { ritual_cards: CardJoin | null }

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatThaiDate(date: Date): string {
  return new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

type Phase = 'discovery' | 'relationship' | 'companion'

function getPhase(totalCheckins: number): Phase {
  if (totalCheckins < 3)  return 'discovery'
  if (totalCheckins < 15) return 'relationship'
  return 'companion'
}

// ── Shared style objects ──────────────────────────────────────────────────────

const paperLift = {
  background: 'linear-gradient(160deg, var(--paper-1) 0%, var(--paper-2) 100%)',
  border: '1px solid var(--paper-border)',
  borderRadius: 'var(--paper-radius-card)',
  boxShadow: 'var(--paper-shadow-lift)',
}

const paperRest = {
  background: 'linear-gradient(160deg, var(--paper-1) 0%, var(--paper-2) 100%)',
  border: '1px solid var(--paper-border)',
  borderRadius: 'var(--paper-radius-card)',
  boxShadow: 'var(--paper-shadow-rest)',
}

// ── Shared sub-components (server-safe) ───────────────────────────────────────

function GrainLayer() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, var(--grain-color) var(--grain-dot), transparent var(--grain-dot))`,
        backgroundSize: `var(--grain-size) var(--grain-size)`,
      }}
    />
  )
}

function DateStamp({ date }: { date: string }) {
  return (
    <p
      className="text-xs font-light"
      style={{ letterSpacing: 'var(--track-mark)', color: 'var(--ink-3)', textTransform: 'uppercase' }}
    >
      {date}
    </p>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-light"
      style={{ letterSpacing: 'var(--track-mark)', color: 'var(--ink-3)', textTransform: 'uppercase' }}
    >
      {children}
    </p>
  )
}

function CategoryLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-light"
      style={{ letterSpacing: 'var(--track-mark)', color: 'var(--ink-brown)', textTransform: 'uppercase' }}
    >
      {children}
    </p>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const todayBK = toBangkokDate(now)

  const [
    profileResult,
    checkinCountResult,
    latestJournalResult,
    latestCardResult,
    memJournalsResult,
    memCheckinsResult,
  ] = await Promise.all([
    supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle(),
    supabase.from('daily_checkins').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('journal_entries').select('body').eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: false }).limit(1),
    supabase.from('reading_history').select('ritual_cards(title_th, body_th, card_categories(name_th))').eq('user_id', user.id).order('read_at', { ascending: false }).limit(1),
    supabase.from('journal_entries').select('body, created_at').eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: false }).limit(50),
    supabase.from('daily_checkins').select('mood_key, note, checked_in_at').eq('user_id', user.id).order('checked_in_at', { ascending: false }).limit(50),
  ])

  const name = profileResult.data?.display_name ?? null
  const totalCheckins = checkinCountResult.count ?? 0
  const phase = getPhase(totalCheckins)
  const thaiDate = formatThaiDate(now)

  const rawCardRow = (latestCardResult.data?.[0] as unknown as ReadingHistoryJoin | undefined)
  const latestCard: LatestCard | null = rawCardRow?.ritual_cards ? {
    titleTh: rawCardRow.ritual_cards.title_th,
    bodyTh: rawCardRow.ritual_cards.body_th,
    categoryNameTh: rawCardRow.ritual_cards.card_categories?.name_th ?? '',
  } : null

  const latestJournal = latestJournalResult.data?.[0] ?? null

  const lastCheckinTs = memCheckinsResult.data?.[0]?.checked_in_at ?? null
  const lastCheckinBK = lastCheckinTs ? toBangkokDate(lastCheckinTs) : null
  const missYou = getMissYouState(lastCheckinBK, todayBK)

  const memories = extractMemories({
    journals: memJournalsResult.data ?? [],
    checkins: memCheckinsResult.data ?? [],
  })
  const topMemory: ExtractedMemory | null = memories[memories.length - 1] ?? null

  // ── Phase 1: Discovery ───────────────────────────────────────────────────────
  // < 3 check-ins. Help them stay, explore, and understand Care.
  // Home can be richer — inviting, not overwhelming.

  if (phase === 'discovery') {
    return (
      <div className="care-page-enter max-w-md mx-auto px-6 pt-12 pb-32 space-y-8">

        <div className="flex items-center justify-between">
          <DateStamp date={thaiDate} />
          <QuietLink href="/profile">บัญชี</QuietLink>
        </div>

        {/* Opening invitation — the first page of the book */}
        <section className="relative overflow-hidden px-8 py-10 space-y-6" style={paperLift}>
          <GrainLayer />
          <div className="relative space-y-5">
            <p className="text-2xl font-light leading-10" style={{ color: 'var(--ink-1)' }}>
              วันนี้...<br />
              ลองกลับมาหาตัวเองสักครู่ไหม
            </p>
            <p className="text-sm font-light leading-8" style={{ color: 'var(--ink-muted)' }}>
              Care ไม่ได้รีบพาคุณไปไหน<br />
              แค่ชวนให้คุณอยู่กับตัวเอง<br />
              ทีละวัน
            </p>
            <div className="pt-2">
              <PrimaryButton href="/checkin">เริ่มวันนี้</PrimaryButton>
            </div>
          </div>
        </section>

        {/* Ritual path — a quiet horizontal sequence, not a checklist */}
        <div className="px-2 space-y-3">
          <SectionLabel>Care เดินทางร่วมกับคุณผ่าน</SectionLabel>
          <div className="flex items-center gap-3 text-sm font-light" style={{ color: 'var(--ink-2)' }}>
            <span>เช็คอิน</span>
            <span style={{ color: 'var(--ink-4)' }}>→</span>
            <span>การ์ด</span>
            <span style={{ color: 'var(--ink-4)' }}>→</span>
            <span>บันทึก</span>
          </div>
          <p className="text-xs font-light leading-6" style={{ color: 'var(--ink-4)' }}>
            ไม่จำเป็นต้องทำทุกอย่างในวันเดียว
          </p>
        </div>

        {/* Collection teaser — barely-there, at the bottom of the opening spread */}
        <div
          className="px-2 pt-5 space-y-2 border-t"
          style={{ borderColor: 'var(--paper-border-soft)' }}
        >
          <p className="text-sm font-light leading-8" style={{ color: 'var(--ink-3)' }}>
            การ์ดบางใบจะค่อย ๆ เดินทางมาหาคุณ
          </p>
          <QuietLink href="/collection">สำรวจ collection</QuietLink>
        </div>

      </div>
    )
  }

  // ── Phase 2: Relationship ─────────────────────────────────────────────────────
  // 3–14 check-ins. Help them form ritual.
  // Home is today's spread: balanced, present-focused.

  if (phase === 'relationship') {
    const greeting = missYou.shouldShow
      ? missYou.line1
      : name
        ? `สวัสดี ${name}`
        : 'ยินดีที่ได้เจอกันอีกครั้ง'

    return (
      <div className="care-page-enter max-w-md mx-auto px-6 pt-10 pb-32 space-y-6">

        {/* Today's header — a page opening */}
        <header className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <DateStamp date={thaiDate} />
            <QuietLink href="/profile">บัญชี</QuietLink>
          </div>
          <h1 className="text-xl font-light leading-9" style={{ color: 'var(--ink-1)' }}>
            {greeting}
          </h1>
          {missYou.shouldShow && (
            <p className="text-sm font-light leading-7" style={{ color: 'var(--ink-3)' }}>
              {missYou.line2}
            </p>
          )}
        </header>

        {/* Card that came to you — a page insert */}
        {latestCard && (
          <section className="relative overflow-hidden px-6 py-6 space-y-3" style={paperRest}>
            <GrainLayer />
            <div className="relative space-y-3">
              <CategoryLabel>{latestCard.categoryNameTh}</CategoryLabel>
              <p className="text-base font-light leading-8" style={{ color: 'var(--ink-1)' }}>
                {latestCard.titleTh}
              </p>
              <p className="text-sm font-light leading-7" style={{ color: 'var(--ink-2)' }}>
                {excerptText(latestCard.bodyTh, 80)}
              </p>
              <QuietLink href="/cards">การ์ดที่เคยเดินทางมาหาคุณ</QuietLink>
            </div>
          </section>
        )}

        {/* Journal status — a page margin note */}
        <section className="px-1 space-y-2">
          {latestJournal ? (
            <>
              <SectionLabel>สิ่งที่ถูกเขียนไว้</SectionLabel>
              <p className="text-sm font-light leading-7" style={{ color: 'var(--ink-2)' }}>
                {excerptText(latestJournal.body, 100)}
              </p>
              <QuietLink href="/journal">กลับไปอ่าน</QuietLink>
            </>
          ) : (
            <p className="text-sm font-light" style={{ color: 'var(--ink-3)' }}>
              ยังมีพื้นที่ว่างสำหรับวันนี้
            </p>
          )}
        </section>

        {/* Memory or diary — one quiet surface, not both */}
        {topMemory ? (
          <section
            className="pl-4 py-2 border-l-2 space-y-1"
            style={{ borderColor: 'var(--paper-border-inner)' }}
          >
            <CategoryLabel>Care สังเกตเห็น</CategoryLabel>
            <p className="text-sm font-light leading-7 italic" style={{ color: 'var(--ink-2)' }}>
              {topMemory.content}
            </p>
            <QuietLink href="/memory">ดูทั้งหมด</QuietLink>
          </section>
        ) : (
          <section
            className="pl-4 py-2 border-l space-y-1"
            style={{ borderColor: 'var(--paper-border-soft)' }}
          >
            <SectionLabel>Care Letter</SectionLabel>
            <p className="text-xs font-light leading-6" style={{ color: 'var(--ink-3)' }}>
              บางข้อความจากวันเก่า ๆ
            </p>
            <QuietLink href="/diary">เปิดดู</QuietLink>
          </section>
        )}

        <PrimaryButton href="/checkin">เช็คอินวันนี้</PrimaryButton>

      </div>
    )
  }

  // ── Phase 3: Companion ────────────────────────────────────────────────────────
  // 15+ check-ins. They know why they are here.
  // Home becomes quieter. One invitation. One action.

  const companionLine = missYou.shouldShow
    ? missYou.line1
    : name
      ? `สวัสดี ${name}`
      : 'Care ยังอยู่ที่นี่'

  return (
    <div className="care-page-enter max-w-md mx-auto px-6 pt-16 pb-32 space-y-10">

      <div className="flex items-center justify-between">
        <DateStamp date={thaiDate} />
        <QuietLink href="/profile">บัญชี</QuietLink>
      </div>

      <p className="text-xl font-light leading-10" style={{ color: 'var(--ink-1)' }}>
        {companionLine}
      </p>

      <PrimaryButton href="/checkin">เริ่มวันนี้</PrimaryButton>

      {/* Memory margin note — very faint, like a pencil annotation */}
      {topMemory && (
        <div
          className="pl-4 border-l space-y-1"
          style={{ borderColor: 'var(--paper-border-faint)' }}
        >
          <p className="text-xs font-light italic leading-7" style={{ color: 'var(--ink-4)' }}>
            {topMemory.content}
          </p>
        </div>
      )}

    </div>
  )
}
