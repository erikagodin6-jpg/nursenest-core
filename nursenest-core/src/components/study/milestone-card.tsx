/**
 * MilestoneCard
 *
 * Calm, restrained milestone display. Shows achieved and upcoming milestones
 * as a compact card grid — not confetti, not badge walls.
 *
 * Design surface: --surface-soft-c with subtle premium accents
 *
 * Achieved milestones: fully lit up (brand/success tint) with a check icon
 * Upcoming milestones: dimmed neutral pill — shows where the learner is heading
 *
 * Intentionally compact: no giant banners, no animations, no pop-ups.
 * The acknowledgment is quiet and premium.
 */

import type { MotivationMilestone } from "@/lib/study/motivation-data";

// ── Milestone chip ────────────────────────────────────────────────────────────

function MilestoneChip({ milestone }: { milestone: MotivationMilestone }) {
  if (milestone.achieved) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{
          background:
            "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))",
          border:
            "1px solid color-mix(in srgb, var(--semantic-success) 22%, transparent)",
        }}
        role="status"
        aria-label={`Milestone achieved: ${milestone.label}`}
      >
        {/* Check icon */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle
            cx="6"
            cy="6"
            r="5.5"
            fill="color-mix(in srgb, var(--semantic-success) 15%, transparent)"
            stroke="var(--semantic-success)"
          />
          <path
            d="M3.5 6l1.75 1.75L8.5 4.5"
            stroke="var(--semantic-success)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--semantic-success)" }}
        >
          {milestone.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2"
      style={{
        background: "transparent",
        border: "1px solid var(--semantic-border-soft)",
        opacity: 0.7,
      }}
      role="status"
      aria-label={`Upcoming milestone: ${milestone.label}`}
    >
      {/* Circle outline icon */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle cx="6" cy="6" r="5.5" stroke="var(--semantic-border-soft)" />
      </svg>
      <span
        className="text-xs"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        {milestone.label}
      </span>
    </div>
  );
}

// ── MilestoneCard ─────────────────────────────────────────────────────────────

export type MilestoneCardProps = {
  milestones: MotivationMilestone[];
};

export function MilestoneCard({ milestones }: MilestoneCardProps) {
  const achievedCount = milestones.filter((m) => m.achieved).length;
  const total = milestones.length;

  if (milestones.length === 0) return null;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background:
          "var(--surface-soft-c, color-mix(in srgb, var(--theme-accent, var(--theme-primary)) 5%, var(--bg-page)))",
        border: "1px solid var(--semantic-border-soft)",
      }}
    >
      <div className="px-5 pt-5 pb-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              Milestones
            </p>
            <p
              className="mt-0.5 text-sm font-semibold"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              {achievedCount === 0
                ? "Keep studying to unlock these"
                : achievedCount === total
                  ? "All milestones reached"
                  : `${achievedCount} of ${total} reached`}
            </p>
          </div>

          {/* Progress fraction */}
          <div
            className="flex flex-col items-center rounded-xl px-3 py-1.5"
            style={{
              background:
                achievedCount > 0
                  ? "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))"
                  : "color-mix(in srgb, var(--semantic-border-soft) 30%, var(--semantic-surface))",
              border:
                achievedCount > 0
                  ? "1px solid color-mix(in srgb, var(--semantic-success) 20%, transparent)"
                  : "1px solid var(--semantic-border-soft)",
            }}
          >
            <span
              className="text-lg font-extrabold tabular-nums leading-none"
              style={{
                color:
                  achievedCount > 0
                    ? "var(--semantic-success)"
                    : "var(--semantic-text-muted)",
              }}
            >
              {achievedCount}/{total}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div
            className="mb-4 h-1 w-full overflow-hidden rounded-full"
            style={{
              background:
                "color-mix(in srgb, var(--semantic-border-soft) 50%, transparent)",
            }}
            role="progressbar"
            aria-valuenow={achievedCount}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={`${achievedCount} of ${total} milestones reached`}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.round((achievedCount / total) * 100)}%`,
                background:
                  achievedCount === total
                    ? "var(--semantic-success)"
                    : "var(--semantic-brand)",
              }}
            />
          </div>
        )}

        {/* Milestone chips */}
        <div className="flex flex-wrap gap-2">
          {milestones.map((m) => (
            <MilestoneChip key={m.id} milestone={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
