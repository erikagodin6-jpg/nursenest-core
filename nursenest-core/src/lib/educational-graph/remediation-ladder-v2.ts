import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { clinicalInterpretationGuidePath, listPublishedClinicalInterpretationGuides } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { publishedMechanismForTopic } from "@/lib/linking/mechanism-link-candidates";
import { normalizeTopicKey } from "@/lib/linking/topic-synonym-map";
import { listTopicSiblingLessonsForMarketing } from "@/lib/lessons/pathway-lesson-topic-siblings";
import { resolveRnCompetencyForTopic } from "@/lib/educational-graph/rn-competency-ontology";

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

const TOPIC_INTERPRETATION_SLUG: Record<string, string> = {
  "abg-interpretation": "abg-interpretation",
  sepsis: "sepsis-interpretation",
  "fluid-balance": "electrolyte-interpretation",
  electrolytes: "electrolyte-interpretation",
  hyperkalemia: "electrolyte-interpretation",
};

function publishedInterpretationForTopic(topicSlug: string): { label: string; href: string } | null {
  const key = normalizeTopicKey(topicSlug) ?? topicSlug;
  const guideSlug = TOPIC_INTERPRETATION_SLUG[key];
  if (guideSlug) {
    const guide = listPublishedClinicalInterpretationGuides().find((g) => g.slug === guideSlug);
    if (guide) return { label: guide.h1, href: clinicalInterpretationGuidePath(guide.slug) };
  }
  for (const g of listPublishedClinicalInterpretationGuides()) {
    if (g.related.topicSlugs.some((t) => (normalizeTopicKey(t) ?? t) === key)) {
      return { label: g.h1, href: clinicalInterpretationGuidePath(g.slug) };
    }
  }
  return null;
}

/**
 * Adaptive competency ladder for public marketing surfaces (bounded, progressive, pathway-scoped).
 */
export function buildMarketingRemediationLadderV2(input: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  anchorLessonSlug: string;
  maxLessonSteps?: number;
}): RemediationLadderStep[] {
  const topic = input.topicSlug.trim().toLowerCase();
  const label = input.topicLabel.trim() || topic.replace(/-/g, " ");
  if (!topic) return [];

  const competency = resolveRnCompetencyForTopic(topic);
  const steps: RemediationLadderStep[] = [];
  let depth = 0;

  const mechanism = publishedMechanismForTopic(topic);
  if (mechanism) {
    steps.push({
      kind: "mechanism",
      label: mechanism.label,
      reason: "Connect bedside cues to physiology before memorizing isolated interventions.",
      href: mechanism.href,
      depth: depth++,
    });
  }

  const siblings = listTopicSiblingLessonsForMarketing({
    pathway: input.pathway,
    topicSlug: topic,
    excludeSlug: input.anchorLessonSlug,
    limit: input.maxLessonSteps ?? 3,
  });
  for (const s of siblings) {
    steps.push({
      kind: "foundational_lesson",
      label: s.title,
      reason: "Build conceptual scaffolding in the same competency cluster.",
      href: s.href,
      depth: depth++,
    });
  }

  const interpretation = publishedInterpretationForTopic(topic);
  if (interpretation) {
    steps.push({
      kind: "interpretation",
      label: interpretation.label,
      reason: "Interpret labs or monitoring trends that drive prioritization in this topic.",
      href: interpretation.href,
      depth: depth++,
    });
  }

  const questionsHref = `${buildExamPathwayPath(input.pathway, "questions")}?topic=${encodeURIComponent(topic)}`;
  steps.push({
    kind: "prioritization_drill",
    label: `Prioritization: ${label}`,
    reason: competency
      ? `Apply ${competency.label.toLowerCase()} judgment on fresh stems.`
      : "Test clinical judgment under time pressure after review.",
    href: questionsHref,
    depth: depth++,
  });

  steps.push({
    kind: "flashcards",
    label: `${label} flashcards`,
    reason: "Spaced reinforcement for recall before a mixed reassessment.",
    href: `/flashcards/${encodeURIComponent(topic)}`,
    depth: depth++,
  });

  steps.push({
    kind: "mixed_reassessment",
    label: "Mixed-domain reassessment",
    reason: "Sample this topic inside a timed or adaptive set to verify transfer.",
    href: buildExamPathwayPath(input.pathway, "cat"),
    depth: depth++,
  });

  return steps.slice(0, 8);
}
