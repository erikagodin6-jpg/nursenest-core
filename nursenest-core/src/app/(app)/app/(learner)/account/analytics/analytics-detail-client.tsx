"use client";

/**
 * AnalyticsDetailClient — lazy loads detailed analytics panels on first render.
 *
 * Uses Promise.allSettled + explicit AnalyticsLoadResult per segment (no silent catch → empty).
 */

import { useEffect, useState } from "react";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import {
  loadConfidenceAnalyticsReportAction,
  loadConfidencePatternsAction,
  loadTimeMetricsAction,
  loadTopicBreakdownAction,
} from "./actions";
import { TimeAnalysisPanel } from "@/components/study/time-analysis-panel";
import { AnalyticsNextSteps } from "@/components/study/analytics-next-steps";
import { QuestionTypePerformancePanel } from "@/components/study/question-type-performance-panel";
import { ConfidenceVsPerformancePanel } from "@/components/study/confidence-vs-performance-panel";
import { KnowledgeConfidenceReport } from "@/components/study/knowledge-confidence-report";
import { CategoryMasterySection } from "@/components/study/category-mastery-section";
import type {
  ConfidencePatternSummary,
  ConfidenceAnalyticsReport,
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
  confidenceReport: AnalyticsLoadResult<ConfidenceAnalyticsReport> | null;
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
    confidenceReport: null,
    timeMetrics: null,
    topics: initialTopicRows,
  });

  useEffect(() => {
    let cancelled = false;
    void Promise.allSettled([
      loadConfidencePatternsAction(),
      loadConfidenceAnalyticsReportAction(),
      loadTimeMetricsAction(),
      loadTopicBreakdownAction(),
    ]).then((results) => {
      if (cancelled) return;
      setDetail({
        patterns: settleAnalyticsAction("confidence_patterns", results[0]!),
        confidenceReport: settleAnalyticsAction("confidence_analytics_report", results[1]!),
        timeMetrics: settleAnalyticsAction("time_metrics", results[2]!),
        topics: settleAnalyticsAction("topics", results[3]!),
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

      <KnowledgeConfidenceReport report={detail.confidenceReport} />

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
      className="nn-analytics-panel-skeleton rounded-2xl border p-5 sm:p-6"
      style={{
        background:
          "linear-gradient(165deg, color-mix(in srgb, var(--semantic-panel-cool) 55%, var(--semantic-surface)), var(--semantic-surface))",
        borderColor: "var(--semantic-border-soft)",
      }}
      data-nn-analytics-skeleton={title.replace(/\s+/g, "-").toLowerCase()}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]"
          aria-hidden
        >
          <BrandLeafIcon tone="muted" size={22} />
        </span>
        <div
          className="nn-analytics-skeleton-block h-4 flex-1 max-w-[10rem] rounded"
          style={{ background: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-border-soft))" }}
          aria-hidden
        />
      </div>
      <div className="space-y-3">
        <div
          className="nn-analytics-skeleton-block h-16 w-full rounded-xl"
          style={{ background: "color-mix(in srgb, var(--semantic-chart-3) 10%, var(--semantic-border-soft))" }}
          aria-hidden
        />
        <div
          className="nn-analytics-skeleton-block h-10 w-3/4 rounded-xl"
          style={{ background: "color-mix(in srgb, var(--semantic-chart-4) 8%, var(--semantic-border-soft))" }}
          aria-hidden
        />
      </div>
      <span className="sr-only">Loading {title}…</span>
    </div>
  );
}
