'use client'

import { useState } from 'react'

type Props = {
  displayDate: string
  moodKey: string
  cardTitle: string | null
  journalBody: string | null
}

const EXCERPT_LENGTH = 80

export default function HistoryEntry({ displayDate, moodKey, cardTitle, journalBody }: Props) {
  const [expanded, setExpanded] = useState(false)

  const hasLongJournal = !!journalBody && journalBody.length > EXCERPT_LENGTH
  const visibleBody =
    journalBody && (expanded || !hasLongJournal)
      ? journalBody
      : journalBody
        ? `${journalBody.slice(0, EXCERPT_LENGTH)}...`
        : null

  return (
    <div className="space-y-2 py-5 border-b border-sand last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-semibold text-ink">{displayDate}</p>
        <span className="text-sm text-muted font-light shrink-0">{moodKey}</span>
      </div>

      {cardTitle && (
        <p className="text-sm text-brown font-light">{cardTitle}</p>
      )}

      {visibleBody && (
        <div className="space-y-1">
          <p className="text-sm text-muted font-light leading-7">{visibleBody}</p>
          {hasLongJournal && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-brown underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              {expanded ? 'ย่อ' : 'อ่านต่อ'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
