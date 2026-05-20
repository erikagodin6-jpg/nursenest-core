import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { listTopicSiblingLessonsForMarketing } from "@/lib/lessons/pathway-lesson-topic-siblings";

export type MarketingRemediationChainStep = {
  kind: "lesson" | "questions" | "flashcards";
  label: string;
  href: string;
};

/**
 * Competency-oriented remediation steps for public lesson surfaces (catalog-backed, bounded).
 */
export function buildMarketingLessonRemediationChain(input: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  anchorLessonSlug: string;
  maxLessonSteps?: number;
}): MarketingRemediationChainStep[] {
  const topic = input.topicSlug.trim().toLowerCase();
  const label = input.topicLabel.trim() || topic.replace(/-/g, " ");
  if (!topic) return [];

  const siblings = listTopicSiblingLessonsForMarketing({
    pathway: input.pathway,
    topicSlug: topic,
    excludeSlug: input.anchorLessonSlug,
    limit: input.maxLessonSteps ?? 4,
  });

  const steps: MarketingRemediationChainStep[] = [];
  for (const s of siblings.slice(0, input.maxLessonSteps ?? 4)) {
    steps.push({ kind: "lesson", label: s.title, href: s.href });
  }

  const questionsHref = `${buildExamPathwayPath(input.pathway, "questions")}?topic=${encodeURIComponent(topic)}`;
  steps.push({
    kind: "questions",
    label: `Practice ${label} questions`,
    href: questionsHref,
  });

  steps.push({
    kind: "flashcards",
    label: `${label} flashcards`,
    href: `/flashcards/${encodeURIComponent(topic)}`,
  });

  return steps.slice(0, 6);
}
