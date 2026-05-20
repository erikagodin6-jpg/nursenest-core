/**
 * Testing-model presentation contracts — UI semantics derived from capabilities, not pathway hacks.
 */
import type { PostExamSessionKind } from "@/lib/learner/post-exam-performance-report";
import { getTestingEngineCapabilities } from "@/lib/testing/testing-engine-capabilities";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { getLearnerDashboardProfile } from "@/lib/testing/testing-dashboard-governance";

export type ResultsHeroVariant = "loft_simulation" | "cat_adaptive" | "linear_practice";

export type TestingModelResultsProfile = {
  model: TestingModel;
  heroVariant: ResultsHeroVariant;
  resultsSurfaceClass: "nn-loft-results" | "nn-cat-results" | "nn-linear-results";
  postExamDataMarker: "loft" | "cat" | "linear";
  showPassProbability: boolean;
  showConfidenceEstimate: boolean;
  readinessMetricLabel: string;
  paywallUpsellCopy: string;
  anotherSessionCtaLabel: string;
  reviewSessionCtaLabel: string;
  simulationHubHref: string;
};

export type TestingModelProgressSemantics = {
  progressLabel: string;
  streakLabel: string | null;
  showAdaptiveProgression: boolean;
};

export type TestingModelRecommendationSemantics = {
  reassessmentCtaLabel: string | null;
  simulationFollowUpLabel: string;
  weakAreaFraming: string;
};

function modelFromSession(
  pathwayId: string | null | undefined,
  sessionKind?: PostExamSessionKind | string | null,
): TestingModel {
  if (sessionKind === "loft_simulation") return "LOFT";
  if (sessionKind === "cat") return "CAT";
  const fromPathway = getTestingModelForPathwayId(pathwayId);
  if (sessionKind === "practice_exam" || sessionKind === "readiness_assessment") {
    return fromPathway === "LOFT" ? "LOFT" : fromPathway === "CAT" ? "CAT" : "LINEAR";
  }
  return fromPathway;
}

export function resolveResultsHeroVariant(
  pathwayId: string | null | undefined,
  sessionKind?: PostExamSessionKind | string | null,
): ResultsHeroVariant {
  const model = modelFromSession(pathwayId, sessionKind);
  if (model === "LOFT" || sessionKind === "loft_simulation") return "loft_simulation";
  if (model === "CAT" || sessionKind === "cat") return "cat_adaptive";
  return "linear_practice";
}

export function getTestingModelResultsProfile(
  pathwayId: string | null | undefined,
  sessionKind?: PostExamSessionKind | string | null,
): TestingModelResultsProfile {
  const model = modelFromSession(pathwayId, sessionKind);
  const def = getTestingModelDefinition(model);
  const caps = getTestingEngineCapabilities(model);
  const heroVariant = resolveResultsHeroVariant(pathwayId, sessionKind);

  const simulationHubHref =
    model === "LOFT" ? "/app/cases/cnple" : "/app/practice-tests?startMode=practice_exam";

  if (heroVariant === "loft_simulation") {
    return {
      model,
      heroVariant,
      resultsSurfaceClass: "nn-loft-results",
      postExamDataMarker: "loft",
      showPassProbability: false,
      showConfidenceEstimate: false,
      readinessMetricLabel: "Blueprint readiness",
      paywallUpsellCopy:
        "Unlock full CNPLE prep for unlimited LOFT simulations, blueprint domain analytics, and competency-focused remediation.",
      anotherSessionCtaLabel: "Start another LOFT simulation",
      reviewSessionCtaLabel: "Review simulation steps",
      simulationHubHref,
    };
  }

  if (heroVariant === "cat_adaptive") {
    return {
      model,
      heroVariant,
      resultsSurfaceClass: "nn-cat-results",
      postExamDataMarker: "cat",
      showPassProbability: caps.supportsAdaptiveSelection,
      showConfidenceEstimate: def.allowsConfidenceEstimation,
      readinessMetricLabel: "Adaptive readiness",
      paywallUpsellCopy:
        "Unlock full exam prep for unlimited adaptive sessions, deeper analytics, and pathway-specific remediation.",
      anotherSessionCtaLabel: "Start Another CAT",
      reviewSessionCtaLabel: "Review This CAT",
      simulationHubHref,
    };
  }

  return {
    model,
    heroVariant,
    resultsSurfaceClass: "nn-linear-results",
    postExamDataMarker: "linear",
    showPassProbability: false,
    showConfidenceEstimate: false,
    readinessMetricLabel: "Session readiness",
    paywallUpsellCopy:
      "Unlock full exam prep for unlimited practice sessions, deeper analytics, and pathway-specific remediation.",
    anotherSessionCtaLabel: def.learnerFacingName,
    reviewSessionCtaLabel: "Review session items",
    simulationHubHref,
  };
}

/** @deprecated Prefer {@link getLearnerDashboardProfile} — alias for presentation-layer naming. */
export const getTestingModelDashboardProfile = getLearnerDashboardProfile;

export function getTestingModelProgressSemantics(
  pathwayId: string | null | undefined,
): TestingModelProgressSemantics {
  const profile = getLearnerDashboardProfile(pathwayId);
  return {
    progressLabel: profile.primaryMetricLabel,
    streakLabel: profile.showCatStreakSemantics ? "CAT session streak" : null,
    showAdaptiveProgression: profile.showAdaptiveProgression,
  };
}

export function getTestingModelRecommendationSemantics(
  pathwayId: string | null | undefined,
): TestingModelRecommendationSemantics {
  const model = getTestingModelForPathwayId(pathwayId);
  if (model === "LOFT") {
    return {
      reassessmentCtaLabel: null,
      simulationFollowUpLabel: "Run another blueprint-balanced simulation",
      weakAreaFraming: "Strengthen competency balance in these domains",
    };
  }
  if (model === "CAT") {
    return {
      reassessmentCtaLabel: "Take another adaptive readiness session",
      simulationFollowUpLabel: "Continue adaptive exam training",
      weakAreaFraming: "Target weak areas with adaptive precision",
    };
  }
  return {
    reassessmentCtaLabel: null,
    simulationFollowUpLabel: "Continue practice",
    weakAreaFraming: "Review weak topics before your next timed block",
  };
}
