import "server-only";

import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";

export type PathwayTopicCoverage = {
  pathwayId: string;
  /** Distinct topicSlugs with at least one completed lesson by this user. */
  topicsCovered: number;
  /** Distinct published topicSlugs that have at least one lesson in this pathway (content total). */
  topicsTotal: number;
  topicsUncovered: number;
  coveragePct: number;
};

const SAFE_PATHWAY_ID = /^[a-z0-9-]+$/;
/** Guard against scanning a huge Progress table if someone completes many lessons. */
const MAX_SLUGS_PER_PATHWAY = 256;

function emptyMap(pathwayIds: string[]): Map<string, PathwayTopicCoverage> {
  const m = new Map<string, PathwayTopicCoverage>();
  for (const id of pathwayIds) {
    m.set(id, { pathwayId: id, topicsCovered: 0, topicsTotal: 0, topicsUncovered: 0, coveragePct: 0 });
  }
  return m;
}

/**
 * Batch-computes lesson-based topic coverage for one or more pathways.
 *
 * Three DB round-trips total, regardless of how many pathways are passed:
 *   1. All completed pathway progress rows for this user (prefix scan).
 *   2. Total distinct topicSlugs per pathway (single groupBy).
 *   3. Distinct topicSlugs for the completed slugs (single OR query).
 *
 * Falls back to zeros on DB error — never throws.
 */
export async function loadPathwayTopicCoverageBatch(
  userId: string,
  pathwayIds: string[],
): Promise<Map<string, PathwayTopicCoverage>> {
  if (!userId || pathwayIds.length === 0) return emptyMap(pathwayIds);

  const safeIds = pathwayIds.filter((id) => SAFE_PATHWAY_ID.test(id));
  if (safeIds.length === 0) return emptyMap(pathwayIds);

  return withDatabaseFallback(async () => {
    // --- Query 1: completed pathway lesson progress rows for this user ---
    const completedRows = await prisma.progress.findMany({
      where: { userId, completed: true, lessonId: { startsWith: "pathway:" } },
      select: { lessonId: true },
    });

    // Parse "pathway:{pathwayId}:{slug}" synthetic IDs.
    const byPathway = new Map<string, string[]>();
    for (const r of completedRows) {
      const rest = r.lessonId.slice("pathway:".length);
      const colonIdx = rest.indexOf(":");
      if (colonIdx < 0) continue;
      const pid = rest.slice(0, colonIdx);
      const slug = rest.slice(colonIdx + 1);
      if (!slug || !safeIds.includes(pid)) continue;
      if (!byPathway.has(pid)) byPathway.set(pid, []);
      const slugs = byPathway.get(pid)!;
      if (slugs.length < MAX_SLUGS_PER_PATHWAY) slugs.push(slug);
    }

    // --- Query 2: total distinct topicSlugs per pathway ---
    const totalGroups = await prisma.pathwayLesson.groupBy({
      by: ["pathwayId", "topicSlug"],
      where: { pathwayId: { in: safeIds }, status: ContentStatus.PUBLISHED },
    });

    const totalByPathway = new Map<string, Set<string>>();
    for (const g of totalGroups) {
      if (!totalByPathway.has(g.pathwayId)) totalByPathway.set(g.pathwayId, new Set());
      totalByPathway.get(g.pathwayId)!.add(g.topicSlug);
    }

    // --- Query 3: topicSlugs for completed lesson slugs (OR per pathway) ---
    const orClauses = [...byPathway.entries()]
      .filter(([, slugs]) => slugs.length > 0)
      .map(([pid, slugs]) => ({
        pathwayId: pid,
        slug: { in: slugs },
        status: ContentStatus.PUBLISHED,
      }));

    const coveredRows =
      orClauses.length > 0
        ? await prisma.pathwayLesson.findMany({
            where: { OR: orClauses },
            select: { pathwayId: true, topicSlug: true },
          })
        : [];

    const coveredByPathway = new Map<string, Set<string>>();
    for (const r of coveredRows) {
      if (!coveredByPathway.has(r.pathwayId)) coveredByPathway.set(r.pathwayId, new Set());
      coveredByPathway.get(r.pathwayId)!.add(r.topicSlug);
    }

    const result = new Map<string, PathwayTopicCoverage>();
    for (const id of pathwayIds) {
      const total = totalByPathway.get(id)?.size ?? 0;
      const covered = coveredByPathway.get(id)?.size ?? 0;
      const uncovered = Math.max(0, total - covered);
      const pct = total > 0 ? Math.min(100, Math.round((covered / total) * 100)) : 0;
      result.set(id, { pathwayId: id, topicsCovered: covered, topicsTotal: total, topicsUncovered: uncovered, coveragePct: pct });
    }
    return result;
  }, emptyMap(pathwayIds));
}

/** Convenience single-pathway wrapper. */
export async function loadPathwayTopicCoverage(
  userId: string,
  pathwayId: string,
): Promise<PathwayTopicCoverage> {
  const map = await loadPathwayTopicCoverageBatch(userId, [pathwayId]);
  return map.get(pathwayId) ?? { pathwayId, topicsCovered: 0, topicsTotal: 0, topicsUncovered: 0, coveragePct: 0 };
}
