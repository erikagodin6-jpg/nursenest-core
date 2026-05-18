/**
 * LOFT simulation policy helpers.
 *
 * Distinguishes fixed-form linear licensing simulations (CNPLE-style) from
 * adaptive CAT delivery. This is intentionally lightweight so route layers,
 * session loaders, and runner shells can adopt it incrementally.
 */

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

  // NP Canada CNPLE linear simulation.
  if (examCode === "cnple") return true;

  // Safety fallback for future route naming.
  if (pathwaySlug.includes("cnple")) return true;
  if (pathwaySlug.includes("simulation")) return true;

  return false;
}
