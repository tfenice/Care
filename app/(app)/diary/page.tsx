import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateCareLetter, firstLine } from '@/lib/services/careLetter'
import { getOnThisDay, MILESTONES } from '@/lib/services/onThisDay'
import { getMissYouState } from '@/lib/services/missYou'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import SurfaceCard from '@/components/ui/SurfaceCard'

function toBK(ts: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(ts))
}

function thaiDateRange(startISO: string, endISO: string): string {
  const THAI_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
                       'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  const [, sm, sd] = startISO.split('-').map(Number)
  const [, em, ed] = endISO.split('-').map(Number)
  if (sm === em) return `${sd}–${ed} ${THAI_MONTHS[em - 1]}`
  return `${sd} ${THAI_MONTHS[sm - 1]} – ${ed} ${THAI_MONTHS[em - 1]}`
}

export default async function DiaryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const todayBK = toBK(now.toISOString())
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000)
  const sevenDaysAgoBK = toBK(sevenDaysAgo.toISOString())

  // Build milestone date windows for On This Day
  const milestoneWindows = MILESTONES.map(m => {
    const d = new Date(now.getTime() - m.daysAgo * 86_400_000)
    const date = toBK(d.toISOString())
    return { daysAgo: m.daysAgo, date }
  })

  const [
    profileResult,
    lastCheckinResult,
    weekCheckinsResult,
    weekJournalsResult,
    m30Result,
    m90Result,
    m180Result,
    m365Result,
  ] = await Promise.all([
    supabase.from('profiles')
      .select('current_streak')
      .eq('id', user.id)
      .maybeSingle(),

    supabase.from('daily_checkins')
      .select('checked_in_at')
      .eq('user_id', user.id)
      .order('checked_in_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase.from('daily_checkins')
      .select('mood_key')
      .eq('user_id', user.id)
      .gte('checked_in_at', `${sevenDaysAgoBK}T00:00:00+07:00`)
      .lte('checked_in_at', `${todayBK}T23:59:59+07:00`)
      .order('checked_in_at', { ascending: false })
      .limit(7),

    supabase.from('journal_entries')
      .select('body')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .gte('created_at', `${sevenDaysAgoBK}T00:00:00+07:00`)
      .lte('created_at', `${todayBK}T23:59:59+07:00`)
      .order('created_at', { ascending: false })
      .limit(7),

    // On This Day — one query per milestone date
    ...milestoneWindows.map(m =>
      supabase.from('journal_entries')
        .select('body')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .gte('created_at', `${m.date}T00:00:00+07:00`)
        .lte('created_at', `${m.date}T23:59:59+07:00`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
    ),
  ])

  const streak = profileResult.data?.current_streak ?? 0
  const weekCheckins = weekCheckinsResult.data ?? []
  const weekJournals = weekJournalsResult.data ?? []

  // ── Miss You ────────────────────────────────────────────────────────────────
  const lastCheckinBK = lastCheckinResult.data?.checked_in_at
    ? toBK(lastCheckinResult.data.checked_in_at)
    : null
  const missYou = getMissYouState(lastCheckinBK, todayBK)

  // ── Care Letter ─────────────────────────────────────────────────────────────
  const latestJournal = weekJournals[0]?.body ?? null
  const letter = generateCareLetter({
    weekMoods:      weekCheckins.map(c => c.mood_key),
    journalCount:   weekJournals.length,
    journalExcerpt: latestJournal ? firstLine(latestJournal, 48) : null,
    streak,
  })
  const dateRange = thaiDateRange(sevenDaysAgoBK, todayBK)

  // ── On This Day ──────────────────────────────────────────────────────────────
  const milestoneResults = [m30Result, m90Result, m180Result, m365Result]
  const milestoneEntries = milestoneWindows.map((m, i) => ({
    daysAgo: m.daysAgo,
    body: milestoneResults[i].data?.body ?? null,
  }))
  const dayMemories = getOnThisDay(milestoneEntries)

  return (
    <PageShell className="space-y-8">
      <PageHeader title="บันทึก Care" subtitle="จดหมายและความทรงจำ" />

      {/* ── Miss You ─────────────────────────────────────────────────────────── */}
      {missYou.shouldShow && (
        <SurfaceCard className="space-y-2 bg-white/60">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ยินดีต้อนรับกลับมา</p>
          <p className="text-base font-light text-ink leading-8">{missYou.message}</p>
          {missYou.sub && (
            <p className="text-xs text-muted font-light">{missYou.sub}</p>
          )}
        </SurfaceCard>
      )}

      {/* ── Care Letter ──────────────────────────────────────────────────────── */}
      <SurfaceCard className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">จดหมายจาก Care</p>
          <p className="text-xs text-muted font-light shrink-0">{dateRange}</p>
        </div>
        <div className="space-y-5">
          {letter.lines.map((line, i) => (
            <p
              key={i}
              className={`text-sm font-light leading-8 ${i === letter.lines.length - 1 ? 'text-brown' : 'text-ink'}`}
            >
              {line}
            </p>
          ))}
        </div>
      </SurfaceCard>

      {/* ── On This Day ──────────────────────────────────────────────────────── */}
      {dayMemories.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light px-1">
            วันนี้เมื่อ...
          </p>
          {dayMemories.map(memory => (
            <SurfaceCard key={memory.daysAgo} className="space-y-3">
              <p className="text-xs text-muted font-light">{memory.label}</p>
              <p className="text-sm font-light text-ink leading-8">
                &ldquo;{memory.excerpt}&rdquo;
              </p>
              <Link
                href="/journal"
                className="inline-block text-xs text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                เขียนวันนี้
              </Link>
            </SurfaceCard>
          ))}
        </div>
      )}

      {dayMemories.length === 0 && (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-10 text-center space-y-3">
          <p className="text-sm font-light text-ink">ยังไม่มีความทรงจำจากวันนี้ในอดีต</p>
          <p className="text-xs text-muted font-light leading-7">
            เมื่อคุณใช้ Care ต่อเนื่อง<br />
            Care จะนำความทรงจำเก่ากลับมาให้นะ
          </p>
        </section>
      )}

      {/* ── Nav footer ───────────────────────────────────────────────────────── */}
      <div className="flex justify-center gap-6">
        <Link href="/journal" className="text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
          เขียนบันทึก
        </Link>
        <Link href="/" className="text-sm text-muted underline underline-offset-4 hover:opacity-70 transition-opacity">
          หน้าหลัก
        </Link>
      </div>
    </PageShell>
  )
}
