import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { saveJournal } from '@/lib/actions/journal'
import JournalSubmitButton from '@/components/care/JournalSubmitButton'

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const saved = params.saved === '1'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())

  // Parallel: profile + today's most recent check-in
  const [{ data: profile }, { data: todayCheckin }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('checked_in_at', `${today}T00:00:00+07:00`)
      .order('checked_in_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const checkedInToday = profile?.last_checkin_date === today

  // ── State A: not yet checked in ──────────────────────────────────────────────
  if (!checkedInToday) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="space-y-5">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <p className="text-ink font-light leading-8">วันนี้คุณยังไม่ได้เช็คอิน</p>
          </div>
          <Link
            href="/checkin"
            className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
          >
            ไปเช็คอิน
          </Link>
        </div>
      </div>
    )
  }

  // Fetch existing journal entry for today's check-in
  let existingEntry = null
  if (todayCheckin?.id) {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('checkin_id', todayCheckin.id)
      .is('deleted_at', null)
      .maybeSingle()
    existingEntry = data
  }

  // ── State B / C: checked in → show journal form ───────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">

        {saved ? (
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
              <h1 className="text-2xl font-semibold text-ink">บันทึกแล้ว</h1>
              <p className="text-muted font-light leading-8">ขอบคุณที่กลับมาฟังใจตัวเองวันนี้</p>
            </div>
            <div className="space-y-4">
              <Link
                href="/history"
                className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
              >
                ดูบันทึกย้อนหลัง
              </Link>
              <div className="text-center">
                <Link
                  href="/checkin"
                  className="text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  กลับไปเช็คอิน
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
              <p className="text-muted font-light text-sm leading-6">หลังจากอ่านมาถึงตรงนี้</p>
              <h1 className="text-2xl font-semibold text-ink leading-relaxed">
                คุณอยากบอกอะไร
                <br />
                กับตัวเองบ้าง
              </h1>
            </div>
            <form action={saveJournal} className="space-y-6">
              {existingEntry?.id && (
                <input type="hidden" name="entry_id" value={existingEntry.id} />
              )}
              <textarea
                name="body"
                rows={8}
                defaultValue={existingEntry?.body ?? ''}
                placeholder="เขียนได้เลย ไม่ต้องสมบูรณ์แบบ"
                className="w-full px-4 py-3 rounded-2xl border border-sand bg-white/60 text-ink placeholder:text-muted focus:outline-none focus:border-brown transition-colors resize-none leading-8 font-light"
              />
              <JournalSubmitButton />
            </form>
          </>
        )}

      </div>
    </div>
  )
}
