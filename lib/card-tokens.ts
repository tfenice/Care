import type { CSSProperties } from 'react'

// Category color identity for the Care deck.
// Keys match card_categories.name_th from the database.

export type CategoryToken = {
  slug: string
  code: string     // A, P, H, G — used for card reference codes (A-01, P-03, etc.)
  color: string    // CSS variable — for inline color values
  rgb: string      // CSS variable — for rgb(var(...) / alpha) composition
  feeling: string  // internal descriptor, not shown in UI
}

export const CATEGORY_TOKENS: Record<string, CategoryToken> = {
  'การยอมรับ': {
    slug: 'acceptance',
    code: 'A',
    color: 'var(--color-acceptance)',
    rgb: 'var(--color-acceptance-rgb)',
    feeling: 'stillness',
  },
  'ความใจจดจ่อ': {
    slug: 'presence',
    code: 'P',
    color: 'var(--color-presence)',
    rgb: 'var(--color-presence-rgb)',
    feeling: 'attention',
  },
  'ความหวัง': {
    slug: 'hope',
    code: 'H',
    color: 'var(--color-hope)',
    rgb: 'var(--color-hope-rgb)',
    feeling: 'possibility',
  },
  'การเติบโต': {
    slug: 'growth',
    code: 'G',
    color: 'var(--color-brown)',
    rgb: 'var(--color-growth-rgb)',
    feeling: 'becoming',
  },
}

// Fallback token — used when category name is unrecognised or absent
const DEFAULT_TOKEN: CategoryToken = {
  slug: 'care',
  code: 'C',
  color: 'var(--color-brown)',
  rgb: 'var(--color-growth-rgb)',
  feeling: 'reflection',
}

export function getCategoryToken(categoryName: string): CategoryToken {
  return CATEGORY_TOKENS[categoryName] ?? DEFAULT_TOKEN
}

// Pre-composed style objects — use these in components to stay consistent
export function categoryPillStyle(token: CategoryToken): CSSProperties {
  return {
    color:      token.color,
    background: `rgb(${token.rgb} / 0.07)`,
    border:     `1px solid rgb(${token.rgb} / 0.25)`,
  }
}

export function categoryAccentStyle(token: CategoryToken): CSSProperties {
  return {
    borderColor: `rgb(${token.rgb} / 0.40)`,
  }
}
