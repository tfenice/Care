import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { toBangkokDate } from '@/lib/utils'
import HistoryEntry from '@/components/care/HistoryEntry'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'

const THAI_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']

function formatDisplayDate(isoDate: string): string {
  const parts = isoDate.split('-')
  const m = parseInt(parts[1])
  const d = parseInt(parts[2])
  return `${d} ${THAI_MONTHS[m - 1]}`
}

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [checkinsResult, journalsResult] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('mood_key, note, checked_in_at')
      .eq('user_id', user.id)
      .order('checked_in_at', { ascending: false })
      .limit(30),
    supabase
      .from('journal_entries')
      .select('body, created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  const checkins = checkinsResult.data ?? []
  const journals = journalsResult.data ?? []

  // Journal body lookup by Bangkok date (most recent per day)
  const journalByDate = new Map<string, string>()
  for (const j of journals) {
    const date = toBangkokDate(j.created_at)
    if (!journalByDate.has(date)) journalByDate.set(date, j.body)
  }

  const entries = checkins.map(c => {
    const date = toBangkokDate(c.checked_in_at)
    return {
      key: date,
      displayDate: formatDisplayDate(date),
      moodKey: c.mood_key,
      journalBody: journalByDate.get(date) ?? c.note,
    }
  })

  return (
    <PageShell>
      <PageHeader title="ย้อนดู" subtitle="วันที่คุณกลับมา" className="mb-10" />

      {entries.length === 0 ? (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-12 text-center space-y-5">
          <p className="text-ink font-light text-sm leading-8">ยังไม่มีวันที่บันทึกไว้</p>
          <p className="text-muted font-light text-sm leading-7">แค่ที่คุณยังกลับมาก็สำคัญแล้ว</p>
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
                cardTitle={null}
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
    </PageShell>
  )
}
