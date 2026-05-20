"use client";

import type { MeasurementSystem } from "@/lib/measurements/measurement-system";
import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";
import { commitMeasurementPreferenceToProfile } from "@/lib/measurements/commit-measurement-preference-to-profile";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";

export function MeasurementSystemToggle({
  fallbackSystem,
  initialPreference = null,
  title = "Measurement units",
  description = "Switch between metric and imperial display without duplicating lessons.",
  compact = false,
  onSystemChange,
  onPreferenceCommitted,
  syncToProfile = false,
}: {
  fallbackSystem: MeasurementSystem;
  initialPreference?: MeasurementPreference | null;
  title?: string;
  description?: string;
  compact?: boolean;
  onSystemChange?: (system: MeasurementSystem) => void;
  /** Optional server sync (e.g. PATCH profile) after localStorage + cookie are updated. */
  onPreferenceCommitted?: (preference: MeasurementPreference) => void | Promise<void>;
  /** When true, also PATCH `/api/learner/personal-profile` (account default). */
  syncToProfile?: boolean;
}) {
  const { preference, measurementSystem, setPreference } = useMeasurementPreference(fallbackSystem, initialPreference);

  function update(next: MeasurementPreference) {
    setPreference(next);
    onSystemChange?.(next === "imperial" ? "US" : "SI");
    if (syncToProfile) void commitMeasurementPreferenceToProfile(next);
    void onPreferenceCommitted?.(next);
  }

  return (
    <div className={compact ? "space-y-2" : "rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 space-y-2"}>
      <div>
        <h2 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
        <p className="text-xs text-[var(--semantic-text-secondary)]">{description}</p>
      </div>
      <div className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-1">
        <button
          type="button"
          onClick={() => update("metric")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${preference === "metric" ? "bg-[var(--semantic-brand)] text-white" : "text-[var(--semantic-text-secondary)]"}`}
          aria-pressed={preference === "metric"}
        >
          SI (metric)
        </button>
        <button
          type="button"
          onClick={() => update("imperial")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${preference === "imperial" ? "bg-[var(--semantic-brand)] text-white" : "text-[var(--semantic-text-secondary)]"}`}
          aria-pressed={preference === "imperial"}
        >
          Conventional
        </button>
      </div>
      <p className="text-xs text-[var(--semantic-text-secondary)]">
        Showing <span className="font-semibold text-[var(--semantic-text-primary)]">{measurementSystem === "US" ? "conventional (US customary)" : "SI (metric)"}</span> values.
      </p>
    </div>
  );
}
