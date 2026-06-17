'use client'

import { useState, useEffect, useTransition } from 'react'
import CardBack from './CardBack'
import { focusRing } from '@/components/ui/focus'

type Phase = 'shuffle' | 'select' | 'revealing'

const CARD_COUNT = 7

// Tight stack offsets during shuffle phase
const SHUFFLE_OFFSETS = [
  { x: -7, rotate: -8 },
  { x:  4, rotate:  5 },
  { x: -3, rotate: -3 },
  { x:  5, rotate:  7 },
  { x: -4, rotate: -5 },
  { x:  3, rotate:  4 },
  { x: -1, rotate: -2 },
]

// Spread fan positions
const FAN_POSITIONS = [
  { x: -84, rotate: -15, z: 1 },
  { x: -56, rotate: -10, z: 2 },
  { x: -28, rotate:  -5, z: 3 },
  { x:   0, rotate:   0, z: 7 },
  { x:  28, rotate:   5, z: 3 },
  { x:  56, rotate:  10, z: 2 },
  { x:  84, rotate:  15, z: 1 },
]

type Props = {
  action: () => Promise<void>
}

export default function CardDeck({ action }: Props) {
  const [phase, setPhase] = useState<Phase>('shuffle')
  const [spread, setSpread] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      // Skip shuffle — go straight to select in the next tick
      const t = setTimeout(() => { setSpread(true); setPhase('select') }, 0)
      return () => clearTimeout(t)
    }
    const t1 = setTimeout(() => setSpread(true), 250)
    const t2 = setTimeout(() => setPhase('select'), 1650)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleSelect = (i: number) => {
    if (phase !== 'select' || selectedIndex !== null || isPending) return
    setSelectedIndex(i)
    setPhase('revealing')
    setTimeout(() => {
      startTransition(async () => { await action() })
    }, 500)
  }

  const subtitle =
    phase === 'shuffle'    ? '' :
    phase === 'revealing'  ? 'กำลังเปิดการ์ด...' :
                             'แล้วเลือกการ์ดที่รู้สึกว่าเรียกคุณ'

  return (
    <div className="space-y-14">
      <div className="text-center space-y-3">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
        <h1 className="text-2xl font-semibold text-ink leading-relaxed">
          หายใจลึก ๆ สักครั้ง
        </h1>
        <p
          className="text-muted font-light leading-8 min-h-[2rem] transition-opacity duration-500"
          style={{ opacity: phase === 'shuffle' ? 0 : 1 }}
        >
          {subtitle}
        </p>
      </div>

      {/* Card fan — h-36 = 144px, enough for 88px card + 32px lift + scale margin */}
      <div className="relative h-36 flex items-end justify-center">
        {Array.from({ length: CARD_COUNT }, (_, i) => {
          const fan = FAN_POSITIONS[i]
          const shuffle = SHUFFLE_OFFSETS[i]
          const pos = spread ? fan : shuffle

          const isSelected = selectedIndex === i
          const isUnselected = selectedIndex !== null && !isSelected
          const isHovered = hoveredIndex === i && phase === 'select' && !isSelected

          const ty  = isSelected ? -32 : isHovered ? -10 : 0
          const scl = isSelected ? 1.12 : isHovered ? 1.05 : isUnselected ? 0.94 : 1

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
                zIndex: isSelected ? 20 : spread ? fan.z : 1,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.1, 0.64, 1), opacity 0.25s ease',
                opacity: isUnselected ? 0.32 : 1,
              }}
              className={`rounded-2xl ${focusRing}`}
            >
              <CardBack className="w-14 h-[88px]" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
