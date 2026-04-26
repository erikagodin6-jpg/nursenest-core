import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import {
  ALL_LEARNER_PRIVATE_READ_SURFACES,
  buildLearnerPrivateReadCacheKeyParts,
  learnerPrivateReadAccessScopeKey,
  learnerPrivateReadSurfaceTag,
  learnerPrivateReadUserTag,
  shouldBypassLearnerPrivateReadCache,
  type LearnerPrivateReadCacheSurface,
} from "@/lib/cache/learner-private-read-cache-keying";

async function expireTag(tag: string): Promise<void> {
  try {
    revalidateTag(tag);
  } catch {
    // ignore
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

export { learnerPrivateReadAccessScopeKey };
