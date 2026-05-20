/**
 * Applies RN batch 1 merged patches (batch-2 shared content + RN batch-1 extras) to catalog.json.
 * Run from nursenest-core/: npx tsx scripts/audit/apply-rn-lesson-batch1-catalog-patches.mts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { RN_BATCH1_MERGED_CATALOG_PATCHES } from "./rn-batch1-catalog-patches";

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
      const patch = RN_BATCH1_MERGED_CATALOG_PATCHES[lesson.slug];
      if (!patch) continue;
      lesson.sections = patch.sections;
      touched += 1;
    }
  }
  writeFileSync(CATALOG, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  const extra = Object.keys(RN_BATCH1_MERGED_CATALOG_PATCHES).length;
  console.log(`Updated ${touched} catalog lesson rows (${extra} unique slugs in RN batch 1 merge).`);
}

main();
