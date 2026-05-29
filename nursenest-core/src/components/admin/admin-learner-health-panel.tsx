"use client";

import { useEffect, useState } from "react";
import type { LearnerHealthScore, LearnerHealthBand } from "@/lib/admin/learner-health-score";
import { healthBandColor } from "@/lib/admin/learner-health-score";

type Props = { userId: string; initialScore?: LearnerHealthScore | null };

const BAND_LABELS: Record<LearnerHealthBand, string> = {
  power_user:    "Power User",
  healthy:       "Healthy",
  moderate_risk: "Moderate Risk",
  at_risk:       "At Risk",
};

type ComponentKey = keyof LearnerHealthScore["components"];
const COMPONENT_LABELS: Record<ComponentKey, string> = {
  studyFrequency:   "Study frequency",
  consistency:      "Consistency",
  activityDiversity:"Activity diversity",
  retention:        "Retention / scores",
  lessonEngagement: "Lesson engagement",
  catParticipation: "CAT participation",
};
const COMPONENT_MAX: Record<ComponentKey, number> = {
  studyFrequency:   25,
  consistency:      20,
  activityDiversity:15,
  retention:        20,
  lessonEngagement: 10,
  catParticipation: 10,
};

export function AdminLearnerHealthPanel({ userId, initialScore }: Props) {
  const [score, setScore] = useState<LearnerHealthScore | null>(initialScore ?? null);
  const [loading, setLoading] = useState(!initialScore);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialScore) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/health-score`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { ok: boolean; score: LearnerHealthScore };
        if (!cancelled) setScore(data.score);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId, initialScore]);

  return (
    <section className="mt-6 nn-card overflow-hidden p-0">
      <div className="border-b border-border/70 bg-muted/20 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Learner Intelligence · Phase 11C</p>
        <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">Learner Health Score</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          0–100 engagement score computed from study frequency, consistency, score trends, and activity diversity.
          Internal use only.
        </p>
      </div>

      <div className="p-5">
        {loading && <p className="text-sm text-muted-foreground">Computing health score…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {score && (
          <div className="space-y-5">
            {/* Score badge + band */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/5 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">
                {score.score}
              </div>
              <div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${healthBandColor(score.band)}`}>
                  {BAND_LABELS[score.band]}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Computed {new Date(score.computedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Component bars */}
            <div className="rounded-xl border border-border/60 divide-y divide-border/50">
              {(Object.keys(COMPONENT_LABELS) as ComponentKey[]).map((key) => {
                const val = score.components[key];
                const max = COMPONENT_MAX[key];
                const pct = Math.round((val / max) * 100);
                return (
                  <div key={key} className="flex items-center gap-4 px-4 py-2.5">
                    <p className="w-40 shrink-0 text-xs text-muted-foreground">{COMPONENT_LABELS[key]}</p>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-red-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-14 text-right text-xs tabular-nums text-muted-foreground">
                        {val} / {max}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signal bullets */}
            {score.signals.length > 0 && (
              <ul className="space-y-1">
                {score.signals.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--theme-heading-text)]">
                    <span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
