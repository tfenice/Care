// PROTOTYPE — all data is demo-only. Replace DEMO_HISTORY_ENTRIES with
// user-scoped Supabase queries in Launch Hardening Sprint.

import Link from 'next/link'
import HistoryEntry from '@/components/care/HistoryEntry'
import { DEMO_HISTORY_ENTRIES } from '@/lib/demo/history'

export default async function HistoryPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32">
      <div className="space-y-1 mb-8">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">ย้อนดู</h1>
      </div>

      <div>
        {DEMO_HISTORY_ENTRIES.map(entry => (
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
