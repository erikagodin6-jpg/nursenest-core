"use client";

/**
 * AnalyticsDetailClient — lazy loads detailed analytics panels on first render.
 *
 * Strategy:
 *   - Fetches confidence patterns, time metrics, and topic breakdown in parallel
 *     on mount (after page paint) using Server Actions
 *   - Shows skeleton states while loading
 *   - No panel blocks the initial page render
 *
 * This keeps the RSC page fast (summary + trend pre-rendered) while detailed
 * panels hydrate silently after the main content is visible.
 */

import { useEffect, useState } from "react";
import {
  loadConfidencePatternsAction,
  loadTimeMetricsAction,
  loadTopicBreakdownAction,
} from "./actions";
import { TimeAnalysisPanel } from "@/components/study/time-analysis-panel";
import { AnalyticsNextSteps } from "@/components/study/analytics-next-steps";
import { QuestionTypePerformancePanel } from "@/components/study/question-type-performance-panel";
import { ConfidenceVsPerformancePanel } from "@/components/study/confidence-vs-performance-panel";
import { CategoryMasterySection } from "@/components/study/category-mastery-section";
import type {
  ConfidencePatternSummary,
  TimeMetrics,
  TopicRow,
  AnalyticsSummary,
  QuestionTypeRow,
  ConfidenceScatterPoint,
} from "@/lib/study/analytics-data";

type Props = {
  summary: AnalyticsSummary;
  questionTypeRows: QuestionTypeRow[];
  /** Server-loaded topic stats — shown until lazy panels refresh. */
  initialTopicRows: TopicRow[];
  confidenceScatterPoints: ConfidenceScatterPoint[];
};

type DetailState = {
  patterns: ConfidencePatternSummary | null;
  timeMetrics: TimeMetrics | null;
  topics: TopicRow[];
  loaded: boolean;
};

const EMPTY_PATTERNS: ConfidencePatternSummary = {
  overconfidentErrors: 0,
  uncertainCorrect: 0,
  stableMastery: 0,
  totalRated: 0,
  highConfidenceAccuracy: null,
  sessionsAnalyzed: 0,
};

const EMPTY_TIME: TimeMetrics = {
  avgMsPerQuestion: null,
  avgSessionDurationMs: null,
  rushSessions: 0,
  deepStudySessions: 0,
  sessionsAnalyzed: 0,
  minSessionMs: null,
  maxSessionMs: null,
};

export function AnalyticsDetailClient({
  summary,
  questionTypeRows,
  initialTopicRows,
  confidenceScatterPoints,
}: Props) {
  const [detail, setDetail] = useState<DetailState>({
    patterns: null,
    timeMetrics: null,
    topics: initialTopicRows,
    loaded: false,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      loadConfidencePatternsAction(),
      loadTimeMetricsAction(),
      loadTopicBreakdownAction(),
    ]).then(([patterns, timeMetrics, topics]) => {
      if (!cancelled) {
        setDetail({ patterns, timeMetrics, topics, loaded: true });
      }
    }).catch(() => {
      if (!cancelled) {
        setDetail({ patterns: EMPTY_PATTERNS, timeMetrics: EMPTY_TIME, topics: [], loaded: true });
      }
    });
    return () => { cancelled = true; };
  }, []);

  const patterns = detail.patterns ?? EMPTY_PATTERNS;
  const timeMetrics = detail.timeMetrics ?? EMPTY_TIME;

  return (
    <div className="space-y-6">
      <CategoryMasterySection topics={detail.topics} />

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <QuestionTypePerformancePanel rows={questionTypeRows} />
        <ConfidenceVsPerformancePanel
          patterns={patterns}
          scatterPoints={confidenceScatterPoints}
          loaded={detail.loaded}
        />
      </div>

      {/* Time analysis — loads after mount */}
      {!detail.loaded ? (
        <AnalyticsPanelSkeleton title="Time Analysis" />
      ) : (
        <TimeAnalysisPanel metrics={timeMetrics} />
      )}

      {/* Next steps — rendered immediately with server-loaded summary + lazy patterns */}
      <AnalyticsNextSteps
        summary={summary}
        patterns={patterns}
      />
    </div>
  );
}

function AnalyticsPanelSkeleton({ title }: { title: string }) {
  return (
    <div
      className="animate-pulse rounded-2xl border p-5 sm:p-6"
      style={{
        background: "var(--semantic-panel-cool)",
        borderColor: "var(--semantic-border-soft)",
      }}
    >
      <div
        className="mb-4 h-4 w-32 rounded"
        style={{ background: "var(--semantic-border-soft)" }}
        aria-hidden
      />
      <div className="space-y-3">
        <div className="h-16 w-full rounded-xl" style={{ background: "var(--semantic-border-soft)" }} aria-hidden />
        <div className="h-10 w-3/4 rounded-xl" style={{ background: "var(--semantic-border-soft)" }} aria-hidden />
      </div>
      <span className="sr-only">Loading {title}…</span>
    </div>
  );
}
