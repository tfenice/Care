import Link from 'next/link'
import { drawCard } from '@/lib/actions/cards'
import DrawCardButton from '@/components/care/DrawCardButton'

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const drawn = params.drawn === '1'

  // AUTH DISABLED — State B: pause moment / draw card
  if (!drawn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-12">
          <div className="space-y-6">
            <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
            <h1 className="text-3xl font-semibold text-ink leading-relaxed">
              หายใจลึก ๆ
              <br />
              สักครั้ง
            </h1>
            <p className="text-muted font-light leading-8">
              วันนี้คุณไม่จำเป็นต้องรีบ
              <br />
              ไม่ต้องรู้คำตอบก็ได้
            </p>
          </div>
          <form action={drawCard}>
            <DrawCardButton />
          </form>
        </div>
      </div>
    )
  }

  // AUTH DISABLED — State C: demo card
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="rounded-3xl border border-sand bg-white/40 px-8 py-10 space-y-6">
          <p className="text-xs tracking-[0.25em] uppercase text-brown font-light">
            การดูแลตัวเอง
          </p>
          <h2 className="text-2xl font-semibold text-ink leading-relaxed">
            ให้เวลากับตัวเองสักนิด
          </h2>
          <p className="text-ink font-light leading-8">
            บางวันแค่ได้หยุดพักก็เพียงพอแล้ว
            คุณไม่จำเป็นต้องทำทุกอย่างให้สมบูรณ์แบบ
          </p>
          <div className="border-l-2 border-sand pl-5 pt-1">
            <p className="text-muted font-light leading-8 text-sm">
              วันนี้มีอะไรที่คุณอยากปล่อยวางบ้างไหม?
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <Link
            href="/journal"
            className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
          >
            เขียนบันทึก
          </Link>
          <p className="text-center text-xs text-muted font-light">
            ลองเขียนสิ่งที่นึกขึ้นมาหลังอ่าน
          </p>
        </div>
      </div>
    </div>
  )
}
