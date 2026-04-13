import Link from "next/link";
import { Activity, BarChart3, LineChart, Sparkles, Target, Timer } from "lucide-react";
import { CatResultsCoachSection } from "@/components/student/cat-results-coach-section";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import {
  remediationCatPracticeHref,
  remediationLessonsTopicHref,
  remediationTopicDrillHref,
} from "@/lib/learner/remediation-links";
import { TrackedStudyLoopCatLink } from "@/components/student/tracked-study-loop-cat-link";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import type { BenchmarkServiceResult } from "@/lib/study/benchmarking/benchmark-service";
import { PracticeBenchmarkBlock } from "@/components/study/practice-benchmark-block";
import { LearnerSurface } from "@/components/learner-ui/learner-surface";
import { PracticeSessionReportHero, type LearnerReportOutcomeTile } from "@/components/student/learner-report-card-primitives";

export type PracticeTestWeakFollowUpCopy = {
  weakTitle: string;
  weakHint: string;
  reviewLessons: string;
  topicDrill: string;
  suggestedFollowUp: string;
  retestWeak: string;
  adaptiveSamePathway: string;
};

export type PracticeTestIncorrectReviewItem = {
  id: string;
  stemPreview: string;
  topic: string | null;
};

function humanizeKey(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function difficultyTrendHint(label: "rising" | "falling" | "mixed" | "flat"): string {
  switch (label) {
    case "rising":
      return "Difficulty ramps up — typical when the CAT is probing your ceiling.";
    case "falling":
      return "Difficulty eases — the run may be stabilizing or shifting content mix.";
    case "mixed":
      return "Difficulty moves up and down — mixed domains or adaptive refocus.";
    default:
      return "Difficulty stays level across most of the run.";
  }
}

function topicExtremes(byTopic: PracticeTestResultsJson["byTopic"], weakest: boolean): { label: string; pct: number }[] {
  return Object.entries(byTopic)
    .map(([topic, { correct, total }]) => ({
      label: topic,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => (weakest ? a.pct - b.pct : b.pct - a.pct))
    .slice(0, 3);
}

function outcomeTilesForPractice(args: {
  cat: boolean;
  results: PracticeTestResultsJson;
}): LearnerReportOutcomeTile[] {
  const { cat, results } = args;
  const coach = results.catCoach;

  if (cat && results.catReport) {
    const rep = results.catReport;
    const trail = humanizeKey(rep.trajectory);
    const stability = coach?.stabilityTrendLabel ? humanizeKey(coach.stabilityTrendLabel) : "—";
    const strengthList =
      coach?.strongestDomains?.filter(Boolean).slice(0, 2).join(" · ") ||
      rep.categoryBreakdown
        .filter((c) => c.strength === "strong")
        .map((c) => c.category)
        .slice(0, 2)
        .join(" · ") ||
      "—";
    const weakHead = results.weakAreas[0] ?? rep.weakAreas[0] ?? "—";
    const weakHint =
      coach?.specificStudyActions?.[0] ?? rep.suggestedNextSteps?.[0] ?? coach?.keyRiskFactor ?? "Review weak domains below, then rerun CAT.";

    return [
      {
        icon: LineChart,
        label: "Trend",
        value: trail,
        hint: rep.readinessHeadline,
        accent: "c1",
      },
      {
        icon: Activity,
        label: "Session arc",
        value: stability,
        hint: coach?.stabilityInterpretation ?? "Ability trend describes movement within this session only.",
        accent: "c2",
      },
      {
        icon: Sparkles,
        label: "Strengths",
        value: strengthList,
        hint: coach ? difficultyTrendHint(coach.difficultyTrendLabel) : "Domain strengths from this adaptive run.",
        accent: "c3",
      },
      {
        icon: Target,
        label: "Focus next",
        value: weakHead,
        hint: weakHint,
        accent: "c4",
      },
    ];
  }

  const extremesHigh = topicExtremes(results.byTopic, false);
  const extremesLow = topicExtremes(results.byTopic, true);
  const incorrect = Math.max(0, results.scoreTotal - results.scoreCorrect);
  return [
    {
      icon: LineChart,
      label: "Score",
      value: `${results.accuracyPct}%`,
      hint: `${results.scoreCorrect} correct · ${incorrect} missed (${results.scoreTotal} items)`,
      accent: "c1",
    },
    {
      icon: BarChart3,
      label: "Topic spread",
      value: `${Object.keys(results.byTopic).length}`,
      hint:
        extremesHigh.length > 0
          ? `Bright spots: ${extremesHigh
              .map((x) => `${x.label} (${x.pct}%)`)
              .slice(0, 2)
              .join(" · ")}`
          : "No per-topic breakdown for this run.",
      accent: "c2",
    },
    {
      icon: Target,
      label: "Toughest area",
      value: extremesLow[0]?.label ?? "—",
      hint:
        extremesLow[0] != null
          ? `${extremesLow[0].pct}% accuracy in this topic bucket`
          : "Keep drilling mixed sets to surface weak themes.",
      accent: "c3",
    },
    {
      icon: Timer,
      label: "Pacing",
      value: `${results.scoreTotal} items`,
      hint: "Fixed-length practice — compare time on task in your full review.",
      accent: "c4",
    },
  ];
}

/**
 * Server-rendered results summary for bookmarkable `/app/practice-tests/[id]/results`.
 * Full teaching review and notes remain on the main run page.
 */
export function PracticeTestResultsStatic({
  testId,
  title,
  results,
  config,
  completedAtLabel,
  incorrectReviewItems = [],
  sessionInsightStruggle = null,
  sessionInsightFocus = null,
  weakFollowUpCopy = null,
  benchmarkResult = null,
}: {
  testId: string;
  title: string | null;
  results: PracticeTestResultsJson;
  config: PracticeTestConfigJson | null;
  completedAtLabel: string;
  incorrectReviewItems?: PracticeTestIncorrectReviewItem[];
  /** Pre-resolved i18n from the results page (grounded in this run’s weak areas). */
  sessionInsightStruggle?: string | null;
  sessionInsightFocus?: string | null;
  /** Labels for weak-topic remediation links (from `t()` on the results page). */
  weakFollowUpCopy?: PracticeTestWeakFollowUpCopy | null;
  /** Pathway-aware benchmark result. Null when not enough cohort data yet. */
  benchmarkResult?: BenchmarkServiceResult | null;
}) {
  const cat = config?.selectionMode === "cat";
  const incorrect = Math.max(0, results.scoreTotal - results.scoreCorrect);
  const feedbackMode = results.catExamFeedbackMode ?? config?.catExamFeedbackMode;
  const badges = cat
    ? [
        { label: "CAT", tone: "brand" as const },
        ...(feedbackMode === "study"
          ? ([{ label: "Study mode", tone: "info" as const }] as const)
          : feedbackMode === "test"
            ? ([{ label: "Test mode", tone: "info" as const }] as const)
            : []),
      ]
    : [{ label: "Practice test", tone: "muted" as const }];

  const statTiles = outcomeTilesForPractice({ cat, results });

  const heroFootnote = (
    <div className="space-y-3 leading-relaxed">
      {cat && feedbackMode === "study" ? (
        <p>
          Study mode — rationales after each item. In-session rationale steps recorded:{" "}
          <span className="font-medium text-[var(--semantic-text-primary)]">
            {typeof results.catStudyRationaleSteps === "number" ? results.catStudyRationaleSteps : "—"}
          </span>
          .
        </p>
      ) : null}
      {cat && feedbackMode === "test" ? <p>Test mode — rationales held until the end of this CAT run.</p> : null}
      {results.readinessLabel != null ? (
        <p className="font-medium text-[var(--semantic-text-primary)]">Readiness label: {results.readinessLabel}</p>
      ) : null}
      {results.catReport ? (
        <p>
          Classification{" "}
          <span className="font-semibold capitalize text-[var(--semantic-text-primary)]">{results.catReport.decision}</span>
          {results.catReport.stoppedReason !== "completed" ? (
            <>
              {" "}
              · Stopped {humanizeKey(results.catReport.stoppedReason)}
            </>
          ) : null}
          {" "}
          · {results.catReport.totalQuestions} adaptive items graded
        </p>
      ) : null}
    </div>
  );

  const firstStudyNext = results.catCoach?.studyNext?.[0];
  const firstStudyLink = firstStudyNext?.links?.[0];

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      <PracticeSessionReportHero
        eyebrow="Session report"
        title={title?.trim() || (cat ? "Adaptive (CAT) practice" : "Practice test")}
        subtitle={`Completed ${completedAtLabel}`}
        badges={badges}
        scoreLabel="Outcome"
        scorePrimary={`${results.scoreCorrect}/${results.scoreTotal}`}
        scoreSecondary={`${results.accuracyPct}% accuracy · ${incorrect} missed`}
        footnote={heroFootnote}
        statTiles={statTiles}
      />

      {firstStudyLink ? (
        <LearnerSurface
          tone="success"
          padding="lg"
          radius="lg"
          accentTop
          className="border-[color-mix(in_srgb,var(--semantic-success)_26%,var(--semantic-border-soft))] shadow-[var(--semantic-shadow-soft)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--semantic-success)]">Recommended next step</p>
          <p className="mt-3 text-sm font-semibold text-[var(--semantic-text-primary)]">{firstStudyNext.title}</p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--semantic-text-muted)]">{firstStudyNext.reason}</p>
          <Link
            href={firstStudyLink.href}
            className="mt-5 inline-flex w-fit rounded-full bg-role-cta px-4 py-2 text-xs font-semibold text-role-cta-foreground shadow-sm transition hover:opacity-95"
          >
            {firstStudyLink.label}
          </Link>
        </LearnerSurface>
      ) : results.weakAreas[0] && config?.pathwayId != null ? (
        <LearnerSurface tone="warm" padding="lg" radius="lg" accentTop className="shadow-[var(--semantic-shadow-soft)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--semantic-warning)]">Recommended next step</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-primary)]">
            Drill your weakest tagged area, then review rationales on the test page.
          </p>
          <Link
            href={remediationTopicDrillHref(results.weakAreas[0], config.pathwayId)}
            className="mt-5 inline-flex w-fit rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-warm)_35%,var(--semantic-surface))]"
          >
            Open targeted questions for {results.weakAreas[0]}
          </Link>
        </LearnerSurface>
      ) : null}

      {cat && results.catReport ? (
        <CatResultsCoachSection
          coach={results.catCoach}
          catExamFeedbackMode={results.catExamFeedbackMode ?? config?.catExamFeedbackMode ?? null}
          pathwayId={config?.pathwayId ?? null}
        />
      ) : null}

      {sessionInsightStruggle || sessionInsightFocus ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_32%,var(--semantic-surface))] px-6 py-5 shadow-[var(--semantic-shadow-soft)]">
          {sessionInsightStruggle ? (
            <p className="text-sm leading-relaxed text-[var(--semantic-text-primary)]">{sessionInsightStruggle}</p>
          ) : null}
          {sessionInsightFocus ? (
            <p className={`text-sm leading-relaxed text-[var(--semantic-text-muted)] ${sessionInsightStruggle ? "mt-3" : ""}`}>
              {sessionInsightFocus}
            </p>
          ) : null}
        </div>
      ) : null}

      {Object.keys(results.byTopic).length > 0 ? (
        <div className="nn-panel-chart-fade rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-6 sm:p-7 shadow-[var(--semantic-shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)]">
              <BarChart3 className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden strokeWidth={2} />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--semantic-text-secondary)]">Topic breakdown</h3>
          </div>
          <ul className="mt-6 space-y-5">
            {Object.entries(results.byTopic).map(([topic, { correct, total }]) => {
              const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
              return (
                <li key={topic} className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_75%,transparent)] bg-[color-mix(in_srgb,var(--semantic-surface)_70%,transparent)] px-3 py-3">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0 font-medium text-[var(--semantic-text-primary)]">{topic}</span>
                    <span className="shrink-0 tabular-nums text-[var(--semantic-text-muted)]">
                      {correct}/{total} ({pct}%)
                    </span>
                  </div>
                  <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-3" role="presentation">
                    <div
                      className={`h-full rounded-full ${semanticFillClassForAccuracyPct(pct)} nn-progress-fill-reveal transition-[width] duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {results.weakAreas.length > 0 && weakFollowUpCopy ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning-soft)_88%,var(--semantic-surface))] p-6 sm:p-7 shadow-[var(--semantic-shadow-soft)]">
          <h3 className="text-base font-semibold tracking-tight text-[var(--semantic-text-primary)]">{weakFollowUpCopy.weakTitle}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-muted)]">{weakFollowUpCopy.weakHint}</p>
          <ul className="mt-6 space-y-4 text-sm">
            {results.weakAreas.map((w) => (
              <li key={w} className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,transparent)] bg-[var(--semantic-surface)] px-4 py-4 shadow-[var(--semantic-shadow-soft)]">
                <p className="font-medium text-[var(--semantic-text-primary)]">{w}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href={remediationLessonsTopicHref(w, null, config?.pathwayId ?? null)}
                    className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))]"
                  >
                    {weakFollowUpCopy.reviewLessons}
                  </Link>
                  <Link
                    href={remediationTopicDrillHref(w, config?.pathwayId ?? null)}
                    className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-info)] hover:opacity-95"
                  >
                    {weakFollowUpCopy.topicDrill}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {weakFollowUpCopy.suggestedFollowUp}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <TrackedStudyLoopCatLink
              href={remediationCatPracticeHref(results.weakAreas[0], config?.pathwayId ?? null)}
              sourceSurface="practice_test_results_retest_weak"
              pathwayId={config?.pathwayId ?? null}
              className="inline-flex rounded-full bg-role-cta px-4 py-2 text-xs font-semibold text-role-cta-foreground shadow-sm hover:opacity-95"
            >
              {weakFollowUpCopy.retestWeak}
            </TrackedStudyLoopCatLink>
            {config?.pathwayId ? (
              <TrackedStudyLoopCatLink
                href={resolveStudyLoopCatHref({
                  authState: "signed_in",
                  pathwayId: config.pathwayId,
                  intent: "start",
                })}
                sourceSurface="practice_test_results_same_pathway"
                pathwayId={config.pathwayId}
                className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
              >
                {weakFollowUpCopy.adaptiveSamePathway}
              </TrackedStudyLoopCatLink>
            ) : null}
          </div>
        </div>
      ) : null}

      {incorrectReviewItems.length > 0 ? (
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_25%,var(--semantic-surface))] p-6 sm:p-7 shadow-[var(--semantic-shadow-soft)]">
          <h3 className="text-base font-semibold tracking-tight text-[var(--semantic-text-primary)]">Missed items</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-muted)]">
            Short previews from your session. Open the test page for full rationales and teaching review.
          </p>
          <ul className="mt-6 space-y-5 text-sm">
            {incorrectReviewItems.map((item) => (
              <li key={item.id} className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pb-5 last:border-0 last:pb-0">
                <p className="text-[var(--semantic-text-primary)]">{item.stemPreview}</p>
                <p className="mt-1.5 text-xs text-[var(--semantic-text-muted)]">
                  {item.topic ? (
                    <>
                      Topic:{" "}
                      <Link
                        className="font-medium text-[var(--semantic-brand)] underline underline-offset-2"
                        href={remediationTopicDrillHref(item.topic, config?.pathwayId ?? null)}
                      >
                        {item.topic}
                      </Link>
                    </>
                  ) : (
                    "Topic not tagged"
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : results.incorrectQuestionIds && results.incorrectQuestionIds.length > 0 ? (
        <div className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--semantic-text-muted)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--semantic-surface))] p-6 sm:p-7">
          <h3 className="text-base font-semibold tracking-tight text-[var(--semantic-text-primary)]">Missed items</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--semantic-text-muted)]">
            {results.incorrectQuestionIds.length} question(s) marked incorrect. Open the test page for full review.
          </p>
          <Link
            href={`/app/practice-tests/${testId}`}
            className="mt-5 inline-flex w-fit rounded-full bg-role-cta px-4 py-2 text-xs font-semibold text-role-cta-foreground shadow-sm transition hover:opacity-95"
          >
            Open full review on test page
          </Link>
        </div>
      ) : null}

      {benchmarkResult != null ? (
        <PracticeBenchmarkBlock
          benchmark={benchmarkResult}
          mode={cat ? "cat" : "practice"}
        />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={`/app/practice-tests/${testId}`}
          className="inline-flex justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-sm transition hover:opacity-95"
        >
          Open full review on test page
        </Link>
        <Link
          href="/app/practice-tests"
          className="inline-flex justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-info))] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[var(--semantic-panel-cool)]"
        >
          Practice tests home
        </Link>
      </div>
    </div>
  );
}
