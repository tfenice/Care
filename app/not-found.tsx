import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="space-y-4">
          <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
          <h1 className="text-2xl font-semibold text-ink">หน้านี้ไม่มีอยู่</h1>
          <p className="text-muted font-light leading-8">
            ลิงก์อาจหมดอายุ หรือพิมพ์ผิด
          </p>
        </div>
        <Link
          href="/home"
          className="inline-block rounded-full bg-ink text-cream px-10 py-4 font-light tracking-wide transition-opacity hover:opacity-75"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
}
