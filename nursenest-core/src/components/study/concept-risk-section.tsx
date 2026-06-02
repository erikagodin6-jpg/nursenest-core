/**
 * ConceptRiskSection
 *
 * Displays "High-Risk Forgotten Concepts" — topics with high wrong streak
 * or strong decay-adjusted miss signal from UserTopicStat.
 *
 * Each card shows:
 *   - Topic name and body system (if known)
 *   - Wrong streak indicator (colored if ≥ 2)
 *   - Miss rate percentage bar
 *   - Time since last error
 *   - Two CTAs: drill questions | study lesson
 *
 * This is a Server Component — data is pre-loaded.
 */

import Link from "next/link";
import { TriangleAlert, BookOpen, Swords } from "lucide-react";
import type { UnifiedReviewItem } from "@/lib/study/unified-review-types";

// ── Miss rate bar ─────────────────────────────────────────────────────────────

function MissRateBar({ missRate }: { missRate: number }) {
  // Semantic color based on rate
  const fillClass =
    missRate >= 65
      ? "var(--semantic-danger, #ef4444)"
      : missRate >= 45
      ? "var(--semantic-warning, #f59e0b)"
      : "var(--semantic-chart-5, #f97316)";

  return (
    <div className="mt-2.5">
      <div className="mb-1 flex items-center justify-between">
        <span
          className="text-[11px] font-medium"
          style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
        >
          Miss rate
        </span>
        <span
          className="text-[11px] font-bold tabular-nums"
          style={{ color: fillClass }}
        >
          {missRate}%
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full"
        style={{ background: "var(--border-subtle, var(--theme-border))" }}
        aria-label={`Miss rate: ${missRate}%`}
        role="progressbar"
        aria-valuenow={missRate}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(missRate, 100)}%`, background: fillClass }}
        />
      </div>
    </div>
  );
}

// ── Streak badge ──────────────────────────────────────────────────────────────

function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;
  const color =
    streak >= 4
      ? "var(--semantic-danger, #ef4444)"
      : streak >= 3
      ? "var(--semantic-warning, #f59e0b)"
      : "var(--semantic-chart-5, #f97316)";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.07em]"
      style={{
        background: `color-mix(in srgb, ${color} 12%, var(--bg-card, var(--theme-card-bg)))`,
        border: `1px solid color-mix(in srgb, ${color} 28%, var(--border-subtle))`,
        color,
      }}
    >
      {streak}× miss streak
    </span>
  );
}

// ── Single concept card ───────────────────────────────────────────────────────

function ConceptCard({ item }: { item: UnifiedReviewItem }) {
  const topicData = item.topicData;
  if (!topicData) return null;

  const urgencyColor =
    topicData.wrongStreak >= 3 || topicData.missRate >= 65
      ? "var(--semantic-danger, #ef4444)"
      : "var(--semantic-warning, #f59e0b)";

  return (
    <li
      className="overflow-hidden rounded-xl transition-shadow"
      style={{
        background: "var(--bg-card, var(--theme-card-bg))",
        border: "1px solid var(--border-subtle, var(--theme-border))",
        borderLeft: `3px solid ${urgencyColor}`,
      }}
    >
      <div className="px-4 py-3.5">
        {/* Topic name + streak badge */}
        <div className="flex flex-wrap items-center gap-2">
          <p
            className="text-sm font-bold leading-snug"
            style={{ color: "var(--theme-heading-text, var(--foreground))" }}
          >
            {item.title}
          </p>
          <StreakBadge streak={topicData.wrongStreak} />
        </div>

        {/* Subtitle / body system */}
        {item.bodySystem ? (
          <p
            className="mt-0.5 text-[11px]"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            {item.bodySystem}
          </p>
        ) : null}

        {/* Miss rate bar */}
        <MissRateBar missRate={topicData.missRate} />

        {/* Due label */}
        <p
          className="mt-2 text-[11px]"
          style={{ color: urgencyColor }}
        >
          {item.dueLabel}
        </p>

        {/* Action row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={item.drillHref}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-85 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2"
            style={{
              background: "var(--theme-primary)",
              color: "var(--theme-primary-foreground, #fff)",
            }}
          >
            <Swords className="h-3 w-3" aria-hidden />
            Drill questions
          </Link>
          {item.lessonHref ? (
            <Link
              href={item.lessonHref}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-85 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: "var(--bg-card, var(--theme-card-bg))",
                border: "1px solid var(--border-subtle, var(--theme-border))",
                color: "var(--theme-text, var(--foreground))",
              }}
            >
              <BookOpen className="h-3 w-3" aria-hidden />
              Study lesson
            </Link>
          ) : null}
        </div>
      </div>
    </li>
  );
}

// ── ConceptRiskSection ────────────────────────────────────────────────────────

export function ConceptRiskSection({ items }: { items: UnifiedReviewItem[] }) {
  if (items.length === 0) return null;

  return (
    <section
      className="overflow-hidden rounded-2xl"
      aria-labelledby="concept-risk-heading"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-chart-5, #f97316) 5%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-chart-5, #f97316) 22%, var(--border-subtle, var(--theme-border)))",
      }}
    >
      {/* Section header */}
      <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
        <TriangleAlert
          className="mt-0.5 h-5 w-5 flex-shrink-0"
          aria-hidden="true"
          style={{ color: "var(--semantic-chart-5, #f97316)" }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h2
              id="concept-risk-heading"
              className="text-sm font-bold sm:text-base"
              style={{ color: "var(--theme-heading-text, var(--foreground))" }}
            >
              High-Risk Forgotten Concepts
            </h2>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold"
              style={{
                background:
                  "color-mix(in srgb, var(--semantic-chart-5, #f97316) 15%, var(--bg-card))",
                border:
                  "1px solid color-mix(in srgb, var(--semantic-chart-5, #f97316) 30%, var(--border-subtle))",
                color: "var(--semantic-chart-5, #f97316)",
              }}
              aria-label={`${items.length} concepts`}
            >
              {items.length}
            </span>
          </div>
          <p
            className="mt-0.5 text-xs leading-snug"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            Topics with repeated errors or high miss rates — forgetting risk is elevated without targeted review.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div
        className="border-t px-4 pb-4 pt-3 sm:px-5"
        style={{
          borderColor:
            "color-mix(in srgb, var(--semantic-chart-5, #f97316) 15%, var(--border-subtle))",
        }}
      >
        <ul className="space-y-2.5">
          {items.map((item) => (
            <ConceptCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
