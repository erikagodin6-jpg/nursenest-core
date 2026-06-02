export type CoverageBand = "covered" | "thin_acceptable" | "insufficient" | "missing";

export function classifyCoverage(count: number, min: number, stretch: number): CoverageBand {
  if (count <= 0) return "missing";
  if (count < min) return "insufficient";
  if (count < stretch) return "thin_acceptable";
  return "covered";
}
