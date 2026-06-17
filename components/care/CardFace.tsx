import { getCategoryToken, categoryPillStyle, categoryAccentStyle } from '@/lib/card-tokens'
import { CategorySymbol } from '@/components/care/card-symbols'
import { CardSignature } from '@/components/care/CardSignature'

type Props = {
  category: string
  titleTh: string
  bodyTh: string
  reflectionPromptTh?: string | null
  sortOrder?: number
  className?: string
}

export default function CardFace({
  category,
  titleTh,
  bodyTh,
  reflectionPromptTh,
  sortOrder,
  className = '',
}: Props) {
  const token = getCategoryToken(category)
  const code = sortOrder ? `${token.code}-${String(sortOrder).padStart(2, '0')}` : null

  return (
    <div
      className={`relative rounded-3xl border border-sand overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(160deg, #FFFFFF 0%, rgba(247,242,235,0.9) 100%)',
        boxShadow: '0 16px 48px rgba(139,111,78,0.12), 0 2px 8px rgba(139,111,78,0.06)',
      }}
    >
      {/* Paper grain — fine dot field at very low opacity */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,111,78,0.1) 0.5px, transparent 0.5px)',
          backgroundSize: '5px 5px',
        }}
      />

      {/* Inner frame — inset stationery border */}
      <div
        className="absolute inset-2 rounded-[20px] pointer-events-none select-none"
        aria-hidden="true"
        style={{ border: '1px solid rgba(201,169,122,0.18)' }}
      />

      {/* Category watermark motif */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
        style={{ color: token.color, opacity: 0.06 }}
      >
        <CardSignature code={code} category={category} size="watermark" />
      </div>

      {/* Card content */}
      <div className="relative px-8 pt-10 pb-8 space-y-8">
        {/* Category header: pill + separator rule */}
        <div className="space-y-5">
          <span
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-light rounded-full px-3 py-1"
            style={categoryPillStyle(token)}
          >
            <CategorySymbol category={category} size="sm" />
            {category}
          </span>
          <div style={{ borderTop: `1px solid rgb(${token.rgb} / 0.12)` }} />
        </div>

        <h2 className="text-3xl font-semibold text-ink leading-relaxed">
          {titleTh}
        </h2>

        <p className="text-ink font-light leading-9 text-lg">
          {bodyTh}
        </p>

        {reflectionPromptTh && (
          <div className="border-l-2 pl-5 pt-1" style={categoryAccentStyle(token)}>
            <p className="text-sm text-muted font-light leading-8">
              {reflectionPromptTh}
            </p>
          </div>
        )}

        {/* Collection footer */}
        {code && (
          <div
            className="border-t pt-4"
            style={{ borderColor: `rgb(${token.rgb} / 0.12)` }}
          >
            <span
              className="text-[10px] tracking-[0.25em] font-light"
              style={{ color: `rgb(${token.rgb} / 0.45)` }}
            >
              {code} • {category}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
