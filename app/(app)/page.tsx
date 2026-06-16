// PROTOTYPE — all data is demo-only. Replace getDashboardData(), getWeeklyReflectionDemo(),
// and getMemoriesDemo() with user-scoped Supabase queries in Launch Hardening Sprint.

import Link from 'next/link'
import { generateWeeklyReflection } from '@/lib/services/weeklyReflection'
import { extractMemories, type ExtractedMemory } from '@/lib/services/memoryExtractor'
import {
  DEMO_DASHBOARD,
  DEMO_WEEK_CHECKINS,
  DEMO_WEEK_JOURNALS,
  DEMO_WEEK_CARDS,
  DEMO_MEMORY_JOURNALS,
  DEMO_MEMORY_CHECKINS,
} from '@/lib/demo/dashboard'

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

// ── Data layer ────────────────────────────────────────────────────────────────

async function getDashboardData(): Promise<DashboardData> {
  return DEMO_DASHBOARD
}

function getMemoriesDemo(): ExtractedMemory[] {
  return extractMemories({ journals: DEMO_MEMORY_JOURNALS, checkins: DEMO_MEMORY_CHECKINS })
}

function getWeeklyReflectionDemo() {
  return generateWeeklyReflection({
    checkins: DEMO_WEEK_CHECKINS,
    journals: DEMO_WEEK_JOURNALS,
    cards:    DEMO_WEEK_CARDS,
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  const [data, weekReflection] = await Promise.all([
    getDashboardData(),
    Promise.resolve(getWeeklyReflectionDemo()),
  ])
  const memories = getMemoriesDemo()
  const topMemory = memories[memories.length - 1] ?? null
  const hour = new Date().getHours()

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
