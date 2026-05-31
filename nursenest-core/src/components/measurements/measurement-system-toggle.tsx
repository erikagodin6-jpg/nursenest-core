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

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,var(--semantic-panel-muted)_8%)] px-2 py-1 shadow-[var(--semantic-shadow-soft)]"
        title={description}
        aria-label={`${title}. ${description}. Showing ${measurementSystem === "US" ? "conventional" : "SI"} values.`}
      >
        <span className="text-[0.7rem] font-semibold text-[var(--semantic-text-secondary)]">Units:</span>
        <div className="inline-flex rounded-full bg-[var(--semantic-surface-muted)] p-0.5">
          <button
            type="button"
            onClick={() => update("metric")}
            className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold leading-none transition ${preference === "metric" ? "bg-[var(--semantic-brand)] text-white shadow-sm" : "text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"}`}
            aria-pressed={preference === "metric"}
            title="Show SI metric values"
          >
            SI
          </button>
          <button
            type="button"
            onClick={() => update("imperial")}
            className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold leading-none transition ${preference === "imperial" ? "bg-[var(--semantic-brand)] text-white shadow-sm" : "text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"}`}
            aria-pressed={preference === "imperial"}
            title="Show conventional US customary values"
          >
            Conventional
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 space-y-2">
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
