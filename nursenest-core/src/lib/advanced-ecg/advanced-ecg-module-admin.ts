import "server-only";

import { getEcgModuleReadiness } from "@/lib/ecg-module/ecg-module-readiness";
import { ADVANCED_ECG_CURRICULUM } from "@/lib/advanced-ecg/advanced-ecg-curriculum";
import { getAdvancedEcgModuleStatus, type AdvancedEcgModuleStatus } from "@/lib/advanced-ecg/advanced-ecg-module-status";
import { ADVANCED_ECG_MODULE_ENTITLEMENT, isAdvancedEcgModuleEnabled } from "@/lib/advanced-ecg/advanced-ecg-module-config";

export type AdvancedEcgModuleAdminSnapshot = {
  enabled: boolean;
  status: AdvancedEcgModuleStatus;
  entitlementRequired: true;
  curriculumUnits: number;
  reviewCounts: {
    advancedInventory: number;
    readyAdvanced: number;
    clinicianReviewed: number;
    manualReviewMissing: number;
    publishSafe: number;
  };
  publishFailures: string[];
  canPublish: boolean;
};

export async function getAdvancedEcgModuleAdminSnapshot(): Promise<AdvancedEcgModuleAdminSnapshot> {
  const [status, readiness] = await Promise.all([getAdvancedEcgModuleStatus(), getEcgModuleReadiness()]);
  const enabled = isAdvancedEcgModuleEnabled();

  const publishFailures: string[] = [];
  if (!enabled) publishFailures.push("Advanced ECG module is disabled by feature flag.");
  if (readiness.counts.readyAdvanced <= 0) publishFailures.push("No publish-safe advanced ECG content is available yet.");
  if (readiness.counts.manualReviewMissing > 0) {
    publishFailures.push(`${readiness.counts.manualReviewMissing} high-risk ECG strip(s) still need clinician review.`);
  }
  if (readiness.counts.publishSafe < readiness.counts.readyAdvanced) {
    publishFailures.push("Not every learner-visible advanced ECG item is marked publish-safe.");
  }

  return {
    enabled,
    status,
    entitlementRequired: true,
    curriculumUnits: ADVANCED_ECG_CURRICULUM.length,
    reviewCounts: {
      advancedInventory: readiness.counts.advanced,
      readyAdvanced: readiness.counts.readyAdvanced,
      clinicianReviewed: readiness.counts.clinicianReviewed,
      manualReviewMissing: readiness.counts.manualReviewMissing,
      publishSafe: readiness.counts.publishSafe,
    },
    publishFailures,
    canPublish: publishFailures.length === 0,
  };
}

export const ADVANCED_ECG_ADMIN_ENTITLEMENT_LABEL = ADVANCED_ECG_MODULE_ENTITLEMENT;
