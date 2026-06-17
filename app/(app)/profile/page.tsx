import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import SurfaceCard from '@/components/ui/SurfaceCard'

// AUTH DISABLED: demo data. Replace with user-scoped Supabase queries.
const DEMO = {
  email: 'demo@care.app',
  memberSince: 'มิถุนายน 2026',
  streak: 3,
  longest: 7,
  totalCheckins: 12,
  totalJournals: 5,
  totalCards: 9,
}

export default function ProfilePage() {
  return (
    <PageShell className="space-y-6">
      <PageHeader title="โปรไฟล์" />

      {/* ── Account ─────────────────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">บัญชี</p>
        <div className="space-y-1">
          <p className="text-xs text-muted font-light">อีเมล</p>
          <p className="text-sm text-ink font-light">{DEMO.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted font-light">สมาชิกตั้งแต่</p>
          <p className="text-sm text-ink font-light">{DEMO.memberSince}</p>
        </div>
      </SurfaceCard>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ความต่อเนื่อง</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-semibold text-ink leading-none">{DEMO.streak}</p>
            <p className="text-xs text-muted font-light mt-1.5">วันติดต่อกัน</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-brown leading-none">{DEMO.longest}</p>
            <p className="text-xs text-muted font-light mt-1.5">สถิติสูงสุด</p>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ทั้งหมด</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'เช็คอิน', value: DEMO.totalCheckins },
            { label: 'บันทึก',  value: DEMO.totalJournals },
            { label: 'การ์ด',   value: DEMO.totalCards },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-semibold text-ink">{value}</p>
              <p className="text-xs text-muted font-light mt-1">{label}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      {/* ── Notification placeholders ────────────────────────────────────────── */}
      <SurfaceCard className="space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">การแจ้งเตือน</p>
        {[
          { label: 'เตือนเช็คอินรายวัน', sub: 'ทุกวัน เวลา 20:00' },
          { label: 'สรุปรายสัปดาห์', sub: 'ทุกวันอาทิตย์' },
        ].map(({ label, sub }) => (
          <div key={label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-ink">{label}</p>
              <p className="text-xs text-muted font-light mt-0.5">{sub}</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-sand flex items-center px-1" aria-label="เร็วๆ นี้">
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        ))}
        <p className="text-xs text-muted font-light">เร็วๆ นี้</p>
      </SurfaceCard>

      {/* ── Links ───────────────────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-1">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light mb-3">ลิงก์</p>
        {[
          { href: '/settings', label: 'ตั้งค่าและความเป็นส่วนตัว' },
          { href: '/growth',   label: 'ดูการเติบโตของคุณ' },
          { href: '/memory',   label: 'ความทรงจำ' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between py-2.5 hover:opacity-70 transition-opacity"
          >
            <span className="text-sm font-light text-ink">{label}</span>
            <span className="text-muted text-sm">→</span>
          </Link>
        ))}
      </SurfaceCard>

      {/* ── Privacy note ────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/20 px-6 py-5">
        <p className="text-xs font-light text-muted leading-6">
          Care เก็บข้อมูลเพื่อช่วยให้คุณกลับมาฟังใจตัวเองได้ต่อเนื่อง
          ข้อมูลของคุณเป็นของคุณเสมอ
        </p>
      </section>

      {/* ── Sign out ────────────────────────────────────────────────────────── */}
      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-full border border-sand py-4 text-sm font-light text-muted hover:text-ink hover:border-ink transition-colors"
        >
          ออกจากระบบ
        </button>
      </form>
    </PageShell>
  )
}
