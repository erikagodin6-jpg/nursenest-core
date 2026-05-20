import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import type { CoachingModel, CompetencyGraphStep } from "@/lib/learner/post-exam-coaching/types";

export function buildRnRemediationGraphSteps(args: {
  topic: string;
  pathwayId: string | null;
  coachingModel: CoachingModel;
  exposureDepth: number;
  sourceSurface: GraphSourceSurface;
}): CompetencyGraphStep[] {
  const traversal = orchestrateEducationalGraph({
    topicSlug: args.topic,
    pathwayId: args.pathwayId,
    sourceSurface: args.sourceSurface,
    coachingModel: args.coachingModel,
    exposureDepth: args.exposureDepth,
  });
  return traversal.steps.map((step) => ({
    depth: step.depth,
    kind:
      step.stepKind === "flashcards"
        ? "flashcards"
        : step.stepKind === "reassessment"
          ? "readiness_reassessment"
          : step.stepKind === "mechanism"
            ? "mechanism"
            : step.stepKind === "foundational_lesson" || step.stepKind === "lesson"
              ? "lesson"
              : "drill",
    title: step.title,
    reason: step.description,
    href: step.href,
  }));
}
