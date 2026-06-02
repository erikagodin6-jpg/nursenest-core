/**
 * LOFT simulation policy helpers.
 *
 * Distinguishes fixed-form linear licensing simulations (CNPLE-style) from
 * adaptive CAT delivery. Delegates pathway classification to client-safe
 * testing model policy modules.
 */

import { assertLoftPsychometricIntegrity } from "@/lib/testing/testing-model-capabilities";
import {
  getTestingModelForPathwayId,
  isLoftTestingModel,
} from "@/lib/testing/testing-model-pathway-map";

export type LoftSimulationPolicyInput = {
  examCode?: string | null;
  pathwaySlug?: string | null;
  deliveryMode?: string | null;
  simulationKind?: string | null;
};

function normalize(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isLoftSimulationPolicy(input: LoftSimulationPolicyInput): boolean {
  const examCode = normalize(input.examCode);
  const pathwaySlug = normalize(input.pathwaySlug);
  const deliveryMode = normalize(input.deliveryMode);
  const simulationKind = normalize(input.simulationKind);

  if (simulationKind === "loft") return true;
  if (deliveryMode === "linear_exam") return true;

  if (examCode === "cnple") return true;

  const pathwayId = pathwaySlug || null;
  if (pathwayId && isLoftTestingModel(getTestingModelForPathwayId(pathwayId))) return true;

  if (pathwaySlug.includes("cnple")) return true;

  return false;
}

/** Runtime guard when a session is classified as LOFT — blocks adaptive engine semantics. */
export function assertLoftSimulationPolicyIntegrity(input: LoftSimulationPolicyInput): void {
  if (!isLoftSimulationPolicy(input)) return;
  const pathwayId = input.pathwaySlug?.trim() || (input.examCode === "cnple" ? "ca-np-cnple" : null);
  assertLoftPsychometricIntegrity(pathwayId);
}
