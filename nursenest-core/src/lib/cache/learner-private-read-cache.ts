import "server-only";

import { revalidateTag, unstable_cache, updateTag } from "next/cache";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { cacheDeploymentRevision } from "@/lib/cache/cache-revision";

export type LearnerPrivateReadCacheSurface =
  | "report-card"
  | "readiness-page"
  | "readiness-dashboard"
  | "progress-page"
  | "profile-activity"
  | "review-queue-initial"
  | "motivation-payload";

const LEARNER_PRIVATE_READ_CACHE_PREFIX = "learner-private-read";
const LEARNER_PRIVATE_TAG_PREFIX = "learner-private";

const ALL_LEARNER_PRIVATE_READ_SURFACES: LearnerPrivateReadCacheSurface[] = [
  "report-card",
  "readiness-page",
  "readiness-dashboard",
  "progress-page",
  "profile-activity",
  "review-queue-initial",
  "motivation-payload",
];

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

function sanitizeUserIdForTag(userId: string): string {
  return userId.trim().replace(/[^a-zA-Z0-9:_-]/g, "_").slice(0, 96) || "unknown";
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
  return `${LEARNER_PRIVATE_TAG_PREFIX}:${sanitizeUserIdForTag(userId)}`;
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
    sanitizeUserIdForTag(userId),
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

async function expireTag(tag: string): Promise<void> {
  try {
    updateTag(tag);
  } catch {
    revalidateTag(tag, "max");
  }
}

export async function invalidateLearnerPrivateReadCache(
  userId: string,
  surfaces: LearnerPrivateReadCacheSurface[] = ALL_LEARNER_PRIVATE_READ_SURFACES,
): Promise<void> {
  if (!userId || shouldBypassLearnerPrivateReadCache()) return;

  const tags = [learnerPrivateReadUserTag(userId), ...surfaces.map((surface) => learnerPrivateReadSurfaceTag(userId, surface))];
  for (const tag of tags) {
    await expireTag(tag);
  }
}

export async function loadWithLearnerPrivateReadCache<T>(
  options: {
    surface: LearnerPrivateReadCacheSurface;
    userId: string;
    ttlSeconds: number;
    keyParts?: unknown[];
    bypass?: boolean;
  },
  loader: () => Promise<T>,
): Promise<T> {
  if (!options.userId || options.bypass || shouldBypassLearnerPrivateReadCache()) {
    return loader();
  }

  return unstable_cache(
    loader,
    buildLearnerPrivateReadCacheKeyParts(options.surface, options.userId, options.keyParts ?? []),
    {
      revalidate: options.ttlSeconds,
      tags: [learnerPrivateReadUserTag(options.userId), learnerPrivateReadSurfaceTag(options.userId, options.surface)],
    },
  )();
}
