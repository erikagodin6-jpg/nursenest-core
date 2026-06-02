import type { PatientTrajectory } from "@/lib/clinical-scenarios/clinical-scenario-trajectory";
import { aggregateTrajectoryLabel } from "@/lib/clinical-scenarios/branching-scenario-engine";

export type PatientAcuity = "stable" | "watch" | "unstable" | "critical";

export type ComputedPatientState = {
  vitals: Record<string, string>;
  acuity: PatientAcuity;
  acuityLabel: string;
  trendLabel: string;
  telemetryNote: string | null;
};

function parseVitalMap(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v == null) continue;
    out[k] = String(v);
  }
  return out;
}

function parseNumberish(value: string | undefined): number | null {
  if (!value) return null;
  const m = value.match(/-?\d+(\.\d+)?/);
  return m ? Number.parseFloat(m[0]!) : null;
}

function adjustValue(key: string, value: string, delta: "up" | "down" | "stable"): string {
  const n = parseNumberish(value);
  if (n == null) return value;
  const k = key.toLowerCase();
  let change = 0;
  if (k.includes("spo2") || k.includes("o2") || k.includes("oxygen")) {
    change = delta === "up" ? 3 : delta === "down" ? -6 : 0;
  } else if (k.includes("hr") || k.includes("heart") || k.includes("pulse")) {
    change = delta === "up" ? 12 : delta === "down" ? -8 : 0;
  } else if (k.includes("bp") || k.includes("pressure")) {
    change = delta === "up" ? 8 : delta === "down" ? -14 : 0;
  } else if (k.includes("rr") || k.includes("resp")) {
    change = delta === "up" ? 4 : delta === "down" ? -2 : 0;
  } else if (k.includes("temp")) {
    change = delta === "up" ? 0.6 : delta === "down" ? -0.3 : 0;
  } else {
    return value;
  }
  const next = n + change;
  if (value.includes("%")) return `${Math.round(next)}%`;
  if (value.includes("/")) {
    const parts = value.split("/");
    if (parts.length === 2) {
      const sys = parseNumberish(parts[0]!) ?? n;
      const dia = parseNumberish(parts[1]!) ?? sys - 40;
      const dSys = delta === "up" ? 8 : delta === "down" ? -14 : 0;
      return `${Math.round(sys + dSys)}/${Math.round(dia + dSys * 0.4)}`;
    }
  }
  if (value.includes("°")) return `${next.toFixed(1)}°C`;
  return String(Math.round(next * 10) / 10);
}

/**
 * Merges baseline + stage vitals and applies trajectory / error burden so vitals feel responsive to decisions.
 */
export function computePatientState(args: {
  baselineVitals: unknown;
  stageVitals: unknown;
  trajectoryPath: PatientTrajectory[];
  incorrectWeight: number;
  deteriorationBannerActive: boolean;
}): ComputedPatientState {
  const merged = { ...parseVitalMap(args.baselineVitals), ...parseVitalMap(args.stageVitals) };
  const agg = aggregateTrajectoryLabel(args.trajectoryPath);
  const burden = args.incorrectWeight;

  let delta: "up" | "down" | "stable" = "stable";
  if (agg === "deteriorating" || args.deteriorationBannerActive || burden >= 4) delta = "down";
  else if (agg === "improving" && burden === 0) delta = "up";

  const vitals: Record<string, string> = {};
  for (const [k, v] of Object.entries(merged)) {
    vitals[k] = adjustValue(k, v, delta);
  }

  const spo2 = parseNumberish(
    vitals["SpO2"] ?? vitals["SpO₂"] ?? vitals["Oxygen saturation"] ?? vitals["spo2"],
  );
  const sbp = parseNumberish(vitals["BP"] ?? vitals["Blood pressure"]);

  let acuity: PatientAcuity = "stable";
  if (agg === "deteriorating" || burden >= 6 || (spo2 != null && spo2 < 88)) acuity = "critical";
  else if (burden >= 3 || (spo2 != null && spo2 < 92) || (sbp != null && sbp < 90)) acuity = "unstable";
  else if (burden >= 1 || args.deteriorationBannerActive) acuity = "watch";

  const acuityLabel =
    acuity === "critical"
      ? "Critical instability"
      : acuity === "unstable"
        ? "Unstable — escalate now"
        : acuity === "watch"
          ? "Watch closely"
          : "Stable for now";

  const trendLabel =
    agg === "deteriorating"
      ? "Patient trending worse"
      : agg === "improving"
        ? "Patient responding to care"
        : "Trajectory mixed";

  const telemetryNote =
    acuity === "critical"
      ? "Telemetry: sustained alarms — consider rapid response and primary survey."
      : acuity === "unstable"
        ? "Telemetry: new instability pattern — reassess ABCs and notify provider."
        : null;

  return { vitals, acuity, acuityLabel, trendLabel, telemetryNote };
}
