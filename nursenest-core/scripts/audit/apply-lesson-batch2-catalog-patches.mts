/**
 * Applies editorial patches from batch2-catalog-patches.ts to pathway lessons in catalog.json.
 * Run from nursenest-core/: npx tsx scripts/audit/apply-lesson-batch2-catalog-patches.mts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { BATCH2_CATALOG_PATCHES } from "./batch2-catalog-patches";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG = join(__dirname, "../../src/content/pathway-lessons/catalog.json");

type CatalogJson = {
  version: number;
  pathways: Record<string, { lessons: Array<{ slug: string; sections: unknown }> }>;
};

function main() {
  const raw = readFileSync(CATALOG, "utf8");
  const data = JSON.parse(raw) as CatalogJson;
  let touched = 0;
  for (const pathwayId of Object.keys(data.pathways)) {
    const bucket = data.pathways[pathwayId];
    if (!bucket?.lessons?.length) continue;
    for (const lesson of bucket.lessons) {
      const patch = BATCH2_CATALOG_PATCHES[lesson.slug];
      if (!patch) continue;
      lesson.sections = patch.sections;
      touched += 1;
    }
  }
  writeFileSync(CATALOG, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Updated ${touched} catalog lesson rows (${Object.keys(BATCH2_CATALOG_PATCHES).length} unique slugs).`);
}

main();
