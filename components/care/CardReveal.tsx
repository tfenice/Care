'use client'

import { useState, useEffect } from 'react'
import CardBack from './CardBack'
import { getCategoryToken, categoryPillStyle, categoryAccentStyle } from '@/lib/card-tokens'
import { CategorySymbol } from '@/components/care/card-symbols'
import { CardSignature } from '@/components/care/CardSignature'
import { CardIllustration } from '@/components/care/CardIllustration'
import { hasIllustration } from '@/lib/card-illustrations'
import PrimaryButton from '@/components/ui/PrimaryButton'

type Phase = 'back' | 'fading' | 'face'

type Props = {
  category: string
  titleTh: string
  bodyTh: string
  reflectionPromptTh?: string | null
  sortOrder?: number
}

export default function CardReveal({ category, titleTh, bodyTh, reflectionPromptTh, sortOrder }: Props) {
  const [phase, setPhase] = useState<Phase>('back')
  const token = getCategoryToken(category)
  const code = sortOrder ? `${token.code}-${String(sortOrder).padStart(2, '0')}` : null

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setTimeout(() => setPhase('face'), 0)
      return
    }

    // back (0–700ms) → fading (700–1050ms) → face (1050ms+)
    const t1 = setTimeout(() => setPhase('fading'), 700)
    const t2 = setTimeout(() => setPhase('face'), 1050)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase !== 'face') {
    return (
      <div className="flex items-center justify-center py-8">
        <div
          style={{
            opacity: phase === 'fading' ? 0 : 1,
            transition: 'opacity 0.35s ease',
          }}
        >
          <CardBack
            size="lg"
            animate={phase === 'back'}
            className="w-52 h-[312px]"
          />
        </div>
      </div>
    )
  }

  // Staggered face reveal — timing tracks section count
  const footerDelay = reflectionPromptTh ? '550ms' : '400ms'
  const actionDelay = code
    ? (reflectionPromptTh ? '700ms' : '550ms')
    : (reflectionPromptTh ? '600ms' : '450ms')

  return (
    <div className="space-y-10">
      <div
        className="relative rounded-3xl border border-sand overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #FFFFFF 0%, rgba(247,242,235,0.9) 100%)',
          boxShadow: '0 16px 48px rgba(139,111,78,0.12), 0 2px 8px rgba(139,111,78,0.06)',
        }}
      >
        {/* Paper grain — full card */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139,111,78,0.1) 0.5px, transparent 0.5px)',
            backgroundSize: '5px 5px',
          }}
        />

        {/* Inner frame — full card */}
        <div
          className="absolute inset-2 rounded-[20px] pointer-events-none select-none"
          aria-hidden="true"
          style={{ border: '1px solid rgba(201,169,122,0.18)' }}
        />

        {/* Emotional Window — upper visual zone, ~35% of card height */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: '192px' }}
          aria-hidden="true"
        >
          {code && hasIllustration(code) ? (
            <CardIllustration code={code} />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ color: token.color, opacity: 0.06 }}
            >
              <CardSignature code={code} category={category} size="watermark" />
            </div>
          )}
          {/* Window floor */}
          <div
            className="absolute bottom-0 inset-x-0 pointer-events-none"
            style={{ borderBottom: '1px solid rgba(201,169,122,0.10)' }}
          />
        </div>

        {/* Card content */}
        <div className="relative px-8 pt-6 pb-8 space-y-8">
          {/* Category header: pill + separator */}
          <div
            className="care-section-in space-y-5"
            style={{ animationDelay: '0ms' }}
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-light rounded-full px-3 py-1"
              style={categoryPillStyle(token)}
            >
              <CategorySymbol category={category} size="sm" />
              {category}
            </span>
            <div style={{ borderTop: `1px solid rgb(${token.rgb} / 0.12)` }} />
          </div>

          <h2
            className="care-section-in text-3xl font-semibold text-ink leading-relaxed"
            style={{ animationDelay: '150ms' }}
          >
            {titleTh}
          </h2>

          <p
            className="care-section-in text-ink font-light leading-9 text-lg"
            style={{ animationDelay: '300ms' }}
          >
            {bodyTh}
          </p>

          {reflectionPromptTh && (
            <div
              className="care-section-in border-l-2 pl-5 pt-1"
              style={{ ...categoryAccentStyle(token), animationDelay: '450ms' }}
            >
              <p className="text-sm text-muted font-light leading-8">
                {reflectionPromptTh}
              </p>
            </div>
          )}

          {/* Collection footer */}
          {code && (
            <div
              className="care-section-in border-t pt-4"
              style={{
                borderColor: `rgb(${token.rgb} / 0.12)`,
                animationDelay: footerDelay,
              }}
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

      <div
        className="care-section-in space-y-3"
        style={{ animationDelay: actionDelay }}
      >
        <PrimaryButton href="/journal">
          เขียนบันทึก
        </PrimaryButton>
        <p className="text-center text-xs text-muted font-light">
          เขียนสิ่งที่นึกขึ้นมาก็ได้
        </p>
      </div>
    </div>
  )
}
