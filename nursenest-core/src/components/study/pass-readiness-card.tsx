/**
 * PassReadinessCard
 *
 * Displays the estimated pass readiness forecast: point estimate, range, and context.
 *
 * Important: This is NOT a pass guarantee. This card must communicate uncertainty.
 *
 * Surface: soft success/info tint depending on forecast band
 *
 * Design:
 *   - Large range display ("65–73%")
 *   - Band label
 *   - "What's helping" and "What's limiting" rows
 *   - Disclaimer on every render
 */

import type { PassReadinessForecast } from "@/lib/study/pass-readiness-forecast";

const BAND_SURFACE: Record<PassReadinessForecast["band"], string> = {
  strong: "color-mix(in srgb, var(--semantic-success) 9%, var(--bg-page))",
  building: "color-mix(in srgb, var(--semantic-info) 9%, var(--bg-page))",
  early: "color-mix(in srgb, var(--semantic-warning) 9%, var(--bg-page))",
  insufficient: "color-mix(in srgb, var(--semantic-border-soft) 30%, var(--bg-page))",
};

const BAND_BORDER: Record<PassReadinessForecast["band"], string> = {
  strong: "color-mix(in srgb, var(--semantic-success) 22%, transparent)",
  building: "color-mix(in srgb, var(--semantic-info) 22%, transparent)",
  early: "color-mix(in srgb, var(--semantic-warning) 22%, transparent)",
  insufficient: "var(--semantic-border-soft)",
};

const BAND_ACCENT: Record<PassReadinessForecast["band"], string> = {
  strong: "var(--semantic-success)",
  building: "var(--semantic-info)",
  early: "var(--semantic-warning)",
  insufficient: "var(--semantic-text-muted)",
};

const BAND_LABEL: Record<PassReadinessForecast["band"], string> = {
  strong: "Strong readiness",
  building: "Building readiness",
  early: "Early stage",
  insufficient: "More data needed",
};

export function PassReadinessCard({ forecast }: { forecast: PassReadinessForecast }) {
  const accent = BAND_ACCENT[forecast.band];
  const surface = BAND_SURFACE[forecast.band];
  const border = BAND_BORDER[forecast.band];
  const bandLabel = BAND_LABEL[forecast.band];

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      <div className="px-5 pt-5 pb-4">
        {/* Header */}
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Estimated pass readiness
        </p>

        {forecast.pointEstimate === null ? (
          /* Insufficient data state */
          <div>
            <p
              className="text-base font-semibold"
              style={{ color: "var(--semantic-text-secondary)" }}
            >
              Not enough data yet
            </p>
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              {forecast.interpretation}
            </p>
          </div>
        ) : (
          /* Score display */
          <div className="space-y-3">
            <div className="flex items-end gap-3">
              <span
                className="text-4xl font-extrabold tabular-nums"
                style={{ color: accent }}
              >
                {forecast.displayRange}
              </span>
              <span
                className="mb-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: `color-mix(in srgb, ${accent} 14%, var(--semantic-surface))`,
                  color: accent,
                }}
              >
                {bandLabel}
              </span>
            </div>

            <p
              className="max-w-md text-xs leading-relaxed"
              style={{ color: "var(--semantic-text-secondary)" }}
            >
              {forecast.interpretation}
            </p>

            {/* Factors */}
            <div className="space-y-1.5">
              {forecast.positiveFactor && (
                <div className="flex items-start gap-2">
                  <span style={{ color: "var(--semantic-success)" }} aria-hidden="true">↑</span>
                  <span className="text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
                    {forecast.positiveFactor}
                  </span>
                </div>
              )}
              {forecast.limitingFactor && (
                <div className="flex items-start gap-2">
                  <span style={{ color: "var(--semantic-warning)" }} aria-hidden="true">↓</span>
                  <span className="text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
                    {forecast.limitingFactor}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mandatory disclaimer */}
      <div
        className="px-5 py-3"
        style={{ borderTop: `1px solid color-mix(in srgb, ${accent} 12%, transparent)` }}
      >
        <p
          className="text-[10px] leading-relaxed italic"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          This is an estimate based on your practice data — not a guarantee of passing or failing.
          Individual exam outcomes vary.
        </p>
      </div>
    </div>
  );
}
