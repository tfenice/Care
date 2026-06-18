import { CARD_ILLUSTRATIONS } from '@/lib/card-illustrations'

// Emotional Window illustration renderer.
// Fills its parent container using xMidYMid slice — no absolute positioning.
// The parent (window zone in CardFace/CardReveal) controls size and clipping.
// Returns null for cards without an illustration.

export function CardIllustration({ code }: { code: string }) {
  const render = CARD_ILLUSTRATIONS[code]
  if (!render) return null

  return (
    <svg
      className="w-full h-full pointer-events-none select-none"
      viewBox="0 0 300 160"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      fill="none"
    >
      {render()}
    </svg>
  )
}
