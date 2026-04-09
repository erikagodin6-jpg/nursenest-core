/**
 * Ratchet: `catalog.json` must not accumulate **new** cross-pathway duplicate rows (same slug in multiple
 * pathway buckets). Aligns with shared-core + scoped-variant authoring (`scoped-gold-registry.ts`).
 *
 * Run: `npx tsx --test src/lib/lessons/pathway-lesson-catalog-redundancy.test.ts`
 *
 * When consolidating duplicates into a registry provider or a single bucket, **lower** the ceiling so the
 * ratchet tightens. Raising the ceiling needs an explicit review (should be rare).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import catalog from "../../content/pathway-lessons/catalog.json";

type CatalogFile = {
  pathways: Record<string, { lessons?: Array<{ slug?: string }> }>;
};

const data = catalog as CatalogFile;

/** Rows beyond the first pathway per slug (sum of extra pathway listings) — copy-paste duplication proxy. */
function crossPathwayCatalogRedundancy(): { redundantRows: number; totalRows: number; uniqueSlugs: number } {
  const slugPaths = new Map<string, Set<string>>();
  let totalRows = 0;
  for (const [pathwayId, bucket] of Object.entries(data.pathways)) {
    for (const row of bucket.lessons ?? []) {
      const slug = typeof row.slug === "string" ? row.slug.trim() : "";
      if (!slug) continue;
      totalRows += 1;
      if (!slugPaths.has(slug)) slugPaths.set(slug, new Set());
      slugPaths.get(slug)!.add(pathwayId);
    }
  }
  let redundant = 0;
  for (const paths of slugPaths.values()) {
    if (paths.size <= 1) continue;
    redundant += paths.size - 1;
  }
  return { redundantRows: redundant, totalRows, uniqueSlugs: slugPaths.size };
}

/** Baseline 2026-04: legacy US/CA RN overlap; do not grow without consolidating or explicit review. */
const MAX_CROSS_PATHWAY_BUCKET_REDUNDANCY = 129;

describe("pathway lesson catalog redundancy (shared-core discipline)", () => {
  it("does not increase cross-pathway catalog duplication (same slug in multiple pathway buckets)", () => {
    const { redundantRows, totalRows, uniqueSlugs } = crossPathwayCatalogRedundancy();
    assert.ok(
      redundantRows <= MAX_CROSS_PATHWAY_BUCKET_REDUNDANCY,
      `catalog.json has ${redundantRows} redundant cross-pathway rows (totalRows=${totalRows}, uniqueSlugs=${uniqueSlugs}). ` +
        `Prefer scoped-gold providers or a single bucket row per slug — do not copy-paste lessons across pathways to pad counts. ` +
        `If you consolidated duplicates, lower MAX_CROSS_PATHWAY_BUCKET_REDUNDANCY.`,
    );
  });
});
