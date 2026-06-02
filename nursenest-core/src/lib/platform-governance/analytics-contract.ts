import { PH } from "@/lib/observability/posthog-conversion-events";
import { listPlatformFeatures } from "./feature-registry";

export const ANALYTICS_CONTRACT_VERSION = "1.0.0" as const;
export const ANALYTICS_EVENT_NAME_PATTERN = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
export const ALLOWED_VENDOR_EVENT_NAMES = new Set(["$experiment_started"]);

export type AnalyticsContractViolation = {
  eventName: string;
  rule: "invalid_name" | "missing_feature_event";
  detail: string;
};

export function canonicalAnalyticsEvents(): string[] {
  return [...new Set([...Object.values(PH), ...listPlatformFeatures().flatMap((feature) => feature.analyticsEvents)])].sort();
}

export function validateAnalyticsEventName(eventName: string): boolean {
  return ANALYTICS_EVENT_NAME_PATTERN.test(eventName) || ALLOWED_VENDOR_EVENT_NAMES.has(eventName);
}

export function validateAnalyticsContract(events = canonicalAnalyticsEvents()): AnalyticsContractViolation[] {
  const violations: AnalyticsContractViolation[] = [];
  const eventSet = new Set(events);

  for (const eventName of events) {
    if (!validateAnalyticsEventName(eventName)) {
      violations.push({
        eventName,
        rule: "invalid_name",
        detail: "Analytics events must use stable snake_case names unless explicitly allowlisted as vendor events.",
      });
    }
  }

  for (const feature of listPlatformFeatures()) {
    if (feature.analyticsCoverage === "none") continue;
    for (const eventName of feature.analyticsEvents) {
      if (!eventSet.has(eventName)) {
        violations.push({
          eventName,
          rule: "missing_feature_event",
          detail: `${feature.id} declares ${eventName}, but it is not in the canonical analytics event set.`,
        });
      }
    }
  }

  return violations;
}
