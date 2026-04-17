import { createHash } from "node:crypto";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

export type LearnerPrivateReadCacheSurface =
  | "premium-dashboard-snapshot"
  | "report-card"
  | "readiness-page"
  | "readiness-dashboard"
  | "progress-page"
  | "profile-activity"
  | "review-queue-initial"
  | "motivation-payload";

export const LEARNER_PRIVATE_READ_CACHE_PREFIX = "learner-private-read";
export const LEARNER_PRIVATE_TAG_PREFIX = "learner-private";

export const ALL_LEARNER_PRIVATE_READ_SURFACES: LearnerPrivateReadCacheSurface[] = [
  "premium-dashboard-snapshot",
  "report-card",
  "readiness-page",
  "readiness-dashboard",
  "progress-page",
  "profile-activity",
  "review-queue-initial",
  "motivation-payload",
];

function cacheDeploymentRevision(): string {
  const v =
    process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
    process.env.CACHE_REVISION?.trim() ||
    process.env.npm_package_version?.trim() ||
    "dev";
  return v.slice(0, 96);
}

function stableSerialize(value: unknown): string {
  if (value == null) return JSON.stringify(value);
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(",")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`).join(",")}}`;
  }
  return JSON.stringify(String(value));
}

function hashUserIdForCacheSegment(userId: string): string {
  return createHash("sha256").update(userId).digest("hex").slice(0, 32);
}

export function learnerPrivateReadAccessScopeKey(entitlement: AccessScope): string {
  return stableSerialize({
    hasAccess: entitlement.hasAccess,
    reason: entitlement.reason,
    tier: entitlement.tier,
    country: entitlement.country,
    alliedCareer: entitlement.alliedCareer,
  });
}

export function learnerPrivateReadUserTag(userId: string): string {
  return `${LEARNER_PRIVATE_TAG_PREFIX}:${hashUserIdForCacheSegment(userId)}`;
}

export function learnerPrivateReadSurfaceTag(userId: string, surface: LearnerPrivateReadCacheSurface): string {
  return `${learnerPrivateReadUserTag(userId)}:${surface}`;
}

export function buildLearnerPrivateReadCacheKeyParts(
  surface: LearnerPrivateReadCacheSurface,
  userId: string,
  keyParts: unknown[],
): string[] {
  return [
    LEARNER_PRIVATE_READ_CACHE_PREFIX,
    surface,
    hashUserIdForCacheSegment(userId),
    ...keyParts.map((part) => stableSerialize(part)),
    cacheDeploymentRevision(),
  ];
}

export function shouldBypassLearnerPrivateReadCache(): boolean {
  if (process.env.NODE_ENV === "test") return true;
  const flags = [
    process.env.NN_DISABLE_PRIVATE_READ_CACHE,
    process.env.ADMIN_ACCESS_DEBUG,
    process.env.DEBUG_SESSION_ROUTE_ENABLED,
    process.env.SENTRY_DEBUG_ROUTE,
  ];
  return flags.some((value) => {
    const normalized = value?.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes";
  });
}
