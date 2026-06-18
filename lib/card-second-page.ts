// Static content for The Second Page experience.
// Each card has an origin story and a reflection question.
// Hero cards (A-05, P-10, H-04, G-03) have card-specific text.
// All other cards fall back to their category text.
//
// Origin format: multi-paragraph poetic prose.
// Use \n for line breaks within a paragraph, \n\n for a new paragraph.
// Reflection: one question only. Never more than one.

export type SecondPageContent = {
  origin: string
  reflection: string
}

// ── Hero card content (card-specific) ─────────────────────────────────────────

const HERO_CONTENT: Record<string, SecondPageContent> = {
  'A-05': {
    origin:
      'การ์ดใบนี้ไม่ได้เกิดขึ้น\nเพื่อบอกให้คุณสู้ต่อ\n\nแต่มันเกิดขึ้นจากคำถามหนึ่ง\n\nถ้าวันนี้...\nเรายังไม่พร้อม\n\nเราจะยังรักตัวเองได้ไหม',
    reflection: 'มีอะไรเล็กๆ วันนี้\nที่คุณยังรู้สึกดีกับมันได้',
  },

  'P-10': {
    origin:
      'การ์ดใบนี้เกิดขึ้นจากความเหนื่อย\nของการที่ต้องพิสูจน์ตัวเองอยู่เสมอ\n\nมีคำถามหนึ่งที่คนเราไม่ค่อยถามตัวเอง\n\nถ้าวันนี้...\nฉันไม่ต้องทำอะไรเลย\n\nฉันยังมีคุณค่าอยู่ไหม',
    reflection: 'ตอนนี้ร่างกายของคุณ\nรู้สึกอย่างไร',
  },

  'H-04': {
    origin:
      'การ์ดใบนี้มาจากความรู้สึก\nของการรอคอยที่ยาวนานเกินไป\n\nจากคำถามว่า\n\nถ้าสิ่งที่ฉันหวังไว้...\nไม่เกิดขึ้นในเร็วๆ นี้\n\nฉันจะยังเชื่อในตัวเองได้ไหม',
    reflection: 'มีอะไรที่คุณกำลังรอคอยอยู่\nอย่างอดทน',
  },

  'G-03': {
    origin:
      'การ์ดใบนี้เกิดจากช่วงเวลา\nที่รู้สึกว่าตัวเองหยุดนิ่ง\n\nแต่มีคำถามหนึ่งที่ค้างอยู่\n\nถ้าการเปลี่ยนแปลงที่แท้จริง...\nไม่มีใครมองเห็น\n\nแม้แต่ตัวฉันเอง\n\nมันยังเกิดขึ้นอยู่ไหม',
    reflection: 'คุณแตกต่างจากตัวเอง\nเมื่อปีที่แล้วอย่างไร',
  },
}

// ── Category fallback content ──────────────────────────────────────────────────
// Used for all 36 non-hero cards, keyed by Thai category name.

const CATEGORY_CONTENT: Record<string, SecondPageContent> = {
  'การยอมรับ': {
    origin:
      'การ์ดใบนี้เกิดขึ้นจากการเรียนรู้\nที่จะอยู่กับสิ่งที่เปลี่ยนแปลงไม่ได้\n\nจากคำถามหนึ่ง\n\nถ้าสิ่งที่เราถือไว้แน่น...\nไม่ได้อยู่ในมือเราอีกต่อไป\n\nเราจะยังโอเคได้ไหม',
    reflection: 'มีอะไรที่คุณพยายามปล่อยวางอยู่',
  },

  'ความใจจดจ่อ': {
    origin:
      'การ์ดใบนี้เกิดขึ้นจากความอยากรู้\nว่าปัจจุบันนี้รู้สึกอย่างไร\n\nจากคำถามหนึ่ง\n\nถ้าเราหยุดคิดถึงอดีตและอนาคต\n\nตอนนี้มีอะไรอยู่บ้าง',
    reflection: 'ตอนนี้คุณสังเกตเห็นอะไร\nในร่างกายหรือในใจ',
  },

  'ความหวัง': {
    origin:
      'การ์ดใบนี้เกิดจากการยืนยัน\nว่าความหวังไม่จำเป็นต้องสมเหตุสมผล\n\nจากคำถามหนึ่ง\n\nถ้าทุกอย่างออกมาดี\n\nคุณจะรู้สึกอย่างไร',
    reflection: 'มีอะไรที่คุณยังอยากให้เกิดขึ้น',
  },

  'การเติบโต': {
    origin:
      'การ์ดใบนี้เกิดจากการสังเกต\nว่าการเปลี่ยนแปลงมักมาโดยไม่รู้ตัว\n\nจากคำถามหนึ่ง\n\nสิ่งที่ยากที่สุดที่เราผ่านมา\n\nให้อะไรกับเราบ้าง',
    reflection: 'วันนี้คุณนึกถึงเรื่องอะไร',
  },
}

const FALLBACK_CONTENT: SecondPageContent = {
  origin:
    'การ์ดใบนี้เกิดจากคำถามเงียบๆ\nที่บางครั้งเราถามตัวเองในยามเช้า\n\nคำถามที่ไม่ต้องการคำตอบ\n\nแค่ต้องการพื้นที่\nในการถาม',
  reflection: 'วันนี้คุณนึกถึงเรื่องอะไร',
}

export function getSecondPageContent(
  code: string | null,
  category: string,
): SecondPageContent {
  if (code && code in HERO_CONTENT) return HERO_CONTENT[code]
  return CATEGORY_CONTENT[category] ?? FALLBACK_CONTENT
}
