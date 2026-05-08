import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { EcgUrlSegment } from "@/lib/ecg/ecg-types";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";

export function ecgUrlSegmentFromPathwayId(pathwayId: string | null | undefined): EcgUrlSegment {
  const id = pathwayId?.trim();
  if (!id) return "rn";
  const pathway = getExamPathwayById(id);
  const role: RoleTrackSlug | undefined = pathway?.roleTrack;
  if (role === "np") return "np";
  if (role === "rpn" || role === "lpn") return "pn";
  return "rn";
}

export function ecgSegmentMatchesPathway(segment: EcgUrlSegment, pathwayId: string | null | undefined): boolean {
  return ecgUrlSegmentFromPathwayId(pathwayId) === segment;
}
