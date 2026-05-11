import "server-only";

import { InternalCourseStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getEcgModuleReadiness } from "@/lib/ecg-module/ecg-module-readiness";
import type { EcgModuleReadinessCounts } from "@/lib/ecg-module/ecg-module-readiness";
import { isAdvancedEcgModuleEnabled } from "@/lib/advanced-ecg/advanced-ecg-module-config";

export type AdvancedEcgModuleStatus = "draft" | "qa_preview" | "published" | "archived";

export type AdvancedEcgCommercialLaunchState = {
  enabled: boolean;
  status: AdvancedEcgModuleStatus;
  publishFailures: string[];
  canPublish: boolean;
  canSellPublicly: boolean;
  publicMessage: string;
};

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

export function buildAdvancedEcgCommercialLaunchState(input: {
  enabled: boolean;
  status: AdvancedEcgModuleStatus;
  counts: Pick<
    EcgModuleReadinessCounts,
    "readyAdvanced" | "manualReviewMissing" | "publishSafe" | "leakedGeneratedPacemaker"
  >;
}): AdvancedEcgCommercialLaunchState {
  const publishFailures: string[] = [];
  if (!input.enabled) publishFailures.push("Advanced ECG module is disabled by feature flag.");
  if (input.status !== "published") publishFailures.push(`Advanced ECG is ${input.status} and not yet published for public checkout.`);
  if (input.counts.readyAdvanced <= 0) publishFailures.push("No publish-safe advanced ECG content is available yet.");
  if (input.counts.manualReviewMissing > 0) {
    publishFailures.push(`${input.counts.manualReviewMissing} high-risk ECG strip(s) still need clinician review.`);
  }
  if (input.counts.publishSafe < input.counts.readyAdvanced) {
    publishFailures.push("Not every learner-visible advanced ECG item is marked publish-safe.");
  }
  if (input.counts.leakedGeneratedPacemaker > 0) {
    publishFailures.push(
      `${input.counts.leakedGeneratedPacemaker} generated pacemaker strip(s) are learner-visible and block public launch.`,
    );
  }

  const canPublish = publishFailures.length === 0;
  return {
    enabled: input.enabled,
    status: input.status,
    publishFailures,
    canPublish,
    canSellPublicly: canPublish,
    publicMessage:
      publishFailures[0] ??
      "Advanced ECG is not available for public checkout right now. Please check back after the launch gates clear.",
  };
}

export async function getAdvancedEcgCommercialLaunchState(): Promise<AdvancedEcgCommercialLaunchState> {
  const [status, readiness] = await Promise.all([getAdvancedEcgModuleStatus(), getEcgModuleReadiness()]);
  return buildAdvancedEcgCommercialLaunchState({
    enabled: isAdvancedEcgModuleEnabled(),
    status,
    counts: readiness.counts,
  });
}
