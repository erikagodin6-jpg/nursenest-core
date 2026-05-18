import type { PatientCase } from "@/lib/cases/longitudinal-case-types";
import { CNPLE_SAMPLE_CASES } from "@/content/cases/cnple-sample-cases";
import { CASE_PEDIATRIC_ASTHMA_EXACERBATION } from "@/content/cases/cnple-pediatric-asthma-loft-case";
import { CASE_PEDIATRIC_FEVER_KAWASAKI } from "@/content/cases/cnple-pediatric-fever-kawasaki-loft-case";
import { CNPLE_SUPPLEMENTAL_LOFT_CASES } from "@/content/cases/cnple-supplemental-loft-cases";

/**
 * Canonical runtime catalog for CNPLE LOFT cases.
 *
 * Keep this file as the single import target for UI/API runtime paths so newly
 * authored supplemental cases do not sit in the repository without appearing in
 * the learner case catalog or session launcher.
 */
export const CNPLE_LOFT_CASES: PatientCase[] = [
  ...CNPLE_SAMPLE_CASES,
  ...CNPLE_SUPPLEMENTAL_LOFT_CASES,
  CASE_PEDIATRIC_ASTHMA_EXACERBATION,
  CASE_PEDIATRIC_FEVER_KAWASAKI,
];

export function findCnpleLoftCase(caseId: string): PatientCase | undefined {
  return CNPLE_LOFT_CASES.find((c) => c.id === caseId);
}

/** Free-tier preview: returns cases with premium cases limited to the first step. */
export function getCnpleLoftCasePreview(caseId: string): PatientCase | undefined {
  const found = findCnpleLoftCase(caseId);
  if (!found) return undefined;
  return {
    ...found,
    steps: found.isPremium ? found.steps.slice(0, 1) : found.steps,
  };
}

export function listCnpleLoftCases(): Omit<PatientCase, "steps">[] {
  return CNPLE_LOFT_CASES.map(({ steps: _steps, ...meta }) => meta);
}

export const CNPLE_LOFT_CASE_CATALOG_METRICS = {
  totalCases: CNPLE_LOFT_CASES.length,
  totalSteps: CNPLE_LOFT_CASES.reduce((sum, c) => sum + c.steps.length, 0),
  freePreviewCases: CNPLE_LOFT_CASES.filter((c) => !c.isPremium).length,
  premiumCases: CNPLE_LOFT_CASES.filter((c) => c.isPremium).length,
  domains: Array.from(new Set(CNPLE_LOFT_CASES.flatMap((c) => [c.primaryDomain, ...c.secondaryDomains]))).sort(),
};
