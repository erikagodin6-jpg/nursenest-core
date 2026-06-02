import { listClinicalImageLibraryItems } from "@/lib/clinical-images/clinical-image-library";
import { CARDIAC_SOUND_RECORDS } from "@/lib/lessons/cardiac-sounds-library-data";
import { RESPIRATORY_SOUND_RECORDS } from "@/lib/lessons/respiratory-sounds-library-data";

export type ClinicalMediaType =
  | "respiratory_sound"
  | "cardiac_sound"
  | "ecg_strip"
  | "clinical_image"
  | "abg_interpretation"
  | "chest_xray"
  | "future_audio_video";

export type ClinicalMediaPathway = "RN" | "RPN" | "PN" | "NP" | "RT" | "ICU" | "Paramedic";

export type ClinicalMediaAsset = {
  id: string;
  title: string;
  type: ClinicalMediaType;
  module: "Respiratory Assessment" | "Cardiac Assessment" | "Clinical Images" | "Future Media";
  category: string;
  description: string;
  clinicalSignificance: string;
  commonCauses: string[];
  examTips: string[];
  clinicalPearl: string;
  location?: string;
  sourceUrl: string | null;
  sourceKind: "uploaded_audio" | "synthesized_audio" | "image" | "placeholder";
  pathways: ClinicalMediaPathway[];
  pathwayOverlays: Partial<Record<ClinicalMediaPathway, string>>;
};

export const CLINICAL_MEDIA_TYPE_LABELS: Record<ClinicalMediaType, string> = {
  respiratory_sound: "Respiratory Sounds",
  cardiac_sound: "Cardiac Sounds",
  ecg_strip: "ECG Strips",
  clinical_image: "Clinical Images",
  abg_interpretation: "ABG Interpretation",
  chest_xray: "Chest X-rays",
  future_audio_video: "Future Audio/Video Assets",
};

export const CLINICAL_MEDIA_PATHWAYS: ClinicalMediaPathway[] = [
  "RN",
  "RPN",
  "PN",
  "NP",
  "RT",
  "ICU",
  "Paramedic",
];

const nursingOverlays: Partial<Record<ClinicalMediaPathway, string>> = {
  RN: "Prioritize assessment cues, escalation, oxygenation/perfusion safety, and NCLEX clinical judgment traps.",
  RPN: "Use REx-PN/CNO scope framing: recognize deterioration, report promptly, document clearly, and collaborate safely.",
  PN: "Use NCLEX-PN/LPN scope framing: recognize abnormal findings, reinforce teaching, and escalate changes in status.",
  NP: "Add diagnostic reasoning, differential diagnosis, prescribing considerations, and referral thresholds.",
};

const respiratoryOverlays: Partial<Record<ClinicalMediaPathway, string>> = {
  ...nursingOverlays,
  RT: "Emphasize breath-sound discrimination, work of breathing, airway clearance, ventilation/oxygenation, and equipment escalation.",
  ICU: "Connect sounds to oxygenation trend, ventilator synchrony, fluid status, sepsis, and rapid decompensation.",
  Paramedic: "Frame as scene assessment, airway risk, oxygen delivery, transport priority, and early destination decisions.",
};

const cardiacOverlays: Partial<Record<ClinicalMediaPathway, string>> = {
  ...nursingOverlays,
  RT: "Connect cardiac sounds to dyspnea differentials, pulmonary edema, oxygenation failure, and interprofessional escalation.",
  ICU: "Connect sounds to hemodynamics, shock states, preload/afterload, invasive monitoring, and urgent notification.",
  Paramedic: "Connect cardiac findings to chest pain, syncope, shock, ECG acquisition, transport priority, and STEMI systems.",
};

function splitName(name: string) {
  return name.replace(/\s*\(([^)]*)\)\s*/g, " ").replace(/\s+/g, " ").trim();
}

function respiratoryExamTips(id: string) {
  if (id.includes("crackles")) {
    return ["Ask whether the sound clears with cough.", "Pair with edema, weight gain, SpO2, fever, and work of breathing cues."];
  }
  if (id.includes("wheeze")) {
    return ["Silent chest with distress is more urgent than loud wheezing.", "Differentiate diffuse bronchospasm from focal obstruction."];
  }
  if (id === "stridor") {
    return ["Treat as upper-airway risk.", "Choose airway escalation before routine teaching when distress is present."];
  }
  return ["Compare side-to-side.", "Location matters: central sounds become abnormal when heard peripherally."];
}

function cardiacExamTips(id: string) {
  if (id === "s3") return ["Think volume overload in the right context.", "Use bell/light pressure and left lateral positioning in technique questions."];
  if (id === "s4") return ["S4 requires organized atrial contraction.", "Do not choose S4 in atrial fibrillation stems."];
  if (id.includes("stenosis") || id.includes("regurgitation")) {
    return ["Anchor timing first: systolic vs diastolic.", "Then use location, radiation, and symptom severity."];
  }
  return ["Time the sound against S1/S2.", "Pair auscultation findings with symptoms, vitals, ECG, and perfusion cues."];
}

export function listClinicalMediaAssets(): ClinicalMediaAsset[] {
  const respiratory = RESPIRATORY_SOUND_RECORDS.map((sound): ClinicalMediaAsset => ({
    id: `respiratory:${sound.id}`,
    title: splitName(sound.name),
    type: "respiratory_sound",
    module: "Respiratory Assessment",
    category: sound.category,
    description: sound.description,
    clinicalSignificance: sound.clinicalSignificance,
    commonCauses: [...sound.commonCauses],
    examTips: respiratoryExamTips(sound.id),
    clinicalPearl: sound.clinicalPearl ?? "Trend the sound with respiratory effort, oxygenation, and patient trajectory rather than memorizing the sound in isolation.",
    location: sound.auscultationSite,
    sourceUrl: sound.audioSrc ?? null,
    sourceKind: sound.audioSrc ? "uploaded_audio" : "synthesized_audio",
    pathways: CLINICAL_MEDIA_PATHWAYS,
    pathwayOverlays: respiratoryOverlays,
  }));

  const cardiac = CARDIAC_SOUND_RECORDS.map((sound): ClinicalMediaAsset => ({
    id: `cardiac:${sound.id}`,
    title: splitName(sound.name),
    type: "cardiac_sound",
    module: "Cardiac Assessment",
    category: sound.category,
    description: sound.description,
    clinicalSignificance: sound.clinicalSignificance,
    commonCauses: [...sound.commonCauses],
    examTips: cardiacExamTips(sound.id),
    clinicalPearl: sound.clinicalPearl ?? "Auscultation is a clue, not a standalone diagnosis; match timing, location, symptoms, and hemodynamic status.",
    location: sound.auscultationSite,
    sourceUrl: null,
    sourceKind: "synthesized_audio",
    pathways: CLINICAL_MEDIA_PATHWAYS,
    pathwayOverlays: cardiacOverlays,
  }));

  const images = listClinicalImageLibraryItems().map((image): ClinicalMediaAsset => ({
    id: `image:${image.id}`,
    title: image.title,
    type: image.category === "ecg_recognition" ? "ecg_strip" : "clinical_image",
    module: "Clinical Images",
    category: image.category,
    description: image.caption,
    clinicalSignificance: image.clinicalConcepts.join(", "),
    commonCauses: [],
    examTips: image.questionIntegrations.map((v) => v.replace(/_/g, " ")),
    clinicalPearl: image.accessibilityNote,
    sourceUrl: image.url,
    sourceKind: "image",
    pathways: image.audiences.includes("RPN") ? ["RN", "RPN", "PN", "NP"] : ["RN", "NP"],
    pathwayOverlays: nursingOverlays,
  }));

  return [...respiratory, ...cardiac, ...images];
}

export function clinicalMediaCoverageByType(items = listClinicalMediaAssets()) {
  return (Object.keys(CLINICAL_MEDIA_TYPE_LABELS) as ClinicalMediaType[]).map((type) => ({
    type,
    label: CLINICAL_MEDIA_TYPE_LABELS[type],
    count: items.filter((item) => item.type === type).length,
  }));
}

export function clinicalMediaPathwayCoverage(items = listClinicalMediaAssets()) {
  return CLINICAL_MEDIA_PATHWAYS.map((pathway) => ({
    pathway,
    count: items.filter((item) => item.pathways.includes(pathway)).length,
  }));
}

export function uploadedClinicalMediaDiscovered(items = listClinicalMediaAssets()) {
  return items.filter((item) => item.sourceKind === "uploaded_audio" || item.sourceKind === "image");
}

export function missingClinicalMediaMappings(items = listClinicalMediaAssets()) {
  const existingTypes = new Set(items.map((item) => item.type));
  return (Object.keys(CLINICAL_MEDIA_TYPE_LABELS) as ClinicalMediaType[])
    .filter((type) => !existingTypes.has(type))
    .map((type) => ({ type, label: CLINICAL_MEDIA_TYPE_LABELS[type] }));
}
