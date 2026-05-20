import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * NP program hubs that receive the premium “clinical workstation” marketing surface
 * (FNP, AGPCNP, PMHNP, WHNP, PNP-PC, CNPLE — aligned to {@link ExamPathwayDefinition} ids).
 */
export const NP_PREMIUM_CONVERGENCE_PATHWAY_IDS = new Set<string>([
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
]);

export function isNpPremiumConvergencePathway(pathway: ExamPathwayDefinition): boolean {
  return pathway.roleTrack === "np" && NP_PREMIUM_CONVERGENCE_PATHWAY_IDS.has(pathway.id);
}
