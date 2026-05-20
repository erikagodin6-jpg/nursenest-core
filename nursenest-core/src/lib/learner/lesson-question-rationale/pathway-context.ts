import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { PathwayRationaleContext } from "@/lib/learner/lesson-question-rationale/types";

/**
 * Build pathway context for mapping gates. Returns `null` if the pathway id is unknown.
 */
export function pathwayRationaleContextFromId(pathwayId: string | null | undefined): PathwayRationaleContext | null {
  const id = typeof pathwayId === "string" ? pathwayId.trim() : "";
  if (!id) return null;
  const p = getExamPathwayById(id);
  if (!p) return null;
  return {
    pathwayId: p.id,
    countryCode: p.countryCode,
    countrySlug: p.countrySlug,
    roleTrack: p.roleTrack,
  };
}
