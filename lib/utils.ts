// Shared utilities — Bangkok date, UUID validation, card codes, text excerpts.
// Import from here to avoid duplicate logic across pages.

// ── Bangkok date ───────────────────────────────────────────────────────────────

export function toBangkokDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(d)
}

export function formatBangkokDisplay(
  input: string | Date,
  options: Intl.DateTimeFormatOptions,
): string {
  const d = typeof input === 'string' ? new Date(input) : input
  return new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', ...options }).format(d)
}

// ── UUID validation ────────────────────────────────────────────────────────────

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(id: string): boolean {
  return UUID_RE.test(id)
}

// ── Card code ──────────────────────────────────────────────────────────────────

export function formatCardCode(tokenCode: string, sortOrder: number): string {
  return `${tokenCode}-${String(sortOrder).padStart(2, '0')}`
}

// ── Text excerpt ───────────────────────────────────────────────────────────────

export function excerptText(text: string, max = 100): string {
  const trimmed = text.trim()
  const nl = trimmed.indexOf('\n')
  if (nl > 0 && nl <= max) return trimmed.slice(0, nl).trimEnd()
  if (trimmed.length <= max) return trimmed
  return trimmed.slice(0, max).trimEnd() + '…'
}
