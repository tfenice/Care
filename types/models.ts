// Domain model types — ergonomic shapes used throughout the app layer.
// Derived from raw DB types but shaped for the UI, not the schema.

import type {
  DbProfile,
  DbCardCategory,
  DbRitualCard,
  DbDailyCheckin,
  DbJournalEntry,
  DbReadingHistory,
  DbUserMemory,
} from './database'

// ── Mood ─────────────────────────────────────────────────────────────────────

export const MOOD_KEYS = ['สบายดี', 'พอไหว', 'เหนื่อย', 'สับสน'] as const
export type MoodKey = (typeof MOOD_KEYS)[number]

// UI-facing score (1–5) derived from mood_key. Not stored in the database —
// derive at display time or in analytics queries via CASE expressions.
export const MOOD_SCORES: Record<MoodKey, 1 | 2 | 3 | 4 | 5> = {
  'สบายดี': 5,
  'พอไหว':  3,
  'เหนื่อย': 2,
  'สับสน':  2,
}

// ── Profile ───────────────────────────────────────────────────────────────────

export type Profile = {
  id: string
  displayName: string | null
  locale: 'th' | 'en'
  timezone: string
  currentStreak: number
  longestStreak: number
  lastCheckinDate: Date | null
  onboardedAt: Date | null
  createdAt: Date
}

export function profileFromDb(row: DbProfile): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    locale: row.locale as 'th' | 'en',
    timezone: row.timezone,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastCheckinDate: row.last_checkin_date ? new Date(row.last_checkin_date) : null,
    onboardedAt: row.onboarded_at ? new Date(row.onboarded_at) : null,
    createdAt: new Date(row.created_at),
  }
}

// ── Card Category ─────────────────────────────────────────────────────────────

export type CardCategory = {
  id: string
  slug: string
  nameTh: string
  sortOrder: number
}

export function cardCategoryFromDb(row: DbCardCategory): CardCategory {
  return {
    id: row.id,
    slug: row.slug,
    nameTh: row.name_th,
    sortOrder: row.sort_order,
  }
}

// ── Ritual Card ───────────────────────────────────────────────────────────────

export type RitualCard = {
  id: string
  categoryId: string
  titleTh: string
  bodyTh: string
  reflectionPromptTh: string | null
  imageUrl: string | null
  tags: string[]
  sortOrder: number
}

export function ritualCardFromDb(row: DbRitualCard): RitualCard {
  return {
    id: row.id,
    categoryId: row.category_id,
    titleTh: row.title_th,
    bodyTh: row.body_th,
    reflectionPromptTh: row.reflection_prompt_th,
    imageUrl: row.image_url,
    tags: row.tags,
    sortOrder: row.sort_order,
  }
}

// ── Daily Check-in ────────────────────────────────────────────────────────────

export type DailyCheckin = {
  id: string
  userId: string
  moodKey: MoodKey
  note: string | null
  checkedInAt: Date
}

export function dailyCheckinFromDb(row: DbDailyCheckin): DailyCheckin {
  return {
    id: row.id,
    userId: row.user_id,
    moodKey: row.mood_key as MoodKey,
    note: row.note,
    checkedInAt: new Date(row.checked_in_at),
  }
}

// ── Journal Entry ─────────────────────────────────────────────────────────────

export type JournalEntry = {
  id: string
  userId: string
  checkinId: string | null
  body: string
  createdAt: Date
  updatedAt: Date
}

export function journalEntryFromDb(row: DbJournalEntry): JournalEntry {
  return {
    id: row.id,
    userId: row.user_id,
    checkinId: row.checkin_id,
    body: row.body,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

// ── Reading History ───────────────────────────────────────────────────────────

export type ReadingHistory = {
  id: string
  userId: string
  cardId: string
  checkinId: string | null
  readAt: Date
}

export function readingHistoryFromDb(row: DbReadingHistory): ReadingHistory {
  return {
    id: row.id,
    userId: row.user_id,
    cardId: row.card_id,
    checkinId: row.checkin_id,
    readAt: new Date(row.read_at),
  }
}

// ── User Memory ───────────────────────────────────────────────────────────────
// Written by the AI backend (service role). Users can read, never write.

export type UserMemory = {
  id: string
  userId: string
  content: string
  sourceType: 'checkin' | 'journal' | 'synthesis'
  sourceIds: string[]
  createdAt: Date
}

export function userMemoryFromDb(row: DbUserMemory): UserMemory {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    sourceType: row.source_type,
    sourceIds: row.source_ids,
    createdAt: new Date(row.created_at),
  }
}
