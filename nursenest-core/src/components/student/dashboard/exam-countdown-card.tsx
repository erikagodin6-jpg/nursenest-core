import Link from "next/link";
import { Calendar, Clock, Settings } from "lucide-react";
import type { CountdownCopy } from "@/lib/learner/exam-timeline";

const URGENCY_COLORS: Record<string, string> = {
  far: "var(--semantic-success)",
  moderate: "var(--semantic-info)",
  near: "var(--semantic-warning)",
  final_stretch: "var(--semantic-danger)",
};

/**
 * ExamCountdownCard — shows exam date, days remaining, and pacing suggestion.
 * Uses the existing `buildCountdownCopy` from exam-timeline.ts.
 */
export function ExamCountdownCard({
  countdown,
  questionsPerDay,
}: {
  countdown: CountdownCopy;
  questionsPerDay?: number | null;
}) {
  const hasDate = countdown.daysRemaining != null;
  const accentColor = hasDate
    ? (URGENCY_COLORS[countdown.urgency ?? "far"] ?? "var(--semantic-info)")
    : "var(--semantic-text-muted)";

  return (
    <div className="nn-metric-tile rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `color-mix(in srgb, ${accentColor} 12%, var(--semantic-surface))`,
              color: accentColor,
            }}
          >
            {hasDate ? <Clock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              {countdown.primary}
            </p>
            {countdown.urgencyLabel && (
              <span
                className="mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: `color-mix(in srgb, ${accentColor} 10%, var(--semantic-surface))`,
                  color: accentColor,
                }}
              >
                {countdown.urgencyLabel}
              </span>
            )}
          </div>
        </div>

        {!hasDate && (
          <Link
            href="/app/account/study-preferences"
            className="flex items-center gap-1 text-xs font-medium transition hover:opacity-80"
            style={{ color: "var(--semantic-brand)" }}
          >
            <Settings className="h-3.5 w-3.5" />
            Set date
          </Link>
        )}
      </div>

      {countdown.secondary && (
        <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
          {countdown.secondary}
        </p>
      )}

      {hasDate && questionsPerDay != null && questionsPerDay > 0 && (
        <p className="mt-2 text-xs font-medium" style={{ color: accentColor }}>
          Study {questionsPerDay} questions/day to stay on track
        </p>
      )}
    </div>
  );
}
