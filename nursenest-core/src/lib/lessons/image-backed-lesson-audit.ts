/**
 * Audit Spaces-backed clinical lesson images against merged pathway lesson catalogs.
 * Used by `scripts/audit-image-backed-missing-lessons.ts` — keep logic deterministic and conservative.
 */

import { LESSON_IMAGE_MAP, type LessonImageMapEntry } from "@/lib/lessons/lesson-image-map";

export type ImageBackedAuditStatus = "matched" | "missing" | "skip";

export type ImageBackedCatalogHit = {
  pathwayId: string;
  slug: string;
  title: string;
};

export type ImageBackedAuditRow = {
  objectKey: string;
  inferredTopic: string;
  matches: ImageBackedCatalogHit[];
  suggestedPathways: readonly string[];
  status: ImageBackedAuditStatus;
};

const DEFAULT_SUGGESTED_RN_PATHWAYS = ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const;

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function humanizeBasename(basename: string): string {
  const base = basename.replace(/\.(png|webp|jpe?g)$/i, "").replace(/-/g, " ");
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** True when a catalog row plausibly belongs to this image map entry (conservative). */
export function catalogRowMatchesImageMapEntry(
  lesson: { slug: string; title?: string },
  entry: LessonImageMapEntry,
): boolean {
  const slug = norm(lesson.slug);
  const title = norm(typeof lesson.title === "string" ? lesson.title : "");

  for (const s of entry.slugs ?? []) {
    if (slug === norm(s)) return true;
  }

  for (const kw of entry.keywords ?? []) {
    const k = norm(kw);
    if (!k) continue;
    if (title.includes(k)) return true;
    if (k.length >= 6 && slug.includes(k.replace(/\s+/g, "-"))) return true;
  }

  return false;
}

export function suggestedPathwaysForImageEntry(entry: LessonImageMapEntry): readonly string[] {
  const cat = norm(entry.category ?? "");
  if (cat.includes("vascular") || cat.includes("cardio") || cat.includes("perioperative") || cat.includes("surgical")) {
    return DEFAULT_SUGGESTED_RN_PATHWAYS;
  }
  if (cat.includes("respiratory") || cat.includes("maternity") || cat.includes("musculoskeletal")) {
    return DEFAULT_SUGGESTED_RN_PATHWAYS;
  }
  return DEFAULT_SUGGESTED_RN_PATHWAYS;
}

export function auditLessonImageMapEntryAgainstLessons(
  entry: LessonImageMapEntry,
  options: {
    inventoryKeySet: ReadonlySet<string>;
    lessonsByPathway: ReadonlyMap<string, ReadonlyArray<{ slug: string; title?: string }>>;
  },
): ImageBackedAuditRow {
  const key = entry.objectKey.replace(/^\/+/, "");
  const inferredTopic = entry.caption?.trim() || humanizeBasename(key);
  const suggestedPathways = suggestedPathwaysForImageEntry(entry);

  if (!options.inventoryKeySet.has(key)) {
    return {
      objectKey: key,
      inferredTopic,
      matches: [],
      suggestedPathways,
      status: "skip",
    };
  }

  const matches: ImageBackedCatalogHit[] = [];
  for (const [pathwayId, lessons] of options.lessonsByPathway) {
    for (const row of lessons) {
      if (catalogRowMatchesImageMapEntry(row, entry)) {
        matches.push({
          pathwayId,
          slug: row.slug.trim(),
          title: typeof row.title === "string" ? row.title.trim() : row.slug.trim(),
        });
      }
    }
  }

  const unique = new Map<string, ImageBackedCatalogHit>();
  for (const m of matches) {
    unique.set(`${m.pathwayId}::${m.slug}`, m);
  }
  const deduped = [...unique.values()];

  if (deduped.length > 0) {
    return { objectKey: key, inferredTopic, matches: deduped, suggestedPathways, status: "matched" };
  }

  const hasSignal = (entry.slugs?.length ?? 0) > 0 || (entry.keywords?.length ?? 0) > 0;
  if (!hasSignal) {
    return { objectKey: key, inferredTopic, matches: [], suggestedPathways, status: "skip" };
  }

  return { objectKey: key, inferredTopic, matches: [], suggestedPathways, status: "missing" };
}

export function auditAllMappedLessonImages(options: {
  inventoryKeys: readonly string[];
  lessonsByPathway: ReadonlyMap<string, ReadonlyArray<{ slug: string; title?: string }>>;
}): ImageBackedAuditRow[] {
  const inventoryKeySet = new Set(options.inventoryKeys.map((k) => k.replace(/^\/+/, "")));
  return LESSON_IMAGE_MAP.map((entry) => auditLessonImageMapEntryAgainstLessons(entry, { inventoryKeySet, lessonsByPathway: options.lessonsByPathway }));
}
