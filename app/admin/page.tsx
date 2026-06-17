// Founder-internal analytics. All data is demo-only until Launch Hardening Sprint.
//
// SAFETY: This file must remain a Server Component (no "use client").
// Never import admin queries or service-role credentials into Client Components —
// doing so would bundle them into the browser bundle. See ADMIN-01 in KNOWN_TECH_DEBT.md.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DEMO_OVERVIEW, DEMO_DAILY_STATS } from '@/lib/demo/admin'

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
  if (!user || user.email !== process.env.FOUNDER_EMAIL) redirect('/checkin')

  const overview   = DEMO_OVERVIEW
  const dailyStats = DEMO_DAILY_STATS

  const maxCheckins = Math.max(...dailyStats.map(d => d.checkins), 1)
  const streakTotal = Object.values(overview.streakDistribution).reduce((a, b) => a + b, 0)
  const maxMoodCount = Math.max(...Object.values(overview.moodFrequency), 1)
  const maxCardCount = Math.max(...overview.topCardCategories.map(c => c.count), 1)

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 pb-16 space-y-8">

      <header className="space-y-1 pt-2">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE · FOUNDER</p>
        <h1 className="text-2xl font-semibold text-ink">Analytics</h1>
        <p className="text-muted font-light text-sm">ภาพรวมการใช้งาน — Demo Data</p>
      </header>

      {/* ── Overview ──────────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ภาพรวม</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Total Users"  value={overview.totalUsers} />
          <StatCard label="DAU"          value={overview.dau}           sub="วันนี้" />
          <StatCard label="WAU"          value={overview.wau}           sub="7 วันที่ผ่านมา" />
          <StatCard label="Check-ins"    value={overview.totalCheckins}  sub="ทั้งหมด" />
          <StatCard label="Journals"     value={overview.totalJournals}  sub="ทั้งหมด" />
          <StatCard label="Cards Drawn"  value={overview.totalCardsDrawn} sub="ทั้งหมด" />
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
      </section>

      {/* ── Most drawn card categories ────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">หมวดการ์ดยอดนิยม</p>
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
        ⚠️ ข้อมูล Demo — เชื่อมต่อ Supabase เมื่อ auth พร้อม
      </p>

    </div>
  )
}
