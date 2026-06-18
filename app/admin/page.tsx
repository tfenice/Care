// Founder-internal analytics.
// Queries are scoped to the founder's data via RLS (anon key).
// For multi-user aggregates, replace createClient() with a service-role client.
// See ADMIN-01 in docs/KNOWN_TECH_DEBT.md.
//
// SAFETY: This file must remain a Server Component (no "use client").

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { toBangkokDate } from '@/lib/utils'

// Join shape: reading_history → ritual_cards → card_categories
type CardHistoryRow = {
  read_at: string
  ritual_cards: { card_categories: { name_th: string } | null } | null
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-sand bg-white/40 px-5 py-5">
      <p className="text-xs tracking-[0.15em] uppercase text-brown font-light mb-2">{label}</p>
      <p className="text-3xl font-semibold text-ink leading-none">{value}</p>
      {sub && <p className="text-xs text-muted font-light mt-2">{sub}</p>}
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !process.env.FOUNDER_EMAIL || user.email !== process.env.FOUNDER_EMAIL) {
    redirect('/checkin')
  }

  const [
    profileCountResult,
    profileResult,
    checkinCountResult,
    journalCountResult,
    cardCountResult,
    recentCheckinsResult,
    recentJournalsResult,
    recentCardsResult,
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles')
      .select('current_streak')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('daily_checkins').select('*', { count: 'exact', head: true }),
    supabase.from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase.from('reading_history').select('*', { count: 'exact', head: true }),
    supabase.from('daily_checkins')
      .select('mood_key, checked_in_at')
      .order('checked_in_at', { ascending: false })
      .limit(50),
    supabase.from('journal_entries')
      .select('created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('reading_history')
      .select('read_at, ritual_cards(card_categories(name_th))')
      .order('read_at', { ascending: false })
      .limit(50),
  ])

  const now             = new Date()
  const todayBK         = toBangkokDate(now.toISOString())
  const sevenDaysAgoBK  = toBangkokDate(new Date(now.getTime() - 6 * 86_400_000).toISOString())

  const recentCheckins = recentCheckinsResult.data ?? []
  const recentJournals = recentJournalsResult.data ?? []
  const rawCards       = (recentCardsResult.data ?? []) as unknown as CardHistoryRow[]

  // DAU/WAU (private beta = 1 user)
  const dau = recentCheckins.some(c => toBangkokDate(c.checked_in_at) === todayBK) ? 1 : 0
  const wau = recentCheckins.some(c => toBangkokDate(c.checked_in_at) >= sevenDaysAgoBK) ? 1 : 0

  // Mood frequency
  const moodFrequency: Record<string, number> = {}
  for (const { mood_key } of recentCheckins) {
    moodFrequency[mood_key] = (moodFrequency[mood_key] ?? 0) + 1
  }

  // Top card categories from join
  const catCounts = new Map<string, number>()
  for (const row of rawCards) {
    const cat = row.ritual_cards?.card_categories?.name_th
    if (cat) catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1)
  }
  const topCardCategories = Array.from(catCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }))

  // Streak distribution bucketed for 1 user
  const currentStreak = profileResult.data?.current_streak ?? 0
  const bucket = currentStreak === 0 ? '0'
    : currentStreak <= 3 ? '1–3'
    : currentStreak <= 7 ? '4–7'
    : currentStreak <= 14 ? '8–14'
    : '15+'
  const streakDistribution: Record<string, number> = { '0': 0, '1–3': 0, '4–7': 0, '8–14': 0, '15+': 0 }
  streakDistribution[bucket] = 1

  // 7-day daily stats
  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const d    = new Date(now.getTime() - (6 - i) * 86_400_000)
    const date = toBangkokDate(d.toISOString())
    return {
      date,
      checkins:    recentCheckins.filter(c => toBangkokDate(c.checked_in_at) === date).length,
      journals:    recentJournals.filter(j => toBangkokDate(j.created_at)    === date).length,
      cardsDrawn:  rawCards.filter(c => toBangkokDate(c.read_at) === date).length,
      activeUsers: (
        recentCheckins.some(c => toBangkokDate(c.checked_in_at) === date) ||
        recentJournals.some(j => toBangkokDate(j.created_at) === date)
      ) ? 1 : 0,
    }
  })

  const overview = {
    totalUsers:      profileCountResult.count ?? 0,
    dau,
    wau,
    totalCheckins:   checkinCountResult.count ?? 0,
    totalJournals:   journalCountResult.count ?? 0,
    totalCardsDrawn: cardCountResult.count ?? 0,
    moodFrequency,
    topCardCategories,
    streakDistribution,
  }

  const maxCheckins  = Math.max(...dailyStats.map(d => d.checkins), 1)
  const streakTotal  = Object.values(overview.streakDistribution).reduce((a, b) => a + b, 0)
  const maxMoodCount = Math.max(...Object.values(overview.moodFrequency), 1)
  const maxCardCount = Math.max(...overview.topCardCategories.map(c => c.count), 1)

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 pb-16 space-y-8">

      <header className="space-y-1 pt-2">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE · FOUNDER</p>
        <h1 className="text-2xl font-semibold text-ink">Analytics</h1>
        <p className="text-muted font-light text-sm">ภาพรวมการใช้งาน · Private Beta</p>
      </header>

      {/* ── Overview ──────────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ภาพรวม</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Total Users"  value={overview.totalUsers} />
          <StatCard label="DAU"          value={overview.dau}              sub="วันนี้" />
          <StatCard label="WAU"          value={overview.wau}              sub="7 วันที่ผ่านมา" />
          <StatCard label="Check-ins"    value={overview.totalCheckins}    sub="ทั้งหมด" />
          <StatCard label="Journals"     value={overview.totalJournals}    sub="ทั้งหมด" />
          <StatCard label="Cards Drawn"  value={overview.totalCardsDrawn}  sub="ทั้งหมด" />
        </div>
      </section>

      {/* ── Daily Check-ins (7d bar chart — CSS only) ────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">Check-ins / วัน (7 วัน)</p>
        <div className="flex items-end gap-2 h-24">
          {dailyStats.map(day => {
            const pct   = Math.round((day.checkins / maxCheckins) * 100)
            const label = day.date.slice(5)
            return (
              <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-muted font-light">{day.checkins}</span>
                <div
                  className="w-full rounded-t-lg bg-brown/30"
                  style={{ height: `${pct}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-muted font-light">{label}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 7-day Table ──────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">รายวัน 7 วันล่าสุด</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-light">
            <thead>
              <tr className="text-xs text-muted tracking-wide uppercase">
                <th className="text-left pb-3 pr-4 font-light">วัน</th>
                <th className="text-right pb-3 pr-4 font-light">Users</th>
                <th className="text-right pb-3 pr-4 font-light">Check-in</th>
                <th className="text-right pb-3 pr-4 font-light">Journal</th>
                <th className="text-right pb-3 font-light">Card</th>
              </tr>
            </thead>
            <tbody>
              {dailyStats.map(day => (
                <tr key={day.date} className="border-t border-sand/60">
                  <td className="py-2.5 pr-4 text-ink">{day.date.slice(5)}</td>
                  <td className="py-2.5 pr-4 text-right text-ink">{day.activeUsers}</td>
                  <td className="py-2.5 pr-4 text-right text-ink">{day.checkins}</td>
                  <td className="py-2.5 pr-4 text-right text-ink">{day.journals}</td>
                  <td className="py-2.5 text-right text-ink">{day.cardsDrawn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Most common moods ─────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">อารมณ์ที่พบบ่อย</p>
        {Object.keys(overview.moodFrequency).length === 0 ? (
          <p className="text-sm font-light text-muted">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(overview.moodFrequency)
              .sort((a, b) => b[1] - a[1])
              .map(([mood, count]) => (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-sm font-light text-ink w-20 shrink-0">{mood}</span>
                  <div className="flex-1 h-2 rounded-full bg-sand overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brown/50"
                      style={{ width: `${Math.round((count / maxMoodCount) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted font-light w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* ── Most drawn card categories ────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">หมวดการ์ดยอดนิยม</p>
        {overview.topCardCategories.length === 0 ? (
          <p className="text-sm font-light text-muted">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="space-y-2">
            {overview.topCardCategories.map(({ category, count }) => (
              <div key={category} className="flex items-center gap-3">
                <span className="text-sm font-light text-ink w-36 shrink-0 truncate">{category}</span>
                <div className="flex-1 h-2 rounded-full bg-sand overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brown/40"
                    style={{ width: `${Math.round((count / maxCardCount) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted font-light w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Streak Distribution ───────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">Streak Distribution</p>
        <div className="space-y-2">
          {Object.entries(overview.streakDistribution).map(([bucket, count]) => {
            const pct = streakTotal > 0 ? Math.round((count / streakTotal) * 100) : 0
            return (
              <div key={bucket} className="flex items-center gap-3">
                <span className="text-xs text-muted font-light w-12 shrink-0">{bucket} วัน</span>
                <div className="flex-1 h-2 rounded-full bg-sand overflow-hidden">
                  <div className="h-full rounded-full bg-brown/40" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted font-light w-6 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </section>

      <p className="text-center text-xs text-muted font-light">
        ข้อมูลแสดงเฉพาะของผู้ก่อตั้ง · RLS จำกัดการเข้าถึง cross-user ระหว่าง private beta
      </p>

    </div>
  )
}
