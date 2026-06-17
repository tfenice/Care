// PROTOTYPE — all data is demo-only. Replace DEMO_HISTORY_ENTRIES with
// user-scoped Supabase queries in Launch Hardening Sprint.

import Link from 'next/link'
import HistoryEntry from '@/components/care/HistoryEntry'
import { DEMO_HISTORY_ENTRIES } from '@/lib/demo/history'

export default async function HistoryPage() {
  const entries = DEMO_HISTORY_ENTRIES

  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32">
      <div className="space-y-1 mb-8">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">ย้อนดู</h1>
        <p className="text-muted font-light leading-7">วันที่คุณกลับมา</p>
      </div>

      {entries.length === 0 ? (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-12 text-center space-y-5">
          <p className="text-ink font-light text-sm leading-8">
            ยังไม่มีวันที่บันทึกไว้
          </p>
          <p className="text-muted font-light text-sm leading-7">
            แค่ที่คุณยังกลับมาก็สำคัญแล้ว
          </p>
          <Link
            href="/checkin"
            className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            เช็คอินวันนี้
          </Link>
        </section>
      ) : (
        <>
          <div>
            {entries.map(entry => (
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
        </>
      )}
    </div>
  )
}
