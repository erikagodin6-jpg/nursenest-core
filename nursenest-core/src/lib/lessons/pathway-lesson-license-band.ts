/**
 * License band for pathway lessons — drives single-tier copy (RN vs PN vs NP), not subscription tier.
 */
export type PathwayLicenseBand = "rn" | "pn" | "np";

export function pathwayLicenseBandFromPathwayId(pathwayId: string): PathwayLicenseBand {
  const id = pathwayId.toLowerCase();
  if (id.includes("np")) return "np";
  if (id.includes("rpn") || id.includes("lpn") || id.includes("-pn-") || id.endsWith("-pn")) return "pn";
  return "rn";
}
