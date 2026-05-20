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
    <div
      className="nn-countdown-card"
      style={{ ["--countdown-accent" as string]: accentColor }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, color-mix(in srgb, ${accentColor} 30%, transparent))`,
          opacity: 0.65,
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `color-mix(in srgb, ${accentColor} 12%, var(--semantic-surface))`,
              color: accentColor,
            }}
          >
            {hasDate ? <Clock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-[0.9375rem] font-bold leading-tight" style={{ color: "var(--semantic-text-primary)" }}>
              {countdown.primary}
            </p>
            {countdown.urgencyLabel && (
              <span
                className="mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
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
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
            style={{
              color: "var(--semantic-brand)",
              background: "color-mix(in srgb, var(--semantic-brand) 8%, var(--semantic-surface))",
            }}
          >
            <Settings className="h-3.5 w-3.5" />
            Set Date
          </Link>
        )}
      </div>

      {countdown.secondary && (
        <p className="mt-3.5 text-[0.8125rem] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
          {countdown.secondary}
        </p>
      )}

      {hasDate && questionsPerDay != null && questionsPerDay > 0 && (
        <p className="mt-2.5 text-xs font-semibold" style={{ color: accentColor }}>
          Study {questionsPerDay} questions/day to stay on track
        </p>
      )}
    </div>
  );
}
