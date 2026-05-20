import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { toCompetencyGraphSteps } from "@/lib/educational-graph/graph-step-adapters";
import { maxGraphStepsForSurface } from "@/lib/educational-graph/graph-surface-caps";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import type { CompetencyGraphStep, CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

/**
 * RN remediation graph — thin adapter over {@link orchestrateEducationalGraph}.
 */
export function buildRnRemediationGraphSteps(args: {
  topic: string;
  pathwayId: string | null;
  coachingModel: CoachingModel;
  exposureDepth: number;
  learnerState?: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
  sourceSurface?: GraphSourceSurface;
  maxSteps?: number;
}): CompetencyGraphStep[] {
  const sourceSurface = args.sourceSurface ?? "app_remediation";
  const traversal = orchestrateEducationalGraph({
    topicSlug: args.topic,
    pathwayId: args.pathwayId,
    coachingModel: args.coachingModel,
    exposureDepth: args.exposureDepth,
    learnerState: args.learnerState ?? null,
    persistentWeakTopics: args.persistentWeakTopics,
    sourceSurface,
    maxSteps: args.maxSteps ?? maxGraphStepsForSurface(sourceSurface, {
      fatigueScore: args.learnerState?.remediationFatigueScore,
    }),
  });
  return toCompetencyGraphSteps(traversal.steps);
}
