/**
 * Optional precomputed pathway lesson indexes (JSON on disk) for marketing cold paths.
 * Never required at runtime — `pathway-lesson-catalog-sync` always falls back to live merge + normalize.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LESSON_CATEGORIES, type LessonCategory } from "@/lib/lessons/lesson-taxonomy";

const SCHEMA_V1 = 1 as const;

/** Same shape as `PathwayLessonSummaryIndexRow` in catalog-sync (kept here to avoid circular imports). */
export type PathwayLessonSummaryIndexJsonRow = {
  id: string;
  slug: string;
  title: string;
  category: LessonCategory;
  shortDescription: string;
};

export type PathwayLessonGeneratedIndexFileV1 = {
  schemaVersion: typeof SCHEMA_V1;
  pathwayId: string;
  generatedAt: string;
  /** Rows from merged catalog (pre marketing filter) — drift-checked vs live raw merge length. */
  mergedRawLessonCount: number;
  /** Rows after marketing hub filter — matches live `getLessonSummariesIndex` length when in sync. */
  effectiveLessonCount: number;
  summaries: PathwayLessonSummaryIndexJsonRow[];
  slugToDisplayTitle: Record<string, string>;
  /** Lowercased slugs in hub-effective set (same semantics as live `getMarketingHubEffectiveCatalogSlugSet`). */
  marketingEffectiveSlugsLowercase: string[];
  /** Counts keyed by `LessonCategory` display name. */
  categoryCounts: Record<string, number>;
};

const diskIndexCache = new Map<string, PathwayLessonGeneratedIndexFileV1 | null | undefined>();

/** Test / reset: clear parsed disk cache so new JSON is picked up. */
export function clearGeneratedPathwayLessonIndexCacheForTests(): void {
  diskIndexCache.clear();
}

function nursenestCoreRootDir(): string {
  // This file lives at `src/lib/lessons/…` — three levels up is the package root (`nursenest-core/`).
  return path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
}

function defaultGeneratedIndexDir(): string {
  const override = process.env.NN_PATHWAY_LESSON_INDEX_DIR?.trim();
  if (override) return path.resolve(override);
  return path.join(nursenestCoreRootDir(), "src", "content", "pathway-lessons", "generated-indexes");
}

function safePathwayIdForFilename(pathwayId: string): string | null {
  const s = pathwayId.trim();
  if (!/^[a-z0-9-]+$/i.test(s)) return null;
  return s;
}

function isLessonCategoryKey(k: string): k is LessonCategory {
  return (LESSON_CATEGORIES as readonly string[]).includes(k);
}

/**
 * Parse and validate a generated index object. Returns null if invalid (caller uses live catalog).
 */
export function parsePathwayLessonGeneratedIndexV1(
  raw: unknown,
  expectedPathwayId: string,
): PathwayLessonGeneratedIndexFileV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.schemaVersion !== SCHEMA_V1) return null;
  if (typeof o.pathwayId !== "string" || o.pathwayId.trim() !== expectedPathwayId.trim()) return null;
  if (typeof o.generatedAt !== "string" || !o.generatedAt.trim()) return null;
  if (typeof o.mergedRawLessonCount !== "number" || !Number.isFinite(o.mergedRawLessonCount) || o.mergedRawLessonCount < 0)
    return null;
  if (typeof o.effectiveLessonCount !== "number" || !Number.isFinite(o.effectiveLessonCount) || o.effectiveLessonCount < 0)
    return null;
  if (!Array.isArray(o.summaries)) return null;
  const slugSeen = new Set<string>();
  const summaries: PathwayLessonSummaryIndexJsonRow[] = [];
  for (const row of o.summaries) {
    if (!row || typeof row !== "object") return null;
    const r = row as Record<string, unknown>;
    if (typeof r.slug !== "string" || !r.slug.trim()) return null;
    if (typeof r.title !== "string") return null;
    if (typeof r.category !== "string" || !isLessonCategoryKey(r.category)) return null;
    if (typeof r.shortDescription !== "string") return null;
    const slug = r.slug.trim();
    if (slugSeen.has(slug)) return null;
    slugSeen.add(slug);
    summaries.push({
      id: typeof r.id === "string" && r.id.trim() ? r.id.trim() : slug,
      slug,
      title: String(r.title),
      category: r.category,
      shortDescription: String(r.shortDescription),
    });
  }
  if (summaries.length !== o.effectiveLessonCount) return null;
  if (!o.slugToDisplayTitle || typeof o.slugToDisplayTitle !== "object") return null;
  const slugToDisplayTitle = o.slugToDisplayTitle as Record<string, unknown>;
  for (const s of summaries) {
    const t = slugToDisplayTitle[s.slug];
    if (typeof t !== "string" || t.trim().length === 0) return null;
  }
  if (!Array.isArray(o.marketingEffectiveSlugsLowercase)) return null;
  const effSlugs = o.marketingEffectiveSlugsLowercase.filter((x): x is string => typeof x === "string");
  const effSet = new Set(effSlugs.map((x) => x.trim().toLowerCase()).filter(Boolean));
  if (effSet.size !== effSlugs.length) return null;
  for (const s of summaries) {
    if (!effSet.has(s.slug.toLowerCase())) return null;
  }
  for (const x of effSet) {
    if (!summaries.some((s) => s.slug.toLowerCase() === x)) return null;
  }
  if (!o.categoryCounts || typeof o.categoryCounts !== "object") return null;
  const cc = o.categoryCounts as Record<string, unknown>;
  for (const cat of LESSON_CATEGORIES) {
    const n = cc[cat];
    if (typeof n !== "number" || !Number.isFinite(n) || n < 0) return null;
  }
  let sum = 0;
  for (const cat of LESSON_CATEGORIES) sum += cc[cat] as number;
  if (sum !== summaries.length) return null;

  return {
    schemaVersion: SCHEMA_V1,
    pathwayId: expectedPathwayId.trim(),
    generatedAt: o.generatedAt.trim(),
    mergedRawLessonCount: o.mergedRawLessonCount,
    effectiveLessonCount: o.effectiveLessonCount,
    summaries,
    slugToDisplayTitle: Object.fromEntries(
      summaries.map((s) => [s.slug, String(slugToDisplayTitle[s.slug]).trim()]),
    ) as Record<string, string>,
    marketingEffectiveSlugsLowercase: [...effSet],
    categoryCounts: Object.fromEntries(LESSON_CATEGORIES.map((c) => [c, cc[c] as number])) as Record<
      LessonCategory,
      number
    >,
  };
}

function readGeneratedIndexFromDisk(pathwayId: string): PathwayLessonGeneratedIndexFileV1 | null {
  const safe = safePathwayIdForFilename(pathwayId);
  if (!safe) return null;
  const fp = path.join(defaultGeneratedIndexDir(), `${safe}.json`);
  if (!fs.existsSync(fp)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(fp, "utf8")) as unknown;
  } catch {
    return null;
  }
  return parsePathwayLessonGeneratedIndexV1(parsed, pathwayId);
}

/**
 * Cached load of the optional generated index for a pathway (null = absent or invalid).
 */
export function getOptionalGeneratedPathwayLessonIndex(pathwayId: string): PathwayLessonGeneratedIndexFileV1 | null {
  const key = pathwayId.trim();
  if (diskIndexCache.has(key)) {
    const hit = diskIndexCache.get(key);
    return hit === undefined ? null : hit;
  }
  const v = readGeneratedIndexFromDisk(key);
  diskIndexCache.set(key, v);
  return v;
}

export function tryGetDisplayTitleFromGeneratedIndex(pathwayId: string, slug: string): string | undefined {
  const idx = getOptionalGeneratedPathwayLessonIndex(pathwayId);
  if (!idx) return undefined;
  const t = idx.slugToDisplayTitle[slug.trim()];
  return typeof t === "string" && t.trim() ? t : undefined;
}

export function tryGetMarketingEffectiveSlugSetFromGeneratedIndex(pathwayId: string): Set<string> | null {
  const idx = getOptionalGeneratedPathwayLessonIndex(pathwayId);
  if (!idx) return null;
  return new Set(idx.marketingEffectiveSlugsLowercase.map((s) => s.trim().toLowerCase()).filter(Boolean));
}

export function tryGetLessonSummariesFromGeneratedIndex(pathwayId: string): PathwayLessonSummaryIndexJsonRow[] | null {
  const idx = getOptionalGeneratedPathwayLessonIndex(pathwayId);
  if (!idx) return null;
  return idx.summaries;
}

export function tryGetMarketingCategoryCountsFromGeneratedIndex(pathwayId: string): Map<LessonCategory, number> | null {
  const idx = getOptionalGeneratedPathwayLessonIndex(pathwayId);
  if (!idx) return null;
  const m = new Map<LessonCategory, number>();
  for (const c of LESSON_CATEGORIES) {
    m.set(c, idx.categoryCounts[c] ?? 0);
  }
  return m;
}
