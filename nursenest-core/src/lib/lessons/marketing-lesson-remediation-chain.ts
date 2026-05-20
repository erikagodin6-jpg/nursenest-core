import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { toMarketingRemediationChainSteps } from "@/lib/educational-graph/graph-step-adapters";

export type MarketingRemediationChainStep = {
  kind: "lesson" | "questions" | "flashcards";
  label: string;
  href: string;
};

/**
 * @deprecated Prefer {@link orchestrateEducationalGraph} — legacy shape for callers not yet migrated.
 */
export function buildMarketingLessonRemediationChain(input: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  anchorLessonSlug: string;
  maxLessonSteps?: number;
}): MarketingRemediationChainStep[] {
  const traversal = orchestrateEducationalGraph({
    topicSlug: input.topicSlug,
    topicLabel: input.topicLabel,
    marketingPathway: input.pathway,
    anchorLessonSlug: input.anchorLessonSlug,
    sourceSurface: "marketing_lesson",
    maxLessonSteps: input.maxLessonSteps ?? 4,
  });
  return toMarketingRemediationChainSteps(traversal.steps);
}
