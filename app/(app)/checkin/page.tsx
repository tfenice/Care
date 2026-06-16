import CheckinForm from '@/components/care/CheckinForm'

export default async function CheckinPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const hasError = !!params.error

  // AUTH DISABLED: skip user/profile DB checks

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
