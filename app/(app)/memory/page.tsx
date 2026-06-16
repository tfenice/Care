import Link from 'next/link'
import { extractMemories, extractThemes, type ExtractedMemory } from '@/lib/services/memoryExtractor'

// AUTH DISABLED: demo input. Replace with user-scoped Supabase queries.

const DEMO_JOURNALS = [
  { body: 'วันนี้คุยกับแม่แล้วรู้สึกดีขึ้นมาก ครอบครัวสำคัญมากจริงๆ', created_at: '2026-06-14' },
  { body: 'งานเยอะมาก เหนื่อยจริงๆ แต่ก็พยายามต่อไป เพื่อนร่วมงานช่วยได้เยอะ', created_at: '2026-06-13' },
  { body: 'นอนไม่หลับ คิดเรื่องงานตลอด กังวลเรื่องเส้นตายที่จะมาถึง', created_at: '2026-06-12' },
  { body: 'วันหยุดอยู่บ้านกับครอบครัว มีความสุขมาก สบายใจมากกว่าวันธรรมดา', created_at: '2026-06-11' },
  { body: 'เริ่มออกกำลังกายใหม่ หวังว่าจะทำได้ต่อเนื่อง รู้สึกดีขึ้นนิดหน่อย', created_at: '2026-06-10' },
]

const DEMO_CHECKINS = [
  { mood_key: 'เหนื่อย', note: null, checked_in_at: '2026-06-14' },
  { mood_key: 'พอไหว',  note: null, checked_in_at: '2026-06-13' },
  { mood_key: 'เหนื่อย', note: null, checked_in_at: '2026-06-12' },
  { mood_key: 'สบายดี', note: null, checked_in_at: '2026-06-11' },
  { mood_key: 'พอไหว',  note: null, checked_in_at: '2026-06-10' },
  { mood_key: 'เหนื่อย', note: null, checked_in_at: '2026-06-09' },
]

function getPageData() {
  const memories = extractMemories({ journals: DEMO_JOURNALS, checkins: DEMO_CHECKINS })

  // Aggregate themes across all journals
  const themeCount: Record<string, number> = {}
  for (const j of DEMO_JOURNALS) {
    for (const t of extractThemes(j.body)) {
      themeCount[t] = (themeCount[t] ?? 0) + 1
    }
  }
  const themes = Object.entries(themeCount).sort((a, b) => b[1] - a[1])

  // Mood frequency from checkins
  const moodCount: Record<string, number> = {}
  for (const c of DEMO_CHECKINS) {
    moodCount[c.mood_key] = (moodCount[c.mood_key] ?? 0) + 1
  }
  const moods = Object.entries(moodCount).sort((a, b) => b[1] - a[1])
  const maxMood = moods[0]?.[1] ?? 1

  // Order: synthesis first (most insight), then journal, then checkin
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
  const { memories, themes, moods, maxMood } = getPageData()
  const hasData = memories.length > 0

  return (
    <div className="max-w-md mx-auto px-6 py-10 pb-32 space-y-6">

      <header className="space-y-1 pt-2">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink">ความทรงจำ</h1>
        <p className="text-muted font-light leading-7">สิ่งที่ Care สังเกตเห็นในตัวคุณ</p>
      </header>

      {!hasData ? (
        <section className="rounded-3xl border border-sand bg-white/40 px-6 py-12 text-center space-y-4">
          <p className="text-3xl select-none">🌱</p>
          <p className="text-ink font-light text-sm leading-8">
            ยังไม่มีความทรงจำ<br />
            เขียนบันทึกและเช็คอินต่อไปเรื่อยๆ<br />
            Care จะเริ่มสังเกตเห็นรูปแบบของคุณ
          </p>
          <Link href="/journal" className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
            เขียนบันทึกตอนนี้
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
            <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
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
            </section>
          )}

          {/* ── Mood frequency ──────────────────────────────────────────────── */}
          {moods.length > 0 && (
            <section className="rounded-3xl border border-sand bg-white/40 px-6 py-6 space-y-4">
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
            </section>
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

    </div>
  )
}
