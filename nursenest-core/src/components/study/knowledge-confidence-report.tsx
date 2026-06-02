"use client";

import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import type { ConfidenceAnalyticsReport } from "@/lib/study/analytics-data";
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";
import { analyticsResolvedData } from "@/lib/study/analytics-load-result";

export function KnowledgeConfidenceReport({
  report,
}: {
  report: AnalyticsLoadResult<ConfidenceAnalyticsReport> | null;
}) {
  if (report === null) return <KnowledgeConfidenceSkeleton />;

  if (report.kind === "error") {
    return (
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Knowledge Confidence Report</h2>
        <p className="mt-2 text-sm text-[var(--semantic-danger)]">
          Confidence analytics could not load ({report.reason}). This is a load failure, not an empty confidence history.
        </p>
      </section>
    );
  }

  if (report.kind === "empty") {
    return (
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Knowledge Confidence Report</h2>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
          Rate confidence during questions and flashcards to unlock overconfidence, underconfidence, and readiness insights.
        </p>
      </section>
    );
  }

  const data = analyticsResolvedData(report);
  if (!data || data.quadrants.totalRated === 0) {
    return (
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Knowledge Confidence Report</h2>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
          No confidence-rated items yet. Add ratings during study to turn confidence into a learning signal.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5" data-testid="knowledge-confidence-report">
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--semantic-text-muted)]">
          Confidence Analytics
        </p>
        <h2 className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">Knowledge Confidence Report</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Confidence is scored against outcomes so NurseNest can separate reliable mastery from hidden risk.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Overconfidence Score" value={`${data.overconfidenceScore}%`} tone="danger" />
        <MetricCard label="Underconfidence Score" value={`${data.underconfidenceScore}%`} tone="info" />
        <MetricCard label="Confidence Accuracy" value={`${data.confidenceAccuracy}%`} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">Correctness × confidence</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Quadrant label="Correct + High Confidence" value={data.quadrants.correctHighConfidence} tone="success" />
            <Quadrant label="Correct + Low Confidence" value={data.quadrants.correctLowConfidence} tone="info" />
            <Quadrant label="Incorrect + High Confidence" value={data.quadrants.incorrectHighConfidence} tone="danger" />
            <Quadrant label="Incorrect + Low Confidence" value={data.quadrants.incorrectLowConfidence} tone="warning" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">Weekly improvement trend</h3>
          <div className="mt-4 flex h-44 items-end gap-2" aria-label="Weekly confidence accuracy trend chart">
            {data.weeklyTrend.length > 0 ? (
              data.weeklyTrend.map((point) => (
                <div key={point.weekLabel} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end rounded-xl bg-[var(--semantic-panel-muted)] px-1.5 pb-1.5">
                    <div
                      className="w-full rounded-lg bg-[color-mix(in_srgb,var(--semantic-success)_82%,var(--semantic-brand))]"
                      style={{ height: `${Math.max(6, point.confidenceAccuracy)}%` }}
                      title={`${point.weekLabel}: ${point.confidenceAccuracy}% confidence accuracy`}
                    />
                  </div>
                  <span className="w-full truncate text-center text-[0.62rem] text-[var(--semantic-text-muted)]">
                    {point.weekLabel.slice(5)}
                  </span>
                </div>
              ))
            ) : (
              <p className="self-center text-sm text-[var(--semantic-text-secondary)]">More weekly data will appear as you study.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[var(--semantic-danger)]" aria-hidden />
            <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">High-risk knowledge gaps</h3>
          </div>
          <div className="mt-4 space-y-3">
            {data.highRiskKnowledgeGaps.length > 0 ? (
              data.highRiskKnowledgeGaps.map((topic) => <TopicRow key={topic.topic} topic={topic} risk />)
            ) : (
              <p className="text-sm text-[var(--semantic-text-secondary)]">No high-confidence misses in the current window.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--semantic-info)]" aria-hidden />
            <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">Topic breakdowns</h3>
          </div>
          <div className="mt-4 space-y-3">
            {data.topicBreakdowns.slice(0, 6).map((topic) => (
              <TopicRow key={topic.topic} topic={topic} />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[var(--semantic-success)]" aria-hidden />
          <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">Recommendations</h3>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {data.recommendations.map((rec) => (
            <a
              key={`${rec.kind}:${rec.title}`}
              href={rec.href}
              className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] focus:outline-none focus:ring-2 focus:ring-[var(--semantic-focus-ring)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--semantic-accent)]">
                {rec.kind === "exam_ready" ? "Ready for exam practice" : "Needs remediation"}
              </p>
              <p className="mt-2 text-sm font-bold text-[var(--semantic-text-primary)]">{rec.title}</p>
              <p className="mt-2 text-xs leading-5 text-[var(--semantic-text-secondary)]">{rec.body}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function KnowledgeConfidenceSkeleton() {
  return (
    <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6" data-testid="knowledge-confidence-report-loading">
      <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Knowledge Confidence Report</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--semantic-panel-muted)]" aria-hidden />
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "danger" | "info" | "success" }) {
  const color = tone === "danger" ? "var(--semantic-danger)" : tone === "info" ? "var(--semantic-info)" : "var(--semantic-success)";
  return (
    <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function Quadrant({ label, value, tone }: { label: string; value: number; tone: "danger" | "info" | "success" | "warning" }) {
  const color =
    tone === "danger"
      ? "var(--semantic-danger)"
      : tone === "info"
        ? "var(--semantic-info)"
        : tone === "success"
          ? "var(--semantic-success)"
          : "var(--semantic-warning)";
  return (
    <div className="rounded-xl bg-[var(--semantic-panel-muted)] p-3">
      <p className="text-[0.66rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-extrabold tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function TopicRow({
  topic,
  risk = false,
}: {
  topic: {
    topic: string;
    totalRated: number;
    overconfidentMisses: number;
    underconfidentCorrect: number;
    confidenceAccuracyPct: number;
    recommendation: string;
  };
  risk?: boolean;
}) {
  return (
    <article className="rounded-2xl bg-[var(--semantic-panel-muted)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-[var(--semantic-text-primary)]">{topic.topic}</p>
        <span className="text-xs font-semibold tabular-nums text-[var(--semantic-text-muted)]">
          {topic.confidenceAccuracyPct}% calibrated
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--semantic-surface)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(3, topic.confidenceAccuracyPct)}%`,
            background: risk ? "var(--semantic-danger)" : "var(--semantic-success)",
          }}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-[var(--semantic-text-secondary)]">
        {topic.overconfidentMisses} overconfident miss{topic.overconfidentMisses === 1 ? "" : "es"} ·{" "}
        {topic.underconfidentCorrect} underconfident correct · {topic.totalRated} rated
      </p>
      <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-secondary)]">{topic.recommendation}</p>
    </article>
  );
}
