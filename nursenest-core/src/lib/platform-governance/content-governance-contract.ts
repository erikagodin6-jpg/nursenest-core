import { listPlatformFeatures } from "./feature-registry";

export const CONTENT_GOVERNANCE_CONTRACT_VERSION = "1.0.0" as const;

export type ContentLifecycleState = "draft" | "reviewed" | "published" | "archived";

export const CONTENT_LIFECYCLE_STATES = [
  "draft",
  "reviewed",
  "published",
  "archived",
] as const satisfies readonly ContentLifecycleState[];

export type ContentGovernanceViolation = {
  featureId: string;
  rule: "missing_lifecycle" | "missing_source";
  detail: string;
};

export function validateContentGovernanceContract(): ContentGovernanceViolation[] {
  const violations: ContentGovernanceViolation[] = [];

  for (const feature of listPlatformFeatures()) {
    if (feature.contentLifecycle === "not-applicable") continue;
    if (feature.contentLifecycle === "not-applicable" && feature.productionReadiness === "ready") {
      violations.push({
        featureId: feature.id,
        rule: "missing_lifecycle",
        detail: `${feature.label} is marked ready but does not declare an applicable content lifecycle policy.`,
      });
    }
    if (feature.canonicalSourceFiles.length === 0) {
      violations.push({
        featureId: feature.id,
        rule: "missing_source",
        detail: `${feature.label} must declare canonical source files for governance review.`,
      });
    }
  }

  return violations;
}
