/**
 * Semantic governance middleware — validates learner-facing cognition copy at orchestration boundaries.
 */
import { governCoachingReportCopy } from "@/lib/learner/rn-coaching-intelligence/ai-coaching-governance";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import {
  governOrchestratedLearnerCopy,
  validateOrchestratedLearnerSemantics,
} from "@/lib/testing/psychometric-orchestrator";
import {
  logCognitionGovernanceViolation,
  type CognitionGovernanceViolation,
} from "@/lib/educational-cognition/governance-observability";

export type SemanticGovernanceResult = {
  ok: boolean;
  sanitized: string;
  violations: CognitionGovernanceViolation[];
};

export function governCognitionNarrative(
  pathwayId: string | null | undefined,
  text: string,
  surface: string,
): SemanticGovernanceResult {
  const violations: CognitionGovernanceViolation[] = [];
  const orchestrated = validateOrchestratedLearnerSemantics(pathwayId, text);
  if (!orchestrated.ok) {
    violations.push({
      code: "psychometric_copy",
      surface,
      pathwayId: pathwayId ?? null,
      detail: "Psychometric copy violation",
    });
    logCognitionGovernanceViolation(violations[violations.length - 1]);
  }
  return {
    ok: violations.length === 0,
    sanitized: orchestrated.sanitized,
    violations,
  };
}

export function governCoachingNarrativeBlocks(
  pathwayId: string | null | undefined,
  blocks: string[],
  coachingModel: CoachingModel,
): string[] {
  const governedPsych = blocks.map((b) => governOrchestratedLearnerCopy(pathwayId, b).sanitized);
  return governCoachingReportCopy(governedPsych, coachingModel);
}
