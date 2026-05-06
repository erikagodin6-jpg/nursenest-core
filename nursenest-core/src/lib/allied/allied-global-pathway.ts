import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

import { ALLIED_GLOBAL_HUB_PATH, buildAlliedGlobalHubPath } from "@/lib/allied/allied-global-hub-path";

export { ALLIED_GLOBAL_HUB_PATH, buildAlliedGlobalHubPath };

export const ALLIED_GLOBAL_PATHWAY_IDS = ["us-allied-core", "ca-allied-core"] as const;
export const ALLIED_CANONICAL_PATHWAY_ID = "us-allied-core" as const;

export type AlliedGlobalPathwayId = (typeof ALLIED_GLOBAL_PATHWAY_IDS)[number];

export function isAlliedGlobalPathwayId(pathwayId: string | null | undefined): pathwayId is AlliedGlobalPathwayId {
  return (ALLIED_GLOBAL_PATHWAY_IDS as readonly string[]).includes((pathwayId ?? "").trim());
}

export function isAlliedHealthPathway(
  pathway:
    | Pick<ExamPathwayDefinition, "id" | "roleTrack" | "examCode">
    | null
    | undefined,
): boolean {
  if (!pathway) return false;
  return pathway.roleTrack === "allied" && pathway.examCode === "allied-health";
}

/** @deprecated Prefer {@link buildAlliedGlobalHubPath} — country-prefixed allied hubs redirect globally. */
export function buildLegacyAlliedMarketingPath(subpath?: string): string {
  return buildAlliedGlobalHubPath(subpath);
}

export function getCanonicalAlliedPathway(): ExamPathwayDefinition | null {
  return getExamPathwayById(ALLIED_CANONICAL_PATHWAY_ID) ?? getExamPathwayById("ca-allied-core") ?? null;
}
