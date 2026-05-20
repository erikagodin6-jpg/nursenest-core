/**
 * TodaysPlanSection
 *
 * The core "do this now" section of the Exam Plan dashboard.
 * Shows 3–5 ordered study blocks derived from the adaptive planner.
 *
 * Each StudyBlockCard includes: numbered step, kind icon, title, reason, effort, CTA.
 *
 * Surfaces: alternating --surface-soft-a / b / c per block, with accent borders.
 *
 * Reuses the NextAction type from the adaptive recommendations engine.
 * Delegates heavy block rendering to a lean inline component —
 * the existing DailyStudyPlanCard covers the coach page; this section
 * has a richer section header and a stronger action-first layout.
 */

import Link from "next/link";
import type { AdaptiveLearnerRecommendations, NextAction } from "@/lib/learner/adaptive-recommendations";

// ── Kind metadata ─────────────────────────────────────────────────────────────

const KIND_META: Record<NextAction["kind"], { label: string; accent: string; effortLabel: string }> = {
  lesson: { label: "Lesson", accent: "var(--semantic-info)", effortLabel: "~15–20 min" },
  quiz: { label: "Practice", accent: "var(--semantic-brand)", effortLabel: "~10–15 min" },
  mock: { label: "Mock exam", accent: "var(--semantic-warning)", effortLabel: "~30–60 min" },
  cat: { label: "Adaptive CAT", accent: "var(--semantic-warning)", effortLabel: "~30–45 min" },
  review: { label: "Smart review", accent: "var(--semantic-success)", effortLabel: "~10 min" },
  continue: { label: "Continue", accent: "var(--semantic-info)", effortLabel: "~15 min" },
  settings: { label: "Settings", accent: "var(--semantic-text-muted)", effortLabel: "~2 min" },
  exams: { label: "Exams", accent: "var(--semantic-brand)", effortLabel: "~5 min" },
};

const BLOCK_SURFACES = [
  "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 4%, var(--bg-page)))",
  "var(--surface-soft-b, color-mix(in srgb, var(--theme-secondary, var(--theme-primary)) 5%, var(--bg-page)))",
  "var(--surface-soft-c, color-mix(in srgb, var(--theme-accent, var(--theme-primary)) 5%, var(--bg-page)))",
];

// ── Study block card ──────────────────────────────────────────────────────────

function StudyBlockCard({
  action,
  index,
  isPrimary,
}: {
  action: NextAction;
  index: number;
  isPrimary: boolean;
}) {
  const meta = KIND_META[action.kind] ?? KIND_META.quiz;
  const surface = BLOCK_SURFACES[index % BLOCK_SURFACES.length]!;
  const accent = meta.accent;

  return (
    <li
      className="flex items-start gap-4 rounded-2xl p-5 transition-opacity"
      style={{
        background: surface,
        border: `1px solid color-mix(in srgb, ${accent} 15%, transparent)`,
      }}
    >
      {/* Step number */}
      <div className="flex shrink-0 flex-col items-center gap-1.5 pt-0.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
          style={{
            background: `color-mix(in srgb, ${accent} 12%, var(--semantic-surface))`,
            color: accent,
          }}
        >
          {index + 1}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{
              background: `color-mix(in srgb, ${accent} 10%, var(--semantic-surface))`,
              color: accent,
              border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
            }}
          >
            {meta.label}
          </span>
          {isPrimary && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
                color: "var(--semantic-brand)",
                border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
              }}
            >
              Start here
            </span>
          )}
        </div>

        <p className="text-sm font-bold" style={{ color: "var(--semantic-text-primary)" }}>
          {action.title}
        </p>

        {action.reason && (
          <p className="text-xs leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
            {action.reason}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Link
            href={action.href}
            className="inline-flex rounded-full px-4 py-1.5 text-xs font-semibold transition hover:opacity-90"
            style={{
              background: `color-mix(in srgb, ${accent} 12%, var(--semantic-surface))`,
              color: accent,
              border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
            }}
          >
            {isPrimary ? "Start now" : "Go"}
          </Link>
          <span className="text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
            {meta.effortLabel}
          </span>
        </div>
      </div>
    </li>
  );
}

// ── Today's plan section ──────────────────────────────────────────────────────

export function TodaysPlanSection({
  adaptive,
}: {
  adaptive: AdaptiveLearnerRecommendations;
}) {
  const blocks: NextAction[] = [
    adaptive.primaryNext,
    ...adaptive.secondary.slice(0, 4),
  ].filter(Boolean);

  return (
    <section id="today-plan" aria-labelledby="today-plan-heading">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2
            id="today-plan-heading"
            className="text-lg font-bold"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            Your Plan for Today
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: "var(--semantic-text-muted)" }}>
            Follow these steps in order to maximize today&apos;s study impact.
          </p>
        </div>
      </div>

      {blocks.length > 0 ? (
        <ol className="space-y-3">
          {blocks.map((block, i) => (
            <StudyBlockCard key={`${block.kind}-${i}`} action={block} index={i} isPrimary={i === 0} />
          ))}
        </ol>
      ) : (
        /* Fallback: text-based focus lines */
        <ul className="space-y-2">
          {adaptive.todayFocus.slice(0, 4).map((line, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{
                background: BLOCK_SURFACES[i % BLOCK_SURFACES.length],
                border: "1px solid var(--semantic-border-soft)",
              }}
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{
                  background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
                  color: "var(--semantic-brand)",
                }}
              >
                {i + 1}
              </span>
              <p className="text-sm" style={{ color: "var(--semantic-text-primary)" }}>{line}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
