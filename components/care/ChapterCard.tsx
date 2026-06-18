// The canonical chapter object — the physical manifestation of one entry
// in the Living Library. Every surface in Care that renders a chapter uses
// this component and nothing else.
//
// Reference: docs/CARD_SYSTEM.md
//
// Laws:
//   • Static — no animation props. Animation wraps this object externally.
//   • Every value from Paper Language tokens — no hardcoded colors or sizes.
//   • SVG only (CardIllustration, CardSignature) — no raster, no external images.
//   • CardPaper and EditorialWindow are exported for standalone reuse.

import type { CSSProperties, ReactNode } from 'react'
import { getCategoryToken, categoryPillStyle, categoryAccentStyle, type CategoryToken } from '@/lib/card-tokens'
import { CategorySymbol } from '@/components/care/card-symbols'
import { CardSignature } from '@/components/care/CardSignature'
import { CardIllustration } from '@/components/care/CardIllustration'
import { hasIllustration } from '@/lib/card-illustrations'

// ── CardPaper ──────────────────────────────────────────────────────────────────
// Single responsibility: paper material.
// Background gradient, grain texture, outer border, border-radius, shadow.
// No content knowledge. Wraps anything. Accept style overrides for shadow etc.

type CardPaperProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function CardPaper({ children, className = '', style }: CardPaperProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(160deg, var(--paper-1) 0%, var(--paper-2) 100%)',
        border: '1px solid var(--paper-border)',
        borderRadius: 'var(--paper-radius-card)',
        boxShadow: 'var(--paper-shadow-lift)',
        ...style,
      }}
    >
      {/* Grain — always present on any paper surface */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--grain-color) var(--grain-dot), transparent var(--grain-dot))',
          backgroundSize: 'var(--grain-size) var(--grain-size)',
        }}
      />
      {children}
    </div>
  )
}

// ── EditorialWindow ────────────────────────────────────────────────────────────
// Single responsibility: the visual zone.
// Hosts the V3 chapter illustration or signature fallback. 192px tall.
// Sits at the top of ChapterCard. Also used standalone in SecondPage.

type EditorialWindowProps = {
  code: string | null
  category: string
  token: CategoryToken
  showFloor?: boolean
  animated?: boolean
}

export function EditorialWindow({ code, category, token, showFloor = true, animated = false }: EditorialWindowProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '192px' }}
      aria-hidden="true"
    >
      {code && hasIllustration(code) ? (
        <CardIllustration code={code} animated={animated} />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ color: token.color, opacity: 0.06 }}
        >
          <CardSignature code={code} category={category} size="watermark" />
        </div>
      )}
      {showFloor && (
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{ borderBottom: '1px solid var(--paper-border-soft)' }}
        />
      )}
    </div>
  )
}

// ── ChapterCard ────────────────────────────────────────────────────────────────
// The canonical chapter object.
//
// To animate arrival, pass className="care-card-in" from the parent.
// The card itself has no animation logic — motion belongs to the world around it.

export type ChapterCardProps = {
  category: string
  titleTh: string
  bodyTh: string
  reflectionPromptTh?: string | null
  sortOrder?: number
  className?: string
  animateIllustration?: boolean
}

export default function ChapterCard({
  category,
  titleTh,
  bodyTh,
  reflectionPromptTh,
  sortOrder,
  className = '',
  animateIllustration = false,
}: ChapterCardProps) {
  const token = getCategoryToken(category)
  const code = sortOrder ? `${token.code}-${String(sortOrder).padStart(2, '0')}` : null

  return (
    <CardPaper className={className}>
      {/* Inner editorial frame — stationery border spanning the full card face */}
      <div
        className="absolute inset-2 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          border: '1px solid var(--paper-border-inner)',
          borderRadius: 'var(--paper-radius-inner)',
        }}
      />

      <EditorialWindow code={code} category={category} token={token} animated={animateIllustration} />

      <div className="relative px-8 pt-6 pb-8 space-y-8">
        {/* Category label */}
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

        {/* Chapter title */}
        <h2 className="text-3xl font-semibold text-ink leading-relaxed">
          {titleTh}
        </h2>

        {/* Opening line */}
        <p className="text-ink font-light leading-9 text-lg">
          {bodyTh}
        </p>

        {/* Reflection prompt */}
        {reflectionPromptTh && (
          <div
            className="border-l-2 pl-5 pt-1"
            style={categoryAccentStyle(token)}
          >
            <p className="text-sm text-muted font-light leading-8">
              {reflectionPromptTh}
            </p>
          </div>
        )}

        {/* Archive footer */}
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
    </CardPaper>
  )
}
