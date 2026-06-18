// Pure function — finds journal excerpts from milestone dates.
// Caller fetches the journal entries; this function filters and shapes them.

import { excerptText } from '@/lib/utils'

export const MILESTONES = [
  { daysAgo: 30,  label: '1 เดือนที่แล้ว' },
  { daysAgo: 90,  label: '3 เดือนที่แล้ว' },
  { daysAgo: 180, label: '6 เดือนที่แล้ว' },
] as const

export type Milestone = typeof MILESTONES[number]

export type MilestoneEntry = {
  daysAgo: number
  body: string | null
}

export type DayMemory = {
  daysAgo: number
  label: string
  excerpt: string
}

export function getOnThisDay(entries: MilestoneEntry[]): DayMemory[] {
  const labelMap: Record<number, string> = Object.fromEntries(
    MILESTONES.map(m => [m.daysAgo, m.label])
  )

  return entries
    .filter(e => e.body && e.body.trim().length > 0)
    .map(e => ({
      daysAgo: e.daysAgo,
      label: labelMap[e.daysAgo] ?? `${e.daysAgo} วันที่แล้ว`,
      excerpt: excerptText(e.body!, 80),
    }))
}
