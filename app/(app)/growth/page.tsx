// PROTOTYPE — all data is demo-only. Replace DEMO_GROWTH with user-scoped
// Supabase queries in Launch Hardening Sprint.

import Link from 'next/link'
import { generateWeeklyReflection } from '@/lib/services/weeklyReflection'
import { DEMO_GROWTH, DEMO_GROWTH_WEEK_JOURNALS, DEMO_GROWTH_WEEK_CARDS } from '@/lib/demo/growth'

const MOOD_DOT: Record<string, string> = {
  สบายดี:  'bg-brown',
  พอไหว:   'bg-brown/50',
  เหนื่อย: 'bg-sand border border-sand',
  สับสน:   'bg-muted/30',
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

function weeklyReflectionDemo() {
  return generateWeeklyReflection({
    checkins: DEMO_GROWTH.last7
      .filter(d => d.mood !== null)
      .map(d => ({ mood_key: d.mood!, note: null })),
    journals: DEMO_GROWTH_WEEK_JOURNALS,
    cards:    DEMO_GROWTH_WEEK_CARDS,
  })
}

export default function GrowthPage() {
  const maxMoodCount  = Math.max(...DEMO_GROWTH.moodBreakdown.map(m => m.count))
  const checkinPct    = DEMO_GROWTH.totalCheckins / 30
  const dominant      = DEMO_GROWTH.moodBreakdown[0]?.mood ?? null
  const interpretation = gentleInterpretation(DEMO_GROWTH.streak, dominant, checkinPct)
  const weekReflect   = weeklyReflectionDemo()

  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32 space-y-6">

      <header className="space-y-1 pt-2">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">การเติบโต</h1>
        <p className="text-muted font-light leading-7">การเดินทางของคุณ</p>
      </header>

      {/* ── Streak + 30-day grid ─────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-6">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">Streak</p>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-4xl font-semibold text-ink">{DEMO_GROWTH.streak}</p>
            <p className="text-xs text-muted font-light mt-1">วันปัจจุบัน</p>
          </div>
          <div className="w-px bg-sand" />
          <div className="text-center">
            <p className="text-4xl font-semibold text-brown">{DEMO_GROWTH.longest}</p>
            <p className="text-xs text-muted font-light mt-1">สถิติสูงสุด</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted font-light mb-3">30 วันที่ผ่านมา</p>
          <div className="grid grid-cols-10 gap-1.5">
            {DEMO_GROWTH.last30.map((checked, i) => (
              <div
                key={i}
                className={`w-full aspect-square rounded-sm ${checked ? 'bg-brown' : 'bg-sand/60'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Lifetime counters ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'เช็คอิน',  value: DEMO_GROWTH.totalCheckins },
          { label: 'การ์ด',    value: DEMO_GROWTH.totalCards },
          { label: 'บันทึก',   value: DEMO_GROWTH.totalJournals },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-sand bg-white/30 px-4 py-4 text-center">
            <p className="text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs text-muted font-light mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── 7-day emotional timeline ────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">7 วันล่าสุด</p>
        <div className="flex justify-between">
          {DEMO_GROWTH.last7.map(({ day, mood }) => (
            <div key={day} className="flex flex-col items-center gap-2">
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
      </section>

      {/* ── Weekly reflection ───────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">สัปดาห์นี้</p>
          {weekReflect.dominant_mood && (
            <span className="text-xs text-muted font-light border border-sand rounded-full px-3 py-1">
              {weekReflect.dominant_mood}
            </span>
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
      </section>

      {/* ── Mood breakdown ──────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">อารมณ์โดยรวม</p>
        <div className="space-y-3">
          {DEMO_GROWTH.moodBreakdown.map(({ mood, count }) => (
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
      </section>

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

    </div>
  )
}
