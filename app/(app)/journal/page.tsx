import Link from 'next/link'
import { saveJournal } from '@/lib/actions/journal'
import JournalSubmitButton from '@/components/care/JournalSubmitButton'
import PageShell from '@/components/ui/PageShell'
import PrimaryButton from '@/components/ui/PrimaryButton'

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const saved = params.saved === '1'
  const hasError = !!params.error

  if (saved) {
    return (
      <PageShell centered>
        <div className="max-w-md w-full space-y-10">
          <div className="space-y-4">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <h1 className="text-2xl font-semibold text-ink">บันทึกแล้ว</h1>
            <p className="text-muted font-light leading-8">ขอบคุณที่กลับมาฟังใจตัวเองวันนี้</p>
          </div>
          <div className="space-y-4">
            <PrimaryButton href="/history">
              ดูบันทึกย้อนหลัง
            </PrimaryButton>
            <div className="text-center">
              <Link href="/home" className="text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity">
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell centered>
      <div className="max-w-md w-full space-y-10">
        <div className="space-y-3">
          <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
          <p className="text-muted font-light text-sm leading-6">อยู่กับตัวเองสักครู่</p>
          <h1 className="text-2xl font-semibold text-ink leading-relaxed">
            คุณอยากบอกอะไร
            <br />
            กับตัวเองบ้าง
          </h1>
        </div>
        <form action={saveJournal} className="space-y-6">
          <textarea
            name="body"
            rows={9}
            placeholder="เขียนได้เลย ไม่ต้องสมบูรณ์แบบ"
            className="w-full px-5 py-4 rounded-2xl border border-sand bg-white/60 text-ink placeholder:text-muted focus:outline-none focus:border-brown transition-colors resize-none leading-8 font-light"
          />
          {hasError && (
            <p className="text-sm text-error text-center">มีบางอย่างผิดพลาด ลองอีกครั้งได้นะ</p>
          )}
          <JournalSubmitButton />
        </form>
      </div>
    </PageShell>
  )
}
