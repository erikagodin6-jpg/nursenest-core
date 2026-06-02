/**
 * Verifies data/premium-lessons-nclex-core-v1/manifest.json slugs resolve after
 * prependScopedGoldCatalogLessons for key pathways.
 *
 * Run: npx tsx scripts/verify-premium-nclex-manifest.mjs
 */
import catalog from "../src/content/pathway-lessons/catalog.json" with { type: "json" };
import { prependScopedGoldCatalogLessons } from "../src/lib/lessons/scoped-lessons/scoped-gold-registry.ts";

const PATHWAYS = ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-lpn-nclex-pn", "ca-rpn-rex-pn"];

const manifest = JSON.parse(
  await (await import("node:fs/promises")).readFile(
    new URL("../data/premium-lessons-nclex-core-v1/manifest.json", import.meta.url),
    "utf8",
  ),
);

function slugForEntry(entry, pathwayId) {
  if (entry.slug) return entry.slug;
  const m = entry.slugByPathway;
  if (m && m[pathwayId]) return m[pathwayId];
  return null;
}

let errors = 0;
for (const pathwayId of PATHWAYS) {
  const fromJson = catalog.pathways[pathwayId]?.lessons ?? [];
  const merged = prependScopedGoldCatalogLessons(pathwayId, fromJson);
  const slugs = new Set(merged.map((l) => l.slug));

  for (const entry of manifest.lessons) {
    const slug = slugForEntry(entry, pathwayId);
    if (!slug) {
      console.error(`No slug mapping for order ${entry.order} on ${pathwayId}`);
      errors += 1;
      continue;
    }
    if (!slugs.has(slug)) {
      console.error(`Missing slug "${slug}" on pathway ${pathwayId} (order ${entry.order}: ${entry.title})`);
      errors += 1;
    }
  }
}

if (errors > 0) {
  console.error(`\nverify-premium-nclex-manifest: ${errors} error(s)`);
  process.exit(1);
}
console.log("verify-premium-nclex-manifest: OK (all mapped slugs present for tested pathways)");
