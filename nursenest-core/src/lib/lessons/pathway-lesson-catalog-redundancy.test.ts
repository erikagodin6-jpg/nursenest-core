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
import {
  buildCanonicalLessonHubIndex,
  canonicalLessonHubKey,
  canonicalLessonHubTitle,
} from "./canonical-lesson-title-normalization";

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

/**
 * Baseline 2026-04: legacy US/CA RN overlap; do not grow without consolidating or explicit review.
 * Bumped after RN catalog duplicate-row removal (shallow `*-nclex-rn` merges) — re-measure with:
 * `node -e "const c=require('./src/content/pathway-lessons/catalog.json'); …"` before tightening.
 */
const MAX_CROSS_PATHWAY_BUCKET_REDUNDANCY = 139;

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

  it("canonicalizes verbose lesson hub titles into simple topic names", () => {
    assert.equal(canonicalLessonHubTitle("COPD Management"), "COPD");
    assert.equal(canonicalLessonHubTitle("COPD Nursing Care"), "COPD");
    assert.equal(canonicalLessonHubTitle("Nursing Interventions for COPD"), "COPD");
    assert.equal(canonicalLessonHubTitle("Heart Failure Discharge Teaching"), "Heart Failure");
    assert.equal(canonicalLessonHubTitle("A Fib Review"), "Atrial Fibrillation");
    assert.equal(canonicalLessonHubTitle("SVT Basics"), "Supraventricular Tachycardia (SVT)");
  });

  it("collapses common abbreviations and synonyms into one canonical lesson key", () => {
    assert.equal(canonicalLessonHubKey("Chronic Obstructive Pulmonary Disease"), "copd");
    assert.equal(canonicalLessonHubKey("CHF"), "heart failure");
    assert.equal(canonicalLessonHubKey("A Fib"), "atrial fibrillation");
    assert.equal(canonicalLessonHubKey("Diabetic Ketoacidosis"), "dka");
  });

  it("keeps the richest same-pathway canonical lesson and suppresses same-topic variants", () => {
    const result = buildCanonicalLessonHubIndex([
      {
        slug: "copd-management",
        title: "COPD Management",
        sectionCount: 4,
        bodyLength: 1_000,
      },
      {
        slug: "copd",
        title: "COPD",
        sectionCount: 11,
        bodyLength: 10_000,
      },
      {
        slug: "copd-nursing-care",
        title: "COPD Nursing Care",
        sectionCount: 6,
        bodyLength: 2_000,
      },
    ]);

    assert.deepEqual([...result.visibleSlugs].sort(), ["copd"]);
    assert.equal(result.slugToCanonicalTitle["copd"], "COPD");
    assert.equal(result.slugToCanonicalTitle["copd-management"], "COPD");
    assert.equal(result.duplicateRedirects["copd-management"], "copd");
    assert.equal(result.duplicateRedirects["copd-nursing-care"], "copd");
  });

  it("preserves legitimate clinical split lessons", () => {
    const result = buildCanonicalLessonHubIndex([
      {
        slug: "copd",
        title: "COPD",
        sectionCount: 10,
        bodyLength: 10_000,
      },
      {
        slug: "copd-exacerbation",
        title: "COPD Exacerbation",
        sectionCount: 8,
        bodyLength: 8_000,
      },
      {
        slug: "pediatric-asthma",
        title: "Pediatric Asthma",
        sectionCount: 8,
        bodyLength: 8_000,
      },
      {
        slug: "asthma",
        title: "Asthma",
        sectionCount: 10,
        bodyLength: 10_000,
      },
    ]);

    assert.deepEqual([...result.visibleSlugs].sort(), ["asthma", "copd", "copd-exacerbation", "pediatric-asthma"]);
  });
});
