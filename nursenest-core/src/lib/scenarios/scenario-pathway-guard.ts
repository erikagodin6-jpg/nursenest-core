import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

/**
 * OSCE / clinical scenario shells are scoped to **nursing** exam pathways only.
 * Allied hubs stay excluded until product explicitly extends this surface.
 */
export function isNursingPathwayForScenarioSurfaces(pathwayId: string | null | undefined): boolean {
  const id = pathwayId?.trim();
  if (!id) return true;
  const p = getExamPathwayById(id);
  if (!p) return true;
  return p.roleTrack !== "allied";
}
