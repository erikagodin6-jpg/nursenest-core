#!/usr/bin/env npx tsx
/**
 * Merges `data/materialized/np-clinical-layer-2026/catalog-np-overlays.json` into
 * `src/content/pathway-lessons/catalog.json` pathway `us-np-fnp` (idempotent by `fnp-overlay-` slug prefix).
 *
 *   npx tsx scripts/merge-catalog-np-overlays.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const BATCH = path.join(ROOT, "data/materialized/np-clinical-layer-2026/catalog-np-overlays.json");

type Lesson = { slug: string; [k: string]: unknown };

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8")) as {
    version: number;
    pathways: Record<string, { lessons: Lesson[] }>;
  };
  const batch = JSON.parse(fs.readFileSync(BATCH, "utf8")) as { usNpFnp: Lesson[] };

  const pathway = catalog.pathways["us-np-fnp"];
  if (!pathway) {
    console.error("Missing pathway us-np-fnp in catalog.json");
    process.exit(1);
  }

  const keep = pathway.lessons.filter((l) => !String(l.slug).startsWith("fnp-overlay-"));
  catalog.pathways["us-np-fnp"] = { lessons: [...keep, ...batch.usNpFnp] };

  fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ usNpFnpTotal: catalog.pathways["us-np-fnp"].lessons.length }, null, 2));
}

main();
