"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import { topicStrengthChipClass } from "@/lib/ui/semantic-chips";
import { appCatWeakFocusPath } from "@/lib/exam-pathways/pathway-cat-flow";
import type { UserPerformanceSummaryPayload } from "@/lib/study/performance-summary-load";

type CatReadinessSnapshot = {
  ok: boolean;
  availableQuestions?: number;
  readinessLabel?: string;
  readinessScore?: number;
};

type RecentPracticeRow = {
  id: string;
  accuracyPct: number | null;
  completedAt: string | null;
  questionCount: number;
  selectionMode: string | null;
};

type Props = {
  pathwayId: string;
  recentSessions: RecentPracticeRow[];
};

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
    <div className="nn-practice-analytics-metric rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 shadow-[var(--semantic-shadow-soft)]">
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

export function PracticeTestsHubAnalytics({ pathwayId, recentSessions }: Props) {
  const { t } = useMarketingI18n();
  const [topics, setTopics] = useState<TopicPerformanceSnapshot | null>(null);
  const [readiness, setReadiness] = useState<{
    score: number | null;
    band: string;
    passTier: string;
    explanation: string;
  } | null>(null);
  const [performance, setPerformance] = useState<UserPerformanceSummaryPayload | null>(null);
  const [catReadiness, setCatReadiness] = useState<CatReadinessSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoadError(null);
    const pid = pathwayId.trim();
    try {
      const fetches: Promise<void>[] = [
        fetch("/api/learner/weak-areas", { credentials: "include", cache: "no-store" })
          .then(async (res) => {
            if (res.ok) setTopics((await res.json()) as TopicPerformanceSnapshot);
          }),
        fetch("/api/learner/readiness", { credentials: "include", cache: "no-store" })
          .then(async (res) => {
            if (!res.ok) return;
            const j = (await res.json()) as {
              readiness?: { score?: number | null; band?: string };
              passLikelihood?: { tier?: string; explanation?: string };
            };
            setReadiness({
              score: j.readiness?.score ?? null,
              band: j.readiness?.band ?? "insufficient_data",
              passTier: j.passLikelihood?.tier ?? "unknown",
              explanation: j.passLikelihood?.explanation ?? "",
            });
          }),
        fetch("/api/performance-summary", { credentials: "include", cache: "no-store" })
          .then(async (res) => {
            if (res.ok) setPerformance((await res.json()) as UserPerformanceSummaryPayload);
          }),
      ];
      if (pid) {
        fetches.push(
          fetch(`/api/practice-tests/cat-readiness?pathwayId=${encodeURIComponent(pid)}`, {
            credentials: "include",
            cache: "no-store",
          }).then(async (res) => {
            if (res.ok) setCatReadiness((await res.json()) as CatReadinessSnapshot);
          }),
        );
      }
      await Promise.all(fetches);
    } catch {
      setLoadError("Could not load practice analytics. Try again after your next session.");
    }
  }, [pathwayId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const completedRecent = useMemo(
    () =>
      recentSessions
        .filter((r) => r.completedAt && r.accuracyPct != null)
        .slice(0, 8),
    [recentSessions],
  );

  const avgRecentAccuracy = useMemo(() => {
    if (completedRecent.length === 0) return null;
    const sum = completedRecent.reduce((n, r) => n + (r.accuracyPct ?? 0), 0);
    return Math.round(sum / completedRecent.length);
  }, [completedRecent]);

  const weakestRows = useMemo(() => {
    const fromPerf = performance?.weakAreas?.slice(0, 5) ?? [];
    if (fromPerf.length > 0) {
      return fromPerf.map((w) => ({
        label: w.topic,
        accuracyPct: w.accuracyPct,
        meta: `${w.totalCount} attempts`,
      }));
    }
    return (topics?.weakTopics ?? []).slice(0, 5).map((w) => ({
      label: w.topic,
      accuracyPct: w.attempted > 0 ? Math.max(0, 100 - w.missRate) : 0,
      meta: `${w.missed} missed`,
    }));
  }, [performance?.weakAreas, topics?.weakTopics]);

  const strongestRows = useMemo(() => {
    return (topics?.strongTopics ?? []).slice(0, 5).map((s) => ({
      label: s.topic,
      accuracyPct: s.attempted > 0 ? Math.max(0, 100 - s.missRate) : 0,
      meta: `${s.attempted} attempts`,
    }));
  }, [topics?.strongTopics]);

  const bodySystemRows = useMemo(() => {
    return (performance?.accuracyByBodySystem ?? []).slice(0, 6).map((row) => ({
      label: row.bodySystem,
      accuracyPct: row.accuracyPct,
      meta: `${row.correctCount}/${row.correctCount + row.wrongCount}`,
    }));
  }, [performance?.accuracyByBodySystem]);

  const readinessPct = readiness?.score ?? catReadiness?.readinessScore ?? avgRecentAccuracy ?? null;
  const readinessFill = semanticFillClassForAccuracyPct(readinessPct ?? 0);

  const pid = pathwayId.trim();

  return (
    <section
      className="nn-practice-tests-hub-analytics rounded-[1.5rem] border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_6%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8"
      aria-labelledby="nn-practice-tests-analytics-heading"
      data-nn-e2e-practice-tests-hub-analytics
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-3)_80%,var(--semantic-text-muted))]">
            Adaptive insights
          </p>
          <h2
            id="nn-practice-tests-analytics-heading"
            className="mt-1 text-xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-2xl"
          >
            Your practice performance
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Weak systems, readiness trajectory, pacing signals, and remediation pulled from your report card and recent
            exams.
          </p>
        </div>
        {pid ? (
          <Link
            href={appCatWeakFocusPath(pid)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-4 py-2 text-sm font-semibold text-[var(--semantic-brand)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))]"
          >
            Drill weak areas →
          </Link>
        ) : null}
      </div>

      {loadError && !topics && !readiness && !performance ? (
        <p className="mt-4 text-sm text-[var(--semantic-text-secondary)]">{loadError}</p>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Readiness score"
          value={readinessPct != null ? `${Math.round(readinessPct)}%` : "—"}
          hint={readiness?.explanation || "Complete a timed mock to sharpen this estimate."}
          tone={readinessPct != null && readinessPct >= 70 ? "success" : readinessPct != null && readinessPct >= 50 ? "warning" : "muted"}
        />
        <MetricTile
          label="Recent exam accuracy"
          value={avgRecentAccuracy != null ? `${avgRecentAccuracy}%` : "—"}
          hint={
            completedRecent.length > 0
              ? `Across last ${completedRecent.length} completed session${completedRecent.length === 1 ? "" : "s"}`
              : "Finish a practice exam to see trends"
          }
          tone={avgRecentAccuracy != null && avgRecentAccuracy >= 75 ? "success" : "muted"}
        />
        <MetricTile
          label="Avg time / question"
          value={
            performance?.averageResponseTimeMs != null
              ? `${Math.round(performance.averageResponseTimeMs / 1000)}s`
              : "—"
          }
          hint={
            performance?.speed?.isSlowResponder
              ? "Pacing is slower than target — practice timed sets"
              : "From graded practice attempts"
          }
          tone={performance?.speed?.isSlowResponder ? "warning" : "muted"}
        />
        <MetricTile
          label="Pass likelihood"
          value={
            performance?.passProbability?.percent != null
              ? `${performance.passProbability.percent}%`
              : readiness?.passTier
                ? readiness.passTier.replace(/_/g, " ")
                : "—"
          }
          hint={performance?.passProbability?.interpretation ?? readiness?.explanation}
          tone="brand"
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Readiness trajectory
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
                  {readinessPct != null ? `${Math.round(readinessPct)}%` : "—"}
                </p>
                <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                  {readiness?.band?.replace(/_/g, " ") ?? "Building baseline"}
                </p>
              </div>
              {catReadiness?.ok && catReadiness.availableQuestions != null ? (
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${topicStrengthChipClass("moderate")}`}>
                  {catReadiness.availableQuestions} CAT-ready items
                </span>
              ) : null}
            </div>
            <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-4 h-2.5 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full ${readinessFill} transition-[width] duration-500`}
                style={{ width: `${Math.max(readinessPct ?? 4, 4)}%` }}
              />
            </div>
          </div>

          {weakestRows.length > 0 ? (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_05%,var(--semantic-surface))] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Weak systems & topics
              </p>
              <div className="mt-3 space-y-3">
                {weakestRows.map((row) => (
                  <CategoryBarRow key={row.label} {...row} />
                ))}
              </div>
            </div>
          ) : null}

          {bodySystemRows.length > 0 ? (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                NCLEX category readiness
              </p>
              <div className="mt-3 space-y-3">
                {bodySystemRows.map((row) => (
                  <CategoryBarRow key={row.label} {...row} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          {strongestRows.length > 0 ? (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--semantic-surface))] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Strong systems
              </p>
              <div className="mt-3 space-y-3">
                {strongestRows.map((row) => (
                  <CategoryBarRow key={row.label} {...row} />
                ))}
              </div>
            </div>
          ) : null}

          {completedRecent.length > 0 ? (
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Weekly accuracy trend
              </p>
              <ul className="mt-3 space-y-2">
                {completedRecent.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="min-w-0 truncate text-[var(--semantic-text-secondary)]">
                      {row.selectionMode === "cat" ? "CAT" : "Practice"} · {row.questionCount} Q
                    </span>
                    <span
                      className={`shrink-0 font-bold tabular-nums ${
                        (row.accuracyPct ?? 0) >= 75
                          ? "text-[var(--semantic-success)]"
                          : (row.accuracyPct ?? 0) >= 60
                            ? "text-[var(--semantic-warning)]"
                            : "text-[var(--semantic-danger)]"
                      }`}
                    >
                      {row.accuracyPct}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Recommended next step
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {weakestRows.length > 0
                ? `Target ${weakestRows[0]?.label} with a focused weak-area session, then confirm with a timed mock.`
                : "Run a 25-question practice exam to establish your baseline accuracy and pacing profile."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {pid ? (
                <Link
                  href={appCatWeakFocusPath(pid)}
                  className="inline-flex min-h-10 items-center rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-xs font-bold text-[var(--semantic-brand-contrast)]"
                >
                  Practice
                </Link>
              ) : null}
              <Link
                href="/app/account/report"
                className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-xs font-semibold text-[var(--semantic-text-primary)]"
              >
                {t("learner.account.nav.report")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
