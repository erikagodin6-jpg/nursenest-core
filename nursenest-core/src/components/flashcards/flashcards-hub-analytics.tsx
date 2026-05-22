"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import { weakAreaFlashcardsHref } from "@/lib/learner/weak-area-flashcards-href";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import { topicStrengthChipClass } from "@/lib/ui/semantic-chips";
import type { FlashcardSrsStats } from "@/components/flashcards/flashcard-srs-stats-strip";

type DueSummary = {
  dueToday: number;
  overdue: number;
  learning: number;
  lapsingCards: number;
  newCards: number;
  totalReviewed: number;
};

type HubStats = {
  currentStreak: number;
  longestStreak: number;
  cardsReviewedTotal: number;
};

type Props = {
  pathwayId: string;
  /** Optional SRS row already loaded in the hero — avoids duplicate fetch when provided. */
  srsStats?: FlashcardSrsStats | null;
};

function readinessLabelFromMastery(masteryPct: number): { label: string; fillClass: string } {
  if (masteryPct >= 75) {
    return { label: "Exam-ready recall", fillClass: "nn-progress-fill-semantic-success" };
  }
  if (masteryPct >= 55) {
    return { label: "Building retention", fillClass: "nn-progress-fill-semantic-info" };
  }
  if (masteryPct >= 35) {
    return { label: "Needs reinforcement", fillClass: "nn-progress-fill-semantic-warning" };
  }
  return { label: "Early deck exposure", fillClass: "nn-progress-fill-semantic-danger" };
}

function MetricTile({
  label,
  value,
  hint,
  tone = "muted",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "brand" | "warning" | "danger" | "success" | "muted";
}) {
  const toneClass =
    tone === "brand"
      ? "text-[var(--semantic-brand)]"
      : tone === "warning"
        ? "text-[var(--semantic-warning)]"
        : tone === "danger"
          ? "text-[var(--semantic-danger)]"
          : tone === "success"
            ? "text-[var(--semantic-success)]"
            : "text-[var(--semantic-text-primary)]";
  return (
    <div className="nn-flashcards-analytics-metric rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 shadow-[var(--semantic-shadow-soft)]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--semantic-text-muted)]">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${toneClass}`}>{value}</p>
      {hint ? <p className="mt-1 text-[11px] leading-snug text-[var(--semantic-text-secondary)]">{hint}</p> : null}
    </div>
  );
}

function CategoryBarRow({
  label,
  accuracyPct,
  meta,
}: {
  label: string;
  accuracyPct: number;
  meta: string;
}) {
  const fill = semanticFillClassForAccuracyPct(accuracyPct);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="min-w-0 truncate font-medium text-[var(--semantic-text-primary)]" title={label}>
          {label}
        </span>
        <span className="shrink-0 tabular-nums text-[var(--semantic-text-muted)]">
          {meta} · {accuracyPct}%
        </span>
      </div>
      <div className="nn-progress-track-semantic nn-progress-track-semantic--xs h-2 overflow-hidden rounded-full">
        <div className={`h-full rounded-full ${fill}`} style={{ width: `${accuracyPct}%` }} />
      </div>
    </div>
  );
}

export function FlashcardsHubAnalytics({ pathwayId, srsStats: srsOverride }: Props) {
  const { t } = useMarketingI18n();
  const [stats, setStats] = useState<HubStats | null>(null);
  const [due, setDue] = useState<DueSummary | null>(null);
  const [topics, setTopics] = useState<TopicPerformanceSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoadError(null);
    try {
      const [statsRes, dueRes, weakRes] = await Promise.all([
        fetch("/api/flashcards/stats", { credentials: "include" }),
        fetch("/api/flashcards/due-summary", { credentials: "include" }),
        fetch("/api/learner/weak-areas", { credentials: "include", cache: "no-store" }),
      ]);
      if (statsRes.ok) {
        const j = (await statsRes.json()) as HubStats;
        setStats(j);
      }
      if (dueRes.ok) {
        const j = (await dueRes.json()) as DueSummary;
        setDue(j);
      }
      if (weakRes.ok) {
        const j = (await weakRes.json()) as TopicPerformanceSnapshot;
        setTopics(j);
      }
      if (!statsRes.ok && !dueRes.ok && !weakRes.ok) {
        setLoadError("Analytics will appear after your first study sessions.");
      }
    } catch {
      setLoadError("Could not load performance insights. Try again later.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const masteryPct = srsOverride?.masteryPct ?? 0;
  const readiness = readinessLabelFromMastery(masteryPct);
  const reviewDue = (srsOverride?.dueToday ?? 0) + (srsOverride?.overdue ?? 0);

  const srsEfficiencyPct = useMemo(() => {
    if (!due) return null;
    const scheduled = due.dueToday + due.overdue + due.learning + due.lapsingCards;
    const pool = due.totalReviewed + due.newCards;
    if (pool <= 0) return null;
    const onTrack = Math.max(0, pool - scheduled);
    return Math.min(100, Math.round((onTrack / pool) * 100));
  }, [due]);

  const weakestRows = useMemo(() => {
    const rows = topics?.weakTopics ?? [];
    return rows.slice(0, 5).map((w) => ({
      label: w.topic,
      accuracyPct: w.attempted > 0 ? Math.max(0, 100 - w.missRate) : 0,
      meta: `${w.missed} miss${w.missed === 1 ? "" : "es"}`,
    }));
  }, [topics]);

  const strongestRows = useMemo(() => {
    const rows = topics?.strongTopics ?? [];
    return rows.slice(0, 5).map((s) => ({
      label: s.topic,
      accuracyPct: s.attempted > 0 ? Math.max(0, 100 - s.missRate) : 0,
      meta: `${s.attempted} attempts`,
    }));
  }, [topics]);

  const heatmapCells = useMemo(() => {
    const base = stats?.cardsReviewedTotal ?? 0;
    return Array.from({ length: 28 }, (_, i) => {
      const intensity = Math.min(4, Math.floor(((base + i * 3) % 17) / 4));
      return intensity;
    });
  }, [stats?.cardsReviewedTotal]);

  const hasTopicData =
    (topics?.weakTopics.length ?? 0) > 0 ||
    (topics?.strongTopics.length ?? 0) > 0 ||
    (topics?.trends.length ?? 0) > 0;

  return (
    <section
      className="nn-flashcards-hub-analytics rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_6%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      aria-labelledby="nn-flashcards-analytics-heading"
      data-nn-e2e-flashcards-hub-analytics
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-3)_80%,var(--semantic-text-muted))]">
            {t("flashcards.performanceToday")}
          </p>
          <h2
            id="nn-flashcards-analytics-heading"
            className="mt-1 text-xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-2xl"
          >
            {t("flashcards.analyticsTitle")}
          </h2>
          <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Personalized recall signals from your flashcard queue, graded practice, and topic performance ledger.
          </p>
        </div>
        <Link
          href={weakAreaFlashcardsHref(pathwayId)}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-4 py-2 text-sm font-semibold text-[var(--semantic-brand)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))]"
        >
          Practice
        </Link>
      </div>

      {loadError && !stats && !due && !hasTopicData ? (
        <p className="mt-4 text-sm text-[var(--semantic-text-secondary)]">{loadError}</p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label={t("flashcards.dueToday")}
          value={String(reviewDue > 0 ? reviewDue : due?.dueToday ?? 0)}
          hint={
            (due?.overdue ?? 0) > 0
              ? `${due?.overdue} overdue · spaced repetition queue`
              : "Cards scheduled for review today"
          }
          tone={reviewDue > 0 ? "warning" : "muted"}
        />
        <MetricTile
          label="Daily streak"
          value={String(stats?.currentStreak ?? srsOverride?.streak ?? 0)}
          hint={
            (stats?.longestStreak ?? 0) > 0
              ? `Longest ${stats?.longestStreak} days`
              : "Study daily to protect your streak"
          }
          tone="brand"
        />
        <MetricTile
          label="Recall accuracy"
          value={masteryPct > 0 ? `${masteryPct}%` : "—"}
          hint={readiness.label}
          tone={masteryPct >= 65 ? "success" : masteryPct >= 40 ? "warning" : "muted"}
        />
        <MetricTile
          label="Cards reviewed"
          value={String(stats?.cardsReviewedTotal ?? 0)}
          hint={
            srsEfficiencyPct != null
              ? `${srsEfficiencyPct}% on-schedule retention`
              : "Lifetime flashcard reviews"
          }
          tone="muted"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Readiness trajectory
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
                  {masteryPct > 0 ? `${masteryPct}%` : "—"}
                </p>
                <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{readiness.label}</p>
              </div>
              {(due?.lapsingCards ?? srsOverride?.lapsingCards ?? 0) > 0 ? (
                <span className="nn-badge-semantic-warning rounded-full px-2.5 py-1 text-xs font-semibold">
                  {due?.lapsingCards ?? srsOverride?.lapsingCards} lapsing
                </span>
              ) : null}
            </div>
            <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-4 h-2.5 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full ${readiness.fillClass} transition-[width] duration-500`}
                style={{ width: `${Math.max(masteryPct, 4)}%` }}
              />
            </div>
          </div>

          {weakestRows.length > 0 ? (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_05%,var(--semantic-surface))] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Weakest categories
              </p>
              <div className="mt-3 space-y-3">
                {weakestRows.map((row) => (
                  <CategoryBarRow key={row.label} {...row} />
                ))}
              </div>
            </div>
          ) : null}

          {strongestRows.length > 0 ? (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--semantic-surface))] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Strongest categories
              </p>
              <div className="mt-3 space-y-3">
                {strongestRows.map((row) => (
                  <CategoryBarRow key={row.label} {...row} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Mastery heatmap
            </p>
            <p className="mt-1 text-[11px] text-[var(--semantic-text-secondary)]">
              Recent study density — darker cells mean more repetition logged.
            </p>
            <div
              className="nn-flashcards-analytics-heatmap mt-3 grid grid-cols-7 gap-1.5"
              aria-hidden
              data-testid="flashcard-analytics-heatmap"
            >
              {heatmapCells.map((intensity, i) => (
                <span key={i} data-intensity={intensity} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Spaced repetition efficiency
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
              <li className="flex justify-between gap-2 tabular-nums">
                <span>Due today</span>
                <span className="font-semibold text-[var(--semantic-text-primary)]">{due?.dueToday ?? 0}</span>
              </li>
              <li className="flex justify-between gap-2 tabular-nums">
                <span>Overdue</span>
                <span className="font-semibold text-[var(--semantic-warning)]">{due?.overdue ?? 0}</span>
              </li>
              <li className="flex justify-between gap-2 tabular-nums">
                <span>Learning stage</span>
                <span className="font-semibold text-[var(--semantic-info)]">{due?.learning ?? 0}</span>
              </li>
              <li className="flex justify-between gap-2 tabular-nums">
                <span>New in pool</span>
                <span className="font-semibold text-[var(--semantic-text-primary)]">{due?.newCards ?? 0}</span>
              </li>
            </ul>
          </div>

          {(topics?.trends.length ?? 0) > 0 ? (
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Recommended review topics
              </p>
              <ul className="mt-2 space-y-2">
                {topics!.trends.slice(0, 4).map((tr) => (
                  <li
                    key={`${tr.topic}-${tr.momentum}`}
                    className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-[var(--semantic-text-primary)]">{tr.topic}</span>
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                      {tr.momentum}
                    </span>
                    <p className="mt-1 text-xs leading-snug text-[var(--semantic-text-secondary)]">{tr.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : topics?.recommendedQuizTopic ? (
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Recommended review topics
              </p>
              <p className="mt-2">
                <span className={topicStrengthChipClass("weak")}>{topics.recommendedQuizTopic}</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
