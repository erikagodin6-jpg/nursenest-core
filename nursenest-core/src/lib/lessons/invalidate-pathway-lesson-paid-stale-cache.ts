import "server-only";

import { getPaidContentStaleCache } from "@/lib/durability/paid-content-stale-cache";

/**
 * `/app/lessons/[id]` uses {@link getPublishedPathwayLessonRecordById} which caches last-known-good payloads
 * in {@link getPaidContentStaleCache} under `lesson:<id>:<locale>`. Clear those entries after admin writes so
 * the next render cannot briefly reuse pre-publish snapshots.
 */
export function invalidatePathwayLessonPaidStaleCache(pathwayLessonId: string): void {
  const id = pathwayLessonId.trim();
  if (!id) return;
  getPaidContentStaleCache().invalidateKeyPrefix(`lesson:${id}:`);
}
