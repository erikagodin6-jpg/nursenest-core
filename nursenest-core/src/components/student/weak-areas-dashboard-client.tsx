"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import type { TopicStrength } from "@/lib/learner/weak-topics-from-sessions";
import { topicStrengthChipClass } from "@/lib/ui/learner-semantic-chips";

type Props = { initial: TopicPerformanceSnapshot | null };

export function WeakAreasDashboardClient({ initial }: Props) {
  const [data, setData] = useState<TopicPerformanceSnapshot | null>(initial);
  const [loading, setLoading] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  useEffect(() => {
    setData(initial);
  }, [initial]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setRefreshError(null);
    try {
      const res = await fetch("/api/learner/weak-areas", { cache: "no-store" });
      if (!res.ok) {
        let msg = "Could not refresh topic performance.";
        try {
          const j = (await res.json()) as { error?: string };
          if (j.error) msg = j.error;
        } catch {
          /* ignore */
        }
        setRefreshError(msg);
        return;
      }
      const json = (await res.json()) as TopicPerformanceSnapshot;
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void refresh(), 300);
    return () => window.clearTimeout(t);
  }, [refresh]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    const onNN = () => void refresh();
    window.addEventListener("nn-topic-stats-updated", onNN);
    window.addEventListener("nn-learner-stats-updated", onNN);
    const t = window.setInterval(() => void refresh(), 45000);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("nn-topic-stats-updated", onNN);
      window.removeEventListener("nn-learner-stats-updated", onNN);
      window.clearInterval(t);
    };
  }, [refresh]);

  const firstWeakTopic = data?.weakTopics[0]?.topic ?? null;

  return (
    <section className="nn-card nn-student-card-lift border-[var(--semantic-border-soft)] p-6 shadow-[var(--semantic-shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Member insight</p>
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Topic performance</h2>
          <p className="mt-1 text-xs text-muted">
            Based on graded question bank attempts, practice tests, and scored mocks. Updates after each graded item.
            {loading ? <span className="ml-2 opacity-70">Refreshing…</span> : null}
          </p>
          {refreshError ? (
            <p
              className="mt-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-3 py-2 text-xs text-[var(--semantic-warning-contrast)]"
              role="status"
            >
              {refreshError} Showing last loaded data.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
            href={remediationWeakModeTestHref(firstWeakTopic ?? undefined)}
          >
            Open weak-mode test
          </Link>
          {firstWeakTopic ? (
            <Link
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-menu-text)] transition-colors hover:bg-muted/80"
              href={remediationTopicDrillHref(firstWeakTopic)}
            >
              Open top queue topic drill
            </Link>
          ) : (
            <Link
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-menu-text)] transition-colors hover:bg-muted/80"
              href="/app/questions"
            >
              Open question bank
            </Link>
          )}
        </div>
      </div>

      {!data ||
      (!data.weakTopics.length &&
        !data.strongTopics.length &&
        !data.trends.length &&
        !data.byStrength.strong.length &&
        !data.byStrength.moderate.length &&
        !data.byStrength.weak.length) ? (
        <p className="mt-4 text-sm text-muted">
          Your topic profile will appear after you answer graded questions in the bank, finish a practice test, or submit
          a mock exam.
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {data.strongTopics.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Strong topics</p>
              <p className="mt-1 text-xs text-muted">
                Keep light reinforcement so these do not decay. Mix in other gaps.
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {data.strongTopics.slice(0, 6).map((s) => (
                  <li key={`st-${s.topic}`} className={`${topicStrengthChipClass("strong")} font-medium`}>
                    {s.topic}{" "}
                    <span className="tabular-nums opacity-80">({100 - s.missRate}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data.trends.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Trajectory</p>
              <ul className="mt-2 space-y-2">
                {data.trends.slice(0, 5).map((t) => (
                  <li
                    key={`tr-${t.topic}-${t.momentum}`}
                    className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-sm text-[var(--semantic-text-secondary)]"
                  >
                    <span className="font-medium text-foreground">{t.topic}</span>
                    <span className="ml-2 text-xs uppercase tracking-wide text-muted">{t.momentum}</span>
                    <p className="mt-1 text-xs leading-snug">{t.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data.weakTopics.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Priority review</p>
              <p className="mt-1 text-xs text-muted">
                Ranked remediation queue from your graded misses. Start at #1 and clear one topic at a time.
              </p>
              <ul className="mt-2 space-y-2">
                {data.weakTopics.slice(0, 6).map((w, i) => (
                  <li
                    key={w.topic}
                    className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_05%,var(--semantic-surface))] px-3 py-2 text-sm shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-foreground">
                        #{i + 1} {w.topic}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span className="rounded-full border border-border px-2 py-0.5">
                          {w.recommendationConfidence ?? "low"} confidence
                        </span>
                        <span>{w.attempted > 0 ? `${100 - w.missRate}% accuracy` : "N/A"}</span>
                        <span>
                          {w.missed} miss
                          {w.missed === 1 ? "" : "es"}
                        </span>
                        {typeof w.wrongStreak === "number" && w.wrongStreak > 1 ? <span>streak {w.wrongStreak}</span> : null}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                        href={remediationTopicDrillHref(w.topic)}
                      >
                        Remediate in question bank
                      </Link>
                      <Link
                        className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-[var(--theme-menu-text)] transition-colors hover:bg-muted/80"
                        href={remediationWeakModeTestHref(w.topic)}
                      >
                        Apply in weak-mode test
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            {(
              [
                ["strong", data.byStrength.strong],
                ["moderate", data.byStrength.moderate],
                ["weak", data.byStrength.weak],
              ] as const
            ).map(([label, rows]) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {rows.slice(0, 8).map((r) => (
                    <li
                      key={`${label}-${r.topic}`}
                      className={`${topicStrengthChipClass(r.strength ?? (label as TopicStrength))} font-medium`}
                    >
                      {r.topic}
                    </li>
                  ))}
                  {rows.length === 0 ? <li className="text-xs text-muted">None yet</li> : null}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
