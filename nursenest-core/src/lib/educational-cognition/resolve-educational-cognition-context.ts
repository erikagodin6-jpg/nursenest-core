/**
 * Educational cognition orchestrator — unified resolver for learner intelligence surfaces.
 */
import { buildRnCoachingIntelligenceReport } from "@/lib/learner/rn-coaching-intelligence/build-rn-coaching-intelligence-report";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { hydrateLearnerState } from "@/lib/learner/rn-coaching-intelligence/hydrate-learner-state";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import { resolvePsychometricContext } from "@/lib/testing/psychometric-orchestrator";
import { buildCognitionCapabilityRegistry } from "@/lib/educational-cognition/cognition-capability-registry";
import { composeGovernedDashboard } from "@/lib/educational-cognition/dashboard-composition-engine";
import {
  buildRemediationOrchestrationContract,
  coachingModelFromPsychometric,
} from "@/lib/educational-cognition/educational-policy-orchestrator";
import { buildEducationalOntologySlice } from "@/lib/educational-cognition/educational-ontology-registry";
import { buildMeasurementCognitionSlice } from "@/lib/educational-cognition/measurement-cognition-bridge";
import { governMeasurementCognitionInput } from "@/lib/educational-cognition/measurement-source-governance";
import { recordCognitionContextResolved } from "@/lib/educational-cognition/cognition-telemetry-v5";
import { hydratePriorLearnerState, saveDurableLearnerCognition } from "@/lib/educational-cognition/learner-cognition-persistence";
import { buildAiTutorContextFromCognition } from "@/lib/educational-cognition/ai-tutor-cognition-envelope";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import type {
  EducationalCognitionContext,
  ResolveEducationalCognitionOptions,
} from "@/lib/educational-cognition/educational-cognition-types";
import { logReadinessInconsistency } from "@/lib/educational-cognition/governance-observability";
import type { BuildRnCoachingIntelligenceInput } from "@/lib/learner/rn-coaching-intelligence/build-rn-coaching-intelligence-report";

export type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";

export function resolveEducationalCognitionContext(
  pathwayId: string | null | undefined,
  options: ResolveEducationalCognitionOptions = {},
): EducationalCognitionContext {
  const id = (pathwayId ?? "").trim() || "unknown";
  const psychometric = resolvePsychometricContext(id, { sessionKind: options.sessionKind });
  const capabilities = buildCognitionCapabilityRegistry(psychometric);
  const coachingModel = coachingModelFromPsychometric(psychometric);

  const priorState = options.userId
    ? hydratePriorLearnerState({ userId: options.userId, pathwayId: id })
    : EMPTY_LEARNER_STATE(id);

  const learnerState = hydrateLearnerState({
    pathwayId: id,
    topicTrends: options.topicTrends ?? [],
    weakTopics: options.weakTopics ?? [],
    sessionWeakLabels: options.weakTopicLabels ?? [],
    sessionReadinessScore: options.readinessResult?.score ?? priorState.readinessTrajectory.at(-1) ?? 0,
    timing: options.timing ?? null,
    reasoningPatterns: priorState.reasoningPatterns,
    priorState,
  });

  if (options.persistLearnerState && options.userId) {
    saveDurableLearnerCognition(options.userId, learnerState);
  }

  const remediation = buildRemediationOrchestrationContract(psychometric, learnerState);
  const dashboard = composeGovernedDashboard(psychometric, capabilities, learnerState);
  const ontology = buildEducationalOntologySlice(learnerState);
  const measurementInput = governMeasurementCognitionInput({ learnerState });
  const measurementSlice = buildMeasurementCognitionSlice(
    learnerState,
    measurementInput.catalogItems,
  );
  const measurement = {
    topCategory: measurementSlice.topCategory,
    measurementPriorityScore: measurementSlice.measurementPriorityScore,
    learnerStateReason: measurementSlice.learnerStateReason,
    priorityCount: measurementSlice.priorityItems.length,
  };

  const readinessResult = options.readinessResult ?? null;
  if (
    readinessResult?.score != null &&
    !psychometric.readiness.allowsPassOutlook &&
    readinessResult.factors.some((f) => /pass|probability|outlook/i.test(f.label))
  ) {
    logReadinessInconsistency(
      id,
      "Readiness result exposes pass-outlook factors on a model that forbids pass outlook.",
    );
  }

  const ctx = {
    pathwayId: id,
    psychometric,
    coachingModel,
    capabilities,
    readinessSemantics: psychometric.readiness,
    readinessResult,
    learnerState,
    dashboard,
    remediation,
    ontology,
    measurement,
    coachingReport: null,
  };

  recordCognitionContextResolved(ctx, options.userId ?? null);
  return ctx;
}

/** Post-session branch — builds full RN coaching intelligence report under governance. */
export function resolveEducationalCognitionFromSession(
  input: BuildRnCoachingIntelligenceInput,
): EducationalCognitionContext {
  const pathwayId = input.pathwayId ?? input.config?.pathwayId ?? null;
  const base = resolveEducationalCognitionContext(pathwayId, {
    userId: input.remediationUserId,
    sessionKind: input.sessionKind,
    weakTopicLabels: [],
  });
  const coachingReport = buildRnCoachingIntelligenceReport(input);
  const weakTopic =
    coachingReport.learnerState.competencyStates.find((c) => c.persistentWeak)?.competencyId.replace(/_/g, " ") ??
    coachingReport.longitudinal.persistentWeakTopics[0] ??
    "clinical focus";
  const traversal = orchestrateEducationalGraph({
    topicSlug: weakTopic.toLowerCase().replace(/\s+/g, "-"),
    topicLabel: weakTopic,
    pathwayId,
    sourceSurface: "post_session_cognition",
    coachingModel: base.coachingModel,
    learnerState: coachingReport.learnerState,
  });
  const aiTutorEnvelope = buildAiTutorContextFromCognition(
    { ...base, learnerState: coachingReport.learnerState, coachingReport },
    traversal.steps,
  );
  const postMeasurementInput = governMeasurementCognitionInput({
    learnerState: coachingReport.learnerState,
  });
  const measurementSlice = buildMeasurementCognitionSlice(
    coachingReport.learnerState,
    postMeasurementInput.catalogItems,
  );
  return {
    ...base,
    learnerState: coachingReport.learnerState,
    coachingReport,
    aiTutorEnvelope,
    ontology: buildEducationalOntologySlice(coachingReport.learnerState),
    remediation: buildRemediationOrchestrationContract(base.psychometric, coachingReport.learnerState),
    dashboard: composeGovernedDashboard(
      base.psychometric,
      base.capabilities,
      coachingReport.learnerState,
    ),
    measurement: {
      topCategory: measurementSlice.topCategory,
      measurementPriorityScore: measurementSlice.measurementPriorityScore,
      learnerStateReason: measurementSlice.learnerStateReason,
      priorityCount: measurementSlice.priorityItems.length,
    },
  };
}

export type { ReadinessResult };
