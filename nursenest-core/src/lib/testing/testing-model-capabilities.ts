/**
 * Capability-based testing model governance — extend new exam models without enum sprawl.
 */
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import {
  getTestingEngineCapabilities,
  type TestingEngineCapabilities,
} from "@/lib/testing/testing-engine-capabilities";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";

export type TestingModelCapability =
  | "adaptive_selection"
  | "blueprint_assembly"
  | "difficulty_escalation"
  | "stable_form_assembly"
  | "adaptive_termination"
  | "confidence_estimation"
  | "difficulty_adaptation";

function engineSupports(
  caps: TestingEngineCapabilities,
  def: ReturnType<typeof getTestingModelDefinition>,
  capability: TestingModelCapability,
): boolean {
  switch (capability) {
    case "adaptive_selection":
      return caps.supportsAdaptiveSelection;
    case "blueprint_assembly":
      return caps.supportsBlueprintAssembly;
    case "difficulty_escalation":
      return caps.supportsDifficultyEscalation;
    case "stable_form_assembly":
      return caps.supportsStableFormAssembly;
    case "adaptive_termination":
      return caps.supportsAdaptiveTermination;
    case "confidence_estimation":
      return def.allowsConfidenceEstimation;
    case "difficulty_adaptation":
      return def.allowsDifficultyAdaptation;
    default:
      return false;
  }
}

export function modelSupportsCapability(
  model: TestingModel,
  capability: TestingModelCapability,
): boolean {
  return engineSupports(getTestingEngineCapabilities(model), getTestingModelDefinition(model), capability);
}

export function pathwaySupportsCapability(
  pathwayId: string | null | undefined,
  capability: TestingModelCapability,
): boolean {
  return modelSupportsCapability(getTestingModelForPathwayId(pathwayId), capability);
}

export function assertModelSupportsCapability(
  model: TestingModel,
  capability: TestingModelCapability,
  context: string,
): void {
  if (modelSupportsCapability(model, capability)) return;
  throw new Error(
    `Testing model ${model} does not support capability "${capability}" (${context}).`,
  );
}

export function assertPathwaySupportsCapability(
  pathwayId: string | null | undefined,
  capability: TestingModelCapability,
  context: string,
): void {
  const model = getTestingModelForPathwayId(pathwayId);
  assertModelSupportsCapability(model, capability, `${context} [pathway=${pathwayId ?? "unknown"}]`);
}

/** LOFT delivery integrity — blueprint assembly without adaptive CAT semantics. */
export function assertLoftPsychometricIntegrity(pathwayId: string | null | undefined): void {
  const model = getTestingModelForPathwayId(pathwayId);
  if (model !== "LOFT") return;
  assertModelSupportsCapability(model, "stable_form_assembly", "loft_integrity");
  assertModelSupportsCapability(model, "blueprint_assembly", "loft_integrity");
  if (modelSupportsCapability(model, "adaptive_selection")) {
    throw new Error(`LOFT pathway ${pathwayId}: adaptive_selection must remain disabled.`);
  }
  if (modelSupportsCapability(model, "difficulty_escalation")) {
    throw new Error(`LOFT pathway ${pathwayId}: difficulty_escalation must remain disabled.`);
  }
}

/** CAT session/bootstrap — adaptive engine operations only on CAT-capable pathways. */
export function assertCatAdaptiveEngineAllowed(pathwayId: string | null | undefined): void {
  assertPathwaySupportsCapability(pathwayId, "adaptive_selection", "cat_adaptive_engine");
}
