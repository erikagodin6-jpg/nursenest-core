import "server-only";

import { InternalCourseStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export type HemodynamicsModuleStatus = "draft" | "qa_preview" | "published" | "archived";

export const HEMODYNAMICS_MODULE_COURSE_CODE = "hemodynamics-module";
export const ADVANCED_HEMODYNAMICS_MODULE_COURSE_CODE = "advanced-hemodynamics-module";

function fromInternalStatus(status: InternalCourseStatus | null | undefined): HemodynamicsModuleStatus {
  if (status === InternalCourseStatus.published) return "published";
  if (status === InternalCourseStatus.internal) return "qa_preview";
  return "draft";
}

function toInternalStatus(status: HemodynamicsModuleStatus): InternalCourseStatus {
  if (status === "published") return InternalCourseStatus.published;
  if (status === "qa_preview") return InternalCourseStatus.internal;
  return InternalCourseStatus.draft;
}

export async function getHemodynamicsModuleStatus(): Promise<HemodynamicsModuleStatus> {
  const row = await prisma.internalCourse.findUnique({
    where: { code: HEMODYNAMICS_MODULE_COURSE_CODE },
    select: { status: true },
  });
  return fromInternalStatus(row?.status);
}

export async function getAdvancedHemodynamicsModuleStatus(): Promise<HemodynamicsModuleStatus> {
  const row = await prisma.internalCourse.findUnique({
    where: { code: ADVANCED_HEMODYNAMICS_MODULE_COURSE_CODE },
    select: { status: true },
  });
  return fromInternalStatus(row?.status);
}

export async function setHemodynamicsModuleStatus(status: HemodynamicsModuleStatus): Promise<HemodynamicsModuleStatus> {
  const row = await prisma.internalCourse.upsert({
    where: { code: HEMODYNAMICS_MODULE_COURSE_CODE },
    create: {
      code: HEMODYNAMICS_MODULE_COURSE_CODE,
      title: "Hemodynamic Monitoring Fundamentals Module",
      description: "Operational status record for the Hemodynamic Monitoring Fundamentals module (included with RN/NP subscriptions).",
      status: toInternalStatus(status),
      pathwayIds: ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-np-fnp", "ca-np-cnple"],
    },
    update: { status: toInternalStatus(status) },
    select: { status: true },
  });
  return fromInternalStatus(row.status);
}

export async function setAdvancedHemodynamicsModuleStatus(status: HemodynamicsModuleStatus): Promise<HemodynamicsModuleStatus> {
  const row = await prisma.internalCourse.upsert({
    where: { code: ADVANCED_HEMODYNAMICS_MODULE_COURSE_CODE },
    create: {
      code: ADVANCED_HEMODYNAMICS_MODULE_COURSE_CODE,
      title: "Advanced Hemodynamic Monitoring Add-On Module",
      description: "Operational status record for the separate paid Advanced Hemodynamic Monitoring module.",
      status: toInternalStatus(status),
      pathwayIds: ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-np-fnp", "ca-np-cnple"],
    },
    update: { status: toInternalStatus(status) },
    select: { status: true },
  });
  return fromInternalStatus(row.status);
}
