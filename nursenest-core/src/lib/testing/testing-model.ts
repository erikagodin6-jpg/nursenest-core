/**
 * Psychometric governance — public API for delivery models (CAT / LOFT / LINEAR).
 *
 * Submodules:
 * - testing-model-definitions — behavioral contracts
 * - testing-engine-capabilities — engine boundary guards
 * - testing-coaching-policy — post-exam / remediation coaching semantics
 * - psychometric-orchestrator — unified context for downstream intelligence
 * - psychometric-isolation — LOFT vs CAT language enforcement
 * - testing-marketing-governance — marketing/SEO validators
 * - policies/* — telemetry, readiness, and domain policy engines
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { TestingModelAnalyticsDimensions } from "@/lib/testing/testing-telemetry-governance";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  catPathwayExamCodeLabel,
  catPathwayRegionalExamLine,
  catPathwayShortCatLabel,
} from "@/lib/exam-pathways/cat-pathway-labels";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import {
  CNPLE_PATHWAY_ID,
  getTestingModelForPathwayId,
  isCnplePathway,
  isCatTestingModel,
  isLoftTestingModel,
  PATHWAY_TESTING_MODEL,
  pathwayUsesCatEngine,
  pathwayUsesLoftEngine,
} from "@/lib/testing/testing-model-pathway-map";

export type { TestingModel, LearnerExamsSurfaceLabel } from "@/lib/testing/testing-model-types";
export {
  TESTING_MODEL_DEFINITIONS,
  getTestingModelDefinition,
  type TestingModelDefinition,
  type PsychometricStyle,
  type PacingStyle,
  type RemediationStyle,
  type AnalyticsModelKey,
} from "@/lib/testing/testing-model-definitions";
export {
  getTestingEngineCapabilities,
  assertCatEngineAllowedForPathwayId,
  assertCatTelemetryAllowedForPathway,
  type TestingEngineCapabilities,
  type CatEngineGuardResult,
} from "@/lib/testing/testing-engine-capabilities";
export {
  getCoachingPolicyForTestingModel,
  getCoachingPolicyForPathway,
  validateCoachingCopyForPathway,
  type TestingCoachingPolicy,
} from "@/lib/testing/testing-coaching-policy";
export {
  validatePsychometricCopyForModel,
  validatePsychometricCopyForPathway,
  assertNoCatLanguageForLoftPathway,
  sanitizeLearnerCopyForPathway,
  loftDashboardPriorityThemes,
  type PsychometricCopyViolation,
} from "@/lib/testing/psychometric-isolation";
export {
  validateTestingModelMarketingLanguage,
  type MarketingLanguageAuditResult,
} from "@/lib/testing/testing-marketing-governance";
export {
  assertLearnerDisplayCopy,
  governCopyForTestingModel,
  governLearnerDisplayCopy,
  governMarketingCopy,
  type LearnerCopyGovernanceResult,
} from "@/lib/testing/psychometric-copy-governance";
export {
  assertPathwayPostHogCapture,
  getPsychometricTelemetryViolationCount,
  logPsychometricTelemetryViolation,
  logTestingModelScopedEvent,
  mergeTestingModelTelemetryMeta,
  resetPsychometricTelemetryViolationCount,
  testingModelTelemetryFields,
  toTestingModelPostHogFields,
} from "@/lib/testing/testing-telemetry-governance";
export {
  assertCatAdaptiveEngineAllowed,
  assertLoftPsychometricIntegrity,
  assertModelSupportsCapability,
  assertPathwaySupportsCapability,
  modelSupportsCapability,
  pathwaySupportsCapability,
  type TestingModelCapability,
} from "@/lib/testing/testing-model-capabilities";
export {
  getLearnerDashboardProfile,
  isDashboardWidgetEligible,
  type LearnerDashboardPsychometricProfile,
  type PsychometricDashboardWidgetId,
} from "@/lib/testing/testing-dashboard-governance";
export {
  getTestingModelDashboardProfile,
  getTestingModelProgressSemantics,
  getTestingModelRecommendationSemantics,
  getTestingModelResultsProfile,
  resolveResultsHeroVariant,
  type ResultsHeroVariant,
  type TestingModelProgressSemantics,
  type TestingModelRecommendationSemantics,
  type TestingModelResultsProfile,
} from "@/lib/testing/testing-model-presentation";
export {
  resolvePsychometricContext,
  resolvePsychometricContextForPathway,
  governOrchestratedLearnerCopy,
  governOrchestratedMarketingCopy,
  captureOrchestratedAnalytics,
  pathwaySupportsPsychometricCapability,
  dashboardWidgetAllowed,
  validateOrchestratedLearnerSemantics,
  buildGovernedStudyLoopCapture,
  resolveStudyLoopCtaEventName,
  type PsychometricOrchestrationContext,
  type ResolvePsychometricContextOptions,
} from "@/lib/testing/psychometric-orchestrator";
export {
  getTestingModelReadinessSemantics,
  type TestingModelReadinessSemantics,
} from "@/lib/testing/policies/readiness-policy";
export { telemetryPolicyForModel } from "@/lib/testing/policies/telemetry-policy";

export {
  CNPLE_PATHWAY_ID,
  isCnplePathway,
  PATHWAY_TESTING_MODEL,
  getTestingModelForPathwayId,
  isLoftTestingModel,
  isCatTestingModel,
  pathwayUsesLoftEngine,
  pathwayUsesCatEngine,
};

export function getTestingModelForPathway(
  pathway: ExamPathwayDefinition | null | undefined,
): import("@/lib/testing/testing-model-types").TestingModel {
  if (!pathway) return "LINEAR";
  if (pathway.examCode === "cnple" || pathway.id === CNPLE_PATHWAY_ID) return "LOFT";
  return getTestingModelForPathwayId(pathway.id);
}

export function getLearnerExamsSurfaceLabel(
  pathwayId: string | null | undefined,
): import("@/lib/testing/testing-model-types").LearnerExamsSurfaceLabel {
  const def = getTestingModelDefinition(getTestingModelForPathwayId(pathwayId));
  if (def.model === "LOFT") return "LOFT Simulation";
  if (def.model === "CAT") return "CAT Exams";
  return "Exams";
}

export function resolveLearnerExamsNavHref(
  pathwayId: string | null | undefined,
  examsLabel?: import("@/lib/testing/testing-model-types").LearnerExamsSurfaceLabel,
): string {
  const label = examsLabel ?? getLearnerExamsSurfaceLabel(pathwayId);
  if (label === "LOFT Simulation") {
    return "/app/cases/cnple";
  }
  if (label === "CAT Exams" && pathwayId?.trim()) {
    const q = new URLSearchParams({ pathwayId: pathwayId.trim() });
    return `/app/practice-tests/cat-launch?${q.toString()}`;
  }
  return "/app/practice-tests?startMode=practice_exam";
}

export type PathwaySimulationDisplayCopy = {
  shortLabel: string;
  regionalLine: string;
  landingTitle: string;
  landingSubtitleLead: string;
};

export function getPathwaySimulationDisplayCopy(
  pathway: ExamPathwayDefinition,
): PathwaySimulationDisplayCopy {
  const regionalLine = catPathwayRegionalExamLine(pathway);
  const def = getTestingModelDefinition(getTestingModelForPathway(pathway));
  if (def.model === "LOFT") {
    const exam = catPathwayExamCodeLabel(pathway);
    return {
      shortLabel: `${exam} simulation`,
      regionalLine,
      landingTitle: `${exam} simulation`,
      landingSubtitleLead: `Blueprint-balanced LOFT licensing simulation (linear fixed-length) for ${regionalLine}.`,
    };
  }
  if (def.model === "CAT") {
    const cat = catPathwayShortCatLabel(pathway);
    return {
      shortLabel: cat,
      regionalLine,
      landingTitle: cat,
      landingSubtitleLead: `Computerized adaptive testing (CAT) for ${regionalLine}.`,
    };
  }
  return {
    shortLabel: `${catPathwayExamCodeLabel(pathway)} practice`,
    regionalLine,
    landingTitle: `${catPathwayExamCodeLabel(pathway)} practice exam`,
    landingSubtitleLead: `Linear practice exams for ${regionalLine}.`,
  };
}

export type { TestingModelAnalyticsDimensions } from "@/lib/testing/testing-telemetry-governance";

/** @deprecated Prefer {@link getTestingModelAnalyticsDimensions} — kept for incremental migration. */
export type ExamAnalyticsContext = {
  examModel: import("@/lib/testing/testing-model-types").TestingModel;
  pathway: string;
  simulationType: string;
};

export function getTestingModelAnalyticsDimensions(
  pathwayId: string | null | undefined,
): TestingModelAnalyticsDimensions {
  const id = (pathwayId ?? "").trim() || "unknown";
  const model = getTestingModelForPathwayId(id);
  const def = getTestingModelDefinition(model);
  return {
    testingModel: model,
    simulationFamily: def.simulationFamily,
    psychometricStyle: def.psychometricStyle,
    remediationStyle: def.remediationStyle,
    analyticsModel: def.analyticsModel,
    pathway: id,
  };
}

export function getExamAnalyticsContext(pathwayId: string | null | undefined): ExamAnalyticsContext {
  const dims = getTestingModelAnalyticsDimensions(pathwayId);
  return {
    examModel: dims.testingModel,
    pathway: dims.pathway,
    simulationType: dims.simulationFamily,
  };
}

export function testingModelForPathwaySlug(pathwayId: string | null | undefined): import("@/lib/testing/testing-model-types").TestingModel {
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : null;
  return pathway ? getTestingModelForPathway(pathway) : getTestingModelForPathwayId(pathwayId);
}
