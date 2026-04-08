/** Shared NP pathway labels for scoped gold lessons (FNP / AGPCNP / PMHNP). */
export function npExamLabel(pathwayId: string): string {
  if (pathwayId === "us-np-agpcnp") return "AGPCNP";
  if (pathwayId === "us-np-pmhnp") return "PMHNP";
  return "FNP";
}

export function npPrimaryCareTitleSuffix(pathwayId: string): string {
  const lab = npExamLabel(pathwayId);
  return lab === "FNP" ? "FNP, US" : `${lab}, US`;
}
