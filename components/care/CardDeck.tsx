'use client'

import { useState, useEffect, useTransition } from 'react'
import CardBack from './CardBack'
import { focusRing } from '@/components/ui/focus'

type Phase = 'shuffle' | 'select' | 'revealing'

const CARD_COUNT = 7

// Tight overlapping stack — visible before the fan spreads
const STACK_POSITIONS = [
  { x: -6, rotate: -7 },
  { x:  4, rotate:  5 },
  { x: -2, rotate: -3 },
  { x:  5, rotate:  6 },
  { x: -3, rotate: -5 },
  { x:  3, rotate:  3 },
  { x: -1, rotate: -1 },
]

// Fan spread — 168px total span, safe on 320px+ screens
const FAN_POSITIONS = [
  { x: -84, rotate: -15, z: 1 },
  { x: -56, rotate: -10, z: 2 },
  { x: -28, rotate:  -5, z: 3 },
  { x:   0, rotate:   0, z: 7 },
  { x:  28, rotate:   5, z: 3 },
  { x:  56, rotate:  10, z: 2 },
  { x:  84, rotate:  15, z: 1 },
]

type Props = { action: () => Promise<void> }

export default function CardDeck({ action }: Props) {
  const [phase, setPhase] = useState<Phase>('shuffle')
  const [spread, setSpread] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const t = setTimeout(() => { setSpread(true); setPhase('select') }, 0)
      return () => clearTimeout(t)
    }
    // Shuffle bob: 0–1200ms → fan out → selectable at 1650ms
    const t1 = setTimeout(() => setSpread(true),   1200)
    const t2 = setTimeout(() => setPhase('select'), 1650)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleSelect = (i: number) => {
    if (phase !== 'select' || selectedIndex !== null || isPending) return
    setSelectedIndex(i)
    setPhase('revealing')
    setTimeout(() => {
      startTransition(async () => { await action() })
    }, 600)
  }

  const subtitle =
    phase === 'revealing' ? 'กำลังเปิดการ์ด...' :
    phase === 'select'    ? 'เลือกการ์ดที่รู้สึกว่าเรียกคุณ' : ''

  return (
    <div className="space-y-14">
      <div className="text-center space-y-3">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink leading-relaxed">
          หายใจลึก ๆ สักครั้ง
        </h1>
        <p
          className="text-muted font-light leading-8 min-h-[2rem] transition-opacity duration-700"
          style={{ opacity: phase === 'shuffle' ? 0 : 1 }}
        >
          {subtitle}
        </p>
      </div>

      {/* h-40 = 160px: 88px card + 40px max lift + 32px breathing room */}
      <div className="relative h-40 flex items-end justify-center">
        {Array.from({ length: CARD_COUNT }, (_, i) => {
          const fan = FAN_POSITIONS[i]
          const pos = spread ? fan : STACK_POSITIONS[i]

          const isSelected  = selectedIndex === i
          const isUnselected = selectedIndex !== null && !isSelected
          const isHovered   = hoveredIndex === i && phase === 'select' && !isSelected

          const ty  = isSelected ? -40 : isHovered ? -12 : 0
          const scl = isSelected ? 1.15 : isHovered ? 1.06 : isUnselected ? 0.92 : 1

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              disabled={phase !== 'select'}
              aria-label={`เลือกการ์ดใบที่ ${i + 1}`}
              style={{
                position: 'absolute',
                bottom: 0,
                transform: `translateX(${pos.x}px) translateY(${ty}px) rotate(${pos.rotate}deg) scale(${scl})`,
                zIndex: isSelected ? 20 : spread ? fan.z : i + 1,
                transition: 'transform 0.55s cubic-bezier(0.34, 1.1, 0.64, 1), opacity 0.3s ease',
                opacity: isUnselected ? 0.28 : 1,
              }}
              className={`rounded-2xl ${focusRing}`}
            >
              {/*
               * Inner wrapper carries the shuffle bob animation.
               * Kept separate so it doesn't conflict with the outer
               * position/rotation transform on the button.
               * transition: smoothly returns to Y=0 when animation is removed.
               */}
              <div
                style={{
                  transition: 'transform 0.4s ease',
                  animation: spread
                    ? 'none'
                    : `care-shuffle-bob 0.9s ease-in-out ${i * 90}ms infinite`,
                }}
              >
                <CardBack className="w-14 h-[88px]" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
