/**
 * StudyStreakCard
 *
 * Premium, calm streak tracking card. Shows:
 *   - Current streak count (large, restrained)
 *   - Last active indicator
 *   - 7-day activity dot grid (Mon–Sun)
 *   - Supportive copy (not gamified cheerleading)
 *
 * Design surface: --surface-soft-a with brand accent
 *
 * This is intentionally calm — no flames, no confetti, no achievement fanfare.
 * The dot grid is the only "visual" — subtle filled/unfilled circles.
 */

import type { WeeklyActivityDay } from "@/lib/study/motivation-data";

// ── Streak copy ───────────────────────────────────────────────────────────────

function streakHeadline(days: number): string {
  if (days === 0) return "No active streak";
  if (days === 1) return "1-day streak";
  if (days < 7) return `${days}-day streak`;
  if (days < 14) return `${days}-day streak`;
  if (days < 30) return `${days}-day streak`;
  return `${days}-day streak`;
}

function streakSubtext(days: number, lastActiveDaysAgo: number | null): string {
  if (days === 0) {
    if (lastActiveDaysAgo === null) return "Start studying to begin your streak.";
    if (lastActiveDaysAgo === 1) return "You studied yesterday. Study today to restart.";
    return `Last active ${lastActiveDaysAgo} days ago. Come back to rebuild.`;
  }
  if (days >= 14) return "Exceptional consistency. This kind of discipline compounds.";
  if (days >= 7) return "A full week of study. Consistency at this level matters.";
  if (days >= 3) return "Three or more days in a row. You're building a real habit.";
  return "Keep it going — each day reinforces the last.";
}

// ── Activity dot ─────────────────────────────────────────────────────────────

function ActivityDot({ day }: { day: WeeklyActivityDay }) {
  const activeColor = "var(--semantic-brand)";
  const inactiveColor = "var(--semantic-border-soft)";
  const todayRing = day.isToday
    ? `0 0 0 2px color-mix(in srgb, ${activeColor} 25%, transparent)`
    : "none";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="h-3 w-3 rounded-full transition-all"
        style={{
          background: day.active ? activeColor : inactiveColor,
          boxShadow: todayRing,
        }}
        aria-label={`${day.dayLabel}: ${day.active ? "active" : "no activity"}${day.isToday ? " (today)" : ""}`}
        role="img"
      />
      <span
        className="text-[9px] font-semibold tabular-nums"
        style={{
          color: day.isToday ? activeColor : "var(--semantic-text-muted)",
          fontWeight: day.isToday ? 700 : 500,
        }}
      >
        {day.dayLabel}
      </span>
    </div>
  );
}

// ── StudyStreakCard ────────────────────────────────────────────────────────────

export type StudyStreakCardProps = {
  streakDays: number;
  lastActiveDaysAgo: number | null;
  weeklyActivity: WeeklyActivityDay[];
};

export function StudyStreakCard({
  streakDays,
  lastActiveDaysAgo,
  weeklyActivity,
}: StudyStreakCardProps) {
  const activeDaysThisWeek = weeklyActivity.filter((d) => d.active).length;
  const hasStreak = streakDays > 0;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background:
          "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 4%, var(--bg-page)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-brand) 18%, var(--semantic-border-soft))",
      }}
    >
      <div className="px-5 pt-5 pb-4">
        {/* Header label */}
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Study consistency
        </p>

        <div className="flex items-start justify-between gap-4">
          {/* Left: streak count + copy */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl font-extrabold tabular-nums"
                style={{
                  color: hasStreak ? "var(--semantic-brand)" : "var(--semantic-text-muted)",
                }}
              >
                {streakDays}
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--semantic-text-secondary)" }}
              >
                {streakDays === 1 ? "day" : "days"}
              </span>
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              {streakHeadline(streakDays)}
            </p>
            <p
              className="max-w-[220px] text-xs leading-relaxed"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              {streakSubtext(streakDays, lastActiveDaysAgo)}
            </p>
          </div>

          {/* Right: week summary stat */}
          <div
            className="flex flex-col items-center gap-1 rounded-xl px-3 py-2"
            style={{
              background:
                "color-mix(in srgb, var(--semantic-brand) 8%, var(--semantic-surface))",
              border:
                "1px solid color-mix(in srgb, var(--semantic-brand) 18%, transparent)",
            }}
          >
            <span
              className="text-xl font-extrabold tabular-nums"
              style={{ color: "var(--semantic-brand)" }}
            >
              {activeDaysThisWeek}/7
            </span>
            <span
              className="text-[9px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              This week
            </span>
          </div>
        </div>
      </div>

      {/* Weekly dot grid */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          borderTop:
            "1px solid color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-border-soft))",
        }}
        role="group"
        aria-label="Weekly activity — last 7 days"
      >
        {weeklyActivity.map((day) => (
          <ActivityDot key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}
