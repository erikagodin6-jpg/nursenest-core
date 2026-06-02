/**
 * Readiness / learner-state semantics — capability-driven, not CAT-default.
 * All readiness presentation transforms route through this module.
 */
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import { modelSupportsCapability } from "@/lib/testing/testing-model-capabilities";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { logReadinessInconsistency } from "@/lib/educational-cognition/governance-observability";

export type TestingModelReadinessSemantics = {
  model: TestingModel;
  readinessLabel: string;
  allowsPassOutlook: boolean;
  allowsAbilityEstimate: boolean;
  allowsPrecisionBand: boolean;
  emphasizeCompetencyBalance: boolean;
  trendLabel: string;
  insufficientDataCopy: string;
};

export function getTestingModelReadinessSemantics(
  pathwayId: string | null | undefined,
): TestingModelReadinessSemantics {
  const model = getTestingModelForPathwayId(pathwayId);
  const def = getTestingModelDefinition(model);

  if (model === "LOFT") {
    return {
      model,
      readinessLabel: "Blueprint readiness",
      allowsPassOutlook: false,
      allowsAbilityEstimate: false,
      allowsPrecisionBand: false,
      emphasizeCompetencyBalance: true,
      trendLabel: "Competency momentum",
      insufficientDataCopy:
        "Complete more LOFT simulation items before treating blueprint readiness as stable.",
    };
  }

  if (model === "CAT") {
    return {
      model,
      readinessLabel: "Adaptive readiness",
      allowsPassOutlook: modelSupportsCapability(model, "confidence_estimation"),
      allowsAbilityEstimate: modelSupportsCapability(model, "adaptive_selection"),
      allowsPrecisionBand: def.allowsConfidenceEstimation,
      emphasizeCompetencyBalance: false,
      trendLabel: "Adaptive precision trend",
      insufficientDataCopy:
        "Answer more graded practice items before we surface an adaptive readiness score.",
    };
  }

  return {
    model,
    readinessLabel: "Practice performance",
    allowsPassOutlook: false,
    allowsAbilityEstimate: false,
    allowsPrecisionBand: false,
    emphasizeCompetencyBalance: true,
    trendLabel: "Practice trend",
    insufficientDataCopy: "Complete more practice sets before readiness is estimated.",
  };
}

const PASS_OUTLOOK_FACTOR_RE = /pass|probability|outlook|likelihood/i;

/**
 * Presentation-only transform — scoring stays in {@link computeReadiness}; semantics live here.
 */
export function applyReadinessPresentationPolicy(
  pathwayId: string | null | undefined,
  result: ReadinessResult,
): ReadinessResult {
  const semantics = getTestingModelReadinessSemantics(pathwayId);
  let factors = result.factors;
  let summary = result.summary;
  let trend = result.trend;

  if (!semantics.allowsPassOutlook) {
    const stripped = factors.filter((f) => !PASS_OUTLOOK_FACTOR_RE.test(f.label));
    if (stripped.length < factors.length) {
      logReadinessInconsistency(
        pathwayId ?? null,
        "Stripped pass-outlook readiness factors for testing model that forbids pass outlook.",
      );
      factors = stripped;
    }
  }

  if (!semantics.allowsPrecisionBand && /precision|theta|ability estimate/i.test(summary)) {
    summary = semantics.insufficientDataCopy;
    logReadinessInconsistency(
      pathwayId ?? null,
      "Readiness summary referenced precision/ability language on a model that forbids it.",
    );
  }

  if (result.band === "insufficient_data" && result.confidence === "low") {
    summary = semantics.insufficientDataCopy;
  }

  if (!semantics.allowsPassOutlook && trend && semantics.emphasizeCompetencyBalance) {
    trend = result.trend;
  }

  return {
    ...result,
    factors,
    summary,
    trend,
  };
}

/** CNPLE domain report — presentation labels only; domain scoring stays in cnple-readiness-scoring. */
export function presentCnpleReadinessForPathway(
  pathwayId: string | null | undefined,
  report: {
    overallReadinessScore: number;
    readyForExam: boolean;
    criticalGaps: string[];
  },
): {
  readinessLabel: string;
  overallLine: string;
  allowsPassOutlook: boolean;
  readyForExam: boolean;
} {
  const semantics = getTestingModelReadinessSemantics(pathwayId);
  const allowsPassOutlook = semantics.allowsPassOutlook;
  const readyForExam = allowsPassOutlook ? report.readyForExam : false;
  const overallLine = allowsPassOutlook
    ? `Overall blueprint readiness: ${report.overallReadinessScore}%`
    : `${semantics.readinessLabel}: ${report.overallReadinessScore}% — competency balance, not pass probability.`;
  return {
    readinessLabel: semantics.readinessLabel,
    overallLine,
    allowsPassOutlook,
    readyForExam,
  };
}
