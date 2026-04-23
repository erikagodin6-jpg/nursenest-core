/**
 * Deterministic nursing taxonomy — rule-based only (no embeddings, no LLM).
 * Used for hub grouping, legacy `classifyLearningTopic` compatibility, and write-time checks.
 */

import { stripToPlainText } from "@/lib/content-quality/plain-text";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export type NursingTaxonomyDomain = "clinical" | "professional";

/** Hub / learning-structure category ids (+ explicit review bucket). */
export type NursingTaxonomyCategoryId =
  | "cardiovascular"
  | "respiratory"
  | "neurology"
  | "endocrine"
  | "renal-genitourinary"
  | "gastrointestinal"
  | "hematology-oncology"
  | "immune-infectious"
  | "musculoskeletal"
  | "dermatology"
  | "mental-health"
  | "pharmacology"
  | "reproductive-ob-gyn"
  | "pediatrics"
  | "fundamentals"
  | "professional-practice-ethics"
  | "taxonomy-review-required";

export type NursingTaxonomyClassification = {
  domain: NursingTaxonomyDomain;
  categoryId: NursingTaxonomyCategoryId;
  /** Short token for logs (first matched rule bucket). */
  ruleHint: string;
};

const TAXONOMY_REVIEW: NursingTaxonomyCategoryId = "taxonomy-review-required";
const PROFESSIONAL_HUB: NursingTaxonomyCategoryId = "professional-practice-ethics";

function hasAny(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

/** Disease, anatomy, physiology, meds, symptoms — if any hit, domain is clinical (non‑negotiable). */
const CLINICAL_DOMAIN_SIGNALS: readonly RegExp[] = [
  /\b(hand hygiene|standard precautions|transmission-?based precautions|isolation precaution|surgical asepsis|chain of infection|ppe\b|personal protective equipment)\b/,
  /\b(disease|disorder|syndrome|pathophys|pathology|diagnos|symptom|signs?|manifestation)\b/,
  /\b(patient|clients?)\b.*\b(acute|chronic|unstable|critical|unstable)\b/,
  /\b(medication|medications|pharmacol|drug|dose|dosage|tablet|infusion|iv\b|oral\b|subcut|intramusc|antibiotic|anticoag|insulin|opioid|benzodiazep|diuretic|beta[\s-]?blocker|ace\b|arb\b)\b/,
  /\b(lab\b|cbc\b|bmp\b|troponin|creatinine|hemoglobin|platelet|inr\b|a1c\b|glucose|electrolyte|potassium|sodium|bicarb|lactate)\b/,
  /\b(anatomy|physiology|hemodynamic|perfusion|oxygenation|ventilation)\b/,
  /\b(myocardial|infarction|ischemia|heart failure|cardiogenic|pulmonary edema|shock|sepsis|septic)\b/,
  /\b(hypertension|hypotension|tachycardia|bradycardia|arrhythm|a-?fib|afib|atrial fibrillation|stroke|seizure|mi\b|stemi|nstemi)\b/,
  /\b(pneumonia|copd|asthma|respiratory failure|hypoxia|hypercapnia|intubat|ventilator)\b/,
  /\b(kidney|renal|nephro|dialysis|aki\b|ckd\b|urinary|uti\b|glomerul)\b/,
  /\b(diabetes|dka\b|hhs\b|thyroid|adrenal|cortisol|insulin)\b/,
  /\b(cancer|tumor|malign|chemo|oncolog|neutropenia|anemia|leukemia|lymphoma)\b/,
  /\b(infection|bacteremia|viremia|antimicrobial|antibiotic)\b/,
  /\b(wound|ulcer|cellulitis|rash|dermat|skin integrity)\b/,
  /\b(fracture|bone|joint|spine|orthopedic)\b/,
  /\b(pregnancy|labor|postpartum|neonatal|fetal)\b/,
  /\b(depression|psychiat|suicid|schizo|bipolar|anxiety disorder)\b/,
];

/** Non‑clinical professional signals — only evaluated when {@link CLINICAL_DOMAIN_SIGNALS} did not fire. */
const PROFESSIONAL_DOMAIN_SIGNALS: readonly RegExp[] = [
  /\b(professional practice|nursing jurisprudence|code of ethics)\b/,
  /\b(ethics|ethical|moral distress|bioethics)\b/,
  /\b(legal|law\b|lawsuit|liability|malpractice|consent\b|hipaa|phi\b)\b/,
  /\b(documentation|charting|ehr\b|emar\b|nursing note)\b/,
  /\b(communication|therapeutic relationship|interprofessional|handoff|sbar\b)\b/,
  /\b(scope of practice|nurse practice act|standards of practice)\b/,
  /\b(delegation|delegate|supervision of|unlicensed assist)\b/,
  /\b(leadership|management|quality improvement|qi\b|pdsa|root cause)\b/,
  /\b(safety culture|near miss|incident report|just culture)\b/,
  /\b(infection prevention|policy|accreditation|joint commission)\b/,
];

const CARDIO: readonly RegExp[] = [
  /cardio|heart|coronary|cad\b|ecg|ekg|arrhythm|hypertension|\bmi\b|stemi|nstemi|angina|a-?fib|afib|atrial fibrillation|heart failure|cardiomyopathy|pericard|endocard|valvular|pacemaker|defibrillator|shock\b|hemodynamic/,
];
const RESP: readonly RegExp[] = [
  /respir|pulmon|airway|asthma|copd|oxygen|ventilat|intubat|extubat|pneumonia|abg|pleural|pulmonary embol|\bpe\b/,
];
const NEURO: readonly RegExp[] = [
  /neuro|brain|stroke|seizure|cns\b|icp\b|delirium|tbi\b|gcs\b|tia\b|mening|parkinson|multiple sclerosis/,
];
const GI: readonly RegExp[] = [
  /\bgi\b|gastro|intestinal|bowel|liver|hepat|pancrea|ibd|crohn|colitis|cirrhosis|constipation|diarrhea|nausea|vomit/,
];
const RENAL: readonly RegExp[] = [
  /renal|kidney|nephro|glomerul|creatinine|\bbun\b|dialysis|dialysate|\baki\b|\bckd\b|oliguria|anuria|polyuria|urolith|urinary|urolog|\buti\b|pyelo|cystitis|prostat|\bbph\b|\bgu\b|genitourinary|bladder|foley|catheter/,
];
const ENDO: readonly RegExp[] = [
  /endocrine|diabet|\bdka\b|\bhhs\b|thyroid|adrenal|pituitary|hypoglyc|hyperglyc|cortisol/,
];
const MSK: readonly RegExp[] = [
  /musculo|orthop|fracture|cast|splint|arthritis|sprain|strain|joint|bone|spine|rheumat/,
];
const HEME_ONC: readonly RegExp[] = [
  /heme|hemat|oncolog|anemia|leukemia|lymphoma|sickle|thrombocytopen|chemotherapy|neutropenia|coagul|infusion reaction/,
];
const IMMUNE: readonly RegExp[] = [
  /immune|immunocomprom|autoimmune|sepsis|septic|infectious disease|hiv\b|tuberculosis|\btb\b|antimicrobial stewardship|hand hygiene|standard precautions|isolation precaution|infection control/,
];
const DERM: readonly RegExp[] = [
  /dermat|skin integrity|pressure injury|pressure ulcer|burn\b|rash|eczema|psoriasis|cellulitis/,
];
const REPRO: readonly RegExp[] = [
  /obstetric|ob-?gyn|pregnan|antepartum|postpartum|intrapartum|labor|delivery|neonatal|lactation|contracept|gyne|fetal/,
];
const PEDS: readonly RegExp[] = [
  /pediatric|paediatric|child\b|infant|newborn|adolescent|well-?child/,
];
const MH: readonly RegExp[] = [
  /mental health|psychiat|depress|anxiety\b|suicid|behavioral health|bipolar|schizo|ptsd|substance use/,
];
const PHARM: readonly RegExp[] = [
  /pharmac|medication administration|contraindication|adverse effect|black box|antidote/,
];
const FUNDAMENTALS: readonly RegExp[] = [
  /vital signs|bedmaking|transfer technique|body mechanics|aseptic technique|sterile field|chain of infection/,
];

function mapClinicalSystem(text: string): NursingTaxonomyCategoryId | null {
  if (hasAny(text, CARDIO)) return "cardiovascular";
  if (hasAny(text, RESP)) return "respiratory";
  if (hasAny(text, NEURO)) return "neurology";
  if (hasAny(text, RENAL)) return "renal-genitourinary";
  if (hasAny(text, GI)) return "gastrointestinal";
  if (hasAny(text, ENDO)) return "endocrine";
  if (hasAny(text, MSK)) return "musculoskeletal";
  if (hasAny(text, HEME_ONC)) return "hematology-oncology";
  if (hasAny(text, IMMUNE)) return "immune-infectious";
  if (hasAny(text, DERM)) return "dermatology";
  if (hasAny(text, REPRO)) return "reproductive-ob-gyn";
  if (hasAny(text, PEDS)) return "pediatrics";
  if (hasAny(text, MH)) return "mental-health";
  if (hasAny(text, PHARM)) return "pharmacology";
  if (hasAny(text, FUNDAMENTALS)) return "fundamentals";
  return null;
}

export function contentSignalsClinicalDomain(text: string): boolean {
  const t = text.toLowerCase();
  return hasAny(t, CLINICAL_DOMAIN_SIGNALS);
}

export function contentSignalsProfessionalDomain(text: string): boolean {
  const t = text.toLowerCase();
  return hasAny(t, PROFESSIONAL_DOMAIN_SIGNALS);
}

export function normalizeTaxonomyCorpus(input: {
  title?: string | null;
  content?: string | null;
  keywords?: readonly string[] | null;
}): string {
  const parts = [
    input.title ?? "",
    input.content ?? "",
    ...(input.keywords ?? []),
  ];
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Primary classifier: single deterministic bucket (no multi-label).
 * Clinical domain always wins when {@link CLINICAL_DOMAIN_SIGNALS} match.
 */
export function classifyNursingContent(input: {
  title?: string | null;
  content?: string | null;
  keywords?: readonly string[] | null;
}): NursingTaxonomyClassification {
  const corpus = normalizeTaxonomyCorpus(input).toLowerCase();
  if (!corpus) {
    return { domain: "clinical", categoryId: TAXONOMY_REVIEW, ruleHint: "empty_corpus" };
  }

  const clinicalDomain = contentSignalsClinicalDomain(corpus);
  if (clinicalDomain) {
    const sys = mapClinicalSystem(corpus);
    if (sys) {
      return { domain: "clinical", categoryId: sys, ruleHint: `clinical:${sys}` };
    }
    return { domain: "clinical", categoryId: TAXONOMY_REVIEW, ruleHint: "clinical_domain_no_system" };
  }

  if (contentSignalsProfessionalDomain(corpus)) {
    return { domain: "professional", categoryId: PROFESSIONAL_HUB, ruleHint: "professional" };
  }

  return { domain: "clinical", categoryId: TAXONOMY_REVIEW, ruleHint: "ambiguous" };
}

const SECTION_CORPUS_MAX = 12_000;

export function buildPathwayLessonTaxonomyCorpus(
  lesson: Pick<
    PathwayLessonRecord,
    "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "system" | "sections"
  >,
): string {
  const heads = (lesson.sections ?? [])
    .slice(0, 24)
    .map((s) => `${s.heading ?? ""} ${stripToPlainText(typeof s.body === "string" ? s.body : "")}`)
    .join(" ");
  const raw = [
    lesson.system ?? "",
    lesson.bodySystem ?? "",
    lesson.title,
    lesson.topic,
    lesson.topicSlug,
    lesson.seoDescription,
    heads,
  ].join(" ");
  const collapsed = raw.replace(/\s+/g, " ").trim();
  return collapsed.length > SECTION_CORPUS_MAX ? collapsed.slice(0, SECTION_CORPUS_MAX) : collapsed;
}

export function classifyPathwayLessonRecordForHub(
  lesson: Pick<
    PathwayLessonRecord,
    "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "system" | "sections"
  >,
): NursingTaxonomyClassification {
  const corpus = buildPathwayLessonTaxonomyCorpus(lesson);
  return classifyNursingContent({ title: corpus });
}
