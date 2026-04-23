import Link from "next/link";
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  LayoutList,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { BAND_HELPER } from "./cat-readiness-hero";
import { ReadinessTrendPanel } from "./readiness-trend-panel";
import { StudyActivityHeatmap } from "./study-activity-heatmap";
import type {
  AnalyticsSummary,
  AnalyticsSupplementalMetrics,
  DailyActivityCell,
  AnalyticsReadinessTrendWindow,
  TopicRow,
} from "@/lib/study/analytics-data";
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";
import { analyticsResolvedData } from "@/lib/study/analytics-load-result";
import { formatSentenceCase } from "@/lib/format/text-case";

type TrendMoreLoader = (cursor: string) => Promise<AnalyticsLoadResult<AnalyticsReadinessTrendWindow>>;

const RING_SIZE = 160;
const RING_STROKE = 12;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function formatAvgMin(ms: number | null): string {
  if (ms == null || ms <= 0) return "—";
  const m = Math.round(ms / 60000);
  if (m <= 0) return "<1 min avg";
  return `${m} min avg`;
}

function weakTopicHints(rows: TopicRow[]): string {
  const cand = [...rows]
    .filter((r) => r.totalCount >= 5)
    .sort((a, b) => a.accuracyPct - b.accuracyPct)
    .slice(0, 2)
    .map((r) => formatSentenceCase(r.topic));
  if (cand.length === 0) return "your lowest-accuracy domains";
  return cand.join(" and ");
}

function ReadinessDonut({ pct }: { pct: number | null }) {
  const clamped = pct != null ? Math.min(100, Math.max(0, pct)) : null;
  const offset = clamped != null ? RING_CIRC - (clamped / 100) * RING_CIRC : RING_CIRC;
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;

  return (
    <div className="relative mx-auto shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90" aria-hidden>
        <circle
          cx={cx}
          cy={cy}
          r={RING_R}
          fill="none"
          stroke="var(--semantic-border-soft)"
          strokeWidth={RING_STROKE}
          opacity={0.35}
        />
        {clamped != null && (
          <circle
            cx={cx}
            cy={cy}
            r={RING_R}
            fill="none"
            stroke="var(--semantic-brand)"
            strokeWidth={RING_STROKE}
            strokeDasharray={RING_CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {clamped != null ? (
          <>
            <span className="text-4xl font-extrabold tabular-nums leading-none text-[var(--semantic-brand)]">
              {clamped}%
            </span>
            <span className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">
              Readiness
            </span>
          </>
        ) : (
          <Target className="h-10 w-10 text-[var(--semantic-text-muted)]" aria-hidden />
        )}
      </div>
    </div>
  );
}

/**
 * High-level “adaptive performance report” matching the learner analytics mock:
 * profile strip, status pills, readiness ring, KPI tiles, trend + activity row.
 */
export function AnalyticsPerformanceReport({
  displayName,
  credentialLine,
  targetExamLine,
  summary,
  trend,
  supplemental,
  dailyActivity,
  initialTopicRows,
  analyticsQuality,
  onLoadMoreTrend,
}: {
  displayName: string;
  credentialLine: string;
  targetExamLine: string | null;
  summary: AnalyticsLoadResult<AnalyticsSummary>;
  trend: AnalyticsLoadResult<AnalyticsReadinessTrendWindow>;
  supplemental: AnalyticsSupplementalMetrics;
  dailyActivity: AnalyticsLoadResult<DailyActivityCell[]>;
  initialTopicRows: AnalyticsLoadResult<TopicRow[]>;
  analyticsQuality: {
    hasError: boolean;
    hasDegraded: boolean;
    failedSegments: string[];
    passProbabilityVisible: boolean;
  };
  onLoadMoreTrend: TrendMoreLoader;
}) {
  const summaryData = analyticsResolvedData(summary);
  const trendData = analyticsResolvedData(trend);
  const initialTrendPoints = trendData?.points ?? [];
  const hasMorTrend = trendData?.hasMore ?? false;
  const trendCursor = trendData?.cursor ?? null;
  const topicRowsForHints = analyticsResolvedData(initialTopicRows) ?? [];

  const band = summaryData?.latestReadinessBand ?? null;
  const score = summaryData?.latestReadinessScore ?? null;
  const onTrack = band === "exam_ready" || band === "approaching";
  const adaptiveActive = (summaryData?.catSessionCount ?? 0) > 0;
  const highEngagement =
    (summaryData?.totalQuestionsAnswered ?? 0) >= 400 || (summaryData?.streakDays ?? 0) >= 10;
  const narrativeBand = band ? BAND_HELPER[band] : "Complete a CAT to anchor a personalized readiness narrative.";
  const weakHint = weakTopicHints(topicRowsForHints);
  const narrativeBody =
    score != null
      ? `${narrativeBand} Continue reinforcing ${weakHint} to support your predicted trajectory.`
      : "Your mastery picture sharpens as you mix CATs, questions, and review — start with a readiness check when you are ready.";

  return (
    <div
      className="space-y-6 rounded-3xl border p-4 sm:p-8"
      style={{
        background: "color-mix(in srgb, var(--semantic-panel-cool) 28%, var(--semantic-surface))",
        borderColor: "var(--semantic-border-soft)",
        boxShadow: "var(--semantic-shadow-soft)",
      }}
    >
      {analyticsQuality.hasError ? (
        <p
          className="rounded-xl border px-3 py-2 text-xs font-medium text-[var(--semantic-danger)]"
          style={{
            borderColor: "color-mix(in srgb, var(--semantic-danger) 35%, var(--semantic-border-soft))",
            background: "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))",
          }}
          data-testid="analytics-data-error-banner"
        >
          Some analytics segments failed to load (not the same as having no activity). Failed:{" "}
          {analyticsQuality.failedSegments.join(", ") || "unknown"}.
        </p>
      ) : null}
      {analyticsQuality.hasDegraded && !analyticsQuality.hasError ? (
        <p
          className="rounded-xl border px-3 py-2 text-xs font-medium text-[var(--semantic-warning)]"
          style={{
            borderColor: "color-mix(in srgb, var(--semantic-warning) 35%, var(--semantic-border-soft))",
            background: "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
          }}
          data-testid="analytics-data-degraded-banner"
        >
          <span className="font-bold uppercase tracking-wide">Degraded</span> — partial analytics:{" "}
          {analyticsQuality.failedSegments.join(", ") || "unspecified segment"}.
        </p>
      ) : null}
      {/* Header strip */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[var(--semantic-surface)]"
            style={{ background: "var(--semantic-brand)" }}
            aria-hidden
          >
            {initialsFromName(displayName)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">Adaptive performance report</h2>
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--semantic-brand)]"
                style={{
                  borderColor: "color-mix(in srgb, var(--semantic-brand) 35%, transparent)",
                  background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
                }}
              >
                <Sparkles className="h-3 w-3" aria-hidden />
                Last 30d signal
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{displayName}</p>
            <p className="text-xs text-[var(--semantic-text-muted)]">{credentialLine}</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Personalized mastery insights from adaptive practice and question bank activity.
              {targetExamLine ? ` ${targetExamLine}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <StatusPill
            active={onTrack}
            label="On track"
            Icon={CheckCircle2}
            tone="success"
          />
          <StatusPill
            active={adaptiveActive}
            label="Adaptive plan active"
            Icon={Target}
            tone="brand"
          />
          <StatusPill
            active={highEngagement}
            label="High engagement"
            Icon={Zap}
            tone="info"
          />
        </div>
      </div>

      {/* Readiness + KPI grid */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,340px)_1fr]">
        <div
          className="flex flex-col gap-4 rounded-2xl border p-5 sm:p-6"
          style={{
            background: "var(--semantic-surface)",
            borderColor: "var(--semantic-border-soft)",
            boxShadow: "var(--semantic-shadow-soft)",
          }}
        >
          <ReadinessDonut pct={score} />
          <p className="text-center text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{narrativeBody}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <KpiTile
            label="Pass probability"
            value={
              analyticsQuality.passProbabilityVisible && supplemental.passProbabilityEstimate != null
                ? `${supplemental.passProbabilityEstimate}%`
                : "—"
            }
            sub={
              analyticsQuality.passProbabilityVisible
                ? "Composite estimate · not a guarantee"
                : "Insufficient data · hidden when signals are incomplete or degraded"
            }
            Icon={Target}
            surface="color-mix(in srgb, var(--semantic-panel-positive) 55%, var(--semantic-surface))"
            border="color-mix(in srgb, var(--semantic-success) 22%, transparent)"
            valueColor="var(--semantic-success)"
          />
          <KpiTile
            label="Difficulty (scale)"
            value={supplemental.adaptiveDifficultyDisplay != null ? `${supplemental.adaptiveDifficultyDisplay} / 10` : "—"}
            sub="Derived from latest readiness"
            Icon={Brain}
            surface="color-mix(in srgb, var(--semantic-brand) 8%, var(--semantic-surface))"
            border="color-mix(in srgb, var(--semantic-brand) 22%, transparent)"
            valueColor="var(--semantic-brand)"
          />
          <KpiTile
            label="Study streak"
            value={
              summary.kind === "error"
                ? "—"
                : (summaryData?.streakDays ?? 0) > 0
                  ? `${summaryData!.streakDays} days`
                  : "—"
            }
            sub={summary.kind === "degraded" ? "Streak may be incomplete (degraded load)" : "Consecutive study days"}
            Icon={Flame}
            surface="color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))"
            border="color-mix(in srgb, var(--semantic-warning) 25%, transparent)"
            valueColor="color-mix(in srgb, var(--semantic-warning) 82%, var(--semantic-text-primary))"
          />
          <KpiTile
            label="Questions done"
            value={(summaryData?.totalQuestionsAnswered ?? 0).toLocaleString()}
            sub={
              summary.kind === "error"
                ? "Summary unavailable"
                : summaryData?.overallAccuracyPct != null
                  ? `${summaryData.overallAccuracyPct}% accuracy`
                  : "Keep practicing for accuracy"
            }
            Icon={BarChart3}
            surface="var(--semantic-panel-cool)"
            border="color-mix(in srgb, var(--semantic-info) 22%, transparent)"
            valueColor="var(--semantic-info-contrast, var(--semantic-info))"
          />
          <KpiTile
            label="Time studied"
            value={supplemental.studyHoursApprox != null ? `${supplemental.studyHoursApprox}h` : "—"}
            sub={formatAvgMin(supplemental.avgMsPerQuestion)}
            Icon={Clock}
            surface="color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))"
            border="color-mix(in srgb, var(--semantic-info) 22%, transparent)"
            valueColor="var(--semantic-info-contrast, var(--semantic-info))"
          />
          <KpiTile
            label="Flashcards"
            value={supplemental.flashcardsReviewedTotal.toLocaleString()}
            sub={`${topicRowsForHints.length} topic area${topicRowsForHints.length !== 1 ? "s" : ""} tracked`}
            Icon={LayoutList}
            surface="color-mix(in srgb, var(--semantic-chart-3) 12%, var(--semantic-surface))"
            border="color-mix(in srgb, var(--semantic-chart-3) 28%, transparent)"
            valueColor="var(--semantic-chart-3)"
          />
        </div>
      </div>

      {/* Trend + heatmap */}
      <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <ReadinessTrendPanel
          trend={trend}
          onLoadMore={onLoadMoreTrend}
          title="Adaptive growth trend"
          subtitle="Readiness score progression across recent CAT sessions"
          className="h-full border-0 shadow-none"
        />
        <StudyActivityHeatmap dailyActivity={dailyActivity} />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[var(--semantic-border-soft)] pt-5">
        <Link href="/app/practice-tests" className="nn-btn-primary inline-flex min-h-[2.5rem] items-center rounded-lg px-5 text-sm font-semibold shadow-none">
          Take a CAT
        </Link>
        <Link href="/app/review" className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-5 text-sm font-semibold">
          Review queue
        </Link>
        <Link href="/app/account/report-card" className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-5 text-sm font-semibold">
          Report card
        </Link>
      </div>
    </div>
  );
}

function StatusPill({
  active,
  label,
  Icon,
  tone,
}: {
  active: boolean;
  label: string;
  Icon: typeof CheckCircle2;
  tone: "success" | "brand" | "info";
}) {
  const cfg = {
    success: {
      border: "color-mix(in srgb, var(--semantic-success) 40%, transparent)",
      text: "var(--semantic-success)",
      bg: "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))",
      solid: false,
    },
    brand: {
      border: "color-mix(in srgb, var(--semantic-brand) 35%, transparent)",
      text: "var(--semantic-surface)",
      bg: "var(--semantic-brand)",
      solid: true,
    },
    info: {
      border: "color-mix(in srgb, var(--semantic-info) 40%, transparent)",
      text: "var(--semantic-info-contrast, var(--semantic-info))",
      bg: "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
      solid: false,
    },
  }[tone];

  const muted = !active;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide"
      style={{
        border: `1px solid ${cfg.border}`,
        color: muted ? "var(--semantic-text-muted)" : cfg.text,
        background: muted ? "var(--semantic-surface)" : cfg.bg,
        opacity: muted ? 0.75 : 1,
      }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}

function KpiTile({
  label,
  value,
  sub,
  Icon,
  surface,
  border,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  Icon: typeof Target;
  surface: string;
  border: string;
  valueColor: string;
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-2xl border p-4 shadow-[var(--semantic-shadow-soft)]"
      style={{ background: surface, borderColor: border }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--semantic-border-soft)]"
          style={{ background: "color-mix(in srgb, var(--semantic-surface) 70%, transparent)" }}
        >
          <Icon className="h-4 w-4 text-[var(--semantic-text-secondary)]" aria-hidden />
        </span>
      </div>
      <p className="text-2xl font-extrabold tabular-nums" style={{ color: valueColor }}>
        {value}
      </p>
      <p className="text-xs text-[var(--semantic-text-muted)]">{sub}</p>
    </div>
  );
}
