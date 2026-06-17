import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { extractMemories, extractThemes, type ExtractedMemory } from '@/lib/services/memoryExtractor'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import SurfaceCard from '@/components/ui/SurfaceCard'

function getPageData(
  journals: Array<{ body: string; created_at: string }>,
  checkins: Array<{ mood_key: string; note: string | null; checked_in_at: string }>,
) {
  const memories = extractMemories({ journals, checkins })

  // Aggregate themes across all journals
  const themeCount: Record<string, number> = {}
  for (const j of journals) {
    for (const t of extractThemes(j.body)) {
      themeCount[t] = (themeCount[t] ?? 0) + 1
    }
  }
  const themes = Object.entries(themeCount).sort((a, b) => b[1] - a[1])

  // Mood frequency from checkins
  const moodCount: Record<string, number> = {}
  for (const c of checkins) {
    moodCount[c.mood_key] = (moodCount[c.mood_key] ?? 0) + 1
  }
  const moods = Object.entries(moodCount).sort((a, b) => b[1] - a[1])
  const maxMood = moods[0]?.[1] ?? 1

  // Synthesis first (most insight), then journal, then checkin
  const ordered: ExtractedMemory[] = [
    ...memories.filter(m => m.source_type === 'synthesis'),
    ...memories.filter(m => m.source_type === 'journal'),
    ...memories.filter(m => m.source_type === 'checkin'),
  ]

  return { memories: ordered, themes, moods, maxMood }
}

const SOURCE_LABELS: Record<ExtractedMemory['source_type'], string> = {
  synthesis: 'ภาพรวม',
  journal:   'จากบันทึก',
  checkin:   'จากการเช็คอิน',
}

const SOURCE_BG: Record<ExtractedMemory['source_type'], string> = {
  synthesis: 'bg-white/60',
  journal:   'bg-white/40',
  checkin:   'bg-white/30',
}

export default async function MemoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [journalsResult, checkinsResult] = await Promise.all([
    supabase.from('journal_entries')
      .select('body, created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('daily_checkins')
      .select('mood_key, note, checked_in_at')
      .eq('user_id', user.id)
      .order('checked_in_at', { ascending: false })
      .limit(50),
  ])

  const { memories, themes, moods, maxMood } = getPageData(
    journalsResult.data ?? [],
    checkinsResult.data ?? [],
  )
  const hasData = memories.length > 0

  return (
    <PageShell className="space-y-6">
      <PageHeader title="ความทรงจำ" subtitle="สิ่งที่ Care สังเกตเห็นในตัวคุณ" />

      {!hasData ? (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-12 text-center space-y-5">
          <p className="text-ink font-light text-sm leading-8">
            Care ยังไม่เห็นรูปแบบที่ชัดเจน
          </p>
          <p className="text-muted font-light text-sm leading-7">
            เมื่อคุณกลับมาบ่อยขึ้น<br />
            Care จะเริ่มสังเกตเห็นสิ่งที่ซ้ำๆ ในตัวคุณ
          </p>
          <Link href="/journal" className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
            เขียนบันทึก
          </Link>
        </section>
      ) : (
        <>
          {/* ── Care noticed... ──────────────────────────────────────────────── */}
          <div className="space-y-3">
            {memories.map((memory, i) => (
              <section
                key={i}
                className={`rounded-3xl border border-sand ${SOURCE_BG[memory.source_type]} px-6 py-5 space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[0.15em] uppercase text-brown font-light">
                    Care สังเกตเห็น · {SOURCE_LABELS[memory.source_type]}
                  </span>
                  {memory.themes.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {memory.themes.slice(0, 2).map(theme => (
                        <span key={theme} className="text-xs text-muted font-light border border-sand rounded-full px-2.5 py-0.5">
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm font-light text-ink leading-7">{memory.content}</p>
              </section>
            ))}
          </div>

          {/* ── Recurring themes ────────────────────────────────────────────── */}
          {themes.length > 0 && (
            <SurfaceCard className="space-y-4">
              <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">เรื่องที่คุณมักนึกถึง</p>
              <div className="flex flex-wrap gap-2">
                {themes.map(([theme, count]) => (
                  <span
                    key={theme}
                    className="inline-flex items-center gap-1.5 text-sm font-light text-ink border border-sand rounded-full px-4 py-1.5"
                  >
                    {theme}
                    <span className="text-xs text-muted">{count}</span>
                  </span>
                ))}
              </div>
            </SurfaceCard>
          )}

          {/* ── Mood frequency ──────────────────────────────────────────────── */}
          {moods.length > 0 && (
            <SurfaceCard className="space-y-4">
              <p className="text-xs tracking-[0.2em] uppercase text-brown font-light">ความรู้สึกในช่วงนี้</p>
              <div className="space-y-3">
                {moods.map(([mood, count]) => (
                  <div key={mood} className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm font-light text-ink">{mood}</span>
                      <span className="text-xs text-muted font-light">{count} ครั้ง</span>
                    </div>
                    <div className="h-1.5 bg-sand rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brown/50 rounded-full"
                        style={{ width: `${Math.round((count / maxMood) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          )}
        </>
      )}

      {/* ── Privacy note ────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-sand bg-white/20 px-6 py-5">
        <p className="text-xs font-light text-muted leading-6">
          Care วิเคราะห์รูปแบบจากบันทึกและการเช็คอินของคุณโดยไม่ใช้ AI ภายนอก
          ข้อมูลทั้งหมดอยู่ในเซิร์ฟเวอร์ของเราเท่านั้น ไม่มีการส่งต่อ
        </p>
      </section>

      <div className="flex justify-center gap-6">
        <Link href="/growth" className="text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
          ดูการเติบโต
        </Link>
        <Link href="/" className="text-sm text-muted underline underline-offset-4 hover:opacity-70 transition-opacity">
          หน้าหลัก
        </Link>
      </div>
    </PageShell>
  )
}
