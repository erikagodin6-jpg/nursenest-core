export type EmsEcgRhythm =
  | "normal-sinus"
  | "sinus-tachycardia"
  | "sinus-bradycardia"
  | "atrial-fibrillation"
  | "atrial-flutter"
  | "svt"
  | "wide-complex-tachycardia"
  | "ventricular-tachycardia"
  | "ventricular-fibrillation"
  | "torsades"
  | "first-degree-block"
  | "second-degree-block-type-1"
  | "second-degree-block-type-2"
  | "complete-heart-block"
  | "pea"
  | "asystole";

export type EmsStemiTerritory = "inferior" | "anterior" | "lateral" | "posterior" | "right-sided";

export type EmsEcgInstabilitySignal =
  | "hypotension"
  | "altered-loc"
  | "chest-pain"
  | "syncope"
  | "shock-signs"
  | "respiratory-distress"
  | "poor-perfusion"
  | "peri-arrest";

export type EmsEcgLeadGroup =
  | "inferior-leads"
  | "anterior-leads"
  | "lateral-leads"
  | "septal-leads"
  | "posterior-leads"
  | "right-sided-leads";

export interface EmsEcgFinding {
  label: string;
  leadGroups?: EmsEcgLeadGroup[];
  clinicalMeaning: string;
  urgency: "low" | "moderate" | "high" | "critical";
}

export interface EmsEcgState {
  rhythm: EmsEcgRhythm;
  rate?: number;
  regularity?: "regular" | "regularly-irregular" | "irregularly-irregular" | "chaotic";
  qrsWidth?: "narrow" | "wide" | "variable";
  stemiTerritory?: EmsStemiTerritory;
  findings: EmsEcgFinding[];
  instabilitySignals: EmsEcgInstabilitySignal[];
  perfusionRisk: number;
  artifactRisk?: number;
  requiresImmediateAction: boolean;
}

export function clampEcgRisk(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function isShockableRhythm(rhythm: EmsEcgRhythm): boolean {
  return rhythm === "ventricular-fibrillation" || rhythm === "ventricular-tachycardia" || rhythm === "torsades";
}

export function isArrestRhythm(rhythm: EmsEcgRhythm): boolean {
  return rhythm === "ventricular-fibrillation" || rhythm === "pea" || rhythm === "asystole";
}

export function isHighRiskBradyRhythm(rhythm: EmsEcgRhythm): boolean {
  return rhythm === "sinus-bradycardia" || rhythm === "second-degree-block-type-2" || rhythm === "complete-heart-block";
}

export function inferEcgRequiresImmediateAction(ecg: Pick<EmsEcgState, "rhythm" | "stemiTerritory" | "instabilitySignals" | "perfusionRisk">): boolean {
  if (isArrestRhythm(ecg.rhythm)) return true;
  if (ecg.stemiTerritory && ecg.perfusionRisk >= 45) return true;
  if (ecg.perfusionRisk >= 70) return true;
  if (ecg.rhythm === "ventricular-tachycardia" && ecg.instabilitySignals.length > 0) return true;
  if (isHighRiskBradyRhythm(ecg.rhythm) && ecg.instabilitySignals.length > 0) return true;
  return false;
}

export function normalizeEcgState(ecg: EmsEcgState): EmsEcgState {
  const perfusionRisk = clampEcgRisk(ecg.perfusionRisk);
  const artifactRisk = ecg.artifactRisk === undefined ? undefined : clampEcgRisk(ecg.artifactRisk);
  return {
    ...ecg,
    perfusionRisk,
    artifactRisk,
    requiresImmediateAction: inferEcgRequiresImmediateAction({
      rhythm: ecg.rhythm,
      stemiTerritory: ecg.stemiTerritory,
      instabilitySignals: ecg.instabilitySignals,
      perfusionRisk,
    }),
  };
}

export const INFERIOR_STEMI_RURAL_TRANSPORT_ECG: EmsEcgState = normalizeEcgState({
  rhythm: "sinus-bradycardia",
  rate: 42,
  regularity: "regular",
  qrsWidth: "narrow",
  stemiTerritory: "inferior",
  findings: [
    {
      label: "ST elevation in inferior leads",
      leadGroups: ["inferior-leads"],
      clinicalMeaning: "Suggests inferior wall myocardial infarction and should trigger STEMI transport logic.",
      urgency: "critical",
    },
    {
      label: "Bradycardia with hypotension risk",
      clinicalMeaning: "Inferior STEMI can involve conduction tissue and worsen perfusion.",
      urgency: "high",
    },
  ],
  instabilitySignals: ["hypotension", "chest-pain", "poor-perfusion"],
  perfusionRisk: 82,
  artifactRisk: 8,
  requiresImmediateAction: true,
});
