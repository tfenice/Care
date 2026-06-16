import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CheckinForm from '@/components/care/CheckinForm'

export default async function CheckinPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const hasError = !!params.error

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const alreadyCheckedIn = profile?.last_checkin_date === today

  if (alreadyCheckedIn) {
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('mood_key')
      .gte('checked_in_at', `${today}T00:00:00+07:00`)
      .order('checked_in_at', { ascending: false })
      .limit(1)

    const moodKey = checkins?.[0]?.mood_key ?? ''

    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="space-y-5">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <p className="text-muted font-light leading-8">วันนี้คุณบันทึกใจแล้ว</p>
            <div className="inline-block px-8 py-3 rounded-full border border-sand text-ink text-lg font-light">
              {moodKey}
            </div>
          </div>
          <Link
            href="/cards"
            className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
          >
            ไปต่อ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center space-y-4">
          <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
          <h1 className="text-3xl font-semibold leading-relaxed text-ink">
            วันนี้ใจของคุณ
            <br />
            เป็นอย่างไรบ้าง
          </h1>
        </div>
        <CheckinForm hasError={hasError} />
      </div>
    </div>
  )
}
