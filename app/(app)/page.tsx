import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────

type DemoData = {
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
// AUTH DISABLED: returns demo data.
// When auth is restored: replace with parallel Supabase fetches.

async function getDashboardData(): Promise<DemoData> {
  return {
    name: null,
    streak: 3,
    longestStreak: 7,
    totalCheckins: 12,
    totalJournals: 5,
    totalCards: 9,
    latestJournal: {
      body: 'วันนี้รู้สึกเหนื่อยนิดหน่อย แต่ก็ผ่านมาได้ทุกครั้ง บางทีการแค่หยุดพักก็เพียงพอแล้วสำหรับวันนี้',
    },
    latestCard: {
      categoryNameTh: 'การยอมรับ',
      titleTh: 'ให้เวลากับตัวเองสักนิด',
      bodyTh: 'บางวันแค่ได้หยุดพักก็เพียงพอแล้ว คุณไม่จำเป็นต้องทำทุกอย่างให้สมบูรณ์แบบ',
    },
  }
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
  const data = await getDashboardData()
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

      {/* ── 3. Recent Reflection ───────────────────────────────────────────── */}
      {data.latestJournal && (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">บันทึกล่าสุด</p>
          <p className="text-ink font-light leading-7 text-sm">
            {truncate(data.latestJournal.body)}
          </p>
          <Link
            href="/journal"
            className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            อ่านต่อ
          </Link>
        </section>
      )}

      {/* ── 4. Recent Card ─────────────────────────────────────────────────── */}
      {data.latestCard && (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">
            {data.latestCard.categoryNameTh}
          </p>
          <h2 className="text-base font-semibold text-ink">{data.latestCard.titleTh}</h2>
          <p className="text-ink font-light leading-7 text-sm">
            {truncate(data.latestCard.bodyTh)}
          </p>
          <Link
            href="/cards"
            className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            ดูอีกครั้ง
          </Link>
        </section>
      )}

      {/* ── 5. Growth Snapshot ─────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ภาพรวม</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: data.totalCheckins, label: 'เช็คอิน' },
            { value: data.totalJournals, label: 'บันทึก' },
            { value: data.totalCards, label: 'การ์ด' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-semibold text-ink">{value}</p>
              <p className="text-xs text-muted font-light mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Quick Actions ───────────────────────────────────────────────── */}
      <section className="space-y-2">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light px-1">ลัดไป</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: '/checkin', label: 'เช็คอินวันนี้' },
            { href: '/cards', label: 'ดูการ์ด' },
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

    </div>
  )
}
