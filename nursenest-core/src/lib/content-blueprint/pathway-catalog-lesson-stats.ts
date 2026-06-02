import fs from "node:fs";
import path from "node:path";

export type CatalogLessonInventory = {
  pathwayId: string;
  catalogLessonCount: number;
  distinctTopicSlugs: number;
  distinctBodySystems: number;
  bodySystemCounts: Record<string, number>;
  topicSlugCounts: Record<string, number>;
};

type CatalogLessonEntry = {
  topicSlug?: string;
  bodySystem?: string;
};

type CatalogFile = {
  pathways?: Record<string, { lessons?: CatalogLessonEntry[] }>;
};

/**
 * Read-only stats from `src/content/pathway-lessons/catalog.json` for a pathway.
 * Returns null if file missing, invalid, or pathway not in catalog.
 */
export function loadPathwayCatalogLessonStats(
  pathwayId: string,
  repoRoot: string = process.cwd(),
): CatalogLessonInventory | null {
  const catalogPath = path.join(repoRoot, "src/content/pathway-lessons/catalog.json");
  if (!fs.existsSync(catalogPath)) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(catalogPath, "utf8")) as unknown;
  } catch {
    return null;
  }
  const data = raw as CatalogFile;
  const lessons = data.pathways?.[pathwayId]?.lessons;
  if (!Array.isArray(lessons) || lessons.length === 0) return null;

  const bodySystemCounts: Record<string, number> = {};
  const topicSlugCounts: Record<string, number> = {};
  for (const L of lessons) {
    const bs = typeof L.bodySystem === "string" && L.bodySystem.trim() ? L.bodySystem.trim() : "unspecified";
    bodySystemCounts[bs] = (bodySystemCounts[bs] ?? 0) + 1;
    const ts =
      typeof L.topicSlug === "string" && L.topicSlug.trim() ? L.topicSlug.trim() : "unspecified_topic";
    topicSlugCounts[ts] = (topicSlugCounts[ts] ?? 0) + 1;
  }

  return {
    pathwayId,
    catalogLessonCount: lessons.length,
    distinctTopicSlugs: Object.keys(topicSlugCounts).length,
    distinctBodySystems: Object.keys(bodySystemCounts).length,
    bodySystemCounts,
    topicSlugCounts,
  };
}
