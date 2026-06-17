import Link from 'next/link'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import SurfaceCard from '@/components/ui/SurfaceCard'

const VERSION = '0.1.0'

export default function SettingsPage() {
  return (
    <PageShell className="space-y-6">
      <PageHeader title="ตั้งค่า" />

      {/* ── Data & Privacy ──────────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ข้อมูลและความเป็นส่วนตัว</p>
        <p className="text-sm font-light text-ink leading-7">
          Care เก็บเฉพาะข้อมูลที่จำเป็นสำหรับการดูแลตัวเองของคุณ ได้แก่ อีเมล อารมณ์ประจำวัน บันทึก และการ์ดที่รับ
          ข้อมูลเหล่านี้ไม่ถูกส่งให้บุคคลภายนอกหรือใช้เพื่อการโฆษณา
        </p>
        <div className="space-y-0.5 pt-1">
          {[
            'อีเมลสำหรับเข้าระบบเท่านั้น',
            'อารมณ์และบันทึกส่วนตัว เห็นได้เฉพาะคุณ',
            'ไม่มีการติดตามข้อมูลจากภายนอก',
            'ข้อมูลถูกเข้ารหัสและปลอดภัย',
          ].map(item => (
            <p key={item} className="text-xs font-light text-muted leading-7 flex items-start gap-2">
              <span className="text-brown mt-0.5">·</span>
              {item}
            </p>
          ))}
        </div>
      </SurfaceCard>

      {/* ── Reminders ───────────────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">การแจ้งเตือน</p>
        <div className="space-y-4">
          {[
            { label: 'เตือนเช็คอินรายวัน', sub: 'ทุกวัน เวลา 20:00' },
            { label: 'สรุปรายสัปดาห์', sub: 'ทุกวันอาทิตย์ เวลา 09:00' },
          ].map(({ label, sub }) => (
            <div key={label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-ink">{label}</p>
                <p className="text-xs text-muted font-light mt-0.5">{sub}</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-sand flex items-center px-1" aria-label="ปิดอยู่">
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted font-light">เร็วๆ นี้</p>
      </SurfaceCard>

      {/* ── Export data (placeholder) ─────────────────────────────────────── */}
      <SurfaceCard className="space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ข้อมูลของคุณ</p>
        <div className="flex items-center justify-between py-1 opacity-50 cursor-not-allowed">
          <div>
            <p className="text-sm font-light text-ink">ส่งออกข้อมูล</p>
            <p className="text-xs text-muted font-light mt-0.5">ดาวน์โหลดบันทึกและการเช็คอินทั้งหมด</p>
          </div>
          <span className="text-muted text-sm">→</span>
        </div>
        <p className="text-xs text-muted font-light">เร็วๆ นี้</p>
      </SurfaceCard>

      {/* ── Delete account (placeholder) ──────────────────────────────────── */}
      <SurfaceCard className="space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">บัญชี</p>
        <div className="flex items-center justify-between py-1 opacity-40 cursor-not-allowed">
          <div>
            <p className="text-sm font-light text-ink">ลบบัญชี</p>
            <p className="text-xs text-muted font-light mt-0.5">ลบข้อมูลทั้งหมดของคุณอย่างถาวร</p>
          </div>
          <span className="text-muted text-sm">→</span>
        </div>
        <p className="text-xs text-muted font-light">ยังไม่พร้อมใช้งาน — หากต้องการลบบัญชีติดต่อเราได้เลย</p>
      </SurfaceCard>

      {/* ── About / Version ───────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-1">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light mb-3">เกี่ยวกับ Care</p>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-light text-ink">เวอร์ชัน</span>
          <span className="text-xs text-muted font-light">{VERSION}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-sand/50">
          <span className="text-sm font-light text-ink">นโยบายความเป็นส่วนตัว</span>
          <span className="text-muted text-sm">→</span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-sand/50">
          <span className="text-sm font-light text-ink">ข้อกำหนดการใช้งาน</span>
          <span className="text-muted text-sm">→</span>
        </div>
      </SurfaceCard>

      <div className="flex justify-center">
        <Link href="/profile" className="text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
          กลับโปรไฟล์
        </Link>
      </div>
    </PageShell>
  )
}
