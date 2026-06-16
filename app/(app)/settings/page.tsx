import Link from 'next/link'

const VERSION = '0.1.0'

export default function SettingsPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32 space-y-6">

      <header className="space-y-1 pt-2">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">ตั้งค่า</h1>
      </header>

      {/* ── Data & Privacy ──────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ข้อมูลและความเป็นส่วนตัว</p>
        <p className="text-sm font-light text-ink leading-7">
          Care เก็บเฉพาะข้อมูลที่จำเป็นสำหรับการดูแลตัวเองของคุณ ได้แก่ อีเมล อารมณ์ประจำวัน บันทึก และการ์ดที่รับ
          ข้อมูลเหล่านี้ไม่ถูกส่งให้บุคคลภายนอกหรือใช้เพื่อการโฆษณา
        </p>
        <div className="space-y-0.5 pt-1">
          {[
            'อีเมลสำหรับเข้าระบบเท่านั้น',
            'อารมณ์และบันทึกส่วนตัว เห็นได้เฉพาะคุณ',
            'ไม่มีการ tracking หรือ analytics ภายนอก',
            'ข้อมูลถูกเข้ารหัสและปลอดภัย',
          ].map(item => (
            <p key={item} className="text-xs font-light text-muted leading-7 flex items-start gap-2">
              <span className="text-brown mt-0.5">·</span>
              {item}
            </p>
          ))}
        </div>
      </section>

      {/* ── Reminders ───────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
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
        <p className="text-xs text-muted font-light">การแจ้งเตือนจะใช้งานได้ในเวอร์ชันถัดไป</p>
      </section>

      {/* ── Export data (placeholder) ─────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ข้อมูลของคุณ</p>
        <div className="flex items-center justify-between py-1 opacity-50 cursor-not-allowed">
          <div>
            <p className="text-sm font-light text-ink">ส่งออกข้อมูล</p>
            <p className="text-xs text-muted font-light mt-0.5">ดาวน์โหลดบันทึกและการเช็คอินทั้งหมด</p>
          </div>
          <span className="text-muted text-sm">→</span>
        </div>
        <p className="text-xs text-muted font-light">ฟีเจอร์นี้กำลังพัฒนา</p>
      </section>

      {/* ── Delete account (placeholder) ──────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">บัญชี</p>
        <div className="flex items-center justify-between py-1 opacity-40 cursor-not-allowed">
          <div>
            <p className="text-sm font-light text-ink">ลบบัญชี</p>
            <p className="text-xs text-muted font-light mt-0.5">ลบข้อมูลทั้งหมดของคุณอย่างถาวร</p>
          </div>
          <span className="text-muted text-sm">→</span>
        </div>
        <p className="text-xs text-muted font-light">ฟีเจอร์นี้กำลังพัฒนา กรุณาติดต่อทีมงาน</p>
      </section>

      {/* ── About / Version ───────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-1">
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
      </section>

      <div className="flex justify-center">
        <Link href="/profile" className="text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
          กลับโปรไฟล์
        </Link>
      </div>

    </div>
  )
}
