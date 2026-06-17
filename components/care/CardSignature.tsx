import { CARD_SIGNATURES, type Shape } from '@/lib/card-signatures'
import { CategorySymbol } from '@/components/care/card-symbols'

type SymbolSize = 'sm' | 'md' | 'lg' | 'watermark'
const DIMS: Record<SymbolSize, number> = { sm: 12, md: 20, lg: 24, watermark: 180 }

function renderShape(s: Shape, i: number) {
  const sw = s.opts?.sw ?? 1.5
  const op = s.opts?.op

  if (s.t === 'c') {
    return s.opts?.f
      ? <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="currentColor" opacity={op} />
      : <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="none" stroke="currentColor"
          strokeWidth={sw} strokeLinecap="round" opacity={op} strokeDasharray={s.opts?.d} />
  }
  if (s.t === 'e') {
    return <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill="none"
             stroke="currentColor" strokeWidth={sw} opacity={op} />
  }
  if (s.t === 'l') {
    return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
             stroke="currentColor" strokeWidth={sw} strokeLinecap="round" opacity={op} />
  }
  return <path key={i} d={s.d} fill="none" stroke="currentColor"
           strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" opacity={op} />
}

export function CardSignature({
  code,
  category,
  size = 'watermark',
}: {
  code?: string | null
  category: string
  size?: SymbolSize
}) {
  const shapes = code ? CARD_SIGNATURES[code] : undefined
  if (!shapes) return <CategorySymbol category={category} size={size} />

  const px = DIMS[size]
  return (
    <svg width={px} height={px} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {shapes.map((s, i) => renderShape(s, i))}
    </svg>
  )
}
