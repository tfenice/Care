import Link from 'next/link'
import HistoryEntry from '@/components/care/HistoryEntry'

// AUTH DISABLED: demo data
const DEMO_ENTRIES = [
  { key: '1', displayDate: '16 มิถุนายน', moodKey: 'พอไหว', cardTitle: 'ให้เวลากับตัวเองสักนิด', journalBody: 'วันนี้รู้สึกเหมือนมีอะไรหลายอย่างที่ต้องทำ แต่ก็พยายามจัดการทีละอย่าง' },
  { key: '2', displayDate: '15 มิถุนายน', moodKey: 'สบายดี', cardTitle: 'ความเงียบคือพื้นที่ให้ใจพัก', journalBody: null },
  { key: '3', displayDate: '14 มิถุนายน', moodKey: 'เหนื่อย', cardTitle: null, journalBody: 'เหนื่อยมากวันนี้ แต่ก็ผ่านมาได้' },
  { key: '4', displayDate: '13 มิถุนายน', moodKey: 'สบายดี', cardTitle: 'หยุดพักแล้วไปต่อได้เสมอ', journalBody: null },
  { key: '5', displayDate: '12 มิถุนายน', moodKey: 'สับสน', cardTitle: null, journalBody: null },
]

export default async function HistoryPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32">
      <div className="space-y-1 mb-8">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">ย้อนดู</h1>
      </div>

      <div>
        {DEMO_ENTRIES.map(entry => (
          <HistoryEntry
            key={entry.key}
            displayDate={entry.displayDate}
            moodKey={entry.moodKey}
            cardTitle={entry.cardTitle}
            journalBody={entry.journalBody}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/checkin"
          className="text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          เช็คอินวันนี้
        </Link>
      </div>
    </div>
  )
}
