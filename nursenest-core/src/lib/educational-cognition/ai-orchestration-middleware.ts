/**
 * AI orchestration middleware — generated educational copy must pass cognition + psychometric gates.
 */
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { governCoachingNarrativeBlocks } from "@/lib/educational-cognition/semantic-governance-middleware";
import { governOrchestratedMarketingCopy } from "@/lib/testing/psychometric-orchestrator";
import {
  logCognitionGovernanceViolation,
  recordAiSemanticCheck,
} from "@/lib/educational-cognition/governance-observability";

export type AiOrchestrationResult = {
  ok: boolean;
  sanitizedBlocks: string[];
  violationCount: number;
};

export function governAiGeneratedEducationalCopy(args: {
  pathwayId: string | null | undefined;
  coachingModel: CoachingModel;
  blocks: string[];
  surface: string;
}): AiOrchestrationResult {
  recordAiSemanticCheck(args.surface);
  const marketingViolations = args.blocks.flatMap((b) => {
    const audit = governOrchestratedMarketingCopy(args.pathwayId ?? "", b);
    return audit.violations;
  });
  if (marketingViolations.length > 0) {
    logCognitionGovernanceViolation({
      code: "marketing_semantics",
      surface: args.surface,
      pathwayId: args.pathwayId ?? null,
      detail: `${marketingViolations.length} marketing violations`,
    });
  }
  const sanitizedBlocks = governCoachingNarrativeBlocks(
    args.pathwayId,
    args.blocks,
    args.coachingModel,
  );
  return {
    ok: marketingViolations.length === 0,
    sanitizedBlocks,
    violationCount: marketingViolations.length,
  };
}
