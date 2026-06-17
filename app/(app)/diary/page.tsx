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

  // Each milestone window spans ±2 days around the exact date
  // so a journal written slightly before or after the milestone is still surfaced.
  const milestoneWindows = MILESTONES.map(m => {
    const exactMs = now.getTime() - m.daysAgo * 86_400_000
    return {
      daysAgo: m.daysAgo,
      startDate: toBK(new Date(exactMs - 2 * 86_400_000).toISOString()),
      endDate:   toBK(new Date(exactMs + 2 * 86_400_000).toISOString()),
    }
  })

  const [
    profileResult,
    lastCheckinResult,
    weekCheckinsResult,
    weekJournalsResult,
    m30Result,
    m90Result,
    m180Result,
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

    // On This Day — one query per milestone, ±2 day window, most recent within range
    ...milestoneWindows.map(m =>
      supabase.from('journal_entries')
        .select('body')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .gte('created_at', `${m.startDate}T00:00:00+07:00`)
        .lte('created_at', `${m.endDate}T23:59:59+07:00`)
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
  const milestoneEntries = milestoneWindows.map((m, i) => ({
    daysAgo: m.daysAgo,
    body: [m30Result, m90Result, m180Result][i].data?.body ?? null,
  }))
  const dayMemories = getOnThisDay(milestoneEntries)

  return (
    <PageShell className="space-y-8">
      <PageHeader title="บันทึก Care" subtitle="จดหมายและความทรงจำ" />

      {/* ── Miss You ─────────────────────────────────────────────────────────── */}
      {missYou.shouldShow && (
        <SurfaceCard className="space-y-2 bg-white/60">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ยินดีต้อนรับกลับมา</p>
          <p className="text-sm font-light text-ink leading-8">{missYou.line1}</p>
          <p className="text-sm font-light text-muted leading-8">{missYou.line2}</p>
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
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">วันนี้เมื่อก่อน</p>
          {dayMemories.length > 0 && (
            <p className="text-xs text-muted font-light leading-6">
              มีบางข้อความจากวันเก่า ๆ ที่ยังอยากกลับมาทักคุณเบา ๆ
            </p>
          )}
        </div>

        {dayMemories.length > 0 ? (
          dayMemories.map(memory => (
            <SurfaceCard key={memory.daysAgo} className="space-y-3">
              {/* Header: specific day count, feels like a date on an old note */}
              <p className="text-xs text-brown font-light tracking-wide">
                วันนี้เมื่อ {memory.daysAgo} วันก่อน
              </p>
              {/* Excerpt: italic to evoke the feel of a handwritten page */}
              <p className="text-sm font-light text-ink leading-8 italic">
                &ldquo;{memory.excerpt}&rdquo;
              </p>
              <Link
                href="/history"
                className="inline-block text-xs text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                อ่านบันทึกนี้
              </Link>
            </SurfaceCard>
          ))
        ) : (
          <SurfaceCard className="text-center space-y-3 py-8">
            <p className="text-sm font-light text-ink">
              วันนี้ยังไม่มีบันทึกเก่าให้ย้อนกลับไปหา
            </p>
            <p className="text-xs text-muted font-light leading-7">
              ไม่เป็นไร บางวันก็เป็นเพียงวันที่เราอยู่ตรงนี้
            </p>
          </SurfaceCard>
        )}
      </div>

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
