import { isLoftSimulationPolicy } from "@/lib/practice-tests/loft-simulation-policy";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { CoachingModel, CoachingSemanticsCopy } from "@/lib/learner/post-exam-coaching/types";
import { enforceGovernedAiMeasurementCopy } from "@/lib/measurements/measurement-ai-boundary";
import { validateAiMeasurementCopy } from "@/lib/measurements/measurement-ai-governance";
import {
  getCoachingPolicyForPathway,
  validatePsychometricCopyForModel,
} from "@/lib/testing/testing-model";

const LOFT_FORBIDDEN = /\b(adaptive|theta|standard error|difficulty progression|exam got harder|exam got easier|psychometric)\b/i;

export function resolveCoachingModel(
  config: PracticeTestConfigJson | null,
  pathwayId?: string | null,
  sessionKind?: string,
): CoachingModel {
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : null;
  if (
    sessionKind === "loft_simulation" ||
    isLoftSimulationPolicy({
      examCode: pathway?.examCode ?? null,
      pathwaySlug: pathway?.id ?? pathwayId ?? null,
      deliveryMode: config?.linearDeliveryMode === "exam" ? "linear_exam" : null,
      simulationKind: config?.catEngineMode === "simulation" ? "loft" : null,
    })
  ) {
    return "loft_readiness";
  }
  if (config?.selectionMode === "cat") return "cat_adaptive";
  return "linear_practice";
}

export function buildCoachingSemanticsCopy(
  model: CoachingModel,
  config: PracticeTestConfigJson | null,
  pathwayId?: string | null,
): CoachingSemanticsCopy {
  const policy = pathwayId ? getCoachingPolicyForPathway(pathwayId) : null;
  switch (model) {
    case "loft_readiness":
      return {
        examModeLabel: policy?.followUpSimulationTitle ?? "LOFT licensing simulation",
        readinessLabel: "Blueprint readiness",
        passOutlookLabel: "Clinical preparedness outlook",
        competencySectionTitle: "Competency balance by domain",
        timingSectionTitle: policy?.pacingNarrativeLead ?? "Simulation pacing",
        forbidAdaptiveWording: true,
      };
    case "cat_adaptive":
      return {
        examModeLabel:
          config?.catPresentationMode === "exam_simulation" ? "CAT exam simulation" : "Adaptive CAT session",
        readinessLabel: "Adaptive readiness estimate",
        passOutlookLabel: "Pass outlook (practice band)",
        competencySectionTitle: "Client needs / blueprint domains",
        timingSectionTitle: "Session pacing & precision",
        forbidAdaptiveWording: false,
      };
    case "linear_practice":
    default:
      return {
        examModeLabel: config?.linearDeliveryMode === "exam" ? "Timed practice exam" : "Linear practice session",
        readinessLabel: "Session readiness",
        passOutlookLabel: "Practice performance outlook",
        competencySectionTitle: "Topic competency",
        timingSectionTitle: "Time management",
        forbidAdaptiveWording: false,
      };
  }
}

/** Strip CAT psychometric phrasing when presenting LOFT copy. */
export function sanitizeCoachingNarrative(
  text: string,
  model: CoachingModel,
  pathwayId?: string | null,
): string {
  let out = text;
  if (model !== "loft_readiness") {
    const governed = enforceGovernedAiMeasurementCopy({
      text: out,
      surface: "coaching",
      pathwayId,
      applyFallback: true,
    });
    if (governed.blocked) return governed.text;
    const measurementIssues = validateAiMeasurementCopy(governed.text, { pathwayId });
    if (measurementIssues.some((i) => i.severity === "block")) {
      return "Review serial lab trends and pathway instructional units in your remediation plan — avoid unsourced conversion shortcuts.";
    }
    return governed.text;
  }
  out = out.replace(/\badaptive readiness\b/gi, "blueprint readiness");
  out = out.replace(/\badaptive estimate\b/gi, "readiness estimate");
  out = out.replace(/\bstandard error\b/gi, "estimate stability");
  out = out.replace(/\btheta\b/gi, "ability estimate");
  out = out.replace(/\bdifficulty progression\b/gi, "item challenge mix");
  const violations = validatePsychometricCopyForModel("LOFT", out);
  if (violations.length > 0 || LOFT_FORBIDDEN.test(out)) {
    out = `${out} Focus on domain balance and clinical preparedness for your next fixed-length simulation.`;
  }
  if (pathwayId) {
    const recheck = validatePsychometricCopyForModel("LOFT", out);
    if (recheck.length > 0) {
      return "Review domain balance and schedule your next blueprint-balanced LOFT simulation when ready.";
    }
  }
  const governed = enforceGovernedAiMeasurementCopy({
    text: out,
    surface: "loft",
    pathwayId,
    applyFallback: true,
  });
  if (governed.blocked) return governed.text;
  const measurementIssues = validateAiMeasurementCopy(governed.text, { pathwayId });
  if (measurementIssues.some((i) => i.severity === "block")) {
    return "Review serial lab trends and pathway instructional units in your remediation plan — avoid unsourced conversion shortcuts.";
  }
  return governed.text;
}

export function loftSafeTrendLabel(
  raw: string | null | undefined,
  model: CoachingModel,
  pathwayId?: string | null,
): string | null {
  if (!raw) return null;
  if (model === "loft_readiness") {
    if (/improving|slipping|cooling|theta/i.test(raw)) return "Performance steady across this simulation";
    return sanitizeCoachingNarrative(raw, model, pathwayId);
  }
  return raw;
}
