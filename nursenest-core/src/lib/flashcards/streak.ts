/** Integer day index in UTC (for streak comparisons). */
export function utcDayIndex(d: Date): number {
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86_400_000);
}

/**
 * Updates streak counters given previous last-study day index (UTC) and today index.
 */
export function nextStreakCounts(
  currentStreak: number,
  longestStreak: number,
  lastStudyDayIndex: number | null,
  todayIndex: number,
): { currentStreak: number; longestStreak: number } {
  if (lastStudyDayIndex === null) {
    const next = 1;
    return { currentStreak: next, longestStreak: Math.max(longestStreak, next) };
  }
  if (lastStudyDayIndex === todayIndex) {
    return { currentStreak, longestStreak };
  }
  if (lastStudyDayIndex === todayIndex - 1) {
    const next = currentStreak + 1;
    return { currentStreak: next, longestStreak: Math.max(longestStreak, next) };
  }
  return { currentStreak: 1, longestStreak: Math.max(longestStreak, 1) };
}
