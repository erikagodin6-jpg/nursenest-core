/**
 * ReviewDueNowCards
 *
 * Dashboard preview of the smart review queue — shows 3 priority groups
 * derived from UserTopicStat weak area data. Does NOT render the full queue;
 * this is an action-oriented preview linking into /app/review.
 *
 * Groups:
 *   1. High Priority Fixes  — wrongStreak ≥ 3
 *   2. Needs Review         — wrongStreak 1–2
 *   3. Uncertain Knowledge  — accuracy < 60%, low streak
 *
 * Surfaces: soft-danger / soft-warning / soft-info (distinct, coordinated)
 */

import Link from "next/link";
import type { ExamPlanWeakArea } from "@/lib/study/exam-plan/exam-plan-data";

// ── Review group card ─────────────────────────────────────────────────────────

function ReviewGroupCard({
  title,
  description,
  count,
  previewTopics,
  ctaLabel,
  ctaHref,
  accent,
}: {
  title: string;
  description: string;
  count: number;
  previewTopics: string[];
  ctaLabel: string;
  ctaHref: string;
  accent: string;
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-5"
      style={{
        background: `color-mix(in srgb, ${accent} 6%, var(--bg-page))`,
        border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
      }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: `color-mix(in srgb, ${accent} 15%, var(--semantic-surface))`,
              color: accent,
            }}
          >
            {count}
          </span>
          <p className="text-sm font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            {title}
          </p>
        </div>
        <p className="mt-1 text-xs" style={{ color: "var(--semantic-text-muted)" }}>
          {description}
        </p>
      </div>

      {/* Preview topics */}
      {previewTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {previewTopics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                background: `color-mix(in srgb, ${accent} 10%, var(--semantic-surface))`,
                color: "var(--semantic-text-secondary)",
                border: `1px solid color-mix(in srgb, ${accent} 15%, transparent)`,
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      {count > 0 ? (
        <Link
          href={ctaHref}
          className="mt-auto inline-flex w-fit rounded-full px-4 py-1.5 text-xs font-semibold transition hover:opacity-90"
          style={{
            background: `color-mix(in srgb, ${accent} 12%, var(--semantic-surface))`,
            color: accent,
            border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
          }}
        >
          {ctaLabel}
        </Link>
      ) : (
        <p className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
          Nothing in this group yet.
        </p>
      )}
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function ReviewDueNowCards({ weakAreas }: { weakAreas: ExamPlanWeakArea[] }) {
  const highPriority = weakAreas.filter((a) => a.wrongStreak >= 3);
  const needsReview = weakAreas.filter((a) => a.wrongStreak >= 1 && a.wrongStreak < 3);
  const uncertain = weakAreas.filter(
    (a) => a.wrongStreak === 0 && a.accuracyPct < 60 && a.totalAttempts >= 3,
  );

  const totalDue = highPriority.length + needsReview.length + uncertain.length;

  return (
    <section aria-labelledby="review-due-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2
            id="review-due-heading"
            className="text-lg font-bold"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            Review Due Now
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: "var(--semantic-text-muted)" }}>
            {totalDue > 0
              ? `${totalDue} topic${totalDue !== 1 ? "s" : ""} need attention to strengthen your readiness.`
              : "No urgent review items right now — keep practicing to build your queue."}
          </p>
        </div>
        <Link
          href="/app/review"
          className="shrink-0 text-xs font-semibold underline underline-offset-2"
          style={{ color: "var(--semantic-brand)" }}
        >
          Full review queue
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ReviewGroupCard
          title="High Priority Fixes"
          description="Incorrect with repeated misses — address these first."
          count={highPriority.length}
          previewTopics={highPriority.map((a) => a.topic)}
          ctaLabel="Review now"
          ctaHref="/app/review?filter=high"
          accent="var(--semantic-danger)"
        />
        <ReviewGroupCard
          title="Needs Review"
          description="Recent misses or inconsistent performance."
          count={needsReview.length}
          previewTopics={needsReview.map((a) => a.topic)}
          ctaLabel="Review soon"
          ctaHref="/app/review?filter=medium"
          accent="var(--semantic-warning)"
        />
        <ReviewGroupCard
          title="Uncertain Knowledge"
          description="Answered some correctly, but accuracy is low — reinforce these."
          count={uncertain.length}
          previewTopics={uncertain.map((a) => a.topic)}
          ctaLabel="Reinforce now"
          ctaHref="/app/review?filter=uncertain"
          accent="var(--semantic-info)"
        />
      </div>
    </section>
  );
}
