/**
 * Catalog shape checks aligned with **shared core + scoped variant** authoring (see `scoped-gold-registry.ts`).
 * Run: `npx tsx --test src/lib/lessons/pathway-lesson-catalog-integrity.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import catalog from "../../content/pathway-lessons/catalog.json";
import { SCOPED_GOLD_PROVIDERS } from "./scoped-lessons/scoped-gold-registry";

type CatalogFile = {
  pathways: Record<string, { lessons?: Array<{ slug?: string }> }>;
};

const data = catalog as CatalogFile;

describe("pathway lesson catalog integrity (shared-core scaling)", () => {
  it("has unique slugs within each pathway bucket (no accidental duplicate rows)", () => {
    for (const [pathwayId, bucket] of Object.entries(data.pathways)) {
      const lessons = bucket.lessons ?? [];
      const seen = new Set<string>();
      const dups: string[] = [];
      for (const row of lessons) {
        const slug = typeof row.slug === "string" ? row.slug.trim() : "";
        if (!slug) continue;
        if (seen.has(slug)) dups.push(slug);
        seen.add(slug);
      }
      assert.deepEqual(
        dups,
        [],
        `pathway ${pathwayId}: duplicate slug(s) in catalog.json — fix or merge into one row / use scoped-gold registry`,
      );
    }
  });

  it("scoped gold registry uses distinct slugs", () => {
    const slugs = SCOPED_GOLD_PROVIDERS.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length, "SCOPED_GOLD_PROVIDERS must not repeat slug");
  });
});
