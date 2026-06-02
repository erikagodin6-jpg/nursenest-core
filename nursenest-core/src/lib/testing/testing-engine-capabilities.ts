/**
 * Engine capability contracts — prevent LOFT/CAT convergence at the selection layer.
 */
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import { getTestingModelForPathwayId, pathwayUsesLoftEngine } from "@/lib/testing/testing-model-pathway-map";

export interface TestingEngineCapabilities {
  supportsAdaptiveSelection: boolean;
  supportsBlueprintAssembly: boolean;
  supportsDifficultyEscalation: boolean;
  supportsStableFormAssembly: boolean;
  supportsAdaptiveTermination: boolean;
}

export function getTestingEngineCapabilities(model: TestingModel): TestingEngineCapabilities {
  const def = getTestingModelDefinition(model);
  if (model === "CAT") {
    return {
      supportsAdaptiveSelection: true,
      supportsBlueprintAssembly: true,
      supportsDifficultyEscalation: true,
      supportsStableFormAssembly: false,
      supportsAdaptiveTermination: def.allowsAdaptiveTermination,
    };
  }
  if (model === "LOFT") {
    return {
      supportsAdaptiveSelection: false,
      supportsBlueprintAssembly: true,
      supportsDifficultyEscalation: false,
      supportsStableFormAssembly: true,
      supportsAdaptiveTermination: false,
    };
  }
  return {
    supportsAdaptiveSelection: false,
    supportsBlueprintAssembly: false,
    supportsDifficultyEscalation: false,
    supportsStableFormAssembly: true,
    supportsAdaptiveTermination: false,
  };
}

export type CatEngineGuardResult =
  | { ok: true }
  | { ok: false; code: "loft_pathway_cat_blocked"; message: string };

/** Server/client guard: CAT session creation must reject LOFT licensing pathways. */
export function assertCatEngineAllowedForPathwayId(pathwayId: string | null | undefined): CatEngineGuardResult {
  if (!pathwayId?.trim()) return { ok: true };
  if (pathwayUsesLoftEngine(pathwayId)) {
    const model = getTestingModelForPathwayId(pathwayId);
    return {
      ok: false,
      code: "loft_pathway_cat_blocked",
      message: `${getTestingModelDefinition(model).learnerFacingName} uses blueprint-constrained LOFT delivery — start simulation from the pathway hub, not adaptive CAT.`,
    };
  }
  return { ok: true };
}

/** Telemetry/event name guard — LOFT sessions must not emit CAT-prefixed adaptive events. */
export function assertCatTelemetryAllowedForPathway(
  pathwayId: string | null | undefined,
  eventName: string,
): void {
  if (!pathwayUsesLoftEngine(pathwayId)) return;
  if (/^cat_/i.test(eventName) || /adaptive_(?:pick|advance|theta)/i.test(eventName)) {
    throw new Error(
      `LOFT pathway ${pathwayId}: CAT telemetry forbidden (${eventName}). Use loft_ / simulation_ namespaces.`,
    );
  }
}
