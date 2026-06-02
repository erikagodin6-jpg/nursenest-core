/**
 * ReadinessStrengthGrid
 *
 * Two-panel visual grid showing:
 *   Left  — Strongest areas (high accuracy, sufficient attempts)
 *   Right — Weakest areas (high miss rate or wrong streak)
 *
 * Each item shows: topic name · accuracy bar · attempt count · momentum arrow
 * Colors: green gradient for strengths, orange→red gradient for weaknesses.
 *
 * Server Component — data pre-loaded.
 */

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, BookOpen, Swords } from "lucide-react";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import { remediationTopicDrillHref, remediationLessonsTopicHref } from "@/lib/learner/remediation-links";

// ── Momentum icon ─────────────────────────────────────────────────────────────

function MomentumIcon({ momentum }: { momentum: TopicTrendRow["momentum"] | undefined }) {
  if (momentum === "improving") {
    return (
      <TrendingUp
        className="h-3.5 w-3.5 flex-shrink-0"
        aria-label="Improving"
        style={{ color: "var(--semantic-success, #22c55e)" }}
      />
    );
  }
  if (momentum === "declining") {
    return (
      <TrendingDown
        className="h-3.5 w-3.5 flex-shrink-0"
        aria-label="Declining"
        style={{ color: "var(--semantic-danger, #e11d48)" }}
      />
    );
  }
  return (
    <Minus
      className="h-3.5 w-3.5 flex-shrink-0"
      aria-label="Stable"
      style={{ color: "var(--semantic-text-muted, #8fa8b8)" }}
    />
  );
}

// ── Strength card ─────────────────────────────────────────────────────────────

function StrengthCard({
  row,
  momentum,
}: {
  row: WeakTopicRow;
  momentum?: TopicTrendRow["momentum"];
}) {
  const accuracyPct = 100 - row.missRate;
  const accent = "var(--semantic-success, #22c55e)";
  const drillHref = remediationTopicDrillHref(row.topic);

  return (
    <li
      className="flex flex-col gap-2 overflow-hidden rounded-xl px-4 py-3.5"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-success, #22c55e) 6%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-success, #22c55e) 18%, var(--border-subtle))",
        borderLeft: `3px solid ${accent}`,
      }}
    >
      {/* Topic name + momentum */}
      <div className="flex items-center justify-between gap-2">
        <p
          className="truncate text-sm font-semibold leading-snug"
          style={{ color: "var(--theme-heading-text, var(--foreground))" }}
        >
          {row.topic}
        </p>
        <MomentumIcon momentum={momentum} />
      </div>

      {/* Accuracy bar */}
      <div>
        <div
          className="nn-progress-track-semantic nn-progress-track-semantic--xs"
          role="progressbar"
          aria-valuenow={accuracyPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${row.topic}: ${accuracyPct}% accuracy`}
        >
          <div
            className="h-full rounded-full nn-progress-fill-semantic-success transition-[width] duration-500 ease-out"
            style={{ width: `${accuracyPct}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span
            className="text-[11px] font-bold tabular-nums"
            style={{ color: accent }}
          >
            {accuracyPct}% accuracy
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
          >
            {row.attempted} answered
          </span>
        </div>
      </div>

      {/* Maintain CTA */}
      <Link
        href={drillHref}
        className="self-start text-[11px] font-medium hover:underline focus-visible:outline-none"
        style={{ color: accent }}
      >
        Keep sharp →
      </Link>
    </li>
  );
}

// ── Weakness card ─────────────────────────────────────────────────────────────

function WeaknessCard({
  row,
  momentum,
  pathwayId,
}: {
  row: WeakTopicRow;
  momentum?: TopicTrendRow["momentum"];
  pathwayId?: string | null;
}) {
  const missRate = row.missRate;
  const accent =
    missRate >= 65
      ? "var(--semantic-danger, #e11d48)"
      : missRate >= 50
      ? "var(--semantic-warning, #d97706)"
      : "var(--semantic-chart-5, #f97316)";

  const drillHref = remediationTopicDrillHref(row.topic, pathwayId);
  const lessonHref = remediationLessonsTopicHref(row.topic, row.normalizedTopic ?? null, pathwayId);

  return (
    <li
      className="flex flex-col gap-2 overflow-hidden rounded-xl px-4 py-3.5"
      style={{
        background: `color-mix(in srgb, ${accent} 6%, var(--bg-card, var(--theme-card-bg)))`,
        border: `1px solid color-mix(in srgb, ${accent} 20%, var(--border-subtle))`,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      {/* Topic name + momentum + streak badge */}
      <div className="flex items-start justify-between gap-2">
        <p
          className="truncate text-sm font-semibold leading-snug"
          style={{ color: "var(--theme-heading-text, var(--foreground))" }}
        >
          {row.topic}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {(row.wrongStreak ?? 0) >= 2 ? (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
              style={{
                background: `color-mix(in srgb, ${accent} 14%, var(--bg-card))`,
                color: accent,
              }}
            >
              {row.wrongStreak}× streak
            </span>
          ) : null}
          <MomentumIcon momentum={momentum} />
        </div>
      </div>

      {/* Miss rate bar */}
      <div>
        <div
          className="nn-progress-track-semantic nn-progress-track-semantic--xs"
          role="progressbar"
          aria-valuenow={missRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${row.topic}: ${missRate}% miss rate`}
        >
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${missRate}%`, background: accent }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span
            className="text-[11px] font-bold tabular-nums"
            style={{ color: accent }}
          >
            {missRate}% miss rate
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
          >
            {row.attempted} answered
          </span>
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={drillHref}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all hover:opacity-85"
          style={{
            background: accent,
            color: "#fff",
          }}
        >
          <Swords className="h-3 w-3" aria-hidden />
          Drill
        </Link>
        <Link
          href={lessonHref}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all hover:opacity-85"
          style={{
            background: "var(--bg-card, var(--theme-card-bg))",
            border: `1px solid color-mix(in srgb, ${accent} 30%, var(--border-subtle))`,
            color: accent,
          }}
        >
          <BookOpen className="h-3 w-3" aria-hidden />
          Lesson
        </Link>
      </div>
    </li>
  );
}

// ── ReadinessStrengthGrid ─────────────────────────────────────────────────────

export interface ReadinessStrengthGridProps {
  strongTopics: WeakTopicRow[];
  weakTopics: WeakTopicRow[];
  trends: TopicTrendRow[];
  pathwayId?: string | null;
}

export function ReadinessStrengthGrid({
  strongTopics,
  weakTopics,
  trends,
  pathwayId,
}: ReadinessStrengthGridProps) {
  const strongDisplay = strongTopics.slice(0, 5);
  const weakDisplay = weakTopics.slice(0, 5);

  const momentumMap = new Map<string, TopicTrendRow["momentum"]>(
    trends.map((t) => [t.topic, t.momentum]),
  );

  const hasAny = strongDisplay.length > 0 || weakDisplay.length > 0;
  if (!hasAny) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Strongest areas */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background:
            "color-mix(in srgb, var(--semantic-success, #22c55e) 4%, var(--bg-card, var(--theme-card-bg)))",
          border:
            "1px solid color-mix(in srgb, var(--semantic-success, #22c55e) 16%, var(--border-subtle))",
        }}
      >
        <div className="flex items-center gap-2 px-5 py-4 sm:px-6">
          <TrendingUp
            className="h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            style={{ color: "var(--semantic-success, #22c55e)" }}
          />
          <div>
            <h2
              className="text-sm font-bold"
              style={{ color: "var(--theme-heading-text, var(--foreground))" }}
            >
              Strongest Areas
            </h2>
            <p
              className="text-[11px]"
              style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
            >
              Topics where you are performing well
            </p>
          </div>
        </div>
        <div
          className="border-t px-4 pb-4 pt-3 sm:px-5"
          style={{
            borderColor:
              "color-mix(in srgb, var(--semantic-success) 14%, var(--border-subtle))",
          }}
        >
          {strongDisplay.length > 0 ? (
            <ul className="space-y-3">
              {strongDisplay.map((row) => (
                <StrengthCard
                  key={row.normalizedTopic ?? row.topic}
                  row={row}
                  momentum={momentumMap.get(row.topic)}
                />
              ))}
            </ul>
          ) : (
            <p
              className="py-4 text-center text-sm italic"
              style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
            >
              Answer more questions to see your strongest topics.
            </p>
          )}
        </div>
      </div>

      {/* Weakest areas */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background:
            "color-mix(in srgb, var(--semantic-danger, #e11d48) 4%, var(--bg-card, var(--theme-card-bg)))",
          border:
            "1px solid color-mix(in srgb, var(--semantic-danger, #e11d48) 14%, var(--border-subtle))",
        }}
      >
        <div className="flex items-center gap-2 px-5 py-4 sm:px-6">
          <TrendingDown
            className="h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            style={{ color: "var(--semantic-danger, #e11d48)" }}
          />
          <div>
            <h2
              className="text-sm font-bold"
              style={{ color: "var(--theme-heading-text, var(--foreground))" }}
            >
              Areas to Improve
            </h2>
            <p
              className="text-[11px]"
              style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
            >
              Focus here for the fastest readiness gains
            </p>
          </div>
        </div>
        <div
          className="border-t px-4 pb-4 pt-3 sm:px-5"
          style={{
            borderColor:
              "color-mix(in srgb, var(--semantic-danger) 12%, var(--border-subtle))",
          }}
        >
          {weakDisplay.length > 0 ? (
            <ul className="space-y-3">
              {weakDisplay.map((row) => (
                <WeaknessCard
                  key={row.normalizedTopic ?? row.topic}
                  row={row}
                  momentum={momentumMap.get(row.topic)}
                  pathwayId={pathwayId}
                />
              ))}
            </ul>
          ) : (
            <p
              className="py-4 text-center text-sm italic"
              style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
            >
              No weak areas detected yet — keep practicing!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
