/**
 * Exam-aligned canonical topic buckets for coverage reporting.
 * Maps existing `exam_questions.topic` / `subtopic` / `body_system` / `exam` strings — no DB writes.
 */

export type PathwayFamily = "nclex_rn" | "nclex_pn" | "np" | "allied";

export type NclexCanonicalTopic =
  | "physiological_integrity"
  | "safe_effective_care"
  | "psychosocial"
  | "pharmacology"
  | "prioritization_delegation"
  | "infection_control"
  | "fundamentals_assessment"
  | "maternity_pediatrics"
  | "uncategorized";

export type NpCanonicalTopic =
  | "advanced_assessment"
  | "differential_diagnosis"
  | "pharmacotherapy"
  | "professional_role"
  | "specialty_focus"
  | "uncategorized";

export type AlliedCanonicalTopic =
  | "safety_infection"
  | "procedures_equipment"
  | "lab_diagnostics"
  | "regulation_ethics"
  | "clinical_judgment"
  | "uncategorized";

export type CanonicalTopicSlug = NclexCanonicalTopic | NpCanonicalTopic | AlliedCanonicalTopic;

const NCLEX_TOPIC_LABELS: Record<NclexCanonicalTopic, string> = {
  physiological_integrity: "Physiological integrity",
  safe_effective_care: "Safe & effective care environment",
  psychosocial: "Psychosocial integrity",
  pharmacology: "Pharmacology",
  prioritization_delegation: "Prioritization & delegation",
  infection_control: "Infection control",
  fundamentals_assessment: "Fundamentals & assessment",
  maternity_pediatrics: "Maternity / pediatrics",
  uncategorized: "Uncategorized / needs taxonomy",
};

const NP_TOPIC_LABELS: Record<NpCanonicalTopic, string> = {
  advanced_assessment: "Advanced health assessment",
  differential_diagnosis: "Differential diagnosis & clinical reasoning",
  pharmacotherapy: "Pharmacotherapy (APRN)",
  professional_role: "Professional role / regulation",
  specialty_focus: "Specialty-specific content",
  uncategorized: "Uncategorized / needs taxonomy",
};

const ALLIED_TOPIC_LABELS: Record<AlliedCanonicalTopic, string> = {
  safety_infection: "Safety & infection prevention",
  procedures_equipment: "Procedures & equipment",
  lab_diagnostics: "Labs & diagnostics",
  regulation_ethics: "Regulation & ethics",
  clinical_judgment: "Clinical judgment & prioritization",
  uncategorized: "Uncategorized / needs taxonomy",
};

export function canonicalTopicLabel(slug: CanonicalTopicSlug): string {
  if (slug in NCLEX_TOPIC_LABELS) return NCLEX_TOPIC_LABELS[slug as NclexCanonicalTopic];
  if (slug in NP_TOPIC_LABELS) return NP_TOPIC_LABELS[slug as NpCanonicalTopic];
  return ALLIED_TOPIC_LABELS[slug as AlliedCanonicalTopic];
}

function haystack(topic: string | null, subtopic: string | null, body: string | null, exam: string | null): string {
  return `${topic ?? ""} ${subtopic ?? ""} ${body ?? ""} ${exam ?? ""}`.toLowerCase();
}

/** Infer NCLEX-style family from pathway exam keys (string column values). */
export function inferPathwayFamilyFromExamKeys(examKeys: readonly string[]): PathwayFamily {
  const u = examKeys.join(" ").toUpperCase();
  if (u.includes("ALLIED")) return "allied";
  if (/(\bNP\b|FNP|AGPCNP|AGNP|PMHNP|CNPLE|CAN-NP)/.test(u)) return "np";
  if (/(PN|REX|REX-PN|LVN|LPN|PRACTICAL)/.test(u) && !u.includes("NCLEX-RN")) return "nclex_pn";
  return "nclex_rn";
}

/**
 * Map a question’s labels to one canonical bucket for coverage charts.
 */
export function mapRowToCanonicalTopic(
  family: PathwayFamily,
  row: { topic: string | null; subtopic: string | null; bodySystem: string | null; exam: string | null },
): CanonicalTopicSlug {
  const h = haystack(row.topic, row.subtopic, row.bodySystem, row.exam);

  if (family === "allied") {
    if (/(lab|cbc|bmp|troponin|culture|imaging|x-ray|mri|ct\b)/.test(h)) return "lab_diagnostics";
    if (/(infection|ppe|sterile|hand hygiene|isolation)/.test(h)) return "safety_infection";
    if (/(ethics|scope|regulation|law|licensure|osha)/.test(h)) return "regulation_ethics";
    if (/(priorit|triage|first|urgent|emerg)/.test(h)) return "clinical_judgment";
    if (/(procedure|equipment|device|technique|specimen)/.test(h)) return "procedures_equipment";
    return "uncategorized";
  }

  if (family === "np") {
    if (/(assess|exam|history|physical|pe\b|vitals)/.test(h)) return "advanced_assessment";
    if (/(diagnos|differential|ddx|workup|plan)/.test(h)) return "differential_diagnosis";
    if (/(pharm|prescri|dose|medication|drug|contraindic)/.test(h)) return "pharmacotherapy";
    if (/(role|collaborat|ethic|legal|consent|standard)/.test(h)) return "professional_role";
    if (/(fnp|agpcnp|pmhnp|psych|gero|peds|women|adult)/.test(h)) return "specialty_focus";
    return "uncategorized";
  }

  // nclex_rn / nclex_pn — NCSBN-style client need categories (approximate via keywords)
  if (/(pharm|medication|drug|dosage|adverse)/.test(h)) return "pharmacology";
  if (/(priorit|delegat|assign|first action|most appropriate)/.test(h)) return "prioritization_delegation";
  if (/(psych|mental health|therap|grief|abuse|violence|cultural)/.test(h)) return "psychosocial";
  if (/(infection|ppe|isolation|sterile|hand hygiene|contact precaution)/.test(h)) return "infection_control";
  if (/(ob|maternity|labor|pregnan|neonat|pediatr|child)/.test(h)) return "maternity_pediatrics";
  if (/(fundamentals|assessment|vital|nursing process|admission)/.test(h)) return "fundamentals_assessment";
  if (/(safe|environment|ergonomic|restraint|hazard)/.test(h)) return "safe_effective_care";
  if (/(cardio|resp|renal|gi|neuro|endo|hematolog|fluid|electrolyte|perfusion|immun)/.test(h))
    return "physiological_integrity";

  return "uncategorized";
}
