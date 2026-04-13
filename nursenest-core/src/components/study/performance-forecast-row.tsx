/**
 * PerformanceForecastRow
 *
 * 3-card row below the benchmark section.
 *
 * Card 1 — Accuracy / Consistency: current accuracy % + consistency label
 * Card 2 — Difficulty Handling: interpretation from readiness holdingBack
 * Card 3 — Pass Readiness Forecast: compact version (full card on PassReadinessCard)
 *
 * Each card uses a distinct coordinated surface. Server component.
 */

import type { CoachPageData } from "@/lib/study/coach-page-data";

// ── Consistency label ─────────────────────────────────────────────────────────

function consistencyLabel(
  accuracyPct: number | null,
  streakDays: number,
): { label: string; accent: string } {
  if (accuracyPct == null) return { label: "No data yet", accent: "var(--semantic-text-muted)" };
  if (accuracyPct >= 75 && streakDays >= 5)
    return { label: "Stable", accent: "var(--semantic-success)" };
  if (accuracyPct >= 65 || streakDays >= 3)
    return { label: "Moderate", accent: "var(--semantic-info)" };
  return { label: "Building", accent: "var(--semantic-warning)" };
}

// ── Difficulty handling ───────────────────────────────────────────────────────

function difficultyInterpretation(
  holdingBackLabels: string[],
  readinessBand: CoachPageData["readiness"]["band"],
): { text: string; accent: string } {
  const lower = holdingBackLabels.map((l) => l.toLowerCase());
  const hasDifficulty = lower.some((l) => l.includes("hard") || l.includes("difficult") || l.includes("high"));
  const hasPacing = lower.some((l) => l.includes("time") || l.includes("pacing"));

  if (readinessBand === "ready") {
    return { text: "Stable on harder items. Current performance supports exam readiness.", accent: "var(--semantic-success)" };
  }
  if (hasDifficulty) {
    return { text: "Struggling with harder items. Focus on concept depth.", accent: "var(--semantic-warning)" };
  }
  if (hasPacing) {
    return { text: "Pacing may be affecting accuracy. Practice timed segments.", accent: "var(--semantic-info)" };
  }
  if (readinessBand === "near_ready") {
    return { text: "Stable at moderate difficulty. Current data is approaching exam readiness.", accent: "var(--semantic-info)" };
  }
  return { text: "Building across difficulty levels. Continue steady practice to improve stability.", accent: "var(--semantic-brand)" };
}

// ── Mini card shell ───────────────────────────────────────────────────────────

function MiniCard({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-2xl p-5"
      style={{
        background: `color-mix(in srgb, ${accent} 7%, var(--bg-page))`,
        border: `1px solid color-mix(in srgb, ${accent} 18%, transparent)`,
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function PerformanceForecastRow({
  overallAccuracyPct,
  streakDays,
  readiness,
  adaptive,
  passReadiness,
}: {
  overallAccuracyPct: CoachPageData["overallAccuracyPct"];
  streakDays: CoachPageData["streakDays"];
  readiness: CoachPageData["readiness"];
  adaptive: CoachPageData["adaptive"];
  passReadiness: CoachPageData["passReadiness"];
}) {
  const consistency = consistencyLabel(overallAccuracyPct, streakDays);
  const difficulty = difficultyInterpretation(adaptive.holdingBackLabels, readiness.band);

  const FORECAST_ACCENT: Record<CoachPageData["passReadiness"]["band"], string> = {
    strong: "var(--semantic-success)",
    building: "var(--semantic-info)",
    early: "var(--semantic-warning)",
    insufficient: "var(--semantic-text-muted)",
  };
  const forecastAccent = FORECAST_ACCENT[passReadiness.band];

  return (
    <section aria-label="Performance and forecast summary">
      <h2
        className="mb-4 text-lg font-bold"
        style={{ color: "var(--semantic-text-primary)" }}
      >
        Performance Overview
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Accuracy / Consistency */}
        <MiniCard label="Accuracy & Consistency" accent={consistency.accent}>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: consistency.accent }}
            >
              {overallAccuracyPct != null ? `${overallAccuracyPct}%` : "—"}
            </span>
            <span className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
              accuracy
            </span>
          </div>
          <p
            className="rounded-full px-2 py-0.5 text-xs font-semibold w-fit"
            style={{
              background: `color-mix(in srgb, ${consistency.accent} 12%, var(--semantic-surface))`,
              color: consistency.accent,
            }}
          >
            {consistency.label}
          </p>
          {streakDays > 0 && (
            <p className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
              {streakDays}-day study streak
            </p>
          )}
        </MiniCard>

        {/* Difficulty Handling */}
        <MiniCard label="Difficulty Handling" accent={difficulty.accent}>
          <p className="text-sm font-semibold leading-snug" style={{ color: difficulty.accent }}>
            {difficulty.text.split(".")[0]}.
          </p>
          {difficulty.text.includes(".") && (
            <p className="text-xs leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
              {difficulty.text.split(".").slice(1).join(".").trim()}
            </p>
          )}
        </MiniCard>

        {/* Pass Readiness Forecast */}
        <MiniCard label="Pass Readiness" accent={forecastAccent}>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: forecastAccent }}
            >
              {passReadiness.displayRange}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
            {passReadiness.positiveFactor}
          </p>
          {passReadiness.limitingFactor && (
            <p className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
              Limiting: {passReadiness.limitingFactor}
            </p>
          )}
          <p className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
            Estimate · not a guarantee
          </p>
        </MiniCard>
      </div>
    </section>
  );
}
