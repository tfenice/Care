import { getCategoryToken } from '@/lib/card-tokens'

type SymbolSize = 'sm' | 'md' | 'lg' | 'watermark'
const DIMS: Record<SymbolSize, number> = { sm: 12, md: 20, lg: 24, watermark: 180 }

// Acceptance (การยอมรับ): circle resting on a grounding line — stillness, letting go
function AcceptanceSymbol({ px }: { px: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="13" r="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Presence (ความใจจดจ่อ): centered dot inside a breathing ring — attention, here and now
function PresenceSymbol({ px }: { px: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
    </svg>
  )
}

// Hope (ความหวัง): rising arc above a horizon line — possibility, not optimism
function HopeSymbol({ px }: { px: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="4" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 7 22 A 9 9 0 0 0 25 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Growth (การเติบโต): asymmetric branching stem — becoming, slow growth
function GrowthSymbol({ px }: { px: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="16" y1="28" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="20" x2="9" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="14" x2="23" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CategorySymbol({
  category,
  size = 'sm',
}: {
  category: string
  size?: SymbolSize
}) {
  const token = getCategoryToken(category)
  const px = DIMS[size]

  switch (token.slug) {
    case 'acceptance': return <AcceptanceSymbol px={px} />
    case 'presence':   return <PresenceSymbol   px={px} />
    case 'hope':       return <HopeSymbol       px={px} />
    case 'growth':     return <GrowthSymbol     px={px} />
    default:           return <PresenceSymbol   px={px} />
  }
}
