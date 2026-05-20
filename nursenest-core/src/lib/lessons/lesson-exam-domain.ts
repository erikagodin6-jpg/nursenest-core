/**
 * Editorial / SEO taxonomy for nursing exam lesson content (no DB migration required).
 * Values are **hints** inferred from title, topic, and body-system fields — use for planning,
 * filters, and aligning question rationales with lesson hubs.
 */
export const LESSON_EXAM_DOMAIN_IDS = [
  "diseases",
  "syndromes",
  "medications",
  "safety",
  "prioritization",
  "case_studies",
  "assessment",
  "other",
] as const;

export type LessonExamDomainId = (typeof LESSON_EXAM_DOMAIN_IDS)[number];

const RE = {
  syndrome: /\bsyndrome\b|charcot|down syndrome|metabolic syndrome|nephrotic|dress\b|cushing|sheehan|reiter|guillain|sj[oö]gren/i,
  disease: /\b(disease|disorder|failure|insufficiency|infection|pneumonia|sepsis|uti\b|copd|chf|mi\b|stroke|diabetes|hepatitis|tb\b)/i,
  medication: /\b(drug|medication|pharm|dose|insulin|antibiotic|anticoag|opioid|benzodiazep|ssri|diuretic|ace\b|arb\b|beta\b)/i,
  safety: /\b(safety|fall|restraint|infection control|isolation|ppe\b|hand hygiene|error|wrong.site|fire|evacuation)/i,
  prioritization: /\b(priorit|triage|first action|urgent|emergent|abcs\b|maslow|delegate|assignment)/i,
  caseStudy: /\b(case study|unfolding|scenario|vignette|situational)/i,
  assessment: /\b(assessment|vital|physical exam|inspection|palpation|percussion|auscultation|glasgow|pain scale)/i,
} as const;

/**
 * Returns 1–3 domain tags for a lesson row (deterministic, cheap string heuristics).
 */
export function inferLessonExamDomains(fields: {
  title: string;
  topic?: string | null;
  bodySystem?: string | null;
  slug?: string | null;
}): LessonExamDomainId[] {
  const blob = [fields.title, fields.topic ?? "", fields.bodySystem ?? "", fields.slug ?? ""].join(" ").toLowerCase();
  const out: LessonExamDomainId[] = [];

  if (RE.caseStudy.test(blob)) out.push("case_studies");
  if (RE.prioritization.test(blob)) out.push("prioritization");
  if (RE.safety.test(blob)) out.push("safety");
  if (RE.medication.test(blob)) out.push("medications");
  if (RE.syndrome.test(blob)) out.push("syndromes");
  if (RE.disease.test(blob)) out.push("diseases");
  if (RE.assessment.test(blob)) out.push("assessment");

  if (out.length === 0) out.push("other");
  return [...new Set(out)].slice(0, 3) as LessonExamDomainId[];
}
