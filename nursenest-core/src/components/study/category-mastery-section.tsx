import type { ReactNode } from "react";
import { Minus, Star, Target } from "lucide-react";
import type { TopicRow } from "@/lib/study/analytics-data";
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";
import { analyticsResolvedData, formatQuestionVolumeRow } from "@/lib/study/analytics-load-result";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import { formatSentenceCase } from "@/lib/format/text-case";

type MasteryLabel = "Strong" | "Improving" | "Stable" | "Moderate" | "Needs review";

function masteryLabel(pct: number): MasteryLabel {
  if (pct >= 80) return "Strong";
  if (pct >= 70) return "Improving";
  if (pct >= 60) return "Moderate";
  if (pct >= 50) return "Stable";
  return "Needs review";
}

function badgeStyle(label: MasteryLabel): { bg: string; text: string; border: string } {
  switch (label) {
    case "Strong":
      return {
        bg: "color-mix(in srgb, var(--semantic-success) 14%, var(--semantic-surface))",
        text: "var(--semantic-success)",
        border: "color-mix(in srgb, var(--semantic-success) 35%, transparent)",
      };
    case "Improving":
      return {
        bg: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
        text: "var(--semantic-info-contrast, var(--semantic-info))",
        border: "color-mix(in srgb, var(--semantic-info) 30%, transparent)",
      };
    case "Moderate":
      return {
        bg: "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))",
        text: "color-mix(in srgb, var(--semantic-warning) 85%, var(--semantic-text-primary))",
        border: "color-mix(in srgb, var(--semantic-warning) 30%, transparent)",
      };
    case "Stable":
      return {
        bg: "color-mix(in srgb, var(--semantic-text-muted) 10%, var(--semantic-surface))",
        text: "var(--semantic-text-secondary)",
        border: "var(--semantic-border-soft)",
      };
    case "Needs review":
    default:
      return {
        bg: "color-mix(in srgb, var(--semantic-danger) 12%, var(--semantic-surface))",
        text: "var(--semantic-danger)",
        border: "color-mix(in srgb, var(--semantic-danger) 30%, transparent)",
      };
  }
}

/**
 * Category performance bars plus ranked strengths and focus lists from topic stats.
 */
export function CategoryMasterySection({ topics }: { topics: AnalyticsLoadResult<TopicRow[]> }) {
  if (topics.kind === "empty") {
    return (
      <div className="space-y-6" data-testid="category-mastery-empty">
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "var(--semantic-surface)",
            borderColor: "var(--semantic-border-soft)",
            boxShadow: "var(--semantic-shadow-soft)",
          }}
        >
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Category performance</h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">
            No topic mastery snapshot yet — this is an explicit empty state, not a failed load.
          </p>
        </section>
      </div>
    );
  }

  if (topics.kind === "error") {
    return (
      <div className="space-y-6" data-testid="category-mastery-error">
        <section
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "var(--semantic-surface)",
            borderColor: "var(--semantic-border-soft)",
            boxShadow: "var(--semantic-shadow-soft)",
          }}
        >
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Category performance</h2>
          <p className="mt-2 text-sm text-[var(--semantic-danger)]">
            Could not load topic mastery ({topics.reason}). This is a load failure — not the same as having no topics
            yet.
          </p>
        </section>
      </div>
    );
  }

  const topicRows = analyticsResolvedData(topics) ?? [];
  const degradedReason = topics.kind === "degraded" ? topics.reason : null;

  const sorted = [...topicRows].sort((a, b) => b.totalCount - a.totalCount);
  const withVolume = sorted.filter((t) => t.totalCount >= 3);
  const strengths = [...withVolume].sort((a, b) => b.accuracyPct - a.accuracyPct).slice(0, 4);
  const focus = [...withVolume].sort((a, b) => a.accuracyPct - b.accuracyPct).slice(0, 4);

  return (
    <div className="space-y-6">
      <section
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--semantic-surface)",
          borderColor: "var(--semantic-border-soft)",
          boxShadow: "var(--semantic-shadow-soft)",
        }}
      >
        <div className="mb-5">
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Category performance</h2>
          <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">Mastery level by content domain</p>
          {degradedReason ? (
            <p className="mt-2 text-xs font-semibold text-[var(--semantic-warning)]" data-testid="category-mastery-degraded">
              <span className="uppercase tracking-wide">Degraded</span> — {degradedReason}
            </p>
          ) : null}
        </div>
        {sorted.length === 0 ? (
          <p className="text-sm text-[var(--semantic-text-muted)]">
            Practice more questions to populate category-level mastery.
          </p>
        ) : (
          <ul className="space-y-4">
            {sorted.map((row) => {
              const total = row.totalCount;
              const label = masteryLabel(row.accuracyPct);
              const b = badgeStyle(label);
              const fill = semanticFillClassForAccuracyPct(row.accuracyPct);
              return (
                <li key={row.topic}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                        {formatSentenceCase(row.topic)}
                      </p>
                      <p className="text-xs text-[var(--semantic-text-muted)]">{formatQuestionVolumeRow(total)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide"
                        style={{ background: b.bg, color: b.text, border: `1px solid ${b.border}` }}
                      >
                        {label}
                      </span>
                      <span className="text-sm font-bold tabular-nums text-[var(--semantic-text-primary)]">
                        {row.accuracyPct}%
                      </span>
                      <Minus className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
                    </div>
                  </div>
                  <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2">
                    <div
                      className={`h-full rounded-full ${fill} transition-[width] duration-500`}
                      style={{ width: `${Math.min(100, row.accuracyPct)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <RankedTopicCard
          title="Top strengths"
          subtitle="Topics where you are most accurate recently"
          icon={<Star className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden />}
          rows={strengths}
          badge="Confident"
          badgeTone="success"
        />
        <RankedTopicCard
          title="Top focus areas"
          subtitle="Topics that deserve targeted review"
          icon={<Target className="h-4 w-4 text-[var(--semantic-danger)]" aria-hidden />}
          rows={focus}
          badge="Review"
          badgeTone="danger"
        />
      </div>
    </div>
  );
}

function RankedTopicCard({
  title,
  subtitle,
  icon,
  rows,
  badge,
  badgeTone,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  rows: TopicRow[];
  badge: string;
  badgeTone: "success" | "danger";
}) {
  const badgeBg =
    badgeTone === "success"
      ? "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))"
      : "color-mix(in srgb, var(--semantic-danger) 12%, var(--semantic-surface))";
  const badgeText = badgeTone === "success" ? "var(--semantic-success)" : "var(--semantic-danger)";
  const badgeBorder =
    badgeTone === "success"
      ? "color-mix(in srgb, var(--semantic-success) 28%, transparent)"
      : "color-mix(in srgb, var(--semantic-danger) 28%, transparent)";
  const numBg =
    badgeTone === "success"
      ? "color-mix(in srgb, var(--semantic-success) 16%, var(--semantic-surface))"
      : "color-mix(in srgb, var(--semantic-danger) 14%, var(--semantic-surface))";

  return (
    <section
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "var(--semantic-surface)",
        borderColor: "var(--semantic-border-soft)",
        boxShadow: "var(--semantic-shadow-soft)",
      }}
    >
      <div className="mb-4 flex items-start gap-2">
        <span
          className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border"
          style={{
            borderColor: "var(--semantic-border-soft)",
            background: "color-mix(in srgb, var(--semantic-panel-cool) 40%, var(--semantic-surface))",
          }}
        >
          {icon}
        </span>
        <div>
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">{title}</h2>
          <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">{subtitle}</p>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--semantic-text-muted)]">Not enough topic data yet.</p>
      ) : (
        <ol className="space-y-2">
          {rows.map((row, i) => (
            <li
              key={row.topic}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] px-3 py-2.5"
              style={{
                background:
                  badgeTone === "success"
                    ? "color-mix(in srgb, var(--semantic-success) 4%, var(--semantic-surface))"
                    : "color-mix(in srgb, var(--semantic-danger) 4%, var(--semantic-surface))",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums"
                  style={{ background: numBg, color: badgeText }}
                >
                  {i + 1}
                </span>
                <p className="truncate text-sm font-medium text-[var(--semantic-text-primary)]">
                  {formatSentenceCase(row.topic)}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide"
                style={{ background: badgeBg, color: badgeText, border: `1px solid ${badgeBorder}` }}
              >
                {badge}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
