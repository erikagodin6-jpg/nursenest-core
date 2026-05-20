"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BAND_HELPER,
  BAND_LABELS,
  CatResultsHero,
  ReadinessBandBadge,
} from "@/components/study/cat-readiness-hero";
import { LoftSimulationResultsHero } from "@/components/study/loft-simulation-results-hero";
import { getTestingModelResultsProfile } from "@/lib/testing/testing-model-presentation";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { buildEnrichedPostExamPerformanceReport } from "@/lib/learner/post-exam-coaching/build-coaching-report";
import { persistDashboardFeedToSession } from "@/lib/learner/post-exam-coaching/dashboard-feed";
import { recordRemediationExposure } from "@/lib/learner/post-exam-coaching/remediation-exposure";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import {
  buildPostExamPerformanceReport,
  type PostExamCompetencyRow,
  type PostExamPerformanceReport,
  type PostExamQuestionOutcome,
} from "@/lib/learner/post-exam-performance-report";

function CompetencyBarRow({ row }: { row: PostExamCompetencyRow }) {
  const fillClass = semanticFillClassForAccuracyPct(row.accuracyPct);
  return (
    <div className="nn-post-exam-report__bar-row">
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="truncate text-sm font-medium text-[var(--semantic-text-primary)]" title={row.label}>
          {row.label}
        </span>
        <span className="shrink-0 text-xs tabular-nums text-[var(--semantic-text-muted)]">
          {row.correct}/{row.total} · {row.accuracyPct}%
        </span>
      </div>
      <div
        className="nn-progress-track-semantic mt-1.5 h-2 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={row.accuracyPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${row.label} accuracy ${row.accuracyPct} percent`}
      >
        <div
          className={`h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 ${fillClass}`}
          style={{ width: `${row.accuracyPct}%` }}
        />
      </div>
    </div>
  );
}

export function PostExamPerformanceReport({
  report: reportProp,
  results,
  testId,
  config,
  pathwayId,
  elapsedMs,
  timedMode,
  timeLimitSec,
  questionOutcomes,
  confidenceByQuestionId,
  learnerUserId = null,
  isEntitled = true,
  priorScore,
  onOpenTeachingReview,
  teachingReviewLoading,
  hideExamReview = false,
}: {
  /** When set (e.g. LOFT case completion), skips practice-test result assembly. */
  report?: PostExamPerformanceReport;
  results?: PracticeTestResultsJson;
  testId: string;
  config?: PracticeTestConfigJson | null;
  pathwayId?: string | null;
  elapsedMs?: number | null;
  timedMode?: boolean;
  timeLimitSec?: number | null;
  questionOutcomes?: PostExamQuestionOutcome[];
  confidenceByQuestionId?: Record<string, "low" | "medium" | "high">;
  /** Enables longitudinal coaching + remediation rotation when entitled. */
  learnerUserId?: string | null;
  isEntitled?: boolean;
  priorScore?: number | null;
  onOpenTeachingReview?: () => void;
  teachingReviewLoading?: boolean;
  hideExamReview?: boolean;
}) {
  const [coachingContext, setCoachingContext] = useState<{
    topicTrends: TopicTrendRow[];
    weakTopics: WeakTopicRow[];
    recentSessionCount: number;
  } | null>(null);

  useEffect(() => {
    if (reportProp || !isEntitled) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/learner/post-exam-coaching-context", { credentials: "include" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          topicTrends?: TopicTrendRow[];
          weakTopics?: WeakTopicRow[];
          recentSessionCount?: number;
        };
        if (!cancelled) {
          setCoachingContext({
            topicTrends: data.topicTrends ?? [],
            weakTopics: data.weakTopics ?? [],
            recentSessionCount: data.recentSessionCount ?? 0,
          });
        }
      } catch {
        /* offline */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reportProp, isEntitled]);

  const report = useMemo(() => {
    if (reportProp) return reportProp;
    if (!results) {
      throw new Error("PostExamPerformanceReport requires results or a prebuilt report");
    }
    const input = {
      results,
      config: config ?? null,
      pathwayId,
      elapsedMs,
      timedMode,
      timeLimitSec,
      questionOutcomes,
      confidenceByQuestionId,
      topicTrends: coachingContext?.topicTrends,
      weakTopicRows: coachingContext?.weakTopics,
      recentSessionCount: coachingContext?.recentSessionCount,
      remediationUserId: learnerUserId ?? null,
    };
    if (coachingContext && isEntitled) {
      return buildEnrichedPostExamPerformanceReport(input);
    }
    return buildPostExamPerformanceReport(input);
  }, [
    reportProp,
    results,
    config,
    pathwayId,
    elapsedMs,
    timedMode,
    timeLimitSec,
    questionOutcomes,
    confidenceByQuestionId,
    coachingContext,
    isEntitled,
    learnerUserId,
  ]);

  useEffect(() => {
    if (report.coaching?.dashboardFeed) {
      persistDashboardFeedToSession(report.coaching.dashboardFeed);
    }
  }, [report]);

  const lessonsHref = pathwayId ? `/app/lessons?pathway=${pathwayId}` : "/app/lessons";
  const interpretation = `${report.overall.readinessLevel}${
    report.overall.readinessResult ? ` (${report.overall.readinessResult})` : ""
  }: ${report.narrative}`;
  const presentation = getTestingModelResultsProfile(pathwayId, report.sessionKind);
  const isLoftSimulation = presentation.heroVariant === "loft_simulation";

  return (
    <div
      className={`nn-post-exam-report ${presentation.resultsSurfaceClass}`}
      data-nn-post-exam-report=""
      data-nn-post-exam-adaptive-report={presentation.postExamDataMarker === "cat" ? "" : undefined}
      data-nn-post-exam-loft-report={presentation.postExamDataMarker === "loft" ? "" : undefined}
      data-session-kind={report.sessionKind}
      data-coaching-model={report.coaching?.coachingModel ?? ""}
      data-readiness-reliability={report.coaching?.readinessReliability.level ?? ""}
    >
      {isLoftSimulation ? (
        <LoftSimulationResultsHero
          readinessLevel={report.overall.readinessLevel}
          score={report.overall.scorePct}
          band={report.readinessBand}
          interpretation={interpretation}
          simulationHubHref={presentation.simulationHubHref}
          lessonsHref={lessonsHref}
          onReviewHref={hideExamReview ? null : presentation.simulationHubHref}
          hideReviewCta={hideExamReview}
        />
      ) : (
        <CatResultsHero
          readinessLevel={
            report.overall.readinessLevel as "Likely Pass" | "Borderline" | "At Risk"
          }
          confidenceLevel={
            report.overall.confidenceLabel as "High" | "Moderate" | "Low"
          }
          passProbability={
            presentation.showPassProbability ? report.overall.passOutlookPct : null
          }
          passProbabilityBand={
            presentation.showPassProbability
              ? (report.overall.passOutlookBand as
                  | "Very likely to pass"
                  | "Likely to pass"
                  | "Borderline"
                  | "At risk"
                  | null)
              : null
          }
          score={report.overall.scorePct}
          band={report.readinessBand}
          interpretation={interpretation}
          testId={testId}
          lessonsHref={lessonsHref}
        />
      )}

      {/* Mobile-first: recommendations before dense charts */}
      <section className="nn-post-exam-report__section nn-semantic-inset--positive" aria-labelledby="post-exam-rec-heading">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
          Your clinical coach
        </p>
        <h2 id="post-exam-rec-heading" className="nn-cat-results__section-title mt-1">
          What to do next
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{report.headline}</p>
        {report.coaching?.readinessReliability ? (
          <p
            className="mt-3 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm text-[var(--semantic-text-secondary)]"
            data-nn-readiness-reliability=""
          >
            <span className="font-semibold text-[var(--semantic-text-primary)]">
              Estimate reliability ({report.coaching.readinessReliability.level}):{" "}
            </span>
            {report.coaching.readinessReliability.guidance}
          </p>
        ) : null}
        {report.coaching?.longitudinalNarratives && report.coaching.longitudinalNarratives.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm text-[var(--semantic-text-secondary)]" data-nn-longitudinal="">
            {report.coaching.longitudinalNarratives.map((line) => (
              <li key={line.slice(0, 48)} className="flex gap-2">
                <span aria-hidden className="text-[var(--semantic-info)]">
                  ↗
                </span>
                {line}
              </li>
            ))}
          </ul>
        ) : null}
        <ol className="mt-4 space-y-3">
          {report.recommendations.map((rec) => (
            <li
              key={`${rec.priority}-${rec.href}`}
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-xs font-bold text-[var(--semantic-brand)]">
                    {rec.priority}
                  </span>
                  {rec.title}
                </p>
              </div>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{rec.reason}</p>
              <Link
                href={rec.href}
                className="nn-btn-primary mt-3 inline-flex min-h-[3rem] min-w-[3rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none"
                onClick={() => {
                  const key = report.coaching?.recommendations.find(
                    (r) => r.href === rec.href,
                  )?.exposureKey;
                  if (learnerUserId && key) {
                    recordRemediationExposure(learnerUserId, {
                      exposureKey: key,
                      kind: rec.kind,
                      href: rec.href,
                    });
                  }
                }}
              >
                Start
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="nn-post-exam-report__section" aria-labelledby="post-exam-summary-heading">
        <h2 id="post-exam-summary-heading" className="nn-cat-results__section-title">
          Performance summary
        </h2>
        <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{report.examModeLabel}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryTile label="Session score" value={`${report.overall.scorePct}%`} />
          <SummaryTile
            label="Items correct"
            value={`${report.overall.correctCount} / ${report.overall.totalCount}`}
          />
          <SummaryTile label="Time" value={report.timing.elapsedLabel} />
          <SummaryTile
            label="Avg per item"
            value={
              report.timing.avgSecPerQuestion != null
                ? `${report.timing.avgSecPerQuestion}s`
                : "—"
            }
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ReadinessBandBadge band={report.readinessBand} />
          <span className="text-xs text-[var(--semantic-text-muted)]">{BAND_LABELS[report.readinessBand]}</span>
        </div>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{BAND_HELPER[report.readinessBand]}</p>
        {report.overall.trendLabel ? (
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            <span className="font-semibold text-[var(--semantic-text-primary)]">Trend: </span>
            {report.overall.trendLabel}
          </p>
        ) : null}
        {priorScore != null ? (
          <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
            Prior readiness score: {Math.round(priorScore)}% (this session: {report.overall.scorePct}%)
          </p>
        ) : null}
      </section>

      {report.strengths.length > 0 ? (
        <section className="nn-post-exam-report__section nn-semantic-inset--cool" aria-labelledby="post-exam-strengths-heading">
          <h2 id="post-exam-strengths-heading" className="nn-cat-results__section-title">
            What went well
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {report.strengths.map((s) => (
              <li
                key={s}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-3 py-1 text-xs font-semibold text-[var(--semantic-success)]"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {report.competencyGroups.map((group) => (
        <section
          key={group.title}
          className="nn-post-exam-report__section"
          aria-labelledby={`competency-${group.title.replace(/\s+/g, "-")}`}
        >
          <h2 id={`competency-${group.title.replace(/\s+/g, "-")}`} className="nn-cat-results__section-title">
            {report.coaching?.semantics.competencySectionTitle && group.title === "Clinical domains"
              ? report.coaching.semantics.competencySectionTitle
              : group.title}
          </h2>
          <div className="mt-4 space-y-3">
            {group.rows.map((row) => (
              <CompetencyBarRow key={`${group.title}-${row.label}`} row={row} />
            ))}
          </div>
        </section>
      ))}

      {report.clinicalJudgment.length > 0 ? (
        <section
          className="nn-post-exam-report__section nn-semantic-inset--warm"
          aria-labelledby="post-exam-cj-heading"
        >
          <h2 id="post-exam-cj-heading" className="nn-cat-results__section-title">
            Clinical judgment patterns
          </h2>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            Educational signals from this session — use them to target reasoning, not just content recall.
          </p>
          <ul className="mt-4 space-y-3">
            {report.clinicalJudgment.map((item) => (
              <li
                key={`${item.pattern}-${item.emphasis}`}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  {item.domain}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{item.pattern}</p>
                <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{item.guidance}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="nn-post-exam-report__section" aria-labelledby="post-exam-timing-heading">
        <h2 id="post-exam-timing-heading" className="nn-cat-results__section-title">
          {report.coaching?.semantics.timingSectionTitle ?? "Time management"}
        </h2>
        <p className="mt-2 text-sm font-semibold text-[var(--semantic-text-primary)]">{report.timing.pacingLabel}</p>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{report.timing.pacingDetail}</p>
        {report.timing.recommendations.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
            {report.timing.recommendations.map((line) => (
              <li key={line.slice(0, 60)} className="flex gap-2">
                <span aria-hidden className="text-[var(--semantic-brand)]">
                  ›
                </span>
                {line}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {!hideExamReview ? (
        <section className="nn-post-exam-report__section" aria-labelledby="post-exam-review-heading">
          <h2 id="post-exam-review-heading" className="nn-cat-results__section-title">
            Exam review
          </h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            Open item-by-item teaching review when you are ready — the summary above stays focused so you are not
            overwhelmed on first pass.
          </p>
          {onOpenTeachingReview ? (
            <button
              type="button"
              disabled={teachingReviewLoading}
              className="nn-btn-secondary mt-3 inline-flex min-h-[3rem] items-center rounded-lg px-4 text-sm font-semibold disabled:opacity-50"
              onClick={onOpenTeachingReview}
            >
              {teachingReviewLoading ? "Loading…" : "Open teaching review"}
            </button>
          ) : (
            <Link
              href={`/app/practice-tests/${testId}`}
              className="nn-btn-secondary mt-3 inline-flex min-h-[3rem] items-center rounded-lg px-4 text-sm font-semibold"
            >
              Review session items
            </Link>
          )}
        </section>
      ) : null}

      {!isEntitled ? (
        <section className="nn-post-exam-report__section rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--semantic-surface))] p-5">
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            {presentation.paywallUpsellCopy}
          </p>
          <Link
            href="/pricing"
            className="nn-btn-primary mt-3 inline-flex min-h-[3rem] items-center rounded-lg px-4 text-sm font-semibold"
          >
            View plans
          </Link>
        </section>
      ) : null}
    </div>
  );
}

/** @deprecated Use {@link PostExamPerformanceReport}. Name retained for incremental migration. */
export const PostExamAdaptiveReport = PostExamPerformanceReport;

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="nn-cat-perf-card">
      <p className="nn-cat-perf-card__label">{label}</p>
      <p className="nn-cat-perf-card__value tabular-nums">{value}</p>
    </div>
  );
}
