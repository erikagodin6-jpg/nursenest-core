/**
 * Canonical RN educational graph traversal — single entry for remediation, hubs, coaching, dashboards.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  defaultReasoningChainForCompetency,
  resolveRnCompetencyForTopic,
} from "@/lib/educational-graph/rn-competency-ontology";
import {
  auditRemediationSteps,
  dedupeGraphHrefs,
  REMEDIATION_LADDER_MAX_STEPS,
} from "@/lib/educational-graph/graph-governance";
import type {
  EduGraphStep,
  EduGraphStepDifficulty,
  EducationalGraphTraversal,
  EducationalIntent,
  GraphSourceSurface,
} from "@/lib/educational-graph/graph-step-contract";
import {
  appFlashcardsHref,
  appLessonTopicHref,
  appPrioritizationDrillHref,
  glossaryLinkForTopic,
  marketingCatHref,
  marketingFlashcardsHref,
  marketingQuestionsHref,
  normalizeGraphTopicSlug,
  publishedInterpretationForTopic,
  publishedMechanismLinkForTopic,
  reassessmentHref,
  topicReasoningChainOverride,
} from "@/lib/educational-graph/graph-href-builders";
import {
  orderStepsEditorial,
  orderStepsForLearnerState,
  resolveTopicCompetencyId,
} from "@/lib/educational-graph/learner-state-ordering";
import { listTopicSiblingLessonsForMarketing } from "@/lib/lessons/pathway-lesson-topic-siblings";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { topicHubEducationalIntro } from "@/lib/seo/topic-hub-educational-intros";

export type OrchestrateEducationalGraphInput = {
  topicSlug: string;
  topicLabel?: string;
  pathwayId?: string | null;
  /** Required for marketing surfaces that emit pathway-scoped public URLs. */
  marketingPathway?: ExamPathwayDefinition;
  anchorLessonSlug?: string;
  sourceSurface: GraphSourceSurface;
  coachingModel?: CoachingModel;
  exposureDepth?: number;
  learnerState?: RnLearnerStateSnapshot | null;
  persistentWeakTopics?: readonly string[];
  recentHrefs?: ReadonlySet<string>;
  maxSteps?: number;
  maxLessonSteps?: number;
};

function stepId(kind: string, href: string): string {
  return `${kind}:${href}`;
}

function makeStep(partial: Omit<EduGraphStep, "stepId"> & { href: string; stepKind: EduGraphStep["stepKind"] }): EduGraphStep {
  return {
    ...partial,
    stepId: stepId(partial.stepKind, partial.href),
  };
}

function isMarketingSurface(surface: GraphSourceSurface): boolean {
  if (surface === "glossary_traversal") return false;
  return surface === "marketing_lesson" || surface === "topic_hub_public";
}

function isAuthenticatedSurface(surface: GraphSourceSurface): boolean {
  return (
    surface === "topic_hub_authenticated" ||
    surface === "app_remediation" ||
    surface === "post_exam_coaching" ||
    surface === "dashboard_feed" ||
    surface === "study_plan" ||
    surface === "ai_tutor" ||
    surface === "recommendation_engine"
  );
}

function buildRawSteps(input: OrchestrateEducationalGraphInput): EduGraphStep[] {
  const topic = normalizeGraphTopicSlug(input.topicSlug);
  const label = input.topicLabel?.trim() || topic.replace(/-/g, " ");
  const competency = resolveRnCompetencyForTopic(topic);
  const competencyId = competency?.id ?? null;
  const pathwayId = input.pathwayId ?? input.marketingPathway?.id ?? null;
  const coachingModel = input.coachingModel ?? "cat_adaptive";
  const surface = input.sourceSurface;
  const difficulty: EduGraphStepDifficulty =
    competency?.id === "infection_sepsis" || competency?.id === "acid_base_gas_exchange" ? "advanced" : "intermediate";

  const steps: EduGraphStep[] = [];
  let depth = 0;

  const mechanism = publishedMechanismLinkForTopic(topic);
  if (mechanism) {
    steps.push(
      makeStep({
        stepKind: "mechanism",
        competencyId,
        topicSlug: topic,
        title: mechanism.title,
        description: "Connect bedside cues to physiology before memorizing isolated interventions.",
        href: mechanism.href,
        pathwayId,
        educationalIntent: "mechanism_framing",
        learnerStateReason: null,
        estimatedMinutes: 8,
        difficulty,
        remediationPriority: 0,
        graphDepth: depth++,
        sourceSurface: surface,
        telemetryMetadata: { reasoningRelation: "symptom_to_mechanism", coachingModel },
      }),
    );
  } else if (!isMarketingSurface(surface)) {
    steps.push(
      makeStep({
        stepKind: "mechanism",
        competencyId,
        topicSlug: topic,
        title: coachingModel === "loft_readiness" ? `Clinical frame: ${label}` : `Mechanism: ${label}`,
        description: `Name the assessment cue and first safe action for ${label}.`,
        href: appLessonTopicHref(topic, pathwayId),
        pathwayId,
        educationalIntent: "mechanism_framing",
        learnerStateReason: null,
        estimatedMinutes: 6,
        difficulty,
        remediationPriority: 0,
        graphDepth: depth++,
        sourceSurface: surface,
        telemetryMetadata: { reasoningRelation: "symptom_to_mechanism", coachingModel },
      }),
    );
  }

  const interpretation = publishedInterpretationForTopic(topic);
  if (interpretation) {
    steps.push(
      makeStep({
        stepKind: "interpretation",
        competencyId,
        topicSlug: topic,
        title: interpretation.title,
        description: "Interpret labs or monitoring trends that drive prioritization in this competency.",
        href: interpretation.href,
        pathwayId,
        educationalIntent: "interpretation",
        learnerStateReason: null,
        estimatedMinutes: 10,
        difficulty,
        remediationPriority: 0,
        graphDepth: depth++,
        sourceSurface: surface,
        telemetryMetadata: { reasoningRelation: "lab_abnormality_to_prioritization", coachingModel },
      }),
    );
  }

  const glossary = glossaryLinkForTopic(topic);
  if (glossary && !isMarketingSurface(surface)) {
    steps.push(
      makeStep({
        stepKind: "glossary",
        competencyId,
        topicSlug: topic,
        title: `Term: ${glossary.title}`,
        description: "Anchor vocabulary to bedside significance before drilling stems.",
        href: glossary.href,
        pathwayId,
        educationalIntent: "terminology",
        learnerStateReason: null,
        estimatedMinutes: 3,
        difficulty: "foundational",
        remediationPriority: 0,
        graphDepth: depth++,
        sourceSurface: surface,
        telemetryMetadata: { coachingModel },
      }),
    );
  }

  if (input.marketingPathway && input.anchorLessonSlug) {
    const siblings = listTopicSiblingLessonsForMarketing({
      pathway: input.marketingPathway,
      topicSlug: topic,
      excludeSlug: input.anchorLessonSlug,
      limit: input.maxLessonSteps ?? 3,
    });
    for (const s of siblings) {
      steps.push(
        makeStep({
          stepKind: "lesson",
          competencyId,
          topicSlug: topic,
          title: s.title,
          description: "Build conceptual scaffolding in the same competency cluster.",
          href: s.href,
          pathwayId,
          educationalIntent: "concept_scaffold",
          learnerStateReason: null,
          estimatedMinutes: 12,
          difficulty,
          remediationPriority: 0,
          graphDepth: depth++,
          sourceSurface: surface,
          telemetryMetadata: { reasoningRelation: "prerequisite_to_advanced", coachingModel },
        }),
      );
    }
  } else {
    steps.push(
      makeStep({
        stepKind: "lesson",
        competencyId,
        topicSlug: topic,
        title: `Lesson: ${label}`,
        description: "Consolidate the clinical story and decision rules in one focused block.",
        href: appLessonTopicHref(topic, pathwayId),
        pathwayId,
        educationalIntent: "concept_scaffold",
        learnerStateReason: null,
        estimatedMinutes: 15,
        difficulty,
        remediationPriority: 0,
        graphDepth: depth++,
        sourceSurface: surface,
        telemetryMetadata: { reasoningRelation: "mechanism_to_assessment", coachingModel },
      }),
    );
  }

  const questionsHref = input.marketingPathway
    ? marketingQuestionsHref(input.marketingPathway, topic)
    : appPrioritizationDrillHref(topic, pathwayId);

  steps.push(
    makeStep({
      stepKind: "prioritization_drill",
      competencyId,
      topicSlug: topic,
      title: `Prioritization: ${label}`,
      description: competency
        ? `Apply ${competency.label.toLowerCase()} judgment on fresh stems.`
        : "Test clinical judgment under time pressure after review.",
      href: questionsHref,
      pathwayId,
      educationalIntent: "prioritization",
      learnerStateReason: null,
      estimatedMinutes: 12,
      difficulty,
      remediationPriority: 0,
      graphDepth: depth++,
      sourceSurface: surface,
      telemetryMetadata: { reasoningRelation: "assessment_to_intervention", coachingModel },
    }),
  );

  if (!isMarketingSurface(surface)) {
    steps.push(
      makeStep({
        stepKind: "mixed_case",
        competencyId,
        topicSlug: topic,
        title: `Mixed cases: ${label}`,
        description: "Intervention sequencing and unstable-patient branches in mixed stems.",
        href: appPrioritizationDrillHref(topic, pathwayId, true),
        pathwayId,
        educationalIntent: "mixed_application",
        learnerStateReason: null,
        estimatedMinutes: 15,
        difficulty,
        remediationPriority: 0,
        graphDepth: depth++,
        sourceSurface: surface,
        telemetryMetadata: { reasoningRelation: "intervention_to_monitoring", coachingModel },
      }),
    );
  }

  const flashHref = input.marketingPathway
    ? marketingFlashcardsHref(topic)
    : appFlashcardsHref(pathwayId, topic);

  steps.push(
    makeStep({
      stepKind: "flashcards",
      competencyId,
      topicSlug: topic,
      title: `${label} flashcards`,
      description: "Spaced reinforcement for recall before reassessment.",
      href: flashHref,
      pathwayId,
      educationalIntent: "spaced_retention",
      learnerStateReason: null,
      estimatedMinutes: 8,
      difficulty: "foundational",
      remediationPriority: 0,
      graphDepth: depth++,
      sourceSurface: surface,
      telemetryMetadata: { reasoningRelation: "remediation_reinforces", coachingModel },
    }),
  );

  const reassess = reassessmentHref({
    coachingModel,
    pathwayId,
    marketingPathway: input.marketingPathway ?? null,
  });
  steps.push(
    makeStep({
      stepKind: reassess.stepKind,
      competencyId,
      topicSlug: topic,
      title: reassess.title,
      description:
        reassess.stepKind === "loft_simulation"
          ? "Confirm domain balance under fixed-length exam pacing."
          : "Verify the gap closed before a full exam simulation.",
      href: reassess.href,
      pathwayId,
      educationalIntent: "reassessment",
      learnerStateReason: null,
      estimatedMinutes: 25,
      difficulty: "advanced",
      remediationPriority: 0,
      graphDepth: depth++,
      sourceSurface: surface,
      telemetryMetadata: { reasoningRelation: "instability_to_escalation", coachingModel },
    }),
  );

  return steps;
}

function buildStudySequence(
  topic: string,
  steps: readonly EduGraphStep[],
  authenticated: boolean,
): string[] {
  const intro = topicHubEducationalIntro(topic);
  const hasMechanism = steps.some((s) => s.stepKind === "mechanism");
  const hasInterpretation = steps.some((s) => s.stepKind === "interpretation");
  if (authenticated) {
    return [
      intro ? "Review competency overview" : "Open foundational lesson",
      hasMechanism ? "Mechanism framing for unstable cues" : "Clarify pathophysiology",
      hasInterpretation ? "Interpretation guide for trend recognition" : "Prioritization drill",
      "Flashcards for retention",
      "Reassess with adaptive or LOFT-safe set",
    ];
  }
  return [
    intro ? "Read the competency overview" : "Review foundational lessons in this topic",
    hasMechanism ? "Study the mechanism explainer" : "Clarify pathophysiology with a focused lesson",
    "Practice prioritization questions",
    "Drill flashcards for recall",
    "Reassess with a mixed adaptive set",
  ];
}

/**
 * Canonical graph traversal — all consumers should call this (directly or via adapters).
 */
export function orchestrateEducationalGraph(input: OrchestrateEducationalGraphInput): EducationalGraphTraversal {
  const topic = normalizeGraphTopicSlug(input.topicSlug);
  const label = input.topicLabel?.trim() || topic.replace(/-/g, " ");
  const competency = resolveRnCompetencyForTopic(topic);
  const maxSteps = Math.min(input.maxSteps ?? REMEDIATION_LADDER_MAX_STEPS, REMEDIATION_LADDER_MAX_STEPS);
  const exposureDepth = Math.min(6, Math.max(0, input.exposureDepth ?? 0));

  let raw = buildRawSteps({ ...input, topicSlug: topic, topicLabel: label });
  raw = dedupeGraphHrefs(raw);

  const useLearnerOrdering =
    isAuthenticatedSurface(input.sourceSurface) &&
    (input.learnerState != null ||
      (input.persistentWeakTopics?.length ?? 0) > 0 ||
      input.sourceSurface === "post_exam_coaching" ||
      input.sourceSurface === "dashboard_feed");

  let ordered = useLearnerOrdering
    ? orderStepsForLearnerState({
        steps: raw,
        learnerState: input.learnerState ?? null,
        persistentWeakTopics: input.persistentWeakTopics,
        recentHrefs: input.recentHrefs,
        remediationFatigueCap: maxSteps,
      })
    : orderStepsEditorial(raw, maxSteps);

  if (exposureDepth > 0 && ordered.length > 3) {
    ordered = ordered.slice(exposureDepth, exposureDepth + 3);
  }

  const reasoningChain =
    topicReasoningChainOverride(topic) ??
    (competency ? defaultReasoningChainForCompetency(competency.id) : []);

  auditRemediationSteps(ordered.map((s) => s.href));

  return {
    topicSlug: topic,
    topicLabel: label,
    competencyId: competency?.id ?? null,
    competencyLabel: competency?.label ?? null,
    reasoningChain,
    steps: ordered,
    studySequence: buildStudySequence(topic, ordered, useLearnerOrdering),
    sourceSurface: input.sourceSurface,
  };
}

export { resolveTopicCompetencyId };
