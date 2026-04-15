import type { PaidFailureCategory } from "./paid-failure-classifier";

/** One row for `paid-user-suite-summary.json` (Tier 1 durability gate). */
export type PaidTier1SummaryEntry = {
  specFile: string;
  testTitle: string;
  /** First line of the failure — primary deploy-blocker headline. */
  reason: string;
  /** Granular classifier (triage); roll-up bucket is {@link tier1BucketForCategory}. */
  detailCategory: PaidFailureCategory;
  route?: string;
  endpoint?: string;
};

/** Tier 1 rollup: every failure maps to exactly one primary cause bucket. */
export type Tier1PrimaryBucket =
  | "onboardingBlockingFlow"
  | "authFailure"
  | "slowEndpointFailure"
  | "unknownFailure";

export type PaidTier1SuiteSummaryArtifact = {
  generatedAt: string;
  onboardingBlockingFlow: PaidTier1SummaryEntry[];
  authFailure: PaidTier1SummaryEntry[];
  slowEndpointFailure: PaidTier1SummaryEntry[];
  unknownFailure: PaidTier1SummaryEntry[];
};

const TIER1_KEYS: (keyof Omit<PaidTier1SuiteSummaryArtifact, "generatedAt">)[] = [
  "onboardingBlockingFlow",
  "authFailure",
  "slowEndpointFailure",
  "unknownFailure",
];

/**
 * Maps detailed classifier output to Tier 1 CI buckets.
 * Only `onboardingBlockingFlow`, `authFailure`, and `slowEndpointFailure` are blocking tiers;
 * all other categories (shell, network, entitlement, i18n, drift, etc.) roll up to `unknownFailure`
 * while preserving `detailCategory` on the entry.
 */
export function tier1BucketForCategory(c: PaidFailureCategory): Tier1PrimaryBucket {
  if (c === "onboardingBlockingFlow") return "onboardingBlockingFlow";
  if (c === "authFailure") return "authFailure";
  if (c === "slowEndpointFailure") return "slowEndpointFailure";
  return "unknownFailure";
}

export function emptyPaidTier1Summary(): PaidTier1SuiteSummaryArtifact {
  const base: Record<string, PaidTier1SummaryEntry[]> = {};
  for (const k of TIER1_KEYS) {
    base[k] = [];
  }
  return {
    generatedAt: new Date().toISOString(),
    ...(base as Omit<PaidTier1SuiteSummaryArtifact, "generatedAt">),
  };
}

export function pushTier1ClassifiedEntry(summary: PaidTier1SuiteSummaryArtifact, entry: PaidTier1SummaryEntry): void {
  const bucket = tier1BucketForCategory(entry.detailCategory);
  summary[bucket].push(entry);
}
