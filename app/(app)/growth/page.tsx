import Link from 'next/link'

// AUTH DISABLED: demo data
const DEMO = {
  streak: 3,
  longest: 7,
  totalCheckins: 12,
  totalCards: 9,
  totalJournals: 5,
  moodBreakdown: [
    { mood: 'สบายดี', count: 5, score: 5 },
    { mood: 'พอไหว', count: 4, score: 3 },
    { mood: 'เหนื่อย', count: 2, score: 2 },
    { mood: 'สับสน', count: 1, score: 2 },
  ],
  last30: [
    // true = checked in, false = missed
    false, false, false, false, false, false, false,
    false, false, false, false, false, false, false,
    false, false, false, false, true, false, false,
    true, true, false, true, true, false, true,
    true, true,
  ],
}

function moodBar(count: number, max: number) {
  const pct = Math.round((count / max) * 100)
  return pct
}

export default function GrowthPage() {
  const maxMoodCount = Math.max(...DEMO.moodBreakdown.map(m => m.count))

  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32 space-y-8">

      <div className="space-y-1">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">การเติบโต</h1>
      </div>

      {/* Streak */}
      <div className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-6">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">Streak</p>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-4xl font-semibold text-ink">{DEMO.streak}</p>
            <p className="text-xs text-muted font-light mt-1">วันปัจจุบัน</p>
          </div>
          <div className="w-px bg-sand" />
          <div className="text-center">
            <p className="text-4xl font-semibold text-brown">{DEMO.longest}</p>
            <p className="text-xs text-muted font-light mt-1">สถิติสูงสุด</p>
          </div>
        </div>

        {/* 30-day grid */}
        <div>
          <p className="text-xs text-muted font-light mb-3">30 วันที่ผ่านมา</p>
          <div className="grid grid-cols-10 gap-1.5">
            {DEMO.last30.map((checked, i) => (
              <div
                key={i}
                className={`w-full aspect-square rounded-sm ${checked ? 'bg-brown' : 'bg-sand/60'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'เช็คอิน', value: DEMO.totalCheckins },
          { label: 'การ์ด', value: DEMO.totalCards },
          { label: 'บันทึก', value: DEMO.totalJournals },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-sand bg-white/30 px-4 py-4 text-center">
            <p className="text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs text-muted font-light mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Mood breakdown */}
      <div className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">อารมณ์</p>
        <div className="space-y-3">
          {DEMO.moodBreakdown.map(({ mood, count }) => (
            <div key={mood} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-light text-ink">{mood}</span>
                <span className="text-muted font-light">{count} วัน</span>
              </div>
              <div className="h-1.5 bg-sand rounded-full overflow-hidden">
                <div
                  className="h-full bg-brown rounded-full transition-all"
                  style={{ width: `${moodBar(count, maxMoodCount)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/home"
        className="block text-center text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        กลับหน้าหลัก
      </Link>
    </div>
  )
}
