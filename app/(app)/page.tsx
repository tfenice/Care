import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateWeeklyReflection, getPreviousWeekBounds } from '@/lib/services/weeklyReflection'
import { extractMemories, type ExtractedMemory } from '@/lib/services/memoryExtractor'
import { getMissYouState } from '@/lib/services/missYou'

// ── Types ─────────────────────────────────────────────────────────────────────

type DashboardData = {
  name: string | null
  streak: number
  longestStreak: number
  totalCheckins: number
  totalJournals: number
  totalCards: number
  latestJournal: { body: string } | null
  latestCard: { categoryNameTh: string; titleTh: string; bodyTh: string } | null
}

// Join shape for reading_history → ritual_cards → card_categories
type CardJoin = { title_th: string; body_th: string; card_categories: { name_th: string } | null }
type ReadingHistoryJoin = { ritual_cards: CardJoin | null }

// ── Helpers ───────────────────────────────────────────────────────────────────

function toBK(ts: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(ts))
}

function truncate(text: string, max = 120) {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…'
}

function greetingText(hour: number) {
  if (hour < 12) return 'สวัสดีตอนเช้า'
  if (hour < 17) return 'สวัสดีตอนบ่าย'
  return 'สวัสดีตอนเย็น'
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const prevBounds = getPreviousWeekBounds()

  // All queries run in parallel
  const [
    profileResult,
    checkinCountResult,
    journalCountResult,
    cardCountResult,
    latestJournalResult,
    latestCardResult,
    weekCheckinsResult,
    weekJournalsResult,
    memJournalsResult,
    memCheckinsResult,
  ] = await Promise.all([
    supabase.from('profiles')
      .select('display_name, current_streak, longest_streak')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('daily_checkins')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase.from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('deleted_at', null),
    supabase.from('reading_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase.from('journal_entries')
      .select('body')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase.from('reading_history')
      .select('ritual_cards(title_th, body_th, card_categories(name_th))')
      .eq('user_id', user.id)
      .order('read_at', { ascending: false })
      .limit(1),
    supabase.from('daily_checkins')
      .select('mood_key, note')
      .eq('user_id', user.id)
      .gte('checked_in_at', `${prevBounds.start}T00:00:00+07:00`)
      .lte('checked_in_at', `${prevBounds.end}T23:59:59+07:00`)
      .order('checked_in_at', { ascending: false })
      .limit(7),
    supabase.from('journal_entries')
      .select('body')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .gte('created_at', `${prevBounds.start}T00:00:00+07:00`)
      .lte('created_at', `${prevBounds.end}T23:59:59+07:00`)
      .order('created_at', { ascending: false })
      .limit(7),
    supabase.from('journal_entries')
      .select('body, created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('daily_checkins')
      .select('mood_key, note, checked_in_at')
      .eq('user_id', user.id)
      .order('checked_in_at', { ascending: false })
      .limit(50),
  ])

  // Build latest card from join result (reading_history → ritual_cards → card_categories)
  const rawCardRow = (latestCardResult.data?.[0] as unknown as ReadingHistoryJoin | undefined)
  const latestCard = rawCardRow?.ritual_cards ? {
    titleTh: rawCardRow.ritual_cards.title_th,
    bodyTh: rawCardRow.ritual_cards.body_th,
    categoryNameTh: rawCardRow.ritual_cards.card_categories?.name_th ?? '',
  } : null

  const profile = profileResult.data
  const data: DashboardData = {
    name: profile?.display_name ?? null,
    streak: profile?.current_streak ?? 0,
    longestStreak: profile?.longest_streak ?? 0,
    totalCheckins: checkinCountResult.count ?? 0,
    totalJournals: journalCountResult.count ?? 0,
    totalCards: cardCountResult.count ?? 0,
    latestJournal: latestJournalResult.data?.[0] ?? null,
    latestCard,
  }

  // Miss You — derive from most recent checkin in the memCheckins result
  const now = new Date()
  const todayBK = toBK(now.toISOString())
  const lastCheckinTs = memCheckinsResult.data?.[0]?.checked_in_at ?? null
  const lastCheckinBK = lastCheckinTs ? toBK(lastCheckinTs) : null
  const missYou = getMissYouState(lastCheckinBK, todayBK)

  // Weekly reflection from previous week's real data
  const weekReflection = generateWeeklyReflection({
    checkins: weekCheckinsResult.data ?? [],
    journals: weekJournalsResult.data ?? [],
    cards: [], // reading_history not yet populated — see DATA-02
  })

  // Memory section from recent journals and checkins
  const memories = extractMemories({
    journals: memJournalsResult.data ?? [],
    checkins: memCheckinsResult.data ?? [],
  })
  const topMemory: ExtractedMemory | null = memories[memories.length - 1] ?? null
  const hour = now.getHours()

  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32 space-y-6">

      {/* ── 1. Greeting ────────────────────────────────────────────────────── */}
      <header className="space-y-1 pt-2">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">
          {data.name ? `สวัสดี ${data.name}` : greetingText(hour)}
        </h1>
        <p className="text-muted font-light leading-7">วันนี้เป็นอย่างไรบ้าง</p>
      </header>

      {/* ── Miss You ───────────────────────────────────────────────────────── */}
      {missYou.shouldShow && (
        <section className="rounded-3xl border border-sand bg-white/60 px-6 py-5 space-y-1.5">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ยินดีต้อนรับกลับมา</p>
          <p className="text-sm font-light text-ink leading-8">{missYou.line1}</p>
          <p className="text-sm font-light text-muted leading-8">{missYou.line2}</p>
        </section>
      )}

      {/* ── 2. Streak ──────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light mb-4">Streak</p>
        <div className="flex items-end gap-8">
          <div>
            <p className="text-5xl font-semibold text-ink leading-none">{data.streak}</p>
            <p className="text-sm text-muted font-light mt-2">วันติดต่อกัน</p>
          </div>
          <div className="pb-1">
            <p className="text-xs text-muted font-light">สถิติสูงสุด</p>
            <p className="text-2xl font-semibold text-brown leading-snug">{data.longestStreak} วัน</p>
          </div>
        </div>
      </section>

      {/* ── 3. Weekly Reflection ───────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">สัปดาห์ที่ผ่านมา</p>
          {weekReflection.dominant_mood && (
            <span className="text-xs text-muted font-light border border-sand rounded-full px-3 py-1">
              {weekReflection.dominant_mood}
            </span>
          )}
        </div>
        {weekReflection.mood_theme && (
          <p className="text-sm font-light text-brown">{weekReflection.mood_theme}</p>
        )}
        <p className="text-sm font-light text-ink leading-7">
          {weekReflection.reflection_text}
        </p>
        <div className="flex gap-4 pt-1">
          <div className="text-center">
            <p className="text-lg font-semibold text-ink">{weekReflection.checkin_count}</p>
            <p className="text-xs text-muted font-light">เช็คอิน</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-ink">{weekReflection.journal_count}</p>
            <p className="text-xs text-muted font-light">บันทึก</p>
          </div>
          {weekReflection.top_card_category && (
            <div className="text-center flex-1">
              <p className="text-xs text-muted font-light">การ์ดยอดนิยม</p>
              <p className="text-xs font-light text-ink mt-0.5">{weekReflection.top_card_category}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. Recent Reflection ───────────────────────────────────────────── */}
      {data.latestJournal && (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">บันทึกล่าสุด</p>
          <p className="text-ink font-light leading-7 text-sm">
            {truncate(data.latestJournal.body)}
          </p>
          <Link href="/journal" className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
            อ่านต่อ
          </Link>
        </section>
      )}

      {/* ── 5. Recent Card ─────────────────────────────────────────────────── */}
      {data.latestCard && (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">
            {data.latestCard.categoryNameTh}
          </p>
          <h2 className="text-base font-semibold text-ink">{data.latestCard.titleTh}</h2>
          <p className="text-ink font-light leading-7 text-sm">
            {truncate(data.latestCard.bodyTh)}
          </p>
          <Link href="/cards" className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
            ดูอีกครั้ง
          </Link>
        </section>
      )}

      {/* ── 6. Growth Snapshot ─────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ภาพรวม</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: data.totalCheckins, label: 'เช็คอิน' },
            { value: data.totalJournals, label: 'บันทึก' },
            { value: data.totalCards,    label: 'การ์ด' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-semibold text-ink">{value}</p>
              <p className="text-xs text-muted font-light mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Memory Card ─────────────────────────────────────────────────── */}
      {topMemory && (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">Care สังเกตเห็น</p>
            {topMemory.themes.length > 0 && (
              <span className="text-xs text-muted font-light border border-sand rounded-full px-3 py-1">
                {topMemory.themes[0]}
              </span>
            )}
          </div>
          <p className="text-sm font-light text-ink leading-7">{topMemory.content}</p>
          <Link href="/memory" className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
            ดูทั้งหมด
          </Link>
        </section>
      )}

      {/* ── 8. Quick Actions ───────────────────────────────────────────────── */}
      <section className="space-y-2">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light px-1">ลัดไป</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: '/checkin', label: 'เช็คอินวันนี้' },
            { href: '/cards',   label: 'ดูการ์ด' },
            { href: '/journal', label: 'เขียนบันทึก' },
            { href: '/history', label: 'ดูย้อนหลัง' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-sand bg-white/30 px-4 py-4 text-sm font-light text-ink hover:bg-white/60 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── 9. Secondary Nav ───────────────────────────────────────────────── */}
      <section className="space-y-2">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light px-1">สำรวจ</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: '/diary',    label: 'บันทึก Care' },
            { href: '/growth',   label: 'การเติบโต' },
            { href: '/memory',   label: 'ความทรงจำ' },
            { href: '/profile',  label: 'โปรไฟล์' },
            { href: '/settings', label: 'ตั้งค่า' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-sand/60 bg-white/15 px-4 py-3.5 text-sm font-light text-muted hover:text-ink hover:bg-white/40 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
