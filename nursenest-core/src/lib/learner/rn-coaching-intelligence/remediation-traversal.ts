import { planRemediationV3 } from "@/lib/learner/rn-coaching-intelligence/remediation-planner-v3";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type UnifiedRemediationHref = {
  href: string;
  title: string;
  kind: string;
  competencyId?: string;
  source: "orchestrator";
};

/**
 * Single remediation href surface — governed planner adapter over {@link orchestrateEducationalGraph}.
 */
export function buildUnifiedRemediationHrefs(args: {
  coachingModel: CoachingModel;
  pathwayId: string | null;
  weakCompetencyIds: string[];
  learnerState?: RnLearnerStateSnapshot | null;
  remediationUserId?: string | null;
  topicLabel?: string;
  sourceSurface?: GraphSourceSurface;
}): UnifiedRemediationHref[] {
  const weakLabels = args.weakCompetencyIds.map((id) => id.replace(/_/g, " "));
  const planner = planRemediationV3({
    coachingModel: args.coachingModel,
    sessionKind: "practice_exam",
    pathwayId: args.pathwayId,
    weakTopicLabels: weakLabels.length ? weakLabels : [args.topicLabel ?? "Clinical focus"],
    learnerState: args.learnerState ?? undefined,
    remediationUserId: args.remediationUserId,
    sourceSurface: args.sourceSurface ?? "dashboard_feed",
  });

  return planner.map((step) => ({
    href: step.href,
    title: step.title,
    kind: step.kind,
    competencyId: args.weakCompetencyIds[0],
    source: "orchestrator" as const,
  }));
}
