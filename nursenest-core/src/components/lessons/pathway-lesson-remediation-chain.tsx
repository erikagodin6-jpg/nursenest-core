import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { resolveRnCompetencyForTopic } from "@/lib/educational-graph/rn-competency-ontology";
import { PathwayLessonRemediationChainClient } from "@/components/lessons/pathway-lesson-remediation-chain-client";

/**
 * Remediation ladder on public lesson detail — canonical graph orchestration + governed telemetry.
 */
export function PathwayLessonRemediationChain({
  pathway,
  topicSlug,
  topicLabel,
  lessonSlug,
}: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  lessonSlug: string;
}) {
  const traversal = orchestrateEducationalGraph({
    topicSlug,
    topicLabel,
    marketingPathway: pathway,
    anchorLessonSlug: lessonSlug,
    sourceSurface: "marketing_lesson",
    maxLessonSteps: 2,
  });
  if (traversal.steps.length < 3) return null;

  const competency = resolveRnCompetencyForTopic(topicSlug);
  const competencyHeading = competency ? `Strengthen: ${competency.label}` : "Remediation pathway";

  return <PathwayLessonRemediationChainClient traversal={traversal} competencyHeading={competencyHeading} />;
}
