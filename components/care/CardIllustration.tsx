import { CARD_ILLUSTRATIONS } from '@/lib/card-illustrations'

// Emotional Window illustration renderer.
// Fills its parent container using xMidYMid slice — no absolute positioning.
// The parent (EditorialWindow) controls size and clipping.
// Returns null for codes without an illustration.
//
// animated=true applies a category-specific CSS animation (care-illus-{a|p|h|g}).
// The animation plays once and holds the final state — no loops.
// Cancelled automatically by prefers-reduced-motion (globals.css).

export function CardIllustration({ code, animated = false }: { code: string; animated?: boolean }) {
  const render = CARD_ILLUSTRATIONS[code]
  if (!render) return null

  // Derive category from code prefix: A-05 → 'a', P-10 → 'p', etc.
  const animClass = animated ? `care-illus-${code.charAt(0).toLowerCase()}` : ''

  return (
    <svg
      className={`w-full h-full pointer-events-none select-none${animClass ? ` ${animClass}` : ''}`}
      viewBox="0 0 300 160"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      fill="none"
    >
      {render()}
    </svg>
  )
}
