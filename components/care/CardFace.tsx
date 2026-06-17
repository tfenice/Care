import { getCategoryToken, categoryPillStyle, categoryAccentStyle } from '@/lib/card-tokens'

type Props = {
  category: string
  titleTh: string
  bodyTh: string
  reflectionPromptTh?: string | null
  className?: string
}

export default function CardFace({ category, titleTh, bodyTh, reflectionPromptTh, className = '' }: Props) {
  const token = getCategoryToken(category)

  return (
    <div
      className={`rounded-3xl border border-sand px-8 py-12 space-y-8 ${className}`}
      style={{
        background: 'linear-gradient(160deg, #FFFFFF 0%, rgba(247,242,235,0.9) 100%)',
        boxShadow: '0 12px 48px rgba(139,111,78,0.1), 0 2px 8px rgba(139,111,78,0.06)',
      }}
    >
      <span
        className="inline-flex items-center text-xs tracking-[0.2em] uppercase font-light rounded-full px-3 py-1"
        style={categoryPillStyle(token)}
      >
        {category}
      </span>
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
    </div>
  )
}
