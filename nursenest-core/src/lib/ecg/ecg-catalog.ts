import type { EcgUrlSegment } from "@/lib/ecg/ecg-types";
import type { EcgRhythmId } from "@/lib/ecg/ecg-rhythm-svg";

export type EcgCatalogScope = {
  rn: boolean;
  np: boolean;
  pn: boolean;
};

export type EcgCatalogEntry = {
  slug: string;
  title: string;
  previewFree: boolean;
  rhythmId: EcgRhythmId;
  scope: EcgCatalogScope;
  clinicalBullets: string[];
};

export const ECG_CATALOG: readonly EcgCatalogEntry[] = [
  {
    slug: "ecg-fundamentals",
    title: "ECG fundamentals",
    previewFree: true,
    rhythmId: "nsr",
    scope: { rn: true, np: true, pn: true },
    clinicalBullets: ["Paper speed and voltage calibration", "Waveform nomenclature", "Lead placement overview"],
  },
  {
    slug: "normal-sinus-rhythm",
    title: "Normal sinus rhythm",
    previewFree: true,
    rhythmId: "nsr",
    scope: { rn: true, np: true, pn: true },
    clinicalBullets: ["Regular P before each QRS", "Stable PR interval", "Narrow QRS in adults"],
  },
  {
    slug: "sinus-bradycardia",
    title: "Sinus bradycardia",
    previewFree: true,
    rhythmId: "sinus_brady",
    scope: { rn: true, np: true, pn: true },
    clinicalBullets: ["Sinus P morphology with slow rate", "Symptom correlation", "When pacing or meds are considered"],
  },
  {
    slug: "sinus-tachycardia",
    title: "Sinus tachycardia",
    previewFree: true,
    rhythmId: "sinus_tachy",
    scope: { rn: true, np: true, pn: true },
    clinicalBullets: ["Narrow-complex regular rhythm", "Fever, pain, dehydration differentials", "Hemodynamic assessment"],
  },
  {
    slug: "atrial-fibrillation",
    title: "Atrial fibrillation",
    previewFree: true,
    rhythmId: "afib",
    scope: { rn: true, np: true, pn: true },
    clinicalBullets: ["Irregularly irregular ventricular response", "Absent organized P waves", "Stroke prevention framing"],
  },
  {
    slug: "pvcs",
    title: "Premature ventricular contractions",
    previewFree: false,
    rhythmId: "pvc",
    scope: { rn: true, np: true, pn: true },
    clinicalBullets: ["Wide premature beats", "Bigeminy pattern awareness", "When escalation is appropriate"],
  },
  {
    slug: "pn-clinical-escalation",
    title: "Deterioration cues & escalation (PN/RPN)",
    previewFree: false,
    rhythmId: "nsr",
    scope: { rn: false, np: false, pn: true },
    clinicalBullets: [
      "Pair rhythm changes with vitals, mentation, and perfusion",
      "Invoke rapid response per unit policy",
      "Reconcile meds and electrolytes within PN scope",
    ],
  },
  {
    slug: "svt",
    title: "Supraventricular tachycardia",
    previewFree: false,
    rhythmId: "svt",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["Regular narrow-complex tachycardia", "Vagal maneuvers overview", "Unstable vs stable pathways"],
  },
  {
    slug: "ventricular-tachycardia",
    title: "Ventricular tachycardia",
    previewFree: false,
    rhythmId: "vt",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["Wide-complex regular rhythm", "Pulseless VT as emergency", "Telemetry prioritization"],
  },
  {
    slug: "ventricular-fibrillation",
    title: "Ventricular fibrillation",
    previewFree: false,
    rhythmId: "vfib",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["Chaotic waveform without organized QRS", "Defibrillation priority", "Post-ROSC handoff"],
  },
  {
    slug: "heart-blocks",
    title: "Heart blocks",
    previewFree: false,
    rhythmId: "heart_block",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["PR prolongation patterns", "Dropped beats", "High-grade block instability"],
  },
  {
    slug: "paced-rhythms",
    title: "Paced rhythms",
    previewFree: false,
    rhythmId: "paced",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["Spike before P or QRS", "Failure to capture vs sense", "Magnet behavior high level"],
  },
  {
    slug: "12-lead-basics",
    title: "12-lead basics",
    previewFree: false,
    rhythmId: "nsr",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["Frontal vs precordial planes", "Axis introduction", "Reciprocal change concept"],
  },
  {
    slug: "ischemia-stemi-patterns",
    title: "Ischemia and STEMI patterns",
    previewFree: false,
    rhythmId: "st_elevation",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["ST trends by territory", "Posterior involvement clues", "Cath lab activation language"],
  },
  {
    slug: "electrolytes-ecg-changes",
    title: "Electrolytes and ECG changes",
    previewFree: false,
    rhythmId: "hyperk",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["Peaked T hyperkalemia", "QT considerations", "Medication interaction awareness"],
  },
  {
    slug: "qt-prolongation-medications",
    title: "Medication-induced QT prolongation",
    previewFree: false,
    rhythmId: "long_qt",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["Torsades risk", "Drug–drug interactions", "Outpatient monitoring themes"],
  },
  {
    slug: "acls-rhythm-prioritization",
    title: "ACLS rhythm prioritization",
    previewFree: false,
    rhythmId: "pulseless",
    scope: { rn: true, np: true, pn: false },
    clinicalBullets: ["Shockable vs non-shockable", "CPR quality anchors", "Post-arrest bundle overview"],
  },
] as const;

export function ecgCatalogBySlug(slug: string): EcgCatalogEntry | undefined {
  return ECG_CATALOG.find((e) => e.slug === slug);
}

export function ecgCatalogForSegment(segment: EcgUrlSegment): EcgCatalogEntry[] {
  const key: keyof EcgCatalogScope = segment === "np" ? "np" : segment === "pn" ? "pn" : "rn";
  return ECG_CATALOG.filter((e) => e.scope[key]);
}

export function pnMayAccessEcgLessonSlug(slug: string): boolean {
  const row = ecgCatalogBySlug(slug);
  return Boolean(row?.scope.pn);
}
