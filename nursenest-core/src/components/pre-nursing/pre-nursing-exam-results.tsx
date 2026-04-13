"use client";

/**
 * Pre-Nursing Exam Results — shared result display for both mini CAT and practice exams.
 *
 * Shows:
 * - Performance level badge (Beginner / Developing / Strong) with semantic color
 * - Score and accuracy bar
 * - Weak areas (what to review)
 * - Strengths (what you've mastered)
 * - Recommended next steps (lessons + flashcards + questions)
 * - Conversion CTA for full platform
 */

import Link from "next/link";
import type { PreNursingExamResult, PerformanceLevel } from "@/lib/pre-nursing/pre-nursing-exam-engine";

// ── Performance badge ─────────────────────────────────────────────────────────

const LEVEL_CONFIG: Record<
  PerformanceLevel,
  { label: string; emoji: string; color: string; bg: string; message: string }
> = {
  Beginner: {
    label: "Beginner",
    emoji: "🌱",
    color: "var(--semantic-warning)",
    bg: "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))",
    message: "Great start! Focus on the fundamentals — the lessons below will build your foundation.",
  },
  Developing: {
    label: "Developing",
    emoji: "📈",
    color: "var(--semantic-info)",
    bg: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
    message: "You're building solid knowledge. Review the weak areas and keep practicing.",
  },
  Strong: {
    label: "Strong",
    emoji: "⭐",
    color: "var(--semantic-success)",
    bg: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
    message: "Excellent performance! You're ready to tackle more advanced nursing content.",
  },
};

const FILL_CLASS: Record<PerformanceLevel, string> = {
  Beginner: "nn-progress-fill-semantic-warning",
  Developing: "nn-progress-fill-semantic-info",
  Strong: "nn-progress-fill-semantic-success",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function PerformanceBadge({ level }: { level: PerformanceLevel }) {
  const cfg = LEVEL_CONFIG[level];
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span>{cfg.emoji}</span>
      {cfg.label}
    </div>
  );
}

function ScoreBar({ score, total, level }: { score: number; total: number; level: PerformanceLevel }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold tabular-nums" style={{ color: "var(--theme-heading-text)" }}>
          {score}/{total}
        </span>
        <span className="text-lg font-semibold tabular-nums" style={{ color: "var(--semantic-text-secondary)" }}>
          {pct}%
        </span>
      </div>
      <div
        className="nn-progress-track-semantic h-3 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Score"
      >
        <div
          className={`${FILL_CLASS[level]} h-full rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function WeakAreaList({ areas, heading }: { areas: PreNursingExamResult["weakAreas"]; heading: string }) {
  if (areas.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-secondary)" }}>
        {heading}
      </h3>
      <ul className="space-y-1.5">
        {areas.map((a) => {
          const pct = a.accuracyPct;
          const fillCls =
            pct >= 75 ? "nn-progress-fill-semantic-success" :
            pct >= 50 ? "nn-progress-fill-semantic-info" :
            pct >= 30 ? "nn-progress-fill-semantic-warning" :
            "nn-progress-fill-semantic-danger";
          return (
            <li key={a.moduleSlug} className="flex items-center gap-3">
              <span
                className="w-36 shrink-0 truncate text-sm font-medium"
                style={{ color: "var(--theme-body-text)" }}
              >
                {a.moduleTitle}
              </span>
              <div
                className="nn-progress-track-semantic h-2 flex-1 overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={`${fillCls} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
              </div>
              <span
                className="w-10 shrink-0 text-right text-xs tabular-nums"
                style={{ color: "var(--semantic-text-secondary)" }}
              >
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NextStepsBlock({ nextSteps }: { nextSteps: PreNursingExamResult["nextSteps"] }) {
  const hasLessons = nextSteps.lessons.length > 0;
  const hasFlashcards = nextSteps.flashcards.length > 0;

  if (!hasLessons && !hasFlashcards && !nextSteps.questions) return null;

  return (
    <div
      className="rounded-xl border p-4 sm:p-5"
      style={{
        borderColor: "var(--semantic-border-soft)",
        background: "var(--semantic-panel-cool)",
      }}
    >
      <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--theme-heading-text)" }}>
        Recommended next steps
      </h3>
      <div className="space-y-3">
        {hasLessons && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-secondary)" }}>
              📖 Review these modules
            </p>
            <ul className="space-y-1">
              {nextSteps.lessons.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-medium hover:underline"
                    style={{ color: "var(--theme-link-text)" }}
                  >
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasFlashcards && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-secondary)" }}>
              🗂 Study flashcards
            </p>
            <ul className="space-y-1">
              {nextSteps.flashcards.map((f) => (
                <li key={f.href}>
                  <Link
                    href={f.href}
                    className="text-sm font-medium hover:underline"
                    style={{ color: "var(--theme-link-text)" }}
                  >
                    {f.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {nextSteps.questions && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-secondary)" }}>
              ✏️ Practice questions
            </p>
            <Link
              href={nextSteps.questions.href}
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--theme-link-text)" }}
            >
              {nextSteps.questions.title}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ConversionCTA({ level }: { level: PerformanceLevel }) {
  const isStrong = level === "Strong";
  return (
    <div
      className="rounded-xl border-2 p-5 sm:p-6"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-brand) 40%, transparent)",
        background: "color-mix(in srgb, var(--semantic-brand) 6%, var(--semantic-surface))",
      }}
    >
      <p className="mb-1 text-base font-bold" style={{ color: "var(--theme-heading-text)" }}>
        {isStrong
          ? "You're ready for nursing school prep!"
          : "Keep building — unlock full exam preparation"}
      </p>
      <p className="mb-4 text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
        {isStrong
          ? "Access the full NCLEX question bank, adaptive CAT exams, and structured study plans."
          : "Get access to thousands of practice questions, flashcards, and a full readiness CAT exam."}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/signup"
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "var(--role-cta, var(--semantic-brand))",
            color: "var(--role-cta-foreground, #fff)",
          }}
        >
          Start free — no card needed
        </Link>
        {isStrong ? (
          <Link
            href="/question-bank"
            className="rounded-full border px-5 py-2.5 text-sm font-semibold"
            style={{
              borderColor: "var(--semantic-border-soft)",
              color: "var(--theme-body-text)",
            }}
          >
            Explore question bank
          </Link>
        ) : (
          <Link
            href="/flashcards"
            className="rounded-full border px-5 py-2.5 text-sm font-semibold"
            style={{
              borderColor: "var(--semantic-border-soft)",
              color: "var(--theme-body-text)",
            }}
          >
            Browse flashcards
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  result: PreNursingExamResult;
  examLabel?: string;
  onRetry?: () => void;
};

export function PreNursingExamResults({ result, examLabel = "Exam", onRetry }: Props) {
  const cfg = LEVEL_CONFIG[result.performanceLevel];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <PerformanceBadge level={result.performanceLevel} />
        <h2 className="text-xl font-bold" style={{ color: "var(--theme-heading-text)" }}>
          {examLabel} complete
        </h2>
        <p className="text-sm leading-6" style={{ color: "var(--semantic-text-secondary)" }}>
          {cfg.message}
        </p>
      </div>

      {/* Score */}
      <ScoreBar score={result.score} total={result.total} level={result.performanceLevel} />

      {/* Areas */}
      {result.weakAreas.length > 0 && (
        <WeakAreaList areas={result.weakAreas} heading="Areas to strengthen" />
      )}
      {result.strengths.length > 0 && (
        <WeakAreaList areas={result.strengths} heading="Strong areas" />
      )}

      {/* Next steps */}
      <NextStepsBlock nextSteps={result.nextSteps} />

      {/* Retry / browse */}
      {onRetry && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--semantic-surface-hover)]"
            style={{
              borderColor: "var(--semantic-border-soft)",
              color: "var(--theme-body-text)",
            }}
          >
            Try again
          </button>
          <Link
            href="/pre-nursing/lessons"
            className="rounded-full border px-5 py-2.5 text-sm font-semibold"
            style={{
              borderColor: "var(--semantic-border-soft)",
              color: "var(--theme-body-text)",
            }}
          >
            Browse all modules
          </Link>
        </div>
      )}

      {/* Conversion CTA */}
      <ConversionCTA level={result.performanceLevel} />
    </div>
  );
}
