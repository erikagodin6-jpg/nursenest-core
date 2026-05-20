"use client";

import type { AuthoredMeasurement } from "@/lib/measurements/measurement-domain";
import { orchestrateClinicalMeasurement } from "@/lib/measurements/clinical-measurement-orchestrator";
import type { MeasurementSystem } from "@/lib/measurements/measurement-domain";

export type MeasurementInterpretationPanelProps = {
  measurement: AuthoredMeasurement;
  measurementSystem: MeasurementSystem;
  pathwayId?: string | null;
  countryCode?: string | null;
  trendValuesSi?: number[];
  compact?: boolean;
  loftSafe?: boolean;
};

/**
 * Compact bedside interpretation card — labs, remediation, dashboard coaching.
 */
export function MeasurementInterpretationPanel({
  measurement,
  measurementSystem,
  pathwayId,
  countryCode,
  trendValuesSi,
  compact = true,
  loftSafe = false,
}: MeasurementInterpretationPanelProps) {
  const orchestrated = orchestrateClinicalMeasurement({
    measurement,
    renderedSystem: measurementSystem === "US" ? "conventional" : "si",
    pathwayId,
    countryCode,
    trendValuesSi,
    sourceSurface: "labs",
    loftSafeCopy: loftSafe,
    authenticated: true,
  });

  const { panel, trend, bedsidePathway } = orchestrated;
  const severityClass =
    panel.abnormality === "critical"
      ? "border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_22%,var(--semantic-surface))]"
      : panel.abnormality === "abnormal"
        ? "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_18%,var(--semantic-surface))]"
        : "border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_20%,var(--semantic-surface))]";

  return (
    <aside
      className={`rounded-xl border p-4 shadow-[var(--semantic-shadow-soft)] ${severityClass}`}
      aria-label="Clinical interpretation guidance"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
          {orchestrated.governedDisplayText}
        </p>
        {!compact && trend ? (
          <span className="nn-badge-semantic-warning text-[0.65rem] uppercase tracking-wide">
            {trend.trajectory.replace("_", " ")}
          </span>
        ) : null}
      </div>

      {panel.semantics.interpretationHint ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {panel.semantics.interpretationHint}
        </p>
      ) : null}

      {!compact && panel.escalation ? (
        <p className="mt-2 text-sm font-medium text-[var(--semantic-text-primary)]">{panel.escalation}</p>
      ) : null}

      {compact && bedsidePathway.monitoringSequence[0] ? (
        <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">
          {bedsidePathway.monitoringSequence[0]}
        </p>
      ) : null}

      {panel.semantics.safetyAlert ? (
        <p className="mt-2 text-xs font-medium text-[var(--semantic-danger)]">{panel.semantics.safetyAlert}</p>
      ) : null}
    </aside>
  );
}
