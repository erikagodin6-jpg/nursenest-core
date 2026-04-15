import type { PaidFailureCategory } from "./paid-failure-classifier";

/** One row for `paid-user-suite-summary.json`. */
export type PaidSuiteSummaryEntry = {
  specFile: string;
  testTitle: string;
  category: PaidFailureCategory;
  /** Primary cause (short headline). */
  reason: string;
  route?: string;
  endpoint?: string;
};

export type PaidSuiteSummaryArtifact = {
  generatedAt: string;
  authFailures: PaidSuiteSummaryEntry[];
  onboardingBlockingFlows: PaidSuiteSummaryEntry[];
  entitlementFailures: PaidSuiteSummaryEntry[];
  contentDiscoveryFailures: PaidSuiteSummaryEntry[];
  slowEndpointFailures: PaidSuiteSummaryEntry[];
  networkFailures: PaidSuiteSummaryEntry[];
  i18nCoreFailures: PaidSuiteSummaryEntry[];
  selectorOrRouteDrift: PaidSuiteSummaryEntry[];
  shellFailures: PaidSuiteSummaryEntry[];
  authNoise: PaidSuiteSummaryEntry[];
  unknown: PaidSuiteSummaryEntry[];
};

const BUCKET_KEYS: (keyof Omit<PaidSuiteSummaryArtifact, "generatedAt">)[] = [
  "authFailures",
  "onboardingBlockingFlows",
  "entitlementFailures",
  "contentDiscoveryFailures",
  "slowEndpointFailures",
  "networkFailures",
  "i18nCoreFailures",
  "selectorOrRouteDrift",
  "shellFailures",
  "authNoise",
  "unknown",
];

function bucketForCategory(c: PaidFailureCategory): keyof Omit<PaidSuiteSummaryArtifact, "generatedAt"> {
  const map: Record<PaidFailureCategory, keyof Omit<PaidSuiteSummaryArtifact, "generatedAt">> = {
    authFailure: "authFailures",
    onboardingBlockingFlow: "onboardingBlockingFlows",
    entitlementFailure: "entitlementFailures",
    contentDiscoveryFailure: "contentDiscoveryFailures",
    slowEndpointFailure: "slowEndpointFailures",
    networkFailure: "networkFailures",
    i18nCoreFailure: "i18nCoreFailures",
    selectorOrRouteDrift: "selectorOrRouteDrift",
    shellFailure: "shellFailures",
    authNoise: "authNoise",
    unknown: "unknown",
  };
  return map[c] ?? "unknown";
}

export function emptyPaidSuiteSummary(): PaidSuiteSummaryArtifact {
  const base: Record<string, PaidSuiteSummaryEntry[]> = {};
  for (const k of BUCKET_KEYS) {
    base[k] = [];
  }
  return {
    generatedAt: new Date().toISOString(),
    ...(base as Omit<PaidSuiteSummaryArtifact, "generatedAt">),
  };
}

export function pushClassifiedEntry(
  summary: PaidSuiteSummaryArtifact,
  entry: PaidSuiteSummaryEntry,
): void {
  const bucket = bucketForCategory(entry.category);
  summary[bucket].push(entry);
}
