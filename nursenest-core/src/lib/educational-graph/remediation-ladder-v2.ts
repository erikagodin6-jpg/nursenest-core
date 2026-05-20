import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { toRemediationLadderSteps } from "@/lib/educational-graph/graph-step-adapters";

export type RemediationLadderStepKind =
  | "mechanism"
  | "foundational_lesson"
  | "interpretation"
  | "prioritization_drill"
  | "practice_questions"
  | "flashcards"
  | "mixed_reassessment";

export type RemediationLadderStep = {
  kind: RemediationLadderStepKind;
  label: string;
  reason: string;
  href: string;
  depth: number;
};

/**
 * @deprecated Prefer {@link orchestrateEducationalGraph} — adapter for marketing lesson surfaces.
 */
export function buildMarketingRemediationLadderV2(input: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  anchorLessonSlug: string;
  maxLessonSteps?: number;
}): RemediationLadderStep[] {
  const traversal = orchestrateEducationalGraph({
    topicSlug: input.topicSlug,
    topicLabel: input.topicLabel,
    marketingPathway: input.pathway,
    anchorLessonSlug: input.anchorLessonSlug,
    sourceSurface: "marketing_lesson",
    maxLessonSteps: input.maxLessonSteps ?? 3,
  });
  return toRemediationLadderSteps(traversal.steps);
}
