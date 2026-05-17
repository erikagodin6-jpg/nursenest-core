export type EmsTransportDestination =
  | "local-ed"
  | "pci-center"
  | "trauma-center"
  | "pediatric-center"
  | "burn-center"
  | "specialty-center";

export type EmsTransportUrgency = "stable" | "urgent" | "critical" | "immediate";

export type EmsTransportMode = "ground" | "als-intercept" | "air-medical";

export interface EmsTransportState {
  destination: EmsTransportDestination;
  urgency: EmsTransportUrgency;
  mode: EmsTransportMode;
  etaMinutes: number;
  sceneTimeMinutes: number;
  transportStarted: boolean;
  activation?: "stemi-alert" | "trauma-alert" | "stroke-alert" | "pediatric-alert" | "none";
  rationale: string;
}

export function inferTransportUrgencyFromRisk(risk: number): EmsTransportUrgency {
  if (!Number.isFinite(risk)) return "stable";
  if (risk >= 85) return "immediate";
  if (risk >= 65) return "critical";
  if (risk >= 35) return "urgent";
  return "stable";
}

export function normalizeTransportState(state: EmsTransportState): EmsTransportState {
  return {
    ...state,
    etaMinutes: Math.max(0, Math.round(state.etaMinutes)),
    sceneTimeMinutes: Math.max(0, Math.round(state.sceneTimeMinutes)),
    activation: state.activation ?? "none",
  };
}
