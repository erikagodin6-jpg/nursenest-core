/**
 * Slug-only index for sync checks (footer, marketing href resolution, next.config redirects).
 * Must match the merged slug set from programmatic page parts + authority batch — see
 * {@link programmatic-registry-import.contract.test.ts} and slug parity checks.
 */
const PROGRAMMATIC_SEO_SLUGS = [
  "nclex-rn-practice-questions",
  "nclex-rn-test-bank",
  "nclex-rn-exam-prep",
  "nclex-rn-lessons",
  "nclex-study-plan",
  "nclex-pn-practice-questions",
  "rex-pn-practice-questions",
  "rex-pn-exam-prep",
  "np-exam-practice-questions",
  "np-exam-prep",
  "canada-np-exam-prep",
  "cnple-practice-questions",
  "np-study-guide-canada",
  "np-clinical-cases",
  "respiratory-therapy-exam-prep",
  "paramedic-exam-prep",
  "medical-laboratory-scientist-exam-prep",
  "radiologic-technology-exam-prep",
  "cardiovascular-nursing-practice-questions",
  "respiratory-nursing-practice-questions",
  "pharmacology-nursing-practice-questions",
  "pediatric-nursing-practice-questions",
  "med-surg-nursing-practice-questions",
  "nursing-lab-values-study-guide",
  "medication-calculation-nursing-guide",
  "clinical-cheat-sheets-nursing",
  "new-graduate-nursing-roadmap",
  "allied-health-career-guides",
  "nursing-flashcards-nclex",
  "nclex-two-week-prep-schedule",
  "heart-failure-nclex-review",
  "siadh-vs-diabetes-insipidus-nclex",
  "dka-vs-hhs-nclex-comparison",
  "hyperkalemia-vs-hypokalemia-nclex",
  "copd-nclex-clinical-guide",
  "sepsis-nclex-early-recognition",
  "pe-vs-dvt-nclex-comparison",
  "acute-kidney-injury-nclex-guide",
  "left-vs-right-heart-failure-nclex",
] as const;

const SLUG_SET = new Set<string>(PROGRAMMATIC_SEO_SLUGS);

export function isProgrammaticSeoSlug(slug: string): boolean {
  return SLUG_SET.has(slug);
}

export function getAllProgrammaticSlugs(): string[] {
  return [...PROGRAMMATIC_SEO_SLUGS];
}
