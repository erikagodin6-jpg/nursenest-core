import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Pathways whose marketing **overview** hub (`/{us|canada}/rn/nclex-rn`) is retired in favor of `/lessons`. */
export const RN_NCLEX_MARKETING_PATHWAY_IDS = new Set(["us-rn-nclex-rn", "ca-rn-nclex-rn"]);

export function isRnNclexMarketingPathwayId(pathwayId: string): boolean {
  return RN_NCLEX_MARKETING_PATHWAY_IDS.has(pathwayId);
}

/** Permanent redirect target for obsolete RN NCLEX exam-hub overview URLs (marketing). */
export const RN_NCLEX_EXAM_HUB_OVERVIEW_REDIRECT = "/lessons" as const;

export function rnNclexExamHubOverviewRedirectTarget(pathway: ExamPathwayDefinition | null): string | null {
  if (pathway && isRnNclexMarketingPathwayId(pathway.id)) return RN_NCLEX_EXAM_HUB_OVERVIEW_REDIRECT;
  return null;
}
