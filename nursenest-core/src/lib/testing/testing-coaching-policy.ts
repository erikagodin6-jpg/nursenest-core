/**
 * Testing-model-specific post-exam coaching semantics.
 */
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import {
  assertNoCatLanguageForLoftPathway,
  validatePsychometricCopyForModel,
} from "@/lib/testing/psychometric-isolation";

export type TestingCoachingPolicy = {
  model: TestingModel;
  emphasizeCompetencyBalance: boolean;
  emphasizeBlueprintDistribution: boolean;
  emphasizeAdaptiveProgression: boolean;
  emphasizePrecisionReadiness: boolean;
  followUpSimulationTitle: string;
  followUpSimulationReason: string;
  followUpAdaptiveSessionTitle: string | null;
  followUpAdaptiveSessionReason: string | null;
  pacingNarrativeLead: string;
  readinessHeadlineTemplate: (scorePct: number, contextLabel: string) => string;
  readinessNarrativeWeak: (weakDomains: string[]) => string;
  readinessNarrativeStrong: string;
};

export function getCoachingPolicyForTestingModel(model: TestingModel): TestingCoachingPolicy {
  const def = getTestingModelDefinition(model);

  if (model === "LOFT") {
    return {
      model,
      emphasizeCompetencyBalance: true,
      emphasizeBlueprintDistribution: true,
      emphasizeAdaptiveProgression: false,
      emphasizePrecisionReadiness: false,
      followUpSimulationTitle: "Another LOFT simulation",
      followUpSimulationReason:
        "Repeat a blueprint-balanced, fixed-length case simulation to practice pacing, domain coverage, and Canadian NP clinical judgment under exam-like conditions.",
      followUpAdaptiveSessionTitle: null,
      followUpAdaptiveSessionReason: null,
      pacingNarrativeLead: "Stable LOFT pacing across the full item set",
      readinessHeadlineTemplate: (scorePct, contextLabel) =>
        `${scorePct >= 75 ? "Approaching readiness" : scorePct >= 55 ? "Building readiness" : "Needs focused review"} — ${contextLabel}`,
      readinessNarrativeWeak: (weakDomains) =>
        `Strengthen competency balance in ${weakDomains.map((d) => d.replace(/-/g, " ")).join(", ")} before your next licensing-style simulation.`,
      readinessNarrativeStrong:
        "Strong competency balance in this run — confirm with another full-length LOFT simulation under timed conditions.",
    };
  }

  if (model === "CAT") {
    return {
      model,
      emphasizeCompetencyBalance: false,
      emphasizeBlueprintDistribution: true,
      emphasizeAdaptiveProgression: true,
      emphasizePrecisionReadiness: true,
      followUpSimulationTitle: "Another adaptive session",
      followUpSimulationReason:
        "A follow-up CAT helps confirm whether today's gaps are stable or one-off under pressure.",
      followUpAdaptiveSessionTitle: "Another adaptive session",
      followUpAdaptiveSessionReason:
        "A follow-up CAT helps confirm whether today's gaps are stable or one-off under pressure.",
      pacingNarrativeLead: "Adaptive pacing across this CAT session",
      readinessHeadlineTemplate: (scorePct, contextLabel) => `${contextLabel} — ${scorePct}% session score`,
      readinessNarrativeWeak: (weakDomains) =>
        `Targeted CAT and topic drills in ${weakDomains.join(", ")} will sharpen precision before your next run.`,
      readinessNarrativeStrong: "Solid adaptive performance — keep pressure-testing weak domains in CAT.",
    };
  }

  return {
    model,
    emphasizeCompetencyBalance: true,
    emphasizeBlueprintDistribution: false,
    emphasizeAdaptiveProgression: false,
    emphasizePrecisionReadiness: false,
    followUpSimulationTitle: "Another practice exam",
    followUpSimulationReason: "Run another linear practice block to confirm topic recall under time.",
    followUpAdaptiveSessionTitle: null,
    followUpAdaptiveSessionReason: null,
    pacingNarrativeLead: "Practice session pacing",
    readinessHeadlineTemplate: (scorePct, contextLabel) => `${contextLabel} — ${scorePct}%`,
    readinessNarrativeWeak: (weakDomains) =>
      `Review ${weakDomains.join(", ")} with lessons and drills before your next practice exam.`,
    readinessNarrativeStrong: "Strong practice performance — repeat under timed conditions.",
  };
}

export function getCoachingPolicyForPathway(pathwayId: string | null | undefined): TestingCoachingPolicy {
  return getCoachingPolicyForTestingModel(getTestingModelForPathwayId(pathwayId));
}

/** Validate coaching strings before they reach learners (LOFT throws on CAT leakage). */
export function validateCoachingCopyForPathway(pathwayId: string | null | undefined, text: string): void {
  const model = getTestingModelForPathwayId(pathwayId);
  const violations = validatePsychometricCopyForModel(model, text);
  if (violations.length > 0 && model === "LOFT") {
    assertNoCatLanguageForLoftPathway(pathwayId, text, "coaching");
  }
}
