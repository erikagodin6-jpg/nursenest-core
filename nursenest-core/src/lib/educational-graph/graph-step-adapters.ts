import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type { MarketingRemediationChainStep } from "@/lib/lessons/marketing-lesson-remediation-chain";
import type { RemediationLadderStep } from "@/lib/educational-graph/remediation-ladder-v2";
import type { TopicHubLearningLink } from "@/lib/educational-graph/topic-hub-learning-graph";

export function toRemediationNavSteps(steps: readonly EduGraphStep[]) {
  return steps.map((s) => ({
    kind: s.stepKind,
    title: s.title,
    href: s.href,
    reason: s.description,
    depth: s.depth,
  }));
}

export function toRemediationLadderSteps(steps: readonly EduGraphStep[]): RemediationLadderStep[] {
  return steps.map((s) => ({
    kind:
      s.stepKind === "lesson"
        ? "foundational_lesson"
        : s.stepKind === "questions" || s.stepKind === "cat"
          ? "practice_questions"
          : s.stepKind === "reassessment"
            ? "mixed_reassessment"
            : s.stepKind,
    label: s.title,
    reason: s.description,
    href: s.href,
    depth: s.depth,
  }));
}

export function toMarketingRemediationChainSteps(steps: readonly EduGraphStep[]): MarketingRemediationChainStep[] {
  return steps
    .filter((s) => ["foundational_lesson", "lesson", "practice_questions", "questions", "flashcards"].includes(s.stepKind))
    .map((s) => ({
      kind: s.stepKind === "flashcards" ? "flashcards" : s.stepKind === "practice_questions" || s.stepKind === "questions" ? "questions" : "lesson",
      label: s.title,
      href: s.href,
    }));
}

export function toTopicHubLearningLinks(
  steps: readonly EduGraphStep[],
  _pathway?: ExamPathwayDefinition,
): TopicHubLearningLink[] {
  return steps.map((s) => ({
    label: s.title,
    href: s.href,
    kind:
      s.stepKind === "mechanism"
        ? "mechanism"
        : s.stepKind === "interpretation"
          ? "interpretation"
          : s.stepKind === "flashcards"
            ? "flashcards"
            : s.stepKind === "reassessment" || s.stepKind === "cat"
              ? "cat"
              : "questions",
  }));
}
