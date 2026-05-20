import "server-only";

import { InternalCourseStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export type AdvancedEcgModuleStatus = "draft" | "qa_preview" | "published" | "archived";

export const ADVANCED_ECG_MODULE_COURSE_CODE = "advanced-ecg-module";

function fromInternalStatus(status: InternalCourseStatus | null | undefined): AdvancedEcgModuleStatus {
  if (status === InternalCourseStatus.published) return "published";
  if (status === InternalCourseStatus.internal) return "qa_preview";
  return "draft";
}

function toInternalStatus(status: AdvancedEcgModuleStatus): InternalCourseStatus {
  if (status === "published") return InternalCourseStatus.published;
  if (status === "qa_preview") return InternalCourseStatus.internal;
  return InternalCourseStatus.draft;
}

export async function getAdvancedEcgModuleStatus(): Promise<AdvancedEcgModuleStatus> {
  const row = await prisma.internalCourse.findUnique({
    where: { code: ADVANCED_ECG_MODULE_COURSE_CODE },
    select: { status: true },
  });
  return fromInternalStatus(row?.status);
}

export async function setAdvancedEcgModuleStatus(status: AdvancedEcgModuleStatus): Promise<AdvancedEcgModuleStatus> {
  const row = await prisma.internalCourse.upsert({
    where: { code: ADVANCED_ECG_MODULE_COURSE_CODE },
    create: {
      code: ADVANCED_ECG_MODULE_COURSE_CODE,
      title: "Advanced ECG Add-On Module",
      description: "Operational status record for the separate paid Advanced ECG module.",
      status: toInternalStatus(status),
      pathwayIds: ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-np-fnp"],
    },
    update: { status: toInternalStatus(status) },
    select: { status: true },
  });
  return fromInternalStatus(row.status);
}
