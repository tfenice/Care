import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateWeeklyReflection, getWeekBounds } from '@/lib/services/weeklyReflection'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import SurfaceCard from '@/components/ui/SurfaceCard'
import Pill from '@/components/ui/Pill'

const MOOD_DOT: Record<string, string> = {
  สบายดี:  'bg-brown',
  พอไหว:   'bg-brown/50',
  เหนื่อย: 'bg-sand border border-sand',
  สับสน:   'bg-muted/30',
}

const THAI_DAY = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'] // index 0 = Sunday

function toBK(ts: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(ts))
}

function gentleInterpretation(streak: number, dominant: string | null, checkinPct: number): string {
  const lines: string[] = []

  if (checkinPct >= 0.8) {
    lines.push('คุณกลับมาฟังใจตัวเองเกือบทุกวัน — นั่นไม่ใช่เรื่องเล็กน้อยเลย')
  } else if (checkinPct >= 0.5) {
    lines.push('คุณพยายามกลับมาดูแลตัวเองอย่างสม่ำเสมอ')
  } else {
    lines.push('แค่ที่คุณยังกลับมาก็สำคัญแล้ว ไม่ต้องสมบูรณ์แบบ')
  }

  if (dominant === 'สบายดี') {
    lines.push('ในช่วงนี้ดูเหมือนว่าคุณอยู่ในที่ที่ดี')
  } else if (dominant === 'พอไหว') {
    lines.push('คุณเดินหน้าต่อไปทีละก้าว แม้บางวันจะหนักก็ตาม')
  } else if (dominant === 'เหนื่อย') {
    lines.push('การยอมรับว่าเหนื่อยก็เป็นความกล้าหาญอย่างหนึ่ง')
  } else if (dominant === 'สับสน') {
    lines.push('ความสับสนเป็นส่วนหนึ่งของการเติบโต — ไม่ต้องรีบหาคำตอบ')
  }

  if (streak >= 5) lines.push(`${streak} วันติดต่อกันนี้บอกได้ว่าคุณดูแลตัวเองจริงๆ`)

  return lines.join(' ')
}

export default async function GrowthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now        = new Date()
  const currBounds = getWeekBounds(now)
  // 31-day window covers Bangkok tz edge cases (UTC+7 can shift a Bangkok day into UTC tomorrow)
  const thirtyOneDaysAgo = new Date(now.getTime() - 31 * 86_400_000).toISOString()

  const [
    profileResult,
    checkinCountResult,
    journalCountResult,
    cardCountResult,
    recentCheckinsResult,
    weekJournalsResult,
  ] = await Promise.all([
    supabase.from('profiles')
      .select('current_streak, longest_streak')
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
    supabase.from('daily_checkins')
      .select('mood_key, note, checked_in_at')
      .eq('user_id', user.id)
      .gte('checked_in_at', thirtyOneDaysAgo)
      .order('checked_in_at', { ascending: false })
      .limit(90),
    supabase.from('journal_entries')
      .select('body')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .gte('created_at', `${currBounds.start}T00:00:00+07:00`)
      .lte('created_at', `${currBounds.end}T23:59:59+07:00`)
      .order('created_at', { ascending: false })
      .limit(7),
  ])

  const streak  = profileResult.data?.current_streak ?? 0
  const longest = profileResult.data?.longest_streak ?? 0
  const totalCheckins = checkinCountResult.count ?? 0
  const totalJournals = journalCountResult.count ?? 0
  const totalCards    = cardCountResult.count ?? 0

  const recentCheckins = recentCheckinsResult.data ?? []

  // ── 30-day activity grid ───────────────────────────────────────────────────
  const checkinDateSet = new Set(recentCheckins.map(c => toBK(c.checked_in_at)))
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now.getTime() - (29 - i) * 86_400_000)
    return checkinDateSet.has(toBK(d.toISOString()))
  })

  // ── 7-day mood timeline ────────────────────────────────────────────────────
  const moodByDate = new Map<string, string>()
  for (const c of recentCheckins) {
    const bkDate = toBK(c.checked_in_at)
    if (!moodByDate.has(bkDate)) moodByDate.set(bkDate, c.mood_key)
  }
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 86_400_000)
    const bkDate = toBK(d.toISOString())
    const dow = new Date(bkDate + 'T00:00:00Z').getUTCDay()
    return { day: THAI_DAY[dow], mood: moodByDate.get(bkDate) ?? null }
  })

  // ── Mood breakdown (last 90 checkins) ─────────────────────────────────────
  const moodCounts = new Map<string, number>()
  for (const { mood_key } of recentCheckins) {
    moodCounts.set(mood_key, (moodCounts.get(mood_key) ?? 0) + 1)
  }
  const moodBreakdown = Array.from(moodCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([mood, count]) => ({ mood, count }))

  // ── Current week reflection ────────────────────────────────────────────────
  const weekCheckins = recentCheckins
    .filter(c => {
      const bkDate = toBK(c.checked_in_at)
      return bkDate >= currBounds.start && bkDate <= currBounds.end
    })
    .map(c => ({ mood_key: c.mood_key, note: c.note }))

  const weekReflect = generateWeeklyReflection({
    checkins: weekCheckins,
    journals: weekJournalsResult.data ?? [],
    cards: [], // reading_history not yet populated — see DATA-02
  })

  const maxMoodCount   = Math.max(...moodBreakdown.map(m => m.count), 1)
  const checkinPct     = totalCheckins / 30
  const dominant       = moodBreakdown[0]?.mood ?? null
  const interpretation = gentleInterpretation(streak, dominant, checkinPct)

  return (
    <PageShell className="space-y-6">
      <PageHeader title="การเติบโต" subtitle="การเดินทางของคุณ" />

      {/* ── Streak + 30-day grid ─────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-6">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">Streak</p>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-4xl font-semibold text-ink">{streak}</p>
            <p className="text-xs text-muted font-light mt-1">วันปัจจุบัน</p>
          </div>
          <div className="w-px bg-sand" />
          <div className="text-center">
            <p className="text-4xl font-semibold text-brown">{longest}</p>
            <p className="text-xs text-muted font-light mt-1">สถิติสูงสุด</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted font-light mb-3">30 วันที่ผ่านมา</p>
          <div className="grid grid-cols-10 gap-1.5">
            {last30.map((checked, i) => (
              <div
                key={i}
                className={`w-full aspect-square rounded-sm ${checked ? 'bg-brown' : 'bg-sand/60'}`}
              />
            ))}
          </div>
        </div>
      </SurfaceCard>

      {/* ── Lifetime counters ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'เช็คอิน', value: totalCheckins },
          { label: 'การ์ด',   value: totalCards },
          { label: 'บันทึก',  value: totalJournals },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-sand bg-white/30 px-4 py-4 text-center">
            <p className="text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs text-muted font-light mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── 7-day emotional timeline ────────────────────────────────────────── */}
      <SurfaceCard className="space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">7 วันล่าสุด</p>
        <div className="flex justify-between">
          {last7.map(({ day, mood }, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                mood ? (MOOD_DOT[mood] ?? 'bg-sand') : 'bg-sand/40 border border-sand/60'
              }`}>
                {!mood && <span className="text-sand text-xs">—</span>}
              </div>
              <span className="text-xs text-muted font-light">{day}</span>
              {mood && (
                <span className="text-xs text-muted font-light leading-tight text-center max-w-[36px] truncate">
                  {mood}
                </span>
              )}
            </div>
          ))}
        </div>
      </SurfaceCard>

      {/* ── Weekly reflection ───────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">สัปดาห์นี้</p>
          {weekReflect.dominant_mood && (
            <Pill>{weekReflect.dominant_mood}</Pill>
          )}
        </div>
        {weekReflect.mood_theme && (
          <p className="text-sm font-light text-brown">{weekReflect.mood_theme}</p>
        )}
        <p className="text-sm font-light text-ink leading-7">{weekReflect.reflection_text}</p>
        <div className="flex gap-5 pt-1">
          <div className="text-center">
            <p className="text-lg font-semibold text-ink">{weekReflect.checkin_count}</p>
            <p className="text-xs text-muted font-light">เช็คอิน</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-ink">{weekReflect.journal_count}</p>
            <p className="text-xs text-muted font-light">บันทึก</p>
          </div>
        </div>
      </SurfaceCard>

      {/* ── Mood breakdown ──────────────────────────────────────────────────── */}
      {moodBreakdown.length > 0 && (
        <SurfaceCard className="space-y-4">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">อารมณ์โดยรวม</p>
          <div className="space-y-3">
            {moodBreakdown.map(({ mood, count }) => (
              <div key={mood} className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm font-light text-ink">{mood}</span>
                  <span className="text-xs text-muted font-light">{count} วัน</span>
                </div>
                <div className="h-1.5 bg-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brown/60 rounded-full"
                    style={{ width: `${Math.round((count / maxMoodCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      )}

      {/* ── Gentle interpretation ───────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/20 px-6 py-6">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light mb-3">Care สังเกตเห็น</p>
        <p className="text-sm font-light text-ink leading-8">{interpretation}</p>
      </section>

      <div className="flex justify-center gap-6">
        <Link href="/history" className="text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
          ย้อนดูประวัติ
        </Link>
        <Link href="/" className="text-sm text-muted underline underline-offset-4 hover:opacity-70 transition-opacity">
          หน้าหลัก
        </Link>
      </div>
    </PageShell>
  )
}
