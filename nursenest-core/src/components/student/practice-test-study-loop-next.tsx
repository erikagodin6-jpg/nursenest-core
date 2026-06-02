"use client";

import Link from "next/link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { buildAppTopicDrillHref, practiceTestsWeakFocusHref } from "@/lib/learner/study-loop-recommendations";
import { readinessTierLabel } from "@/lib/lessons/lesson-content-readiness";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";

type Props = {
  results: PracticeTestResultsJson;
  pathwayId: string | null;
  /** Coach snapshot — provides readinessTier and lessonContentSignal. Optional for legacy sessions. */
  coach?: CatResultsCoachSnapshot | null;
};

type StudyStep = {
  step: number;
  label: string;
  description: string;
  href: string;
  primary?: boolean;
  badge?: string;
};

function buildStudySteps(args: {
  results: PracticeTestResultsJson;
  pathwayId: string | null;
  readinessTier: "at_risk" | "borderline" | "likely_pass" | "unknown";
  lessonPrimaryReady: boolean;
  lessonPartialAvailable: boolean;
  primaryWeak: string | null;
}): StudyStep[] {
  const { results, pathwayId, readinessTier, lessonPrimaryReady, lessonPartialAvailable, primaryWeak } = args;

  const drillHref = primaryWeak
    ? buildAppTopicDrillHref({ topic: primaryWeak, topicCode: null, pathwayId })
    : `/app/questions${pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : ""}`;
  const flashcardsHref = `/app/flashcards${pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : ""}`;
  const lessonsHref = `/app/lessons${pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : ""}`;
  const retestHref = practiceTestsWeakFocusHref(pathwayId);

  const weakLabel = primaryWeak ? ` — ${primaryWeak}` : "";

  if (readinessTier === "at_risk") {
    // Priority: questions → flashcards → lessons (only if complete) → retest
    const steps: StudyStep[] = [
      {
        step: 1,
        label: "Practice questions in weak areas",
        description: `Targeted drills on your lowest-scoring topics build faster than re-reading${weakLabel}.`,
        href: drillHref,
        primary: true,
      },
      {
        step: 2,
        label: "Flashcard reinforcement",
        description: "Short, spaced repetition on weak concepts between longer study blocks.",
        href: flashcardsHref,
      },
    ];
    if (lessonPrimaryReady) {
      steps.push({
        step: 3,
        label: "Review lesson content",
        description: "Lessons are ready to read — use them to solidify your understanding of specific topics.",
        href: lessonsHref,
      });
    } else if (lessonPartialAvailable) {
      steps.push({
        step: 3,
        label: "Browse available lessons",
        description: "Some lesson content is available. Use as a light supplement — questions remain your primary tool.",
        href: lessonsHref,
        badge: "Limited content",
      });
    }
    steps.push({
      step: steps.length + 1,
      label: "Retake adaptive CAT",
      description: "After focused study, rerun the adaptive session to measure real progress.",
      href: retestHref,
    });
    return steps;
  }

  if (readinessTier === "borderline") {
    // Mix: questions + lessons (if available) + flashcards + retest
    const steps: StudyStep[] = [
      {
        step: 1,
        label: "Practice questions on weak topics",
        description: `Focus on your borderline areas to push past the passing threshold${weakLabel}.`,
        href: drillHref,
        primary: true,
      },
    ];
    if (lessonPrimaryReady) {
      steps.push({
        step: 2,
        label: "Review lessons for weak areas",
        description: "Structured lesson content can close conceptual gaps before your next CAT.",
        href: lessonsHref,
      });
      steps.push({ step: 3, label: "Flashcard review", description: "Reinforce key facts between question sessions.", href: flashcardsHref });
    } else {
      steps.push({ step: 2, label: "Flashcard review", description: "Reinforce key terms and decision rules.", href: flashcardsHref });
      if (lessonPartialAvailable) {
        steps.push({
          step: 3,
          label: "Browse lesson previews",
          description: "Partial lesson content is available as a study supplement.",
          href: lessonsHref,
          badge: "Content expanding",
        });
      }
    }
    steps.push({
      step: steps.length + 1,
      label: "Retake adaptive CAT",
      description: "Run another adaptive session after this study block to confirm your trend.",
      href: retestHref,
    });
    return steps;
  }

  if (readinessTier === "likely_pass") {
    // Reinforce weak areas, mixed questions, optional lesson review, retest to confirm
    const steps: StudyStep[] = [
      {
        step: 1,
        label: "Reinforce weak areas with questions",
        description: `Keep weak topics sharp — even small gaps matter on exam day${weakLabel}.`,
        href: drillHref,
        primary: true,
      },
      {
        step: 2,
        label: "Mixed question session",
        description: "Broad practice across all categories to maintain readiness across the blueprint.",
        href: `/app/questions${pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : ""}`,
      },
    ];
    if (lessonPrimaryReady) {
      steps.push({
        step: 3,
        label: "Optional: lesson review",
        description: "Use lessons to deepen understanding in any area that still feels uncertain.",
        href: lessonsHref,
      });
    }
    steps.push({
      step: steps.length + 1,
      label: "Confirm with another CAT",
      description: "Consistency across multiple sessions is the strongest readiness signal.",
      href: retestHref,
    });
    return steps;
  }

  // Unknown / fallback: safe default — questions first, then lessons if ready
  const steps: StudyStep[] = [
    {
      step: 1,
      label: "Practice targeted questions",
      description: "Questions on weak topics are the highest-yield study activity after any CAT.",
      href: drillHref,
      primary: true,
    },
  ];
  if (lessonPrimaryReady) {
    steps.push({ step: 2, label: "Review lessons", description: "Lesson content is ready for topic review.", href: lessonsHref });
  }
  steps.push({
    step: steps.length + 1,
    label: "Retake adaptive CAT",
    description: "Run another adaptive session to track your progress.",
    href: retestHref,
  });
  return steps;
}

const TIER_COLORS: Record<string, string> = {
  at_risk: "bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger)] border-[color-mix(in_srgb,var(--semantic-danger)_30%,transparent)]",
  borderline: "bg-[var(--semantic-warning-soft)] text-[var(--semantic-warning)] border-[color-mix(in_srgb,var(--semantic-warning)_30%,transparent)]",
  likely_pass: "bg-[var(--semantic-success-soft)] text-[var(--semantic-success)] border-[color-mix(in_srgb,var(--semantic-success)_30%,transparent)]",
  unknown: "bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-muted)] border-[var(--semantic-border-soft)]",
};

/**
 * After CAT / practice test: readiness snapshot + content-aware ordered study plan.
 *
 * Steps are ordered by readiness tier (At Risk → questions-first; Likely Pass → reinforce + confirm).
 * Lesson links are surfaced only when lesson content is ready to be a meaningful resource.
 */
export function PracticeTestStudyLoopNext({ results, pathwayId, coach }: Props) {
  const { t } = useMarketingI18n();

  const readinessTier = coach?.readinessTier ?? "unknown";
  const lessonPrimaryReady = coach?.lessonContentSignal?.lessonPrimaryReady ?? false;
  const lessonPartialAvailable = coach?.lessonContentSignal?.lessonPartialAvailable ?? false;
  const primaryWeak = results.weakAreas[0]?.trim() ?? null;

  const steps = buildStudySteps({
    results,
    pathwayId,
    readinessTier,
    lessonPrimaryReady,
    lessonPartialAvailable,
    primaryWeak,
  });

  const tierColor = TIER_COLORS[readinessTier] ?? TIER_COLORS.unknown;
  const tierLabel = readinessTierLabel(readinessTier);

  return (
    <div className="nn-study-loop-outer p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {t("learner.studyLoop.afterCatTitle")}
        </p>
        {readinessTier !== "unknown" && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${tierColor}`}
          >
            {tierLabel}
          </span>
        )}
      </div>

      {results.readinessLabel != null ? (
        <p className="mb-1 text-sm text-foreground">
          <span className="font-semibold">{t("learner.studyLoop.readinessLabel")}</span>{" "}
          {results.readinessLabel}
        </p>
      ) : null}

      {!lessonPrimaryReady && (
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          Practice questions and flashcards are your primary resources right now — lesson content is being
          expanded and will automatically become a primary recommendation as it reaches full depth.
        </p>
      )}

      <ol className="mt-3 space-y-3">
        {steps.map((step) => (
          <li key={step.step} className="rounded-xl border border-[var(--semantic-border-soft)] bg-background/70 px-4 py-3">
            <div className="flex flex-wrap items-start gap-3">
              <span className="mt-0.5 shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                {step.step}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={step.href}
                    className={`text-sm font-semibold underline-offset-2 hover:underline ${
                      step.primary ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </Link>
                  {step.badge && (
                    <span className="rounded-full border border-[var(--semantic-warning)]/30 bg-[var(--semantic-warning-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-warning)]">
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/app/account/readiness"
          className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-muted/80"
        >
          {t("learner.studyLoop.fullReadiness")}
        </Link>
        <Link
          href="/app/questions"
          className="inline-flex rounded-full bg-role-cta px-4 py-2 text-xs font-semibold text-role-cta-foreground"
        >
          {t("learner.studyLoop.backToBank")}
        </Link>
      </div>
    </div>
  );
}
