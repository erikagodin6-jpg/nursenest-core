import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  defaultReasoningChainForCompetency,
  resolveRnCompetencyForTopic,
} from "@/lib/educational-graph/rn-competency-ontology";
import type {
  EduGraphStep,
  EduGraphStepKind,
  EducationalGraphTraversal,
  GraphSourceSurface,
} from "@/lib/educational-graph/graph-step-contract";
import {
  graphFlashcardsHref,
  graphInterpretationHref,
  graphLessonHref,
  graphMechanismHref,
  graphPracticeHref,
  graphReassessmentHref,
  normalizeGraphTopicSlug,
  topicLabelFromSlug,
} from "@/lib/educational-graph/graph-href-builders";
import { dedupeGraphHrefs, REMEDIATION_LADDER_MAX_STEPS } from "@/lib/educational-graph/graph-governance";

export type OrchestrateEducationalGraphInput = {
  topicSlug: string;
  topicLabel?: string | null;
  pathwayId?: string | null;
  marketingPathway?: ExamPathwayDefinition | null;
  anchorLessonSlug?: string | null;
  sourceSurface: GraphSourceSurface;
  coachingModel?: CoachingModel;
  learnerState?: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
  recentHrefs?: ReadonlySet<string>;
  exposureDepth?: number;
  maxSteps?: number;
  maxLessonSteps?: number;
};

function step(input: {
  kind: EduGraphStepKind;
  title: string;
  description: string;
  href: string;
  depth: number;
  topicSlug: string;
  topicLabel: string;
  sourceSurface: GraphSourceSurface;
  pathwayId: string | null;
  competencyId: string | null;
  competencyLabel: string | null;
}): EduGraphStep {
  return {
    stepId: `${input.sourceSurface}:${input.topicSlug}:${input.kind}:${input.depth}`,
    stepKind: input.kind,
    title: input.title,
    description: input.description,
    href: input.href,
    depth: input.depth,
    topicSlug: input.topicSlug,
    topicLabel: input.topicLabel,
    sourceSurface: input.sourceSurface,
    pathwayId: input.pathwayId,
    competencyId: input.competencyId,
    competencyLabel: input.competencyLabel,
    remediationPriority: input.depth <= 2 ? "high" : "medium",
  };
}

export function orchestrateEducationalGraph(input: OrchestrateEducationalGraphInput): EducationalGraphTraversal {
  const topicSlug = normalizeGraphTopicSlug(input.topicSlug);
  const topicLabel = input.topicLabel?.trim() || topicLabelFromSlug(topicSlug);
  const competency = resolveRnCompetencyForTopic(topicSlug);
  const pathwayId = input.pathwayId ?? input.marketingPathway?.id ?? null;
  const sourceSurface = input.sourceSurface;

  const candidates = [
    step({
      kind: "mechanism",
      title: `${topicLabel} mechanism`,
      description: "Review the clinical mechanism before practicing decisions.",
      href: graphMechanismHref(topicSlug),
      depth: 1,
      topicSlug,
      topicLabel,
      sourceSurface,
      pathwayId,
      competencyId: competency?.id ?? null,
      competencyLabel: competency?.label ?? null,
    }),
    step({
      kind: "foundational_lesson",
      title: `${topicLabel} lesson`,
      description: "Rebuild the core lesson concepts connected to this topic.",
      href: graphLessonHref({
        pathway: input.marketingPathway ?? null,
        anchorLessonSlug: input.anchorLessonSlug ?? topicSlug,
        topicSlug,
      }),
      depth: 2,
      topicSlug,
      topicLabel,
      sourceSurface,
      pathwayId,
      competencyId: competency?.id ?? null,
      competencyLabel: competency?.label ?? null,
    }),
    step({
      kind: "interpretation",
      title: `${topicLabel} interpretation`,
      description: "Connect assessment cues, findings, and clinical judgment.",
      href: graphInterpretationHref(topicSlug),
      depth: 3,
      topicSlug,
      topicLabel,
      sourceSurface,
      pathwayId,
      competencyId: competency?.id ?? null,
      competencyLabel: competency?.label ?? null,
    }),
    step({
      kind: "practice_questions",
      title: `${topicLabel} practice questions`,
      description: "Apply the concept with exam-style rationales.",
      href: graphPracticeHref(pathwayId, topicSlug),
      depth: 4,
      topicSlug,
      topicLabel,
      sourceSurface,
      pathwayId,
      competencyId: competency?.id ?? null,
      competencyLabel: competency?.label ?? null,
    }),
    step({
      kind: "flashcards",
      title: `${topicLabel} flashcards`,
      description: "Use spaced recall to retain the highest-yield details.",
      href: graphFlashcardsHref(pathwayId, topicSlug),
      depth: 5,
      topicSlug,
      topicLabel,
      sourceSurface,
      pathwayId,
      competencyId: competency?.id ?? null,
      competencyLabel: competency?.label ?? null,
    }),
    step({
      kind: "reassessment",
      title: `${topicLabel} reassessment`,
      description: "Recheck readiness with a focused adaptive set.",
      href: graphReassessmentHref(pathwayId, topicSlug),
      depth: 6,
      topicSlug,
      topicLabel,
      sourceSurface,
      pathwayId,
      competencyId: competency?.id ?? null,
      competencyLabel: competency?.label ?? null,
    }),
  ];

  const recentHrefs = input.recentHrefs ?? new Set<string>();
  const deduped = dedupeGraphHrefs(candidates).filter((s) => !recentHrefs.has(s.href));
  const cap = Math.min(input.maxSteps ?? REMEDIATION_LADDER_MAX_STEPS, REMEDIATION_LADDER_MAX_STEPS);
  const steps = deduped.slice(0, Math.max(1, cap));

  return {
    topicSlug,
    topicLabel,
    sourceSurface,
    pathwayId,
    competencyId: competency?.id ?? null,
    competencyLabel: competency?.label ?? null,
    steps,
    studySequence: steps.map((s) => s.description),
    reasoningChain: competency ? [...defaultReasoningChainForCompetency(competency.id)] : [],
  };
}
