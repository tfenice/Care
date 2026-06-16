// Demo-only until Launch Hardening Sprint.
// Replace with service-role Supabase queries after auth is restored.

export const DEMO_OVERVIEW = {
  totalUsers: 3,
  dau: 2,
  wau: 3,
  totalCheckins: 47,
  totalJournals: 18,
  totalCardsDrawn: 34,
  streakDistribution: {
    '0':    0,
    '1–3':  1,
    '4–7':  1,
    '8–14': 1,
    '15+':  0,
  } as Record<string, number>,
  moodFrequency: {
    'สบายดี': 14,
    'พอไหว':  18,
    'เหนื่อย': 10,
    'สับสน':   5,
  } as Record<string, number>,
  topCardCategories: [
    { category: 'การยอมรับ',           count: 12 },
    { category: 'ความหวัง',            count: 9  },
    { category: 'การอยู่กับปัจจุบัน',  count: 7  },
    { category: 'การเติบโต',           count: 6  },
  ],
}

export const DEMO_DAILY_STATS = [
  { date: '2026-06-16', checkins: 2, journals: 1, cardsDrawn: 2, activeUsers: 2 },
  { date: '2026-06-15', checkins: 3, journals: 2, cardsDrawn: 3, activeUsers: 3 },
  { date: '2026-06-14', checkins: 2, journals: 1, cardsDrawn: 2, activeUsers: 2 },
  { date: '2026-06-13', checkins: 3, journals: 2, cardsDrawn: 4, activeUsers: 3 },
  { date: '2026-06-12', checkins: 1, journals: 0, cardsDrawn: 1, activeUsers: 1 },
  { date: '2026-06-11', checkins: 2, journals: 1, cardsDrawn: 3, activeUsers: 2 },
  { date: '2026-06-10', checkins: 3, journals: 2, cardsDrawn: 2, activeUsers: 3 },
]
