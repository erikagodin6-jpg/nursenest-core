/**
 * Capability-driven cognition registry — maps psychometric capabilities to learner intelligence features.
 */
import { pathwaySupportsCapability } from "@/lib/testing/testing-model-capabilities";
import type { CognitionCapability } from "@/lib/educational-cognition/educational-cognition-types";
import type { PsychometricOrchestrationContext } from "@/lib/testing/psychometric-orchestrator";

const CAPABILITY_MAP: Record<
  CognitionCapability,
  (ctx: PsychometricOrchestrationContext) => boolean
> = {
  adaptive_recommendations: (ctx) =>
    ctx.engineCapabilities.supportsAdaptiveSelection &&
    ctx.dashboard.showAdaptiveProgression,
  pass_outlook: (ctx) => ctx.readiness.allowsPassOutlook,
  competency_graph: () => true,
  longitudinal_state: () => true,
  timing_intelligence: () => true,
  ai_coaching_narrative: () => true,
  measurement_interpretation: () => true,
  remediation_fatigue_governance: () => true,
};

export function buildCognitionCapabilityRegistry(
  psychometric: PsychometricOrchestrationContext,
): Record<CognitionCapability, boolean> {
  const out = {} as Record<CognitionCapability, boolean>;
  for (const key of Object.keys(CAPABILITY_MAP) as CognitionCapability[]) {
    out[key] = CAPABILITY_MAP[key](psychometric);
  }
  out.adaptive_recommendations =
    out.adaptive_recommendations &&
    pathwaySupportsCapability(psychometric.pathwayId, "adaptive_selection");
  return out;
}
