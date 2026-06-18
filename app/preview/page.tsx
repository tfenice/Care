// Development preview — Emotional Window side-by-side comparison.
// Not protected by auth. Remove before production.

import CardFace from '@/components/care/CardFace'

const PREVIEW_CARDS = [
  {
    code: 'A-05',
    category: 'ชีวิตประจำวัน',
    sortOrder: 5,
    titleTh: 'วันนี้ก็พอแล้ว',
    bodyTh: 'ไม่ต้องทำให้มากกว่านี้ ไม่ต้องพิสูจน์อะไร วันนี้ที่คุณผ่านมาได้คือเพียงพอแล้ว',
    reflectionPromptTh: 'มีอะไรเล็กๆ ในวันนี้ที่ทำให้คุณยิ้มได้บ้าง?',
  },
  {
    code: 'P-10',
    category: 'ความสงบ',
    sortOrder: 10,
    titleTh: 'ไม่ต้องทำอะไร',
    bodyTh: 'บางครั้งการไม่ทำอะไรเลยคือสิ่งที่ดีที่สุดที่คุณจะมอบให้ตัวเองได้',
    reflectionPromptTh: 'ตอนนี้ร่างกายของคุณรู้สึกอย่างไร?',
  },
  {
    code: 'H-04',
    category: 'ความหวัง',
    sortOrder: 4,
    titleTh: 'เมล็ดที่ยังไม่งอก',
    bodyTh: 'ความหวังบางอย่างต้องใช้เวลา รากกำลังเติบโตในที่ที่มองไม่เห็น',
    reflectionPromptTh: 'มีอะไรที่คุณกำลังรอคอยอยู่อย่างอดทน?',
  },
  {
    code: 'G-03',
    category: 'การเติบโต',
    sortOrder: 3,
    titleTh: 'การเติบโตที่มองไม่เห็น',
    bodyTh: 'สิ่งที่เติบโตขึ้นในตัวคุณมักไม่ปรากฏให้ใครเห็น รวมถึงตัวคุณเอง',
    reflectionPromptTh: 'คุณแตกต่างจากตัวเองเมื่อปีที่แล้วอย่างไรบ้าง?',
  },
]

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 space-y-1">
          <p className="text-xs tracking-[0.2em] uppercase text-muted font-light">
            dev preview
          </p>
          <h1 className="text-2xl font-semibold text-ink">
            Emotional Window — 4 cards
          </h1>
          <p className="text-sm text-muted font-light">
            Upper 35% reserved as visual zone. Illustration supports text — never dominates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PREVIEW_CARDS.map((card) => (
            <div key={card.code} className="space-y-3">
              <CardFace
                category={card.category}
                titleTh={card.titleTh}
                bodyTh={card.bodyTh}
                reflectionPromptTh={card.reflectionPromptTh}
                sortOrder={card.sortOrder}
              />
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-light text-center">
                {card.code} — {card.titleTh}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
