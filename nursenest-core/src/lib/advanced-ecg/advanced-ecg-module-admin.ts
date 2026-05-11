import "server-only";

import { getEcgModuleReadiness } from "@/lib/ecg-module/ecg-module-readiness";
import { buildRepoEcgDepthAuditSnapshot } from "@/lib/ecg-module/ecg-depth-audit-repo";
import { ADVANCED_ECG_CURRICULUM, ADVANCED_ECG_PACEMAKER_CURRICULUM } from "@/lib/advanced-ecg/advanced-ecg-curriculum";
import {
  getAdvancedEcgCommercialLaunchState,
  type AdvancedEcgModuleStatus,
} from "@/lib/advanced-ecg/advanced-ecg-module-status";
import { ADVANCED_ECG_MODULE_ENTITLEMENT } from "@/lib/advanced-ecg/advanced-ecg-module-config";

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
  pacemakerGovernance: {
    curriculumUnits: number;
    pacemakerInventory: number;
    generatedPacemakerInventory: number;
    leakedGeneratedPacemaker: number;
    requiresStaticCuration: true;
  };
  publishFailures: string[];
  canPublish: boolean;
  coverage: {
    coveredKeys: string[];
    missingKeys: string[];
    affectedRoutes: string[];
    adminPreviewRoutes: string[];
    matrix: Array<{
      key: string;
      lessonWordCount: number;
      totalQuestions: number;
      stripIdentification: number;
      priorityAction: number;
      complicationEscalation: number;
      comparison: number;
      clinicalCauses: number;
      fullRationales: number;
      distractorRationales: number;
    }>;
    advancedTopicsMissingMinimums: string[];
  };
};

export function buildAdvancedEcgCoverageAdminSnapshot() {
  const repoAudit = buildRepoEcgDepthAuditSnapshot();

  return {
    coveredKeys: repoAudit.audit.coveredKeys,
    missingKeys: repoAudit.audit.missingKeys,
    affectedRoutes: repoAudit.affectedRoutes,
    adminPreviewRoutes: repoAudit.adminPreviewRoutes,
    matrix: repoAudit.audit.coveredKeys.map((key) => {
      const counts = repoAudit.audit.questionCountsByKey[key];
      const rationale = repoAudit.audit.rationaleCompleteness[key];
      return {
        key,
        lessonWordCount: repoAudit.audit.lessonWordCounts[key] ?? 0,
        totalQuestions: counts?.total ?? 0,
        stripIdentification: counts?.families.strip_identification ?? 0,
        priorityAction: counts?.families.priority_action ?? 0,
        complicationEscalation: counts?.families.complication_escalation ?? 0,
        comparison: counts?.families.comparison ?? 0,
        clinicalCauses: counts?.families.clinical_causes ?? 0,
        fullRationales: rationale?.fullRationaleCount ?? 0,
        distractorRationales: rationale?.distractorRationaleCount ?? 0,
      };
    }),
    advancedTopicsMissingMinimums: repoAudit.advancedCoverage.topics
      .filter((topic) => !topic.questionVolume.minimumsMet)
      .map((topic) => topic.key),
  };
}

export async function getAdvancedEcgModuleAdminSnapshot(): Promise<AdvancedEcgModuleAdminSnapshot> {
  const [launchState, readiness] = await Promise.all([
    getAdvancedEcgCommercialLaunchState(),
    getEcgModuleReadiness(),
  ]);
  const coverage = buildAdvancedEcgCoverageAdminSnapshot();

  return {
    enabled: launchState.enabled,
    status: launchState.status,
    entitlementRequired: true,
    curriculumUnits: ADVANCED_ECG_CURRICULUM.length,
    reviewCounts: {
      advancedInventory: readiness.counts.advanced,
      readyAdvanced: readiness.counts.readyAdvanced,
      clinicianReviewed: readiness.counts.clinicianReviewed,
      manualReviewMissing: readiness.counts.manualReviewMissing,
      publishSafe: readiness.counts.publishSafe,
    },
    pacemakerGovernance: {
      curriculumUnits: ADVANCED_ECG_PACEMAKER_CURRICULUM.length,
      pacemakerInventory: readiness.counts.pacemaker,
      generatedPacemakerInventory: readiness.counts.generatedPacemaker,
      leakedGeneratedPacemaker: readiness.counts.leakedGeneratedPacemaker,
      requiresStaticCuration: true,
    },
    publishFailures: launchState.publishFailures,
    canPublish: launchState.canPublish,
    coverage,
  };
}

export const ADVANCED_ECG_ADMIN_ENTITLEMENT_LABEL = ADVANCED_ECG_MODULE_ENTITLEMENT;
