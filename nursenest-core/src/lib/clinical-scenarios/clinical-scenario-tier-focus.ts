import type { ClinicalNursingScenarioTier } from "@prisma/client";

const TIER_NARRATIVE: Record<ClinicalNursingScenarioTier, string> = {
  RN_NCLEX_RN:
    "RN / NCLEX-RN emphasis: prioritization, first-safe actions, delegation boundaries, and early escalation when trends worsen.",
  RPN_PN:
    "PN / RPN emphasis: trend monitoring, scope-appropriate interventions, structured escalation to RN or provider, and documentation that supports handoffs.",
  NP:
    "NP emphasis: differential diagnosis framing, diagnostics integration, prescribing and protocol pathways, and coordinating acute stabilization.",
  NEW_GRAD:
    "New grad emphasis: what to report immediately, common safety traps, stabilizing basics first, and knowing when to call for help.",
};

/** Human-readable tier lens for learner-facing simulation chrome (maps Prisma enum to product language). */
export function clinicalScenarioTierNarrative(tierFocus: string): string {
  if (tierFocus in TIER_NARRATIVE) {
    return TIER_NARRATIVE[tierFocus as ClinicalNursingScenarioTier];
  }
  return "";
}
