/** Shared NP pathway labels for scoped gold lessons (US NP tracks). */
export function npExamLabel(pathwayId: string): string {
  if (pathwayId === "ca-np-cnple") return "Canadian NP";
  if (pathwayId === "us-np-agpcnp") return "AGPCNP";
  if (pathwayId === "us-np-pmhnp") return "PMHNP";
  if (pathwayId === "us-np-whnp") return "WHNP";
  if (pathwayId === "us-np-pnp-pc") return "PNP-PC";
  return "FNP";
}

export function npPrimaryCareTitleSuffix(pathwayId: string): string {
  if (pathwayId === "ca-np-cnple") return "Canadian NP (primary care)";
  const lab = npExamLabel(pathwayId);
  return lab === "FNP" ? "FNP, US" : `${lab}, US`;
}
