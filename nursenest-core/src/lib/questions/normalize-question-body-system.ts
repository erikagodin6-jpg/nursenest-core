/**
 * Canonical practice-hub body systems for question bank + marketing hub.
 * Maps free-text `ExamQuestion.bodySystem` / `topic` (+ optional lesson bodySystem) into one id.
 */

export const PRACTICE_BODY_SYSTEM_HUB_IDS = [
  "cardiovascular",
  "respiratory",
  "neurological",
  "gastrointestinal",
  "endocrine",
  "renal_urinary",
  "musculoskeletal",
  "integumentary",
  "hematology_oncology",
  "immune_infection",
  "maternity_reproductive",
  "pediatrics",
  "mental_health",
  "pharmacology",
  "fundamentals_safety",
  "leadership_prioritization",
  "community_public_health",
  "emergency_critical_care",
  "uncategorized",
] as const;

export type PracticeBodySystemHubId = (typeof PRACTICE_BODY_SYSTEM_HUB_IDS)[number];

const HUB_SET = new Set<string>(PRACTICE_BODY_SYSTEM_HUB_IDS);

export function isPracticeBodySystemHubId(id: string | null | undefined): id is PracticeBodySystemHubId {
  return typeof id === "string" && HUB_SET.has(id as PracticeBodySystemHubId);
}

/** Display copy for fixed hubs (counts come from aggregates). */
export const PRACTICE_BODY_SYSTEM_HUB_META: ReadonlyArray<{
  id: Exclude<PracticeBodySystemHubId, "uncategorized">;
  label: string;
  description: string;
}> = [
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    description: "Cardiac output, vascular disorders, hemodynamics, and acute coronary syndromes.",
  },
  {
    id: "respiratory",
    label: "Respiratory",
    description: "Airway management, ventilation, gas exchange, and oxygenation problems.",
  },
  {
    id: "neurological",
    label: "Neurological",
    description: "Stroke, seizures, ICP, cranial nerves, and neuro assessment.",
  },
  {
    id: "gastrointestinal",
    label: "Gastrointestinal",
    description: "GI bleeding, liver disease, nutrition, absorption, and elimination.",
  },
  {
    id: "endocrine",
    label: "Endocrine",
    description: "Diabetes, thyroid, adrenal, and hormonal regulation.",
  },
  {
    id: "renal_urinary",
    label: "Renal / Urinary",
    description: "Kidney disease, dialysis, fluids and electrolytes, and acid–base balance.",
  },
  {
    id: "musculoskeletal",
    label: "Musculoskeletal",
    description: "Mobility, fractures, arthritis, and musculoskeletal assessment.",
  },
  {
    id: "integumentary",
    label: "Integumentary",
    description: "Wounds, burns, pressure injury, and dermatologic nursing care.",
  },
  {
    id: "hematology_oncology",
    label: "Hematology / Oncology",
    description: "Blood disorders, transfusion, oncologic treatment effects, and neutropenic precautions.",
  },
  {
    id: "immune_infection",
    label: "Immune / Infection Control",
    description: "Isolation, sepsis, immunosuppression, and standard precautions.",
  },
  {
    id: "maternity_reproductive",
    label: "Maternity / Reproductive",
    description: "Antepartum, intrapartum, postpartum, and newborn transition.",
  },
  {
    id: "pediatrics",
    label: "Pediatrics",
    description: "Growth, development, pediatric illness, and family-centered care.",
  },
  {
    id: "mental_health",
    label: "Mental Health",
    description: "Therapeutic communication, safety, psychotropic medications, and behavioral health.",
  },
  {
    id: "pharmacology",
    label: "Pharmacology",
    description: "Drug classes, interactions, adverse effects, and safe administration.",
  },
  {
    id: "fundamentals_safety",
    label: "Fundamentals / Safety",
    description: "Vital signs, infection prevention, mobility, and foundational nursing skills.",
  },
  {
    id: "leadership_prioritization",
    label: "Leadership / Prioritization",
    description: "Delegation, prioritization, ethical/legal scope, and care coordination.",
  },
  {
    id: "community_public_health",
    label: "Community / Public Health",
    description: "Population health, screening, outbreaks, and health promotion.",
  },
  {
    id: "emergency_critical_care",
    label: "Emergency / Critical Care",
    description: "Shock, trauma, resuscitation, and high-acuity stabilization.",
  },
];

/** Primary `topic` bias strings for adaptive practice / CAT pool (matches legacy topic labels). */
export const PRACTICE_HUB_CAT_TOPIC_NAME: Partial<Record<PracticeBodySystemHubId, string>> = {
  cardiovascular: "Cardiovascular",
  respiratory: "Respiratory",
  neurological: "Neurological",
  gastrointestinal: "Gastrointestinal",
  endocrine: "Endocrine",
  renal_urinary: "Renal",
  musculoskeletal: "Musculoskeletal",
  integumentary: "Integumentary",
  hematology_oncology: "Hematology",
  immune_infection: "Immune",
  maternity_reproductive: "Maternity",
  pediatrics: "Pediatrics",
  mental_health: "Mental Health",
  pharmacology: "Pharmacology",
  fundamentals_safety: "Fundamentals",
  leadership_prioritization: "Leadership",
  community_public_health: "Community",
  emergency_critical_care: "Emergency",
};

function norm(s: string | null | undefined): string {
  return (s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function haystack(bodySystem: string | null | undefined, topic: string | null | undefined): string {
  return `${norm(bodySystem)} ${norm(topic)}`;
}

type MatchRule = { hub: PracticeBodySystemHubId; patterns: readonly string[] };

/** Order matters: first matching rule wins (checked after exact maps). */
const KEYWORD_RULES: readonly MatchRule[] = [
  { hub: "cardiovascular", patterns: ["cardiovascular", "cardiac", "cardiology", "vascular", "heart failure", "angina", "mi ", " stemi", "acs"] },
  { hub: "respiratory", patterns: ["respiratory", "pulmonary", "abg", "oxygenation", "airway", "asthma", "pneumonia", "copd", "ventilation"] },
  { hub: "neurological", patterns: ["neurological", "neuro", "stroke", "seizure", "icp", "cranial", "spinal cord", "meningitis"] },
  { hub: "gastrointestinal", patterns: ["gastrointestinal", "gi ", " gi,", "hepatic", "liver", "pancreat", "nutrition", "bowel", "elimination"] },
  { hub: "endocrine", patterns: ["endocrine", "diabetes", "thyroid", "insulin", "hypoglycem", "cushing", "addison", "hormone"] },
  {
    hub: "renal_urinary",
    patterns: ["renal", "urinary", "kidney", "dialysis", "fluid balance", "electrolyte", "acid-base", "f&e", "genitourinary"],
  },
  { hub: "musculoskeletal", patterns: ["musculoskeletal", "orthopedic", "fracture", "arthritis", "mobility", "gait"] },
  { hub: "integumentary", patterns: ["integumentary", "skin", "wound", "burn", "pressure injury", "dermat"] },
  { hub: "hematology_oncology", patterns: ["hematolog", "oncolog", "chemo", "neutropen", "transfusion", "anemia", "clotting"] },
  { hub: "immune_infection", patterns: ["immune", "infection control", "isolation", "sepsis", "hiv", "tb ", " mrsa", "precaution"] },
  {
    hub: "maternity_reproductive",
    patterns: ["maternity", "obstetric", "pregnancy", "labor", "postpartum", "newborn", "reproductive", "prenatal", "gynecolog"],
  },
  { hub: "pediatrics", patterns: ["pediatric", "child", "infant", "adolescent", "neonatal"] },
  { hub: "mental_health", patterns: ["mental health", "psych", "behavioral", "suicide", "anxiety", "depression", "schizo"] },
  { hub: "pharmacology", patterns: ["pharmacology", "medication", "drug", "dosing", "adverse effect", "interaction"] },
  {
    hub: "fundamentals_safety",
    patterns: ["fundamental", "safety", "infection prevention", "vital sign", "positioning", "hygiene", "ergonomic"],
  },
  {
    hub: "leadership_prioritization",
    patterns: ["leadership", "prioritization", "delegation", "management", "supervision", "legal", "ethics", "scope of practice"],
  },
  { hub: "community_public_health", patterns: ["community", "public health", "population", "screening", "immunization campaign", "epidemic"] },
  {
    hub: "emergency_critical_care",
    patterns: ["emergency", "critical care", "icu", "trauma", "resuscitation", "shock", "code blue"],
  },
];

/** Exact normalized bodySystem / topic → hub (legacy labels). */
const EXACT_BODY_OR_TOPIC: ReadonlyArray<{ keys: readonly string[]; hub: PracticeBodySystemHubId }> = [
  { keys: ["cardiovascular", "cardiac"], hub: "cardiovascular" },
  { keys: ["respiratory", "pulmonary"], hub: "respiratory" },
  { keys: ["neurological", "neuro"], hub: "neurological" },
  { keys: ["gastrointestinal", "gi"], hub: "gastrointestinal" },
  { keys: ["endocrine"], hub: "endocrine" },
  { keys: ["renal", "renal / urinary", "renal_urinary", "genitourinary"], hub: "renal_urinary" },
  { keys: ["musculoskeletal"], hub: "musculoskeletal" },
  { keys: ["integumentary"], hub: "integumentary" },
  { keys: ["hematology", "hematologic", "oncology", "hematology_oncology"], hub: "hematology_oncology" },
  { keys: ["immune", "infection control", "immune_infectious"], hub: "immune_infection" },
  { keys: ["reproductive", "maternity", "maternal", "obstetrics"], hub: "maternity_reproductive" },
  { keys: ["pediatrics", "pediatric"], hub: "pediatrics" },
  { keys: ["mental health", "psychiatric", "behavioral health"], hub: "mental_health" },
  { keys: ["pharmacology"], hub: "pharmacology" },
  { keys: ["fundamentals", "safety", "patient safety"], hub: "fundamentals_safety" },
  { keys: ["leadership", "delegation", "prioritization"], hub: "leadership_prioritization" },
  { keys: ["community health", "public health"], hub: "community_public_health" },
  { keys: ["emergency", "critical care"], hub: "emergency_critical_care" },
];

function hubFromExactKey(key: string): PracticeBodySystemHubId | null {
  const k = norm(key);
  if (!k) return null;
  for (const row of EXACT_BODY_OR_TOPIC) {
    if (row.keys.some((c) => c === k)) return row.hub;
  }
  return null;
}

function hubFromKeywordText(text: string): PracticeBodySystemHubId | null {
  const t = text;
  if (!t.trim()) return null;
  for (const rule of KEYWORD_RULES) {
    for (const p of rule.patterns) {
      if (t.includes(p)) return rule.hub;
    }
  }
  return null;
}

export type NormalizeQuestionBodySystemInput = {
  bodySystem?: string | null;
  topic?: string | null;
};

export type NormalizeQuestionBodySystemLessonHint = {
  bodySystem?: string | null;
  topic?: string | null;
};

/**
 * Maps a question row (and optional linked lesson metadata) to a single practice hub id.
 */
export function normalizeQuestionBodySystem(
  question: NormalizeQuestionBodySystemInput,
  linkedLesson?: NormalizeQuestionBodySystemLessonHint | null,
): PracticeBodySystemHubId {
  const fromLessonBs = hubFromExactKey(linkedLesson?.bodySystem ?? "");
  if (fromLessonBs) return fromLessonBs;
  const fromLessonKw = hubFromKeywordText(haystack(linkedLesson?.bodySystem, linkedLesson?.topic));
  if (fromLessonKw) return fromLessonKw;

  const bsExact = hubFromExactKey(question.bodySystem ?? "");
  if (bsExact) return bsExact;
  const topicExact = hubFromExactKey(question.topic ?? "");
  if (topicExact) return topicExact;

  const fromBsKw = hubFromKeywordText(haystack(question.bodySystem, null));
  if (fromBsKw) return fromBsKw;

  const fromTopicKw = hubFromKeywordText(haystack(null, question.topic));
  if (fromTopicKw) return fromTopicKw;

  return "uncategorized";
}

export function parsePracticeHubIdsParam(raw: string | null | undefined, max = 24): PracticeBodySystemHubId[] {
  if (!raw || !raw.trim()) return [];
  const out: PracticeBodySystemHubId[] = [];
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const id = part.trim().toLowerCase();
    if (!isPracticeBodySystemHubId(id)) continue;
    if (id === "uncategorized") continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= max) break;
  }
  return out;
}

export function practiceHubIdsToCatTopicNames(ids: readonly PracticeBodySystemHubId[]): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    const n = PRACTICE_HUB_CAT_TOPIC_NAME[id];
    if (!n || seen.has(n)) continue;
    seen.add(n);
    names.push(n);
  }
  return names;
}
