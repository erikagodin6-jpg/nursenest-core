import "server-only";

import type { ClinicalNursingScenarioPublishStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

const LIST_TAKE = 60;

export async function listClinicalNursingScenariosForAdmin(opts: { pathwayId?: string | null }) {
  const pid = opts.pathwayId?.trim();
  return prisma.clinicalNursingScenario.findMany({
    where: pid ? { pathwayId: pid } : {},
    orderBy: { updatedAt: "desc" },
    take: LIST_TAKE,
    select: {
      id: true,
      title: true,
      pathwayId: true,
      canonicalCategoryId: true,
      tierFocus: true,
      difficulty: true,
      publishStatus: true,
      updatedAt: true,
      _count: { select: { stages: true } },
    },
  });
}

export async function listClinicalNursingScenariosForLearnerCatalog(opts: {
  pathwayId: string;
  includeDraftsForStaff: boolean;
}) {
  const pid = opts.pathwayId.trim();
  return prisma.clinicalNursingScenario.findMany({
    where: {
      pathwayId: pid,
      ...(opts.includeDraftsForStaff ? {} : { publishStatus: "APPROVED" as ClinicalNursingScenarioPublishStatus }),
    },
    orderBy: { updatedAt: "desc" },
    take: LIST_TAKE,
    select: {
      id: true,
      title: true,
      pathwayId: true,
      canonicalCategoryId: true,
      tierFocus: true,
      difficulty: true,
      publishStatus: true,
      patientAgeContext: true,
      presentingConcern: true,
    },
  });
}

export async function getClinicalNursingScenarioDetailForViewer(opts: {
  id: string;
  viewerMaySeeDrafts: boolean;
}) {
  const row = await prisma.clinicalNursingScenario.findUnique({
    where: { id: opts.id },
    include: { stages: { orderBy: { orderIndex: "asc" } } },
  });
  if (!row) return null;
  if (!opts.viewerMaySeeDrafts && row.publishStatus !== "APPROVED") return null;
  return row;
}

export async function updateClinicalNursingScenarioPublishStatus(
  id: string,
  status: ClinicalNursingScenarioPublishStatus,
) {
  await prisma.clinicalNursingScenario.update({
    where: { id },
    data: { publishStatus: status },
  });
}
