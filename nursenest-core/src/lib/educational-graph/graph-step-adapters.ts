import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type {
  CoachingRecommendation,
  CoachingSessionKind,
  CompetencyGraphStep,
  RemediationStepKind,
} from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { EduGraphStep, EduGraphStepKind, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import { normalizeGraphTopicSlug } from "@/lib/educational-graph/graph-href-builders";
import type { RemediationLadderStep } from "@/lib/educational-graph/remediation-ladder-v2";
import type { MarketingRemediationChainStep } from "@/lib/lessons/marketing-lesson-remediation-chain";

const TO_LEGACY_KIND: Record<EduGraphStepKind, RemediationStepKind | "cat" | "review"> = {
  mechanism: "mechanism",
  lesson: "lesson",
  interpretation: "lesson",
  glossary: "lesson",
  flashcards: "flashcards",
  prioritization_drill: "drill",
  mixed_case: "drill",
  remediation_review: "drill",
  reassessment: "readiness_reassessment",
  cat_exam: "readiness_reassessment",
  loft_simulation: "simulation",
};

export function toCompetencyGraphSteps(steps: readonly EduGraphStep[]): CompetencyGraphStep[] {
  return steps.map((s) => ({
    depth: s.graphDepth,
    kind: (TO_LEGACY_KIND[s.stepKind] ?? "lesson") as RemediationStepKind,
    title: s.title,
    reason: s.description,
    href: s.href,
  }));
}

export type RemediationNavStepFromGraph = {
  kind: string;
  title: string;
  href: string;
  reason: string;
  depth: number;
};

export function toRemediationNavSteps(steps: readonly EduGraphStep[]): RemediationNavStepFromGraph[] {
  return toCompetencyGraphSteps(steps).map((s) => ({
    kind: s.kind,
    title: s.title,
    href: s.href,
    reason: s.reason,
    depth: s.depth,
  }));
}

/** Maps planner session context to orchestrator source surface (single traversal authority). */
export function graphSourceSurfaceForPlanner(args: {
  sessionKind: CoachingSessionKind;
  preferDashboard?: boolean;
}): GraphSourceSurface {
  if (args.preferDashboard) return "dashboard_feed";
  switch (args.sessionKind) {
    case "cat":
    case "readiness_assessment":
      return "post_exam_coaching";
    case "loft_simulation":
      return "ai_tutor";
    case "practice_exam":
    case "timed_assessment":
    default:
      return "study_plan";
  }
}

export function graphStepsToCoachingRecommendations(args: {
  steps: readonly EduGraphStep[];
  topicLabel: string;
  startPriority?: number;
  exposureKeyPrefix?: string;
}): CoachingRecommendation[] {
  const legacy = toCompetencyGraphSteps(args.steps);
  let priority = args.startPriority ?? 1;
  const topicKey = normalizeGraphTopicSlug(args.topicLabel);
  return legacy.map((step) => ({
    priority: priority++,
    title: step.title,
    reason: step.reason,
    href: step.href,
    kind: step.kind,
    graphStep: step,
    exposureKey: `${args.exposureKeyPrefix ?? topicKey}::${step.kind}`,
  }));
}

export function toRemediationLadderSteps(steps: readonly EduGraphStep[]): RemediationLadderStep[] {
  const kindMap: Record<string, RemediationLadderStep["kind"]> = {
    mechanism: "mechanism",
    lesson: "foundational_lesson",
    interpretation: "interpretation",
    prioritization_drill: "prioritization_drill",
    flashcards: "flashcards",
    cat_exam: "mixed_reassessment",
    reassessment: "mixed_reassessment",
    loft_simulation: "mixed_reassessment",
    mixed_case: "prioritization_drill",
    glossary: "interpretation",
    remediation_review: "prioritization_drill",
  };
  return steps.map((s) => ({
    kind: kindMap[s.stepKind] ?? "prioritization_drill",
    label: s.title,
    reason: s.description,
    href: s.href,
    depth: s.graphDepth,
  }));
}

export function toMarketingRemediationChainSteps(
  steps: readonly EduGraphStep[],
): MarketingRemediationChainStep[] {
  return steps
    .filter((s) => ["lesson", "prioritization_drill", "flashcards", "mechanism", "interpretation"].includes(s.stepKind))
    .map((s) => ({
      kind:
        s.stepKind === "lesson"
          ? "lesson"
          : s.stepKind === "flashcards"
            ? "flashcards"
            : "questions",
      label: s.title,
      href: s.href,
    }));
}

export type TopicHubLinkFromGraph = {
  label: string;
  href: string;
  kind: "mechanism" | "interpretation" | "questions" | "flashcards" | "cat";
};

export function toTopicHubLearningLinks(
  steps: readonly EduGraphStep[],
  pathway: ExamPathwayDefinition,
): TopicHubLinkFromGraph[] {
  const kindMap: Record<string, TopicHubLinkFromGraph["kind"]> = {
    mechanism: "mechanism",
    interpretation: "interpretation",
    prioritization_drill: "questions",
    lesson: "questions",
    flashcards: "flashcards",
    cat_exam: "cat",
    reassessment: "cat",
    loft_simulation: "cat",
  };
  return steps
    .filter((s) => kindMap[s.stepKind])
    .map((s) => ({
      label: s.title,
      href: s.href,
      kind: kindMap[s.stepKind]!,
    }))
    .slice(0, 6);
}
