"use client";

import type { MeasurementSystem } from "@/lib/measurements/measurement-system";
import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";
import { commitMeasurementPreferenceToProfile } from "@/lib/measurements/commit-measurement-preference-to-profile";
import {
  buildMeasurementAnalyticsPayload,
  trackMeasurementAnalytics,
} from "@/lib/measurements/measurement-analytics";
import { legacyToClinicalSystem } from "@/lib/measurements/measurement-domain";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";

/**
 * Compact SI / conventional toggle for exam shells (CAT, practice tests, flashcards).
 */
export function ExamMeasurementUnitToggle({
  fallbackSystem,
  initialPreference = null,
  syncToProfile = true,
  className = "",
  disabled = false,
  pathwayId = null,
  analyticsSurface,
}: {
  fallbackSystem: MeasurementSystem;
  initialPreference?: MeasurementPreference | null;
  syncToProfile?: boolean;
  className?: string;
  disabled?: boolean;
  pathwayId?: string | null;
  analyticsSurface?: string;
}) {
  const { preference, setPreference, measurementSystem } = useMeasurementPreference(
    fallbackSystem,
    initialPreference,
  );

  function update(next: MeasurementPreference) {
    setPreference(next);
    if (syncToProfile) {
      void commitMeasurementPreferenceToProfile(next);
    }
    const policy = getPathwayMeasurementPolicy(pathwayId);
    void trackMeasurementAnalytics(
      buildMeasurementAnalyticsPayload({
        event: "measurement_toggle_session",
        pathwayId,
        instructionalSystem: policy.instructionalSystem,
        renderedSystem: legacyToClinicalSystem(next === "imperial" ? "US" : "SI"),
        measurementContext: policy.measurementContext,
        surface: analyticsSurface,
      }),
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-0.5 ${className}`.trim()}
      role="group"
      aria-label="Measurement units"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => update("metric")}
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition ${
          preference === "metric"
            ? "bg-[var(--semantic-brand)] text-white"
            : "text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
        }`}
        aria-pressed={preference === "metric"}
      >
        SI
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => update("imperial")}
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition ${
          preference === "imperial"
            ? "bg-[var(--semantic-brand)] text-white"
            : "text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
        }`}
        aria-pressed={preference === "imperial"}
      >
        Conv.
      </button>
    </div>
  );
}
