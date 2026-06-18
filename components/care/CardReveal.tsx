'use client'

import { useState, useEffect } from 'react'
import CardBack from './CardBack'
import ChapterCard from './ChapterCard'
import PrimaryButton from '@/components/ui/PrimaryButton'

type Phase = 'back' | 'fading' | 'face'

type Props = {
  category: string
  titleTh: string
  bodyTh: string
  reflectionPromptTh?: string | null
  sortOrder?: number
  cardId?: string | null
}

export default function CardReveal({ category, titleTh, bodyTh, reflectionPromptTh, sortOrder, cardId }: Props) {
  const [phase, setPhase] = useState<Phase>('back')

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

  return (
    <div className="space-y-10">
      {/* Animation wraps the object. The card arrives; the illustration breathes into it. */}
      <ChapterCard
        className="care-card-in"
        animateIllustration
        category={category}
        titleTh={titleTh}
        bodyTh={bodyTh}
        reflectionPromptTh={reflectionPromptTh}
        sortOrder={sortOrder}
      />
      <div className="care-section-in" style={{ animationDelay: '550ms' }}>
        {cardId ? (
          <PrimaryButton href={`/cards/second?card=${cardId}`}>
            อยู่กับการ์ดใบนี้อีกสักครู่
          </PrimaryButton>
        ) : (
          <PrimaryButton href="/journal">
            เขียนบันทึก
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}
