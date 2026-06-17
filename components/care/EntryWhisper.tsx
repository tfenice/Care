'use client'

import { useState, useEffect } from 'react'

const PHRASES = [
  'วันนี้เป็นอย่างไรบ้าง',
  'วันนี้คุณยิ้มหรือยัง',
  'วันนี้คุณใจดีกับตัวเองพอไหม',
]

const PHRASE_MS = 833  // each phrase
const TOTAL_MS = PHRASES.length * PHRASE_MS  // 2499ms ≈ 2.5s

const LS_KEY = 'care-last-whisper-date'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

type Props = {
  children: React.ReactNode
}

export default function EntryWhisper({ children }: Props) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const today = todayISO()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let alreadyShown = false
    try { alreadyShown = localStorage.getItem(LS_KEY) === today } catch { /* private browsing */ }

    if (reduced || alreadyShown) {
      const t = setTimeout(() => setDone(true), 0)
      return () => clearTimeout(t)
    }

    // Mark whisper as shown for today before starting animation
    try { localStorage.setItem(LS_KEY, today) } catch { /* private browsing */ }

    const t = setTimeout(() => setDone(true), TOTAL_MS)
    return () => clearTimeout(t)
  }, [])

  if (done) return <>{children}</>

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Fixed-height container so all phrases occupy the same position */}
      <div className="relative w-full text-center" style={{ height: '5rem' }}>
        {PHRASES.map((phrase, i) => (
          <p
            key={i}
            className="absolute inset-0 flex items-center justify-center text-2xl font-light text-ink leading-snug"
            style={{
              animationName: 'care-whisper',
              animationDuration: `${PHRASE_MS}ms`,
              animationDelay: `${i * PHRASE_MS}ms`,
              animationFillMode: 'both',
              animationTimingFunction: 'ease-in-out',
            }}
          >
            {phrase}
          </p>
        ))}
      </div>
    </div>
  )
}
