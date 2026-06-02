/**
 * Psychometric orchestration core — single resolver for delivery-model governance downstream.
 */
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { captureGovernedLearnerProductEvent } from "@/lib/observability/governed-learner-analytics";
import { governLearnerDisplayCopy, governMarketingCopy } from "@/lib/testing/psychometric-copy-governance";
import { getCoachingPolicyForTestingModel } from "@/lib/testing/testing-coaching-policy";
import type { TestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import {
  getTestingEngineCapabilities,
  type TestingEngineCapabilities,
} from "@/lib/testing/testing-engine-capabilities";
import {
  CNPLE_PATHWAY_ID,
  getTestingModelForPathwayId,
} from "@/lib/testing/testing-model-pathway-map";
import type { TestingModel } from "@/lib/testing/testing-model-types";
import {
  getLearnerDashboardProfile,
  isDashboardWidgetEligible,
  type LearnerDashboardPsychometricProfile,
  type PsychometricDashboardWidgetId,
} from "@/lib/testing/testing-dashboard-governance";
import {
  getTestingModelProgressSemantics,
  getTestingModelRecommendationSemantics,
  getTestingModelResultsProfile,
  type TestingModelProgressSemantics,
  type TestingModelRecommendationSemantics,
  type TestingModelResultsProfile,
} from "@/lib/testing/testing-model-presentation";
import {
  pathwaySupportsCapability,
  type TestingModelCapability,
} from "@/lib/testing/testing-model-capabilities";
import {
  getTestingModelReadinessSemantics,
  type TestingModelReadinessSemantics,
} from "@/lib/testing/policies/readiness-policy";
import {
  buildGovernedStudyLoopCapture,
  resolveStudyLoopCtaEventName,
  telemetryPolicyForModel,
} from "@/lib/testing/policies/telemetry-policy";
import type { TestingCoachingPolicy } from "@/lib/testing/testing-coaching-policy";
import type { TestingModelAnalyticsDimensions } from "@/lib/testing/testing-telemetry-governance";
import { toTestingModelPostHogFields } from "@/lib/testing/testing-telemetry-governance";

export type PsychometricOrchestrationContext = {
  pathwayId: string;
  model: TestingModel;
  definition: TestingModelDefinition;
  engineCapabilities: TestingEngineCapabilities;
  dashboard: LearnerDashboardPsychometricProfile;
  coaching: TestingCoachingPolicy;
  readiness: TestingModelReadinessSemantics;
  results: TestingModelResultsProfile;
  recommendations: TestingModelRecommendationSemantics;
  progress: TestingModelProgressSemantics;
  analytics: TestingModelAnalyticsDimensions;
  telemetry: ReturnType<typeof telemetryPolicyForModel>;
};

export type ResolvePsychometricContextOptions = {
  sessionKind?: string | null;
};

function analyticsDimensionsFromPathway(pathwayId: string): TestingModelAnalyticsDimensions {
  const fields = toTestingModelPostHogFields(pathwayId);
  return {
    testingModel: fields.testing_model as TestingModel,
    simulationFamily: fields.simulation_family,
    psychometricStyle: fields.psychometric_style as TestingModelAnalyticsDimensions["psychometricStyle"],
    remediationStyle: fields.remediation_style as TestingModelAnalyticsDimensions["remediationStyle"],
    analyticsModel: fields.analytics_model as TestingModelAnalyticsDimensions["analyticsModel"],
    pathway: fields.pathway,
  };
}

function resolveModel(pathwayId: string, sessionKind?: string | null): TestingModel {
  if (sessionKind === "loft_simulation") return "LOFT";
  if (sessionKind === "cat") return "CAT";
  const pathway = getExamPathwayById(pathwayId);
  if (pathway && (pathway.examCode === "cnple" || pathway.id === CNPLE_PATHWAY_ID)) return "LOFT";
  return getTestingModelForPathwayId(pathwayId);
}

export function resolvePsychometricContext(
  pathwayId: string | null | undefined,
  options?: ResolvePsychometricContextOptions,
): PsychometricOrchestrationContext {
  const id = (pathwayId ?? "").trim() || "unknown";
  const model = resolveModel(id, options?.sessionKind);
  const definition = getTestingModelDefinition(model);
  const engineCapabilities = getTestingEngineCapabilities(model);

  return {
    pathwayId: id,
    model,
    definition,
    engineCapabilities,
    dashboard: getLearnerDashboardProfile(id),
    coaching: getCoachingPolicyForTestingModel(model),
    readiness: getTestingModelReadinessSemantics(id),
    results: getTestingModelResultsProfile(id, options?.sessionKind),
    recommendations: getTestingModelRecommendationSemantics(id),
    progress: getTestingModelProgressSemantics(id),
    analytics: analyticsDimensionsFromPathway(id),
    telemetry: telemetryPolicyForModel(model),
  };
}

export function resolvePsychometricContextForPathway(
  pathwayId: string | null | undefined,
): PsychometricOrchestrationContext {
  return resolvePsychometricContext(pathwayId);
}

export function pathwaySupportsPsychometricCapability(
  pathwayId: string | null | undefined,
  capability: TestingModelCapability,
): boolean {
  return pathwaySupportsCapability(pathwayId, capability);
}

export function dashboardWidgetAllowed(
  pathwayId: string | null | undefined,
  widgetId: PsychometricDashboardWidgetId,
): boolean {
  return isDashboardWidgetEligible(pathwayId, widgetId);
}

export function governOrchestratedLearnerCopy(pathwayId: string | null | undefined, text: string) {
  return governLearnerDisplayCopy(pathwayId, text);
}

export function governOrchestratedMarketingCopy(pathwayId: string | null | undefined, text: string) {
  return governMarketingCopy(pathwayId, text);
}

export function validateOrchestratedLearnerSemantics(
  pathwayId: string | null | undefined,
  text: string,
): { ok: boolean; sanitized: string } {
  const result = governLearnerDisplayCopy(pathwayId, text);
  return { ok: result.ok, sanitized: result.sanitized };
}

export function captureOrchestratedAnalytics(
  userId: string,
  entitlement: AccessScope,
  event: string,
  props: Record<string, string | number | boolean | undefined> = {},
): void {
  captureGovernedLearnerProductEvent(userId, entitlement, event, props);
}

export { buildGovernedStudyLoopCapture, resolveStudyLoopCtaEventName };
