import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HistoryEntry from '@/components/care/HistoryEntry'
import type { DbRitualCard, DbJournalEntry, DbReadingHistory } from '@/types/database'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ── Tier 1: last 30 days of check-ins ────────────────────────────────────────
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: checkins } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', user.id)
    .gte('checked_in_at', thirtyDaysAgo.toISOString())
    .order('checked_in_at', { ascending: false })

  if (!checkins || checkins.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="space-y-5">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <h1 className="text-2xl font-semibold text-ink leading-relaxed">ย้อนดู</h1>
            <p className="text-muted font-light leading-8">
              ยังไม่มีบันทึกใดๆ เลย
              <br />
              เริ่มจากวันนี้ก็ได้นะ
            </p>
          </div>
          <Link
            href="/checkin"
            className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
          >
            เช็คอินวันนี้
          </Link>
        </div>
      </div>
    )
  }

  const checkinIds = checkins.map(c => c.id)

  // ── Tier 2: parallel fetch journal entries + reading history ──────────────────
  const [{ data: journals }, { data: readingHistory }] = await Promise.all([
    supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .in('checkin_id', checkinIds),
    supabase
      .from('reading_history')
      .select('*')
      .eq('user_id', user.id)
      .in('checkin_id', checkinIds),
  ])

  // ── Tier 3: ritual cards for drawn cards (conditional) ────────────────────────
  const cardIds = [...new Set((readingHistory ?? []).map(h => h.card_id))]
  let cards: DbRitualCard[] = []
  if (cardIds.length > 0) {
    const { data } = await supabase
      .from('ritual_cards')
      .select('*')
      .in('id', cardIds)
    cards = data ?? []
  }

  // ── Build lookup maps ─────────────────────────────────────────────────────────
  const journalByCheckinId = new Map<string, DbJournalEntry>()
  for (const j of journals ?? []) {
    if (j.checkin_id) journalByCheckinId.set(j.checkin_id, j)
  }

  const readingByCheckinId = new Map<string, DbReadingHistory>()
  for (const h of readingHistory ?? []) {
    if (h.checkin_id) readingByCheckinId.set(h.checkin_id, h)
  }

  const cardById = new Map<string, DbRitualCard>()
  for (const c of cards) cardById.set(c.id, c)

  // ── Group by Bangkok date, deduplicate (newest check-in wins per date) ─────────
  const bangkokDateFmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' })
  const thaiDateFmt = new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Bangkok',
  })

  type EntryRow = {
    key: string
    displayDate: string
    moodKey: string
    cardTitle: string | null
    journalBody: string | null
  }

  const seenDates = new Set<string>()
  const entries: EntryRow[] = []

  for (const checkin of checkins) {
    const dateKey = bangkokDateFmt.format(new Date(checkin.checked_in_at))
    if (seenDates.has(dateKey)) continue
    seenDates.add(dateKey)

    const reading = readingByCheckinId.get(checkin.id)
    const card = reading ? (cardById.get(reading.card_id) ?? null) : null
    const journal = journalByCheckinId.get(checkin.id) ?? null

    entries.push({
      key: checkin.id,
      displayDate: thaiDateFmt.format(new Date(checkin.checked_in_at)),
      moodKey: checkin.mood_key,
      cardTitle: card?.title_th ?? null,
      journalBody: journal?.body ?? null,
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32">
      <div className="space-y-1 mb-8">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">ย้อนดู</h1>
      </div>

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
    </div>
  )
}
