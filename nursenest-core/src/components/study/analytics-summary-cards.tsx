/**
 * AnalyticsSummaryCards — four key metric cards with distinct soft surfaces.
 *
 * Card surfaces (left to right):
 *   1. Total Questions    → --semantic-panel-cool (info tint)
 *   2. Overall Accuracy   → --semantic-panel-positive (success tint)
 *   3. Study Streak       → warm tint
 *   4. Readiness Score    → brand tint
 *
 * No hardcoded colors. Each card uses a different semantic tint so the row
 * reads as coordinated palette variation, not a uniform gray grid.
 */

import type { TopicRow } from "@/lib/study/analytics-data";

type CardDef = {
  label: string;
  value: string;
  sub: string;
  surface: string;
  valueCss: string;
  borderCss: string;
};

export function AnalyticsSummaryCards({
  totalQuestionsAnswered,
  overallAccuracyPct,
  streakDays,
  latestReadinessScore,
  topicRows,
}: {
  totalQuestionsAnswered: number;
  overallAccuracyPct: number | null;
  streakDays: number;
  latestReadinessScore: number | null;
  topicRows: TopicRow[];
}) {
  const topTopics = topicRows.slice(0, 3);
  const strongCount = topicRows.filter((r) => r.accuracyPct >= 75).length;

  const cards: CardDef[] = [
    {
      label: "Questions Answered",
      value: totalQuestionsAnswered.toLocaleString(),
      sub:
        topTopics.length > 0
          ? `Across ${topicRows.length} topic${topicRows.length !== 1 ? "s" : ""}`
          : "Start practicing to track topics",
      surface: "var(--semantic-panel-cool)",
      valueCss: "var(--semantic-info-contrast, var(--semantic-info))",
      borderCss: "color-mix(in srgb, var(--semantic-info) 25%, transparent)",
    },
    {
      label: "Overall Accuracy",
      value: overallAccuracyPct !== null ? `${overallAccuracyPct}%` : "—",
      sub:
        overallAccuracyPct !== null
          ? accuracyLabel(overallAccuracyPct)
          : "Complete practice sessions to see accuracy",
      surface: "var(--semantic-panel-positive)",
      valueCss: "var(--semantic-success)",
      borderCss: "color-mix(in srgb, var(--semantic-success) 25%, transparent)",
    },
    {
      label: "Study Streak",
      value: streakDays > 0 ? `${streakDays}d` : "—",
      sub: streakDaysSub(streakDays),
      surface: "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
      valueCss: "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))",
      borderCss: "color-mix(in srgb, var(--semantic-warning) 25%, transparent)",
    },
    {
      label: "Readiness Score",
      value: latestReadinessScore !== null ? `${latestReadinessScore}%` : "—",
      sub:
        strongCount > 0
          ? `${strongCount} strong topic${strongCount !== 1 ? "s" : ""} identified`
          : "Take a CAT to measure readiness",
      surface: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
      valueCss: "var(--semantic-brand)",
      borderCss: "color-mix(in srgb, var(--semantic-brand) 25%, transparent)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  surface,
  valueCss,
  borderCss,
}: CardDef) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-2xl p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
      style={{
        background: surface,
        border: `1px solid ${borderCss}`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        {label}
      </p>
      <p
        className="text-3xl font-extrabold tabular-nums"
        style={{ color: valueCss }}
      >
        {value}
      </p>
      <p className="text-xs text-[var(--semantic-text-muted)]">{sub}</p>
    </div>
  );
}

function accuracyLabel(pct: number): string {
  if (pct >= 80) return "Strong overall accuracy";
  if (pct >= 70) return "Good — keep reinforcing weak areas";
  if (pct >= 60) return "Developing — focused review needed";
  return "Early stage — consistent practice builds this";
}

function streakDaysSub(days: number): string {
  if (days === 0) return "Study today to start a streak";
  if (days === 1) return "1 day — keep it going";
  if (days < 7) return `${days} days — building momentum`;
  if (days < 30) return `${days} days — strong habit`;
  return `${days} days — excellent consistency`;
}
