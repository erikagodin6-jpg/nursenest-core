import "server-only";

import { InternalCourseStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export type AdvancedLabsModuleStatus = "draft" | "qa_preview" | "published" | "archived";

export const ADVANCED_LABS_MODULE_COURSE_CODE = "advanced-labs-module";

function fromInternalStatus(
  status: InternalCourseStatus | null | undefined,
): AdvancedLabsModuleStatus {
  if (status === InternalCourseStatus.published) return "published";
  if (status === InternalCourseStatus.internal) return "qa_preview";
  return "draft";
}

function toInternalStatus(status: AdvancedLabsModuleStatus): InternalCourseStatus {
  if (status === "published") return InternalCourseStatus.published;
  if (status === "qa_preview") return InternalCourseStatus.internal;
  return InternalCourseStatus.draft;
}

export async function getAdvancedLabsModuleStatus(): Promise<AdvancedLabsModuleStatus> {
  const row = await prisma.internalCourse.findUnique({
    where: { code: ADVANCED_LABS_MODULE_COURSE_CODE },
    select: { status: true },
  });
  return fromInternalStatus(row?.status);
}

export async function setAdvancedLabsModuleStatus(
  status: AdvancedLabsModuleStatus,
): Promise<AdvancedLabsModuleStatus> {
  const row = await prisma.internalCourse.upsert({
    where: { code: ADVANCED_LABS_MODULE_COURSE_CODE },
    create: {
      code: ADVANCED_LABS_MODULE_COURSE_CODE,
      title: "Advanced Labs Interpretation Add-On Module",
      description:
        "Operational status record for the Advanced Labs Interpretation paid add-on module.",
      status: toInternalStatus(status),
      pathwayIds: ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-np-fnp", "ca-np-cnple"],
    },
    update: { status: toInternalStatus(status) },
    select: { status: true },
  });
  return fromInternalStatus(row.status);
}
