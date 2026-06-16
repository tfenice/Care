import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'

export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32 space-y-8">

      <div className="space-y-1">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">โปรไฟล์</h1>
      </div>

      {/* Account */}
      <div className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">บัญชี</p>
        <div className="space-y-1">
          <p className="text-sm text-muted font-light">อีเมล</p>
          <p className="text-ink font-light">—</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted font-light">สมาชิกตั้งแต่</p>
          <p className="text-ink font-light">—</p>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">การแจ้งเตือน</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-ink">เตือนเช็คอินรายวัน</p>
            <p className="text-xs text-muted font-light mt-0.5">ทุกวัน เวลา 20:00</p>
          </div>
          <div className="w-10 h-6 rounded-full bg-sand flex items-center px-1">
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-light text-ink">สรุปรายสัปดาห์</p>
            <p className="text-xs text-muted font-light mt-0.5">ทุกวันอาทิตย์</p>
          </div>
          <div className="w-10 h-6 rounded-full bg-sand flex items-center px-1">
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">เกี่ยวกับ</p>
        <Link href="/" className="flex items-center justify-between py-1 hover:opacity-70 transition-opacity">
          <span className="text-sm font-light text-ink">นโยบายความเป็นส่วนตัว</span>
          <span className="text-muted text-sm">→</span>
        </Link>
        <Link href="/" className="flex items-center justify-between py-1 hover:opacity-70 transition-opacity">
          <span className="text-sm font-light text-ink">ข้อกำหนดการใช้งาน</span>
          <span className="text-muted text-sm">→</span>
        </Link>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-light text-ink">เวอร์ชัน</span>
          <span className="text-muted text-sm font-light">0.1.0</span>
        </div>
      </div>

      {/* Sign out */}
      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-full border border-sand py-4 text-sm font-light text-muted hover:text-ink hover:border-ink transition-colors"
        >
          ออกจากระบบ
        </button>
      </form>

    </div>
  )
}
