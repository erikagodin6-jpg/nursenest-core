"use client";

import { Activity, HeartPulse, Wind } from "lucide-react";
import type { ComputedPatientState, PatientAcuity } from "@/lib/clinical-scenarios/clinical-scenario-patient-state-engine";
import { cn } from "@/lib/utils";

function acuityClass(acuity: PatientAcuity): string {
  switch (acuity) {
    case "critical":
      return "nn-clinical-scenarios-telemetry--critical";
    case "unstable":
      return "nn-clinical-scenarios-telemetry--unstable";
    case "watch":
      return "nn-clinical-scenarios-telemetry--watch";
    default:
      return "nn-clinical-scenarios-telemetry--stable";
  }
}

export function ClinicalScenarioPatientTelemetryStrip({ state }: { state: ComputedPatientState }) {
  const entries = Object.entries(state.vitals).slice(0, 8);
  return (
    <section className={cn("nn-clinical-scenarios-telemetry", acuityClass(state.acuity))} aria-live="polite">
      <div className="nn-clinical-scenarios-telemetry__head">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 shrink-0" aria-hidden />
          <div>
            <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">Live patient telemetry</p>
            <p className="text-[11px] text-[var(--semantic-text-secondary)]">{state.trendLabel}</p>
          </div>
        </div>
        <span className="nn-clinical-scenarios-telemetry__acuity">{state.acuityLabel}</span>
      </div>
      {entries.length > 0 ? (
        <dl className="nn-clinical-scenarios-telemetry__grid">
          {entries.map(([k, v]) => (
            <div key={k} className="nn-clinical-scenarios-telemetry__vital">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {state.telemetryNote ? (
        <p className="nn-clinical-scenarios-telemetry__note">
          <Activity className="mr-1 inline h-3.5 w-3.5" aria-hidden />
          {state.telemetryNote}
        </p>
      ) : (
        <p className="nn-clinical-scenarios-telemetry__note nn-clinical-scenarios-telemetry__note--muted">
          <Wind className="mr-1 inline h-3.5 w-3.5" aria-hidden />
          Vitals update as your decisions change the patient trajectory.
        </p>
      )}
    </section>
  );
}
