/**
 * Display-time copy governance — validate learner-facing strings before render (AI, coaching, CMS).
 */
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import {
  assertNoCatLanguageForLoftPathway,
  sanitizeLearnerCopyForPathway,
  validatePsychometricCopyForModel,
  validatePsychometricCopyForPathway,
  type PsychometricCopyViolation,
} from "@/lib/testing/psychometric-isolation";
import { validateTestingModelMarketingLanguage } from "@/lib/testing/testing-marketing-governance";

export type LearnerCopyGovernanceResult =
  | { ok: true; sanitized: string }
  | { ok: false; violations: PsychometricCopyViolation[]; sanitized: string };

/** Validate + sanitize copy for a pathway before showing to learners. */
export function governLearnerDisplayCopy(
  pathwayId: string | null | undefined,
  text: string,
): LearnerCopyGovernanceResult {
  const sanitized = sanitizeLearnerCopyForPathway(pathwayId, text);
  const violations = validatePsychometricCopyForPathway(pathwayId, sanitized);
  if (violations.length > 0) {
    return { ok: false, violations, sanitized };
  }
  return { ok: true, sanitized };
}

/** Strict guard — throws when LOFT pathways receive CAT psychometric language. */
export function assertLearnerDisplayCopy(pathwayId: string | null | undefined, text: string): string {
  const result = governLearnerDisplayCopy(pathwayId, text);
  if (!result.ok) {
    const first = result.violations[0];
    assertNoCatLanguageForLoftPathway(pathwayId, text);
    throw new Error(first?.message ?? "Psychometric copy violation");
  }
  return result.sanitized;
}

/** CMS / marketing publish gate. */
export function governMarketingCopy(pathwayId: string | null | undefined, text: string) {
  return validateTestingModelMarketingLanguage(pathwayId, text);
}

/** Model-only validation (no pathway context). */
export function governCopyForTestingModel(
  model: ReturnType<typeof getTestingModelForPathwayId>,
  text: string,
): PsychometricCopyViolation[] {
  return validatePsychometricCopyForModel(model, text);
}
