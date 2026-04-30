import type { ClinicalNursingScenarioPublishStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";

/** Where clause for learner catalog — subscribers never see non-APPROVED scenarios. */
export function buildClinicalNursingScenarioLearnerCatalogWhere(opts: {
  pathwayId: string;
  includeDraftsForStaff: boolean;
  canonicalCategoryIds?: string[];
}): Prisma.ClinicalNursingScenarioWhereInput {
  const pid = opts.pathwayId.trim();
  const catIds = (opts.canonicalCategoryIds ?? []).map((c) => c.trim()).filter(Boolean);
  return {
    pathwayId: pid,
    ...(catIds.length > 0 ? { canonicalCategoryId: { in: catIds } } : {}),
    ...(opts.includeDraftsForStaff ? {} : { publishStatus: "APPROVED" as ClinicalNursingScenarioPublishStatus }),
  };
}

export function clinicalNursingScenarioRowVisibleToLearner(
  publishStatus: ClinicalNursingScenarioPublishStatus,
  viewerMaySeeDrafts: boolean,
): boolean {
  if (viewerMaySeeDrafts) return true;
  return publishStatus === "APPROVED";
}
