/**
 * Marketing / SEO copy governance by testing model.
 */
import { auditCnpleContent, type CnpleContentAuditResult } from "@/lib/np/cnple-content-quality-guardrails";
import { isCnplePathway } from "@/lib/testing/testing-model-pathway-map";
import {
  validatePsychometricCopyForPathway,
  type PsychometricCopyViolation,
} from "@/lib/testing/psychometric-isolation";

export type MarketingLanguageAuditResult = {
  ok: boolean;
  violations: PsychometricCopyViolation[];
  cnpleAudit?: CnpleContentAuditResult;
};

/**
 * Validates learner/marketing copy for a pathway's psychometric model.
 * CNPLE runs full CNPLE content guardrails plus LOFT isolation rules.
 */
export function validateTestingModelMarketingLanguage(
  pathwayId: string,
  text: string,
): MarketingLanguageAuditResult {
  const psychometric = validatePsychometricCopyForPathway(pathwayId, text);
  let cnpleAudit: CnpleContentAuditResult | undefined;

  if (isCnplePathway(pathwayId)) {
    cnpleAudit = auditCnpleContent(text);
  }

  const cnpleBlocked = cnpleAudit && !cnpleAudit.ok;
  const psychometricBlocked = psychometric.length > 0;

  return {
    ok: !cnpleBlocked && !psychometricBlocked,
    violations: psychometric,
    cnpleAudit,
  };
}
