import type { PaidFailureCategory } from "./paid-failure-classifier";

/** One row for `paid-user-suite-summary.json` (aggregated reporter output). */
export type PaidSuiteSummaryEntry = {
  specFile: string;
  testTitle: string;
  category: PaidFailureCategory;
  route?: string;
  endpoint?: string;
  reason: string;
};

export type PaidSuiteSummaryArtifact = {
  generatedAt: string;
  failedRoutes: PaidSuiteSummaryEntry[];
  onboardingRedirects: PaidSuiteSummaryEntry[];
  authFailures: PaidSuiteSummaryEntry[];
  entitlementFailures: PaidSuiteSummaryEntry[];
  slowEndpoints: PaidSuiteSummaryEntry[];
  networkFailures: PaidSuiteSummaryEntry[];
  missingTranslations: PaidSuiteSummaryEntry[];
  consoleRuntimeErrors: PaidSuiteSummaryEntry[];
  selectorOrRouteDrift: PaidSuiteSummaryEntry[];
  nonBlockingAuthNoise: PaidSuiteSummaryEntry[];
  contentDiscovery: PaidSuiteSummaryEntry[];
  unknown: PaidSuiteSummaryEntry[];
};

const BUCKET_KEYS: (keyof Omit<PaidSuiteSummaryArtifact, "generatedAt">)[] = [
  "failedRoutes",
  "onboardingRedirects",
  "authFailures",
  "entitlementFailures",
  "slowEndpoints",
  "networkFailures",
  "missingTranslations",
  "consoleRuntimeErrors",
  "selectorOrRouteDrift",
  "nonBlockingAuthNoise",
  "contentDiscovery",
  "unknown",
];

function bucketForCategory(c: PaidFailureCategory): keyof Omit<PaidSuiteSummaryArtifact, "generatedAt"> {
  const map: Record<PaidFailureCategory, keyof Omit<PaidSuiteSummaryArtifact, "generatedAt">> = {
    authFailure: "authFailures",
    onboardingRedirects: "onboardingRedirects",
    entitlementFailures: "entitlementFailures",
    networkFailures: "networkFailures",
    slowEndpoints: "slowEndpoints",
    missingTranslations: "missingTranslations",
    consoleRuntimeErrors: "consoleRuntimeErrors",
    selectorOrRouteDrift: "selectorOrRouteDrift",
    nonBlockingAuthNoise: "nonBlockingAuthNoise",
    failedRoutes: "failedRoutes",
    contentDiscovery: "contentDiscovery",
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
  entry: Omit<PaidSuiteSummaryEntry, never>,
): void {
  const bucket = bucketForCategory(entry.category);
  summary[bucket].push(entry);
}
