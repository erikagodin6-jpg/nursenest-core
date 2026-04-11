/**
 * ReviewQueueHero
 *
 * Summary hero banner for the /app/review page.
 * Shows total due counts, urgency breakdown, and a contextual summary message.
 *
 * Design surface: --surface-emphasis (brand-tinted callout — per spec Section 3).
 * No hardcoded colors. All tints derived from semantic + theme CSS variables.
 *
 * This is a Server Component — no interactivity needed.
 */

import type { ReviewQueueSummary } from "@/lib/study/srs-scheduler";

// ── Stat chip ─────────────────────────────────────────────────────────────────

function StatChip({
  label,
  value,
  accentVar,
  borderVar,
}: {
  label: string;
  value: number;
  accentVar: string;
  borderVar: string;
}) {
  return (
    <div
      className="flex min-w-[6rem] flex-col items-center rounded-xl px-4 py-3 text-center"
      style={{
        background: `color-mix(in srgb, ${accentVar} 10%, var(--bg-card, var(--theme-card-bg)))`,
        border: `1px solid color-mix(in srgb, ${accentVar} 25%, var(--border-subtle, var(--theme-border)))`,
      }}
    >
      <span
        className="text-2xl font-extrabold leading-none tracking-tight"
        style={{ color: accentVar }}
      >
        {value}
      </span>
      <span
        className="mt-1 text-[11px] font-medium leading-tight"
        style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Summary copy ──────────────────────────────────────────────────────────────

function buildSummaryMessage(s: ReviewQueueSummary): string {
  if (s.total === 0) {
    return "No questions in your review history yet. Complete a practice session and come back to review your weak areas.";
  }
  if (s.dueNowCount === 0 && s.reviewSoonCount === 0) {
    return `All ${s.total} question${s.total !== 1 ? "s" : ""} in your history are well-retained. Keep practicing to build new review items.`;
  }
  const parts: string[] = [];
  if (s.overconfidenceCount > 0) {
    parts.push(
      `${s.overconfidenceCount} overconfidence miss${s.overconfidenceCount !== 1 ? "es" : ""} (high urgency)`,
    );
  }
  if (s.dueNowCount > 0) {
    parts.push(`${s.dueNowCount} due now`);
  }
  if (s.reviewSoonCount > 0) {
    parts.push(`${s.reviewSoonCount} coming up soon`);
  }
  if (parts.length === 0) return "Your review queue is up to date.";
  return `${parts.join(" · ")} — work through the due items first for maximum retention.`;
}

// ── ReviewQueueHero ───────────────────────────────────────────────────────────

export function ReviewQueueHero({ summary }: { summary: ReviewQueueSummary }) {
  const message = buildSummaryMessage(summary);
  const hasItems = summary.total > 0;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background:
          "var(--surface-emphasis, color-mix(in srgb, var(--semantic-brand) 8%, var(--bg-card)))",
        border:
          "1px solid color-mix(in srgb, var(--theme-primary) 20%, var(--border-subtle, var(--theme-border)))",
      }}
      role="region"
      aria-label="Review queue summary"
    >
      <div className="px-6 py-5 sm:px-7 sm:py-6">
        {/* Label */}
        <p
          className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          aria-hidden="true"
        >
          Spaced repetition review
        </p>

        {/* Headline */}
        <h1
          className="text-xl font-extrabold leading-tight sm:text-2xl"
          style={{ color: "var(--theme-heading-text, var(--foreground))" }}
        >
          {hasItems
            ? `${summary.dueNowCount + summary.reviewSoonCount} question${
                summary.dueNowCount + summary.reviewSoonCount !== 1 ? "s" : ""
              } to review`
            : "Nothing due yet"}
        </h1>

        {/* Summary message */}
        <p
          className="mt-1.5 text-sm leading-relaxed"
          style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
        >
          {message}
        </p>

        {/* Stat chips */}
        {hasItems ? (
          <div className="mt-5 flex flex-wrap gap-2.5">
            <StatChip
              label="Due Now"
              value={summary.dueNowCount}
              accentVar="var(--semantic-warning, #f59e0b)"
              borderVar="var(--semantic-warning, #f59e0b)"
            />
            <StatChip
              label="Review Soon"
              value={summary.reviewSoonCount}
              accentVar="var(--semantic-info, #38bdf8)"
              borderVar="var(--semantic-info, #38bdf8)"
            />
            <StatChip
              label="Stable"
              value={summary.stableCount}
              accentVar="var(--semantic-success, #22c55e)"
              borderVar="var(--semantic-success, #22c55e)"
            />
            {summary.overconfidenceCount > 0 ? (
              <StatChip
                label="Overconfidence"
                value={summary.overconfidenceCount}
                accentVar="var(--semantic-danger, #ef4444)"
                borderVar="var(--semantic-danger, #ef4444)"
              />
            ) : null}
            {summary.uncertainCount > 0 ? (
              <StatChip
                label="Uncertain"
                value={summary.uncertainCount}
                accentVar="var(--semantic-chart-3, #a78bfa)"
                borderVar="var(--semantic-chart-3, #a78bfa)"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
