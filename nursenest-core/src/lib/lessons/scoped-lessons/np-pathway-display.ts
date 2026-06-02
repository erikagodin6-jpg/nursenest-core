const NP_LABELS: Record<string, string> = {
  "ca-np-cnple": "Canadian NP",
  "us-np-agpcnp": "AGPCNP",
  "us-np-pmhnp": "PMHNP",
  "us-np-whnp": "WHNP",
  "us-np-pnp-pc": "PNP-PC",
};

export function npExamLabel(pathwayId: string): string {
  return NP_LABELS[pathwayId] ?? "FNP";
}

export function npPrimaryCareTitleSuffix(pathwayId: string): string {
  if (pathwayId === "ca-np-cnple") {
    return "Canadian NP (primary care)";
  }

  const label = npExamLabel(pathwayId);
  return label === "FNP" ? "FNP, US" : `${label}, US`;
}