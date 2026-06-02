/**
 * Recurring body-system / clinical area buckets for coverage planning.
 */

export type ClinicalSystemId =
  | "cardio"
  | "respiratory"
  | "neuro"
  | "renal"
  | "endocrine"
  | "gi"
  | "fluids_electrolytes"
  | "infection_sepsis"
  | "maternity"
  | "peds"
  | "mental_health"
  | "msk"
  | "hematology_immuno"
  | "general";

export const CLINICAL_SYSTEM_LABELS: Record<ClinicalSystemId, string> = {
  cardio: "Cardiovascular",
  respiratory: "Respiratory",
  neuro: "Neurological",
  renal: "Renal / GU",
  endocrine: "Endocrine",
  gi: "GI / nutrition",
  fluids_electrolytes: "Fluids & electrolytes",
  infection_sepsis: "Infection / sepsis",
  maternity: "Maternity",
  peds: "Pediatrics",
  mental_health: "Mental health",
  msk: "MSK / integumentary",
  hematology_immuno: "Hematology / immunology",
  general: "General / multi-system",
};

export function inferClinicalSystemFromHaystack(haystack: string): ClinicalSystemId {
  const h = haystack.toLowerCase();
  if (/(maternity|ob\b|labor|pregnan|postpartum|neonat|newborn)/.test(h)) return "maternity";
  if (/(pediatr|infant|child|adolescent)/.test(h)) return "peds";
  if (/(psych|mental health|suicid|anxiety|depress|substance|therap\b)/.test(h)) return "mental_health";
  if (/(sepsis|septic|bacteremia|infection outbreak|cellulitis|uti\b|pneumonia)/.test(h)) return "infection_sepsis";
  if (/(cardio|heart|mi\b|chf|ekg|ecg|arrhythm|hypertens|shock.*cardio)/.test(h)) return "cardio";
  if (/(respirat|lung|copd|asthma|ventilat|o2\b|hypox)/.test(h)) return "respiratory";
  if (/(neuro|stroke|seizure|icp|gcs\b|spinal cord|parkinson|ms\b)/.test(h)) return "neuro";
  if (/(renal|kidney|dialysis|ckd|aki|urin|diuretic|electrolyte|fluid balance|k\b|na\b|mg\b)/.test(h))
    return /(electrolyte|fluid|dehydrat|osmolal)/.test(h) ? "fluids_electrolytes" : "renal";
  if (/(diabetes|thyroid|insulin|glucose|cortisol|endocrine)/.test(h)) return "endocrine";
  if (/(gi\b|bowel|liver|pancreat|nutrition|nausea|vomit|diarr)/.test(h)) return "gi";
  if (/(wound|skin|pressure ulcer|fracture|mobility|musculoskeletal)/.test(h)) return "msk";
  if (/(anemia|transfusion|platelet|coagul|neutropen|immunoglobulin)/.test(h)) return "hematology_immuno";
  return "general";
}
