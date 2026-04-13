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

// ── Performance level config ───────────────────────────────────────────────────

type LevelConfig = {
  label: string;
  emoji: string;
  color: string;
  bg: string;
  /** One-line badge message shown under the heading. */
  message: string;
  /** Two-sentence interpretation paragraph. */
  interpretation: string;
  /** What this result means for their next step. */
  whatItMeans: string;
};

const LEVEL_CONFIG: Record<PerformanceLevel, LevelConfig> = {
  Beginner: {
    label: "Beginner",
    emoji: "🌱",
    color: "var(--semantic-warning)",
    bg: "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))",
    message: "You're at the starting line — that's exactly where this course begins.",
    interpretation:
      "Your results show gaps in foundational pre-nursing concepts, which is completely normal at this stage. Most students who work through 2–3 modules see a significant improvement on their next attempt.",
    whatItMeans:
      "Focus on the modules below before retaking. Each lesson is short and self-contained — you can work through one in 15–20 minutes.",
  },
  Developing: {
    label: "Developing",
    emoji: "📈",
    color: "var(--semantic-info)",
    bg: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
    message: "Solid foundation — you have the core concepts, now sharpen the edges.",
    interpretation:
      "You're demonstrating real knowledge across multiple pre-nursing topics, with a few areas that need reinforcement. Students at this level typically reach \"Strong\" after targeted review of their 2–3 weakest modules.",
    whatItMeans:
      "Review the weak areas listed below, then retake the adaptive exam. A second attempt usually shows a 15–25 point improvement.",
  },
  Strong: {
    label: "Strong",
    emoji: "⭐",
    color: "var(--semantic-success)",
    bg: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
    message: "Outstanding — your pre-nursing foundation is exam-ready.",
    interpretation:
      "You demonstrated strong command of pre-nursing concepts across multiple topic areas. This level of performance suggests you're ready to begin structured NCLEX or nursing school prep.",
    whatItMeans:
      "You've outgrown the basics. The next step is applying this knowledge to clinical reasoning questions — NCLEX-style practice will accelerate your readiness.",
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

const BANK_MODULE_SET = new Set([
  "anatomy-physiology", "medical-terminology", "pharmacology",
  "fluids-electrolytes", "infection-control", "pathophysiology",
  "chemistry", "nutrition-foundations", "oxygenation", "health-assessment",
]);

function WeakAreaList({
  areas,
  heading,
  showLinks = false,
}: {
  areas: PreNursingExamResult["weakAreas"];
  heading: string;
  showLinks?: boolean;
}) {
  if (areas.length === 0) return null;
  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-secondary)" }}>
        {heading}
      </h3>
      <ul className="space-y-3">
        {areas.map((a) => {
          const pct = a.accuracyPct;
          const fillCls =
            pct >= 75 ? "nn-progress-fill-semantic-success" :
            pct >= 50 ? "nn-progress-fill-semantic-info" :
            pct >= 30 ? "nn-progress-fill-semantic-warning" :
            "nn-progress-fill-semantic-danger";
          const practiceHref = BANK_MODULE_SET.has(a.moduleSlug)
            ? `/pre-nursing/practice/${a.moduleSlug}`
            : `/pre-nursing/lessons/${a.moduleSlug}`;
          return (
            <li key={a.moduleSlug} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
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
                  <div
                    className={`${fillCls} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span
                  className="w-10 shrink-0 text-right text-xs tabular-nums"
                  style={{ color: "var(--semantic-text-secondary)" }}
                >
                  {pct}%
                </span>
              </div>
              {showLinks && pct < 60 && (
                <div className="ml-[9.5rem] flex gap-3 text-xs">
                  <Link
                    href={practiceHref}
                    className="font-medium hover:underline"
                    style={{ color: "var(--semantic-info)" }}
                  >
                    Practice →
                  </Link>
                  <Link
                    href={`/pre-nursing/lessons/${a.moduleSlug}`}
                    className="font-medium hover:underline"
                    style={{ color: "var(--semantic-text-secondary)" }}
                  >
                    Review lesson
                  </Link>
                </div>
              )}
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

const CTA_COPY: Record<
  PerformanceLevel,
  { heading: string; body: string; primary: string; primaryHref: string; secondary: string; secondaryHref: string }
> = {
  Beginner: {
    heading: "The right foundation changes everything.",
    body: "NurseNest's full platform includes thousands of NCLEX-style questions, adaptive CAT exams, and structured study plans — all aligned to nursing school and beyond.",
    primary: "Create a free account",
    primaryHref: "/signup",
    secondary: "See what's included",
    secondaryHref: "/pricing",
  },
  Developing: {
    heading: "You're closer than you think.",
    body: "Upgrade to the full NurseNest platform to access a complete NCLEX question bank, targeted flashcard decks, and a full readiness CAT exam that tracks your progress over time.",
    primary: "Start free — no card needed",
    primaryHref: "/signup",
    secondary: "Browse flashcard decks",
    secondaryHref: "/flashcards",
  },
  Strong: {
    heading: "You're ready for the next level.",
    body: "Your pre-nursing foundation is strong. NurseNest's full NCLEX prep — 2,000+ adaptive questions, structured lessons, and a readiness CAT — is the natural next step.",
    primary: "Start NCLEX prep free",
    primaryHref: "/signup",
    secondary: "Explore the question bank",
    secondaryHref: "/question-bank",
  },
};

function ConversionCTA({ level }: { level: PerformanceLevel }) {
  const copy = CTA_COPY[level];
  return (
    <div
      className="rounded-xl border-2 p-5 sm:p-6"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-brand) 40%, transparent)",
        background: "color-mix(in srgb, var(--semantic-brand) 6%, var(--semantic-surface))",
      }}
    >
      <p className="mb-1 text-base font-bold" style={{ color: "var(--theme-heading-text)" }}>
        {copy.heading}
      </p>
      <p className="mb-4 text-sm leading-6" style={{ color: "var(--semantic-text-secondary)" }}>
        {copy.body}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={copy.primaryHref}
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "var(--role-cta, var(--semantic-brand))",
            color: "var(--role-cta-foreground, #fff)",
          }}
        >
          {copy.primary}
        </Link>
        <Link
          href={copy.secondaryHref}
          className="rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--semantic-surface-hover)]"
          style={{
            borderColor: "var(--semantic-border-soft)",
            color: "var(--theme-body-text)",
          }}
        >
          {copy.secondary}
        </Link>
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
        <p className="text-sm font-medium" style={{ color: "var(--semantic-text-secondary)" }}>
          {cfg.message}
        </p>
      </div>

      {/* Score */}
      <ScoreBar score={result.score} total={result.total} level={result.performanceLevel} />

      {/* Interpretation */}
      <div
        className="rounded-xl border-l-4 px-4 py-3 text-sm leading-6"
        style={{
          borderLeftColor: LEVEL_CONFIG[result.performanceLevel].color,
          background: LEVEL_CONFIG[result.performanceLevel].bg,
          color: "var(--theme-body-text)",
        }}
      >
        <p className="mb-1">{cfg.interpretation}</p>
        <p className="font-medium" style={{ color: "var(--theme-heading-text)" }}>{cfg.whatItMeans}</p>
      </div>

      {/* Weak areas — top 3 max, with inline links */}
      {result.weakAreas.length > 0 && (
        <WeakAreaList areas={result.weakAreas} heading="Areas to strengthen" showLinks />
      )}

      {/* Strengths — no links needed */}
      {result.strengths.length > 0 && (
        <WeakAreaList areas={result.strengths} heading="What you nailed" />
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
