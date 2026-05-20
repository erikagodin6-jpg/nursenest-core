import "server-only";

import { InternalCourseStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export type EcgModuleStatus = "draft" | "qa_preview" | "published" | "archived";

export const ECG_MODULE_COURSE_CODE = "ecg-mastery-module";

function fromInternalStatus(status: InternalCourseStatus | null | undefined): EcgModuleStatus {
  if (status === InternalCourseStatus.published) return "published";
  if (status === InternalCourseStatus.internal) return "qa_preview";
  return "draft";
}

function toInternalStatus(status: EcgModuleStatus): InternalCourseStatus {
  if (status === "published") return InternalCourseStatus.published;
  if (status === "qa_preview") return InternalCourseStatus.internal;
  if (status === "archived") return InternalCourseStatus.draft;
  return InternalCourseStatus.draft;
}

export async function getEcgModuleStatus(): Promise<EcgModuleStatus> {
  const row = await prisma.internalCourse.findUnique({
    where: { code: ECG_MODULE_COURSE_CODE },
    select: { status: true },
  });
  return fromInternalStatus(row?.status);
}

export async function setEcgModuleStatus(status: EcgModuleStatus): Promise<EcgModuleStatus> {
  const row = await prisma.internalCourse.upsert({
    where: { code: ECG_MODULE_COURSE_CODE },
    create: {
      code: ECG_MODULE_COURSE_CODE,
      title: "ECG Mastery Module",
      description: "Production status record for gated ECG module publishing.",
      status: toInternalStatus(status),
      pathwayIds: ["us-rn-nclex-rn", "ca-rn-nclex-rn", "np"],
    },
    update: { status: toInternalStatus(status) },
    select: { status: true },
  });
  return fromInternalStatus(row.status);
}
