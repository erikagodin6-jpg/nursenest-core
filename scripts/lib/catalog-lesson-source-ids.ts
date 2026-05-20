import { readFileSync } from "node:fs";
import path from "node:path";

type CatalogShape = {
  pathways: Record<string, { lessons: Array<{ slug: string }> }>;
};

let cached: {
  compoundKeys: Set<string>;
  slugPathwayCount: Map<string, number>;
  /** Slugs that appear in exactly one pathway in catalog → canonical compound key. */
  uniqueSlugToCompound: Map<string, string>;
} | null = null;

export function loadCatalogLessonKeys(cwd: string): {
  compoundKeys: Set<string>;
  slugPathwayCount: Map<string, number>;
  uniqueSlugToCompound: Map<string, string>;
} {
  if (cached) return cached;
  const fp = path.join(cwd, "src/content/pathway-lessons/catalog.json");
  const raw = JSON.parse(readFileSync(fp, "utf8")) as CatalogShape;
  const compoundKeys = new Set<string>();
  const slugPathwayCount = new Map<string, number>();
  for (const [pathwayId, p] of Object.entries(raw.pathways ?? {})) {
    for (const l of p.lessons ?? []) {
      compoundKeys.add(`${pathwayId}:${l.slug}`);
      slugPathwayCount.set(l.slug, (slugPathwayCount.get(l.slug) ?? 0) + 1);
    }
  }
  const uniqueSlugToCompound = new Map<string, string>();
  for (const [pathwayId, p] of Object.entries(raw.pathways ?? {})) {
    for (const l of p.lessons ?? []) {
      if (slugPathwayCount.get(l.slug) === 1) uniqueSlugToCompound.set(l.slug, `${pathwayId}:${l.slug}`);
    }
  }
  cached = { compoundKeys, slugPathwayCount, uniqueSlugToCompound };
  return cached;
}

export function parsePathwayLessonSourceId(sourceId: string): { pathwayId: string; slug: string } | null {
  const i = sourceId.indexOf(":");
  if (i <= 0 || i >= sourceId.length - 1) return null;
  return { pathwayId: sourceId.slice(0, i), slug: sourceId.slice(i + 1) };
}
