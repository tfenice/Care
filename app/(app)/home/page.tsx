import Link from 'next/link'

// AUTH DISABLED: demo data
const DEMO = {
  streak: 3,
  longest: 7,
  totalCheckins: 12,
  todayCheckedIn: false,
  todayCardDrawn: false,
  weekMoods: [
    { day: 'จ', mood: 'สบายดี' },
    { day: 'อ', mood: 'พอไหว' },
    { day: 'พ', mood: 'สบายดี' },
    { day: 'พฤ', mood: 'เหนื่อย' },
    { day: 'ศ', mood: 'สับสน' },
    { day: 'ส', mood: 'พอไหว' },
    { day: 'อา', mood: null },
  ],
}

function moodDotColor(mood: string | null) {
  if (!mood) return 'bg-sand'
  if (mood === 'สบายดี') return 'bg-brown'
  if (mood === 'พอไหว') return 'bg-brown/50'
  if (mood === 'เหนื่อย') return 'bg-ink/30'
  return 'bg-ink/20'
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'สวัสดีตอนเช้า'
  if (h < 17) return 'สวัสดีตอนบ่าย'
  return 'สวัสดีตอนเย็น'
}

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">{greeting()}</h1>
      </div>

      {/* Streak card */}
      <div className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-4xl font-semibold text-ink">{DEMO.streak}</p>
            <p className="text-sm text-muted font-light mt-1">วันติดต่อกัน</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted font-light">สถิติสูงสุด</p>
            <p className="text-xl font-semibold text-brown">{DEMO.longest} วัน</p>
          </div>
        </div>

        {/* 7-day mood dots */}
        <div className="flex justify-between pt-2">
          {DEMO.weekMoods.map(({ day, mood }) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${moodDotColor(mood)}`} />
              <span className="text-xs text-muted font-light">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's action */}
      {!DEMO.todayCheckedIn ? (
        <div className="space-y-3">
          <p className="text-muted font-light text-sm">วันนี้ยังไม่ได้บันทึกใจ</p>
          <Link
            href="/checkin"
            className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
          >
            เช็คอินวันนี้
          </Link>
        </div>
      ) : !DEMO.todayCardDrawn ? (
        <div className="space-y-3">
          <p className="text-muted font-light text-sm">บันทึกใจแล้ว ✓</p>
          <Link
            href="/cards"
            className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
          >
            รับการ์ดวันนี้
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-sand px-5 py-4">
          <p className="text-sm text-muted font-light">วันนี้คุณทำดีมากแล้ว ✓</p>
          <Link href="/journal" className="text-sm text-brown underline underline-offset-4 mt-1 inline-block hover:opacity-70 transition-opacity">
            เขียนบันทึกเพิ่ม
          </Link>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-sand bg-white/30 px-5 py-4">
          <p className="text-2xl font-semibold text-ink">{DEMO.totalCheckins}</p>
          <p className="text-xs text-muted font-light mt-1">เช็คอินทั้งหมด</p>
        </div>
        <Link href="/growth" className="rounded-2xl border border-sand bg-white/30 px-5 py-4 hover:bg-white/50 transition-colors">
          <p className="text-sm font-light text-ink">ดูสถิติทั้งหมด</p>
          <p className="text-xs text-muted font-light mt-1">การเติบโตของคุณ →</p>
        </Link>
      </div>

      {/* Quick nav */}
      <div className="space-y-2">
        <Link href="/cards" className="flex items-center justify-between px-5 py-4 rounded-2xl border border-sand bg-white/30 hover:bg-white/50 transition-colors">
          <span className="text-sm font-light text-ink">การ์ดวันนี้</span>
          <span className="text-muted text-sm">→</span>
        </Link>
        <Link href="/history" className="flex items-center justify-between px-5 py-4 rounded-2xl border border-sand bg-white/30 hover:bg-white/50 transition-colors">
          <span className="text-sm font-light text-ink">ย้อนดูบันทึก</span>
          <span className="text-muted text-sm">→</span>
        </Link>
        <Link href="/profile" className="flex items-center justify-between px-5 py-4 rounded-2xl border border-sand bg-white/30 hover:bg-white/50 transition-colors">
          <span className="text-sm font-light text-ink">โปรไฟล์และตั้งค่า</span>
          <span className="text-muted text-sm">→</span>
        </Link>
      </div>

    </div>
  )
}
