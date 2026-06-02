const US_NP_FNP_PATHWAY_ID = "us-np-fnp";
const CA_NP_CNPLE_PATHWAY_ID = "ca-np-cnple";

export function resolveImportedNpPathwayId(exam: string): string {
  const normalized = exam.trim().toUpperCase();

  switch (normalized) {
    case "CNPLE-NP":
      return CA_NP_CNPLE_PATHWAY_ID;
    case "AANP-FNP":
    case "ANCC-FNP":
    default:
      return US_NP_FNP_PATHWAY_ID;
  }
}
