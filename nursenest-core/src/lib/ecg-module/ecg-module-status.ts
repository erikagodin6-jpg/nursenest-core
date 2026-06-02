import "server-only";

import { InternalCourseStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type EcgModuleStatus = "draft" | "qa_preview" | "published" | "archived";

export const ECG_MODULE_COURSE_CODE = "ecg-mastery-module";
const ECG_MODULE_STATUS_READ_TIMEOUT_MS = 650;

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
  const row = await withDatabaseFallbackTimeout(
    () =>
      prisma.internalCourse.findUnique({
        where: { code: ECG_MODULE_COURSE_CODE },
        select: { status: true },
      }),
    null,
    ECG_MODULE_STATUS_READ_TIMEOUT_MS,
    { scope: "ecg_module", label: "module_status" },
  );
  if (!row) {
    safeServerLog("ecg_module", "module_status_fallback", {
      code: ECG_MODULE_COURSE_CODE,
      timeoutMs: ECG_MODULE_STATUS_READ_TIMEOUT_MS,
      fallbackStatus: "draft",
    });
  }
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
