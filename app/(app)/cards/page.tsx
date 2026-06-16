import Link from 'next/link'

export default function CardsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="space-y-5">
          <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
          <h1 className="text-2xl font-semibold text-ink leading-relaxed">
            ไพ่สำหรับวันนี้
          </h1>
          <p className="text-muted font-light leading-8">กำลังมา...</p>
        </div>
        <Link
          href="/checkin"
          className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          กลับไปเช็คอิน
        </Link>
      </div>
    </div>
  )
}
