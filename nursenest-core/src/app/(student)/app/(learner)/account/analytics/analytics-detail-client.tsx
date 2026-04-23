"use client";

/**
 * AnalyticsDetailClient — lazy loads detailed analytics panels on first render.
 *
 * Uses Promise.allSettled + explicit AnalyticsLoadResult per segment (no silent catch → empty).
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
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";
import { settleAnalyticsAction } from "@/lib/study/analytics-load-result";

type Props = {
  summary: AnalyticsLoadResult<AnalyticsSummary>;
  questionTypeRows: AnalyticsLoadResult<QuestionTypeRow[]>;
  /** Server-loaded topic stats — shown until lazy panels refresh. */
  initialTopicRows: AnalyticsLoadResult<TopicRow[]>;
  confidenceScatterPoints: AnalyticsLoadResult<ConfidenceScatterPoint[]>;
};

type DetailState = {
  patterns: AnalyticsLoadResult<ConfidencePatternSummary> | null;
  timeMetrics: AnalyticsLoadResult<TimeMetrics> | null;
  topics: AnalyticsLoadResult<TopicRow[]>;
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
  });

  useEffect(() => {
    let cancelled = false;
    void Promise.allSettled([
      loadConfidencePatternsAction(),
      loadTimeMetricsAction(),
      loadTopicBreakdownAction(),
    ]).then((results) => {
      if (cancelled) return;
      setDetail({
        patterns: settleAnalyticsAction("confidence_patterns", results[0]!),
        timeMetrics: settleAnalyticsAction("time_metrics", results[1]!),
        topics: settleAnalyticsAction("topics", results[2]!),
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <CategoryMasterySection topics={detail.topics} />

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <QuestionTypePerformancePanel rows={questionTypeRows} />
        <ConfidenceVsPerformancePanel
          patterns={detail.patterns}
          scatterPoints={confidenceScatterPoints}
        />
      </div>

      {detail.timeMetrics == null ? (
        <AnalyticsPanelSkeleton title="Time Analysis" />
      ) : (
        <TimeAnalysisPanel metrics={detail.timeMetrics} />
      )}

      <AnalyticsNextSteps summary={summary} patterns={detail.patterns} />
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
