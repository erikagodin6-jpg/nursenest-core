import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export const ALLIED_GLOBAL_HUB_PATH = "/allied/allied-health" as const;
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

export function buildAlliedGlobalHubPath(subpath?: string): string {
  if (!subpath) return ALLIED_GLOBAL_HUB_PATH;
  return `${ALLIED_GLOBAL_HUB_PATH}/${subpath.replace(/^\//, "")}`;
}

export function buildLegacyAlliedMarketingPath(subpath?: string): string {
  const base = "/us/allied/allied-health";
  if (!subpath) return base;
  return `${base}/${subpath.replace(/^\//, "")}`;
}

export function getCanonicalAlliedPathway(): ExamPathwayDefinition | null {
  return getExamPathwayById(ALLIED_CANONICAL_PATHWAY_ID) ?? getExamPathwayById("ca-allied-core") ?? null;
}
