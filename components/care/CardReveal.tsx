'use client'

import { useState, useEffect } from 'react'
import CardBack from './CardBack'
import { getCategoryToken, categoryPillStyle, categoryAccentStyle } from '@/lib/card-tokens'
import PrimaryButton from '@/components/ui/PrimaryButton'

type Phase = 'back' | 'fading' | 'face'

type Props = {
  category: string
  titleTh: string
  bodyTh: string
  reflectionPromptTh?: string | null
}

export default function CardReveal({ category, titleTh, bodyTh, reflectionPromptTh }: Props) {
  const [phase, setPhase] = useState<Phase>('back')
  const token = getCategoryToken(category)

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

  // Pause + fade-out of card back
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

  // Staggered face reveal
  const hasReflection = !!reflectionPromptTh
  const actionDelay = hasReflection ? '600ms' : '450ms'

  return (
    <div className="space-y-10">
      <div
        className="rounded-3xl border border-sand px-8 py-12 space-y-8"
        style={{
          background: 'linear-gradient(160deg, #FFFFFF 0%, rgba(247,242,235,0.9) 100%)',
          boxShadow: '0 12px 48px rgba(139,111,78,0.1), 0 2px 8px rgba(139,111,78,0.06)',
        }}
      >
        <span
          className="care-section-in inline-flex items-center text-xs tracking-[0.2em] uppercase font-light rounded-full px-3 py-1"
          style={{ ...categoryPillStyle(token), animationDelay: '0ms' }}
        >
          {category}
        </span>

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
