import { classifyQuestionTopicIntoLessonCategory } from "@/lib/questions/pathway-question-category-structure";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

/**
 * Single shared normalization for practice hub, flashcards hub, analytics, and bank tooling.
 * Order of signal strength matches product rule: structured fields → lesson link → keyword fallback → uncategorized.
 */
export const CANONICAL_STUDY_CATEGORIES = [
  { id: "cardiovascular", label: "Cardiovascular" },
  { id: "respiratory", label: "Respiratory" },
  { id: "neurological", label: "Neurological" },
  { id: "gastrointestinal", label: "Gastrointestinal" },
  { id: "endocrine", label: "Endocrine" },
  { id: "renal_urinary", label: "Renal / Urinary" },
  { id: "musculoskeletal", label: "Musculoskeletal" },
  { id: "integumentary", label: "Integumentary" },
  { id: "hematology_oncology", label: "Hematology / Oncology" },
  { id: "immune_infection_control", label: "Immune / Infection Control" },
  { id: "maternity_reproductive", label: "Maternity / Reproductive" },
  { id: "pediatrics", label: "Pediatrics" },
  { id: "mental_health", label: "Mental Health" },
  { id: "pharmacology", label: "Pharmacology" },
  { id: "fundamentals_safety", label: "Fundamentals / Safety" },
  { id: "delegation_assignment", label: "Delegation / Assignment" },
  { id: "prioritization", label: "Prioritization" },
  { id: "leadership_management", label: "Leadership / Management" },
  { id: "community_public_health", label: "Community / Public Health" },
  { id: "emergency_critical_care", label: "Emergency / Critical Care" },
  { id: "lab_values_diagnostics", label: "Lab Values / Diagnostics" },
  { id: "ethics_legal", label: "Ethics / Legal" },
  { id: "uncategorized", label: "Uncategorized" },
] as const;

export type CanonicalStudyCategoryId = (typeof CANONICAL_STUDY_CATEGORIES)[number]["id"];

const LABEL_BY_ID = new Map<string, string>(
  CANONICAL_STUDY_CATEGORIES.map((c) => [c.id, c.label]),
);

const CANONICAL_ID_SET = new Set<string>(CANONICAL_STUDY_CATEGORIES.map((c) => c.id));

export type StudyCategoryInput = {
  pathwayId?: string | null;
  bodySystem?: string | null;
  category?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  clientNeed?: string | null;
  nclexCategory?: string | null;
  nclexClientNeedsCategory?: string | null;
  nclexClientNeedsSubcategory?: string | null;
  lessonBodySystem?: string | null;
  lessonCategory?: string | null;
  /** When already classified via pathway learning taxonomy. */
  taxonomyLeaf?: string | null;
  tags?: string[] | null;
  /** Optional stem snippet for keyword rescue (keep short — caller trims). */
  stemHint?: string | null;
};

function norm(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

function collapse(s: string): string {
  return s.replace(/[^a-z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

/** True when every token appears as a whole word / token boundary in haystack (lowercase). */
function hasPhrase(hay: string, phrase: string): boolean {
  const h = hay;
  const p = phrase.trim().toLowerCase();
  if (!p) return false;
  if (h.includes(p)) return true;
  const alt = p.replace(/\s+/g, "_");
  return alt.length > 1 && h.includes(alt);
}

function mapBodySystemString(raw: string | null | undefined): CanonicalStudyCategoryId | null {
  const t = collapse(norm(raw));
  if (!t) return null;
  const direct: Record<string, CanonicalStudyCategoryId> = {
    cardiovascular: "cardiovascular",
    cardiac: "cardiovascular",
    cv: "cardiovascular",
    heart: "cardiovascular",
    respiratory: "respiratory",
    pulmonary: "respiratory",
    neurological: "neurological",
    neuro: "neurological",
    cns: "neurological",
    gastrointestinal: "gastrointestinal",
    gi: "gastrointestinal",
    endocrine: "endocrine",
    renal: "renal_urinary",
    renal_urinary: "renal_urinary",
    genitourinary: "renal_urinary",
    gu: "renal_urinary",
    urinary: "renal_urinary",
    musculoskeletal: "musculoskeletal",
    msk: "musculoskeletal",
    integumentary: "integumentary",
    skin: "integumentary",
    dermatology: "integumentary",
    wound: "integumentary",
    hematology: "hematology_oncology",
    hematology_oncology: "hematology_oncology",
    oncology: "hematology_oncology",
    immune: "immune_infection_control",
    infection: "immune_infection_control",
    infection_control: "immune_infection_control",
    maternity: "maternity_reproductive",
    maternity_reproductive: "maternity_reproductive",
    obstetrics: "maternity_reproductive",
    ob: "maternity_reproductive",
    labor: "maternity_reproductive",
    reproductive: "maternity_reproductive",
    pediatrics: "pediatrics",
    pediatric: "pediatrics",
    mental_health: "mental_health",
    psychiatry: "mental_health",
    behavioral: "mental_health",
    pharmacology: "pharmacology",
    fundamentals: "fundamentals_safety",
    fundamentals_safety: "fundamentals_safety",
    safety: "fundamentals_safety",
    delegation: "delegation_assignment",
    delegation_assignment: "delegation_assignment",
    assignment: "delegation_assignment",
    prioritization: "prioritization",
    leadership: "leadership_management",
    leadership_management: "leadership_management",
    management: "leadership_management",
    community: "community_public_health",
    community_public_health: "community_public_health",
    public_health: "community_public_health",
    emergency: "emergency_critical_care",
    emergency_critical_care: "emergency_critical_care",
    critical_care: "emergency_critical_care",
    trauma: "emergency_critical_care",
    lab: "lab_values_diagnostics",
    labs: "lab_values_diagnostics",
    diagnostics: "lab_values_diagnostics",
    ethics: "ethics_legal",
    legal: "ethics_legal",
    ethics_legal: "ethics_legal",
  };
  if (direct[t]) return direct[t];
  for (const s of CANONICAL_STUDY_CATEGORIES) {
    if (t === s.id || t === collapse(s.label)) return s.id;
  }
  return null;
}

function mapNclexBucket(raw: string | null | undefined): CanonicalStudyCategoryId | null {
  const t = collapse(norm(raw));
  if (!t) return null;
  if (t.includes("safe") && t.includes("effective")) return "fundamentals_safety";
  if (t.includes("health_promotion") || t === "healthpromotion" || t.includes("health-promotion"))
    return "community_public_health";
  if (t.includes("psychosocial")) return "mental_health";
  if (t.includes("physiological")) return null;
  if (t.includes("management_of_care") || t.includes("managementofcare")) return "prioritization";
  if (t.includes("pharmacological") || t.includes("pharmacologic")) return "pharmacology";
  if (t.includes("reduction_of_risk") || t.includes("safety") || t.includes("risk_reduction"))
    return "fundamentals_safety";
  if (t.includes("basic_care") || t.includes("comfort")) return "fundamentals_safety";
  return null;
}

const TAXONOMY_LEAF_TO_CANONICAL: Record<string, CanonicalStudyCategoryId> = {
  cardiovascular: "cardiovascular",
  respiratory: "respiratory",
  neurological: "neurological",
  endocrine: "endocrine",
  renal_genitourinary: "renal_urinary",
  gastrointestinal: "gastrointestinal",
  hematology_oncology: "hematology_oncology",
  musculoskeletal: "musculoskeletal",
  integumentary: "integumentary",
  immune_infectious: "immune_infection_control",
  reproductive_obstetrics: "maternity_reproductive",
  pediatrics: "pediatrics",
  cardiovascular_drugs: "pharmacology",
  cns_drugs: "pharmacology",
  endocrine_drugs: "pharmacology",
  anti_infectives: "pharmacology",
  pain_sedation: "pharmacology",
  ethics: "ethics_legal",
  legal_regulation: "ethics_legal",
  documentation: "fundamentals_safety",
  communication: "fundamentals_safety",
  scope_of_practice: "delegation_assignment",
  delegation_supervision: "delegation_assignment",
  leadership_management: "leadership_management",
  patient_safety_quality: "fundamentals_safety",
  test_taking: "prioritization",
  study_strategy: "prioritization",
};

function mapTaxonomyLeaf(leaf: string | null | undefined): CanonicalStudyCategoryId | null {
  const x = (leaf ?? "").trim();
  if (!x) return null;
  if (x === REVIEW_REQUIRED) return "uncategorized";
  return TAXONOMY_LEAF_TO_CANONICAL[x] ?? null;
}

/**
 * Keyword rescue on combined free text (topic, tags, stem). Order matters: more specific buckets first.
 */
function mapKeywordBlob(blob: string): CanonicalStudyCategoryId | null {
  const b = norm(blob);
  if (!b) return null;

  const rules: Array<{ id: CanonicalStudyCategoryId; test: () => boolean }> = [
    {
      id: "delegation_assignment",
      test: () =>
        hasPhrase(b, "delegate") ||
        hasPhrase(b, "delegation") ||
        (hasPhrase(b, "assignment") && (hasPhrase(b, "nurse") || hasPhrase(b, "patient"))) ||
        /\buap\b/.test(b) ||
        (/\b(lvn|lpn)\b/.test(b) && (hasPhrase(b, "task") || hasPhrase(b, "assign") || hasPhrase(b, "supervise"))) ||
        hasPhrase(b, "unlicensed assistive") ||
        (hasPhrase(b, "nurse practice act") && hasPhrase(b, "scope")),
    },
    {
      id: "prioritization",
      test: () =>
        hasPhrase(b, "priorit") ||
        hasPhrase(b, "first action") ||
        hasPhrase(b, "triage") ||
        hasPhrase(b, "most urgent") ||
        (hasPhrase(b, "airway") && hasPhrase(b, "first")),
    },
    {
      id: "leadership_management",
      test: () =>
        hasPhrase(b, "charge nurse") ||
        hasPhrase(b, "nurse manager") ||
        hasPhrase(b, "staffing") ||
        hasPhrase(b, "budget") ||
        hasPhrase(b, "quality improvement") ||
        (hasPhrase(b, "committee") && hasPhrase(b, "nursing")),
    },
    {
      id: "pharmacology",
      test: () =>
        hasPhrase(b, "medication") ||
        hasPhrase(b, "pharmacol") ||
        hasPhrase(b, "drug interaction") ||
        hasPhrase(b, "insulin") ||
        hasPhrase(b, "anticoag") ||
        hasPhrase(b, "dosage") ||
        hasPhrase(b, "adverse effect"),
    },
    {
      id: "immune_infection_control",
      test: () =>
        hasPhrase(b, "infection control") ||
        hasPhrase(b, "ppe") ||
        hasPhrase(b, "isolation") ||
        hasPhrase(b, "standard precaution") ||
        hasPhrase(b, "c diff") ||
        hasPhrase(b, "hand hygiene") ||
        hasPhrase(b, "sterile technique"),
    },
    {
      id: "lab_values_diagnostics",
      test: () =>
        hasPhrase(b, "lab value") ||
        hasPhrase(b, "abg") ||
        hasPhrase(b, "arterial blood") ||
        hasPhrase(b, "electrolyte") ||
        hasPhrase(b, "troponin") ||
        hasPhrase(b, "cbc") ||
        hasPhrase(b, "bmp") ||
        hasPhrase(b, "coagulation") ||
        hasPhrase(b, "diagnostic imaging"),
    },
    {
      id: "ethics_legal",
      test: () =>
        hasPhrase(b, "ethics") ||
        hasPhrase(b, "consent") ||
        hasPhrase(b, "hipaa") ||
        hasPhrase(b, "malpractice") ||
        hasPhrase(b, "mandated reporter") ||
        hasPhrase(b, "advance directive"),
    },
    {
      id: "emergency_critical_care",
      test: () =>
        hasPhrase(b, "emergency") ||
        hasPhrase(b, "trauma") ||
        hasPhrase(b, "code blue") ||
        hasPhrase(b, "resuscitation") ||
        /\bicu\b/.test(b) ||
        hasPhrase(b, "critical care"),
    },
    {
      id: "community_public_health",
      test: () =>
        hasPhrase(b, "community health") ||
        hasPhrase(b, "public health") ||
        hasPhrase(b, "epidemic") ||
        hasPhrase(b, "immunization campaign") ||
        hasPhrase(b, "home health"),
    },
    {
      id: "fundamentals_safety",
      test: () =>
        hasPhrase(b, "fall risk") ||
        hasPhrase(b, "restraint") ||
        hasPhrase(b, "fire safety") ||
        hasPhrase(b, "ergonomic") ||
        hasPhrase(b, "body mechanics"),
    },
    {
      id: "maternity_reproductive",
      test: () =>
        hasPhrase(b, "pregnancy") ||
        hasPhrase(b, "labor") ||
        hasPhrase(b, "postpartum") ||
        hasPhrase(b, "newborn") ||
        hasPhrase(b, "antenatal"),
    },
    {
      id: "pediatrics",
      test: () => hasPhrase(b, "pediatric") || hasPhrase(b, "child") || hasPhrase(b, "infant") || hasPhrase(b, "adolescent"),
    },
    {
      id: "mental_health",
      test: () =>
        hasPhrase(b, "mental health") ||
        hasPhrase(b, "suicid") ||
        hasPhrase(b, "anxiety") ||
        hasPhrase(b, "therapeutic communication"),
    },
    {
      id: "cardiovascular",
      test: () =>
        hasPhrase(b, "cardiac") ||
        hasPhrase(b, "heart failure") ||
        hasPhrase(b, "angina") ||
        hasPhrase(b, "ekg") ||
        hasPhrase(b, "ecg"),
    },
    {
      id: "respiratory",
      test: () =>
        hasPhrase(b, "asthma") ||
        hasPhrase(b, "pneumonia") ||
        hasPhrase(b, "copd") ||
        hasPhrase(b, "oxygen") ||
        hasPhrase(b, "ventilator"),
    },
    {
      id: "neurological",
      test: () =>
        hasPhrase(b, "stroke") ||
        hasPhrase(b, "seizure") ||
        hasPhrase(b, "intracranial") ||
        hasPhrase(b, "spinal cord"),
    },
    {
      id: "gastrointestinal",
      test: () =>
        hasPhrase(b, "bowel") ||
        hasPhrase(b, "gi bleed") ||
        hasPhrase(b, "liver") ||
        hasPhrase(b, "pancreat"),
    },
    {
      id: "endocrine",
      test: () =>
        hasPhrase(b, "diabetes") ||
        hasPhrase(b, "thyroid") ||
        hasPhrase(b, "cortisol") ||
        hasPhrase(b, "hypoglycemia"),
    },
    {
      id: "renal_urinary",
      test: () =>
        hasPhrase(b, "dialysis") ||
        hasPhrase(b, "renal failure") ||
        hasPhrase(b, "urinary tract") ||
        /\buti\b/.test(b),
    },
    {
      id: "musculoskeletal",
      test: () => hasPhrase(b, "fracture") || hasPhrase(b, "joint") || hasPhrase(b, "mobility"),
    },
    {
      id: "integumentary",
      test: () => hasPhrase(b, "wound") || hasPhrase(b, "pressure injury") || hasPhrase(b, "burn"),
    },
    {
      id: "hematology_oncology",
      test: () => hasPhrase(b, "anemia") || hasPhrase(b, "transfusion") || hasPhrase(b, "chemotherapy"),
    },
  ];

  for (const { id, test } of rules) {
    try {
      if (test()) return id;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function compileBlob(input: StudyCategoryInput): string {
  const parts = [
    input.category,
    input.topic,
    input.subtopic,
    input.clientNeed,
    input.nclexCategory,
    input.nclexClientNeedsCategory,
    input.nclexClientNeedsSubcategory,
    input.lessonCategory,
    input.stemHint,
    ...(input.tags ?? []),
  ];
  return parts.map((p) => norm(p)).filter(Boolean).join(" | ");
}

/**
 * Normalize any mixture of exam-question / lesson / taxonomy signals into one canonical study category.
 */
export function normalizeStudyCategory(input: StudyCategoryInput): { id: CanonicalStudyCategoryId; label: string } {
  const steps: Array<() => CanonicalStudyCategoryId | null> = [
    () => mapBodySystemString(input.bodySystem),
    () => mapBodySystemString(input.category),
    () => mapKeywordBlob(norm(input.topic ?? "")),
    () => mapKeywordBlob(norm(input.subtopic ?? "")),
    () => mapNclexBucket(input.clientNeed),
    () => mapNclexBucket(input.nclexCategory),
    () => mapNclexBucket(input.nclexClientNeedsCategory),
    () => mapNclexBucket(input.nclexClientNeedsSubcategory),
    () => mapBodySystemString(input.lessonBodySystem),
    () => mapBodySystemString(input.lessonCategory),
    () => mapTaxonomyLeaf(input.taxonomyLeaf),
  ];

  for (const step of steps) {
    const id = step();
    if (id && id !== "uncategorized") {
      return { id, label: LABEL_BY_ID.get(id) ?? id };
    }
  }

  const blob = compileBlob(input);
  const kw = mapKeywordBlob(blob);
  if (kw) return { id: kw, label: LABEL_BY_ID.get(kw) ?? kw };

  return { id: "uncategorized", label: LABEL_BY_ID.get("uncategorized") ?? "Uncategorized" };
}

/** Discovery buckets only carry `topic` + pathway — reuse pathway topic classifier + keyword rescue. */
export function normalizeStudyCategoryForDiscoveryTopic(topic: string, pathwayId: string): {
  id: CanonicalStudyCategoryId;
  label: string;
} {
  const { categoryId } = classifyQuestionTopicIntoLessonCategory(topic, pathwayId);
  return normalizeStudyCategory({ pathwayId, topic, taxonomyLeaf: categoryId });
}

export function normalizeStudyCategoryForExamQuestionRow(row: {
  bodySystem?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  nclexClientNeedsCategory?: string | null;
  nclexClientNeedsSubcategory?: string | null;
  pathwayId?: string | null;
}): { id: CanonicalStudyCategoryId; label: string } {
  return normalizeStudyCategory({
    pathwayId: row.pathwayId,
    bodySystem: row.bodySystem,
    topic: row.topic,
    subtopic: row.subtopic,
    nclexClientNeedsCategory: row.nclexClientNeedsCategory,
    nclexClientNeedsSubcategory: row.nclexClientNeedsSubcategory,
    clientNeed: row.nclexClientNeedsCategory,
    nclexCategory: row.nclexClientNeedsCategory,
  });
}

export function isCanonicalStudyCategoryId(id: string): id is CanonicalStudyCategoryId {
  return CANONICAL_ID_SET.has(id);
}
