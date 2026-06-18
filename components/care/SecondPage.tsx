'use client'

// The Second Page — a quiet continuation after the card reveal.
// Phase 0: chapter illustration settles (1.2s)
// Phase 1: origin story fades in
// Phase 2: reflection question + journal CTA fade in

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CardPaper, EditorialWindow } from './ChapterCard'
import { categoryPillStyle, getCategoryToken } from '@/lib/card-tokens'
import { CategorySymbol } from '@/components/care/card-symbols'
import PrimaryButton from '@/components/ui/PrimaryButton'

type PreviousEncounter = {
  date: string
  excerpt: string | null
}

type Props = {
  code: string | null
  category: string
  origin: string
  reflection: string
  previousEncounter: PreviousEncounter | null
}

export function SecondPage({
  code,
  category,
  origin,
  reflection,
  previousEncounter,
}: Props) {
  const [phase, setPhase] = useState(0) // 0=illustration 1=origin 2=reflection
  const token = getCategoryToken(category)

  // Phase 0 → 1: let the illustration settle before showing content
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => setPhase(1), reduced ? 0 : 1200)
    return () => clearTimeout(t)
  }, [])

  // Phase 1 → 2: reflection arrives after origin story
  useEffect(() => {
    if (phase !== 1) return
    const t = setTimeout(() => setPhase(2), 2200)
    return () => clearTimeout(t)
  }, [phase])

  const contentVisible    = phase >= 1
  const reflectionVisible = phase >= 2

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-md mx-auto px-6 py-12 space-y-12">

        {/* Brand + card identity */}
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.28em] uppercase text-muted font-light">CARE</p>
          {code && (
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-light rounded-full px-2.5 py-0.5"
                style={categoryPillStyle(token)}
              >
                <CategorySymbol category={category} size="sm" />
                {code}
              </span>
            </div>
          )}
        </div>

        {/* Chapter illustration — animated during phase 0 silence before words appear */}
        <CardPaper style={{ boxShadow: 'var(--paper-shadow-page)' }}>
          <EditorialWindow
            code={code}
            category={category}
            token={token}
            showFloor={false}
            animated
          />
        </CardPaper>

        {/* Origin story — fades in after illustration settles */}
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 1s ease-out, transform 1s ease-out',
            pointerEvents: contentVisible ? 'auto' : 'none',
          }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <p
              className="text-[10px] tracking-[0.24em] uppercase font-light"
              style={{ color: `rgb(${token.rgb} / 0.50)` }}
            >
              การ์ดใบนี้ถือกำเนิดขึ้นอย่างไร
            </p>
            <p
              className="text-xl font-light text-ink leading-10 whitespace-pre-line"
              style={{ letterSpacing: '0.01em' }}
            >
              {origin}
            </p>
          </div>

          {/* Reflection — fades in after origin */}
          <div
            style={{
              opacity: reflectionVisible ? 1 : 0,
              transform: reflectionVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 1s 0.2s ease-out, transform 1s 0.2s ease-out',
              pointerEvents: reflectionVisible ? 'auto' : 'none',
            }}
            className="space-y-10"
          >
            <div style={{ borderTop: `1px solid rgb(${token.rgb} / 0.10)` }} />

            <p
              className="text-2xl font-light text-ink leading-10 whitespace-pre-line"
              style={{ letterSpacing: '0.01em' }}
            >
              {reflection}
            </p>

            {previousEncounter && (
              <div
                className="border-l-2 pl-5 py-1 space-y-2"
                style={{ borderColor: `rgb(${token.rgb} / 0.28)` }}
              >
                <p className="text-[10px] tracking-[0.2em] uppercase font-light text-muted">
                  ครั้งล่าสุดที่คุณพบการ์ดใบนี้
                </p>
                <p className="text-xs font-light text-muted">
                  {previousEncounter.date}
                </p>
                {previousEncounter.excerpt && (
                  <p className="text-sm font-light text-ink leading-7 opacity-70">
                    &ldquo;{previousEncounter.excerpt}&rdquo;
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4 pb-8">
              <PrimaryButton href="/journal">
                เขียนบันทึก
              </PrimaryButton>
              <p className="text-center">
                <Link
                  href="/home"
                  className="text-xs text-muted font-light underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  กลับหน้าหลัก
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
