import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { CatResultsCoachPanel } from "@/components/student/cat-results-coach-panel";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import {
  remediationLessonsTopicHref,
  remediationTopicDrillHref,
  remediationWeakModeTestHref,
} from "@/lib/learner/remediation-links";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";

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
}) {
  const cat = config?.selectionMode === "cat";
  const incorrect = Math.max(0, results.scoreTotal - results.scoreCorrect);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Results</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--semantic-text-primary)]">
          {title?.trim() || (cat ? "Adaptive (CAT) practice" : "Practice test")}
        </h2>
        <p className="mt-1 text-sm text-[var(--semantic-text-muted)]">Completed {completedAtLabel}</p>
        {cat && (results.catExamFeedbackMode ?? config?.catExamFeedbackMode) === "study" ? (
          <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">
            Study Mode — you could review explanations after each item. In-session rationale steps recorded:{" "}
            <span className="font-medium text-[var(--semantic-text-primary)]">
              {typeof results.catStudyRationaleSteps === "number" ? results.catStudyRationaleSteps : "—"}
            </span>
            .
          </p>
        ) : cat && (results.catExamFeedbackMode ?? config?.catExamFeedbackMode) === "test" ? (
          <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">
            Test Mode — rationales were held until after completion for this CAT run.
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Score</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
              {results.scoreCorrect}/{results.scoreTotal}
            </p>
            <p className="text-sm font-medium text-[var(--semantic-brand)]">{results.accuracyPct}% accuracy</p>
          </div>
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Correct</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--role-success-text)]">{results.scoreCorrect}</p>
          </div>
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Incorrect</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">{incorrect}</p>
          </div>
        </div>

        {results.readinessLabel != null ? (
          <p className="mt-5 text-lg font-semibold text-[var(--semantic-text-primary)]">
            Readiness: {results.readinessLabel}
          </p>
        ) : null}
        {results.catReport ? (
          <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">
            Classification:{" "}
            <span className="font-semibold capitalize text-[var(--semantic-text-primary)]">{results.catReport.decision}</span>
            {results.catReport.stoppedReason !== "completed" ? (
              <>
                {" "}
                · Stopped:{" "}
                <span className="text-[var(--semantic-text-primary)]">
                  {results.catReport.stoppedReason.replace(/_/g, " ")}
                </span>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      {cat && results.catReport ? (
        <CatResultsCoachPanel
          coach={results.catCoach}
          catExamFeedbackMode={results.catExamFeedbackMode ?? config?.catExamFeedbackMode ?? null}
          pathwayId={config?.pathwayId ?? null}
        />
      ) : null}

      {sessionInsightStruggle || sessionInsightFocus ? (
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] px-5 py-4 shadow-sm">
          {sessionInsightStruggle ? (
            <p className="text-sm text-[var(--semantic-text-primary)]">{sessionInsightStruggle}</p>
          ) : null}
          {sessionInsightFocus ? (
            <p className={`text-sm text-[var(--semantic-text-muted)] ${sessionInsightStruggle ? "mt-2" : ""}`}>
              {sessionInsightFocus}
            </p>
          ) : null}
        </div>
      ) : null}

      {Object.keys(results.byTopic).length > 0 ? (
        <div className="nn-panel-chart-fade rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)]">
              <BarChart3 className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden strokeWidth={2} />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Topic breakdown</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {Object.entries(results.byTopic).map(([topic, { correct, total }]) => {
              const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
              return (
                <li key={topic}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="font-medium text-[var(--semantic-text-primary)]">{topic}</span>
                    <span className="shrink-0 tabular-nums text-[var(--semantic-text-muted)]">
                      {correct}/{total} ({pct}%)
                    </span>
                  </div>
                  <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2" role="presentation">
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
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] p-6 shadow-sm">
          <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{weakFollowUpCopy.weakTitle}</h3>
          <p className="mt-1 text-sm text-[var(--semantic-text-muted)]">{weakFollowUpCopy.weakHint}</p>
          <ul className="mt-4 space-y-4 text-sm">
            {results.weakAreas.map((w) => (
              <li key={w} className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] bg-[var(--semantic-surface)] px-3 py-3">
                <p className="font-medium text-[var(--semantic-text-primary)]">{w}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href={remediationLessonsTopicHref(w)}
                    className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))]"
                  >
                    {weakFollowUpCopy.reviewLessons}
                  </Link>
                  <Link
                    href={remediationTopicDrillHref(w)}
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
            <Link
              href={remediationWeakModeTestHref(results.weakAreas[0])}
              className="inline-flex rounded-full bg-role-cta px-4 py-2 text-xs font-semibold text-role-cta-foreground shadow-sm hover:opacity-95"
            >
              {weakFollowUpCopy.retestWeak}
            </Link>
            {config?.pathwayId ? (
              <Link
                href={`/app/practice-tests/start?pathwayId=${encodeURIComponent(config.pathwayId)}`}
                className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
              >
                {weakFollowUpCopy.adaptiveSamePathway}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {incorrectReviewItems.length > 0 ? (
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm">
          <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">Missed items</h3>
          <p className="mt-1 text-sm text-[var(--semantic-text-muted)]">
            Short previews from your session. Open the test page for full rationales and teaching review.
          </p>
          <ul className="mt-4 space-y-4 text-sm">
            {incorrectReviewItems.map((item) => (
              <li key={item.id} className="border-b border-[var(--semantic-border-soft)] pb-4 last:border-0 last:pb-0">
                <p className="text-[var(--semantic-text-primary)]">{item.stemPreview}</p>
                <p className="mt-1.5 text-xs text-[var(--semantic-text-muted)]">
                  {item.topic ? (
                    <>
                      Topic:{" "}
                      <Link
                        className="font-medium text-[var(--semantic-brand)] underline underline-offset-2"
                        href={remediationTopicDrillHref(item.topic)}
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
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm">
          <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">Missed items</h3>
          <p className="mt-1 text-sm text-[var(--semantic-text-muted)]">
            {results.incorrectQuestionIds.length} question(s) marked incorrect. Open the test page for full review.
          </p>
          <Link
            href={`/app/practice-tests/${testId}`}
            className="mt-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
          >
            Open full review on test page
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/app/practice-tests/${testId}`}
          className="inline-flex rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-sm transition hover:opacity-95"
        >
          Open full review on test page
        </Link>
        <Link
          href="/app/practice-tests"
          className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
        >
          Practice tests home
        </Link>
      </div>
    </div>
  );
}
