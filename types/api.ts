// Route Handler request/response contracts.
// These are the shapes that cross the client ↔ server boundary.

import type { MoodKey } from './models'

// ── Shared ────────────────────────────────────────────────────────────────────

export type ApiError = {
  error: string
  code?: string
}

// ── POST /api/checkins ────────────────────────────────────────────────────────

export type CreateCheckinRequest = {
  moodKey: MoodKey
  note?: string
}

export type CreateCheckinResponse = {
  id: string
  checkedInAt: string
}

// ── GET /api/cards ────────────────────────────────────────────────────────────
// Returns one card to draw. The server excludes recently seen cards.

export type DrawCardResponse = {
  card: {
    id: string
    titleTh: string
    titleEn: string | null
    bodyTh: string
    bodyEn: string | null
    reflectionPromptTh: string | null
    imageUrl: string | null
    category: {
      slug: string
      nameTh: string
    }
  }
}

// ── POST /api/cards ───────────────────────────────────────────────────────────
// Records that a user read a card.

export type RecordCardReadRequest = {
  cardId: string
  checkinId?: string
}

export type RecordCardReadResponse = {
  id: string
}

// ── POST /api/journal ─────────────────────────────────────────────────────────

export type CreateJournalEntryRequest = {
  body: string
  checkinId?: string
}

export type CreateJournalEntryResponse = {
  id: string
  createdAt: string
}

// ── PATCH /api/journal/[id] ───────────────────────────────────────────────────

export type UpdateJournalEntryRequest = {
  body?: string
}

export type UpdateJournalEntryResponse = {
  id: string
  updatedAt: string
}

// ── DELETE /api/journal/[id] ──────────────────────────────────────────────────
// Soft-delete: sets deleted_at. Returns 204 with no body on success.

export type DeleteJournalEntryResponse = Record<string, never>
