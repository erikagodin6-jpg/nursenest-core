#!/usr/bin/env npx tsx
/**
 * Merges `data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json` into
 * `src/content/pathway-lessons/catalog.json` for US + CA RN/PN pathways.
 *
 *   npx tsx scripts/merge-catalog-sprint2.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const BATCH = path.join(ROOT, "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json");

type Lesson = { slug: string; [k: string]: unknown };

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8")) as {
    version: number;
    pathways: Record<string, { lessons: Lesson[] }>;
  };
  const batch = JSON.parse(fs.readFileSync(BATCH, "utf8")) as {
    usRn: Lesson[];
    usPn: Lesson[];
    caRn: Lesson[];
    caRpn: Lesson[];
  };

  const keepUsRn = (catalog.pathways["us-rn-nclex-rn"]?.lessons ?? []).filter(
    (l) => !String(l.slug).startsWith("us-rn-"),
  );
  const keepUsPn = (catalog.pathways["us-lpn-nclex-pn"]?.lessons ?? []).filter(
    (l) => !String(l.slug).startsWith("us-pn-"),
  );
  const keepCaRn = (catalog.pathways["ca-rn-nclex-rn"]?.lessons ?? []).filter(
    (l) => !String(l.slug).startsWith("ca-rn-"),
  );
  const keepCaRpn = (catalog.pathways["ca-rpn-rex-pn"]?.lessons ?? []).filter(
    (l) => !String(l.slug).startsWith("ca-rpn-"),
  );

  catalog.pathways["us-rn-nclex-rn"] = { lessons: [...keepUsRn, ...batch.usRn] };
  catalog.pathways["us-lpn-nclex-pn"] = { lessons: [...keepUsPn, ...batch.usPn] };
  catalog.pathways["ca-rn-nclex-rn"] = { lessons: [...keepCaRn, ...batch.caRn] };
  catalog.pathways["ca-rpn-rex-pn"] = { lessons: [...keepCaRpn, ...batch.caRpn] };

  fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  console.log(
    JSON.stringify(
      {
        usRnTotal: catalog.pathways["us-rn-nclex-rn"].lessons.length,
        usPnTotal: catalog.pathways["us-lpn-nclex-pn"].lessons.length,
        caRnTotal: catalog.pathways["ca-rn-nclex-rn"].lessons.length,
        caRpnTotal: catalog.pathways["ca-rpn-rex-pn"].lessons.length,
      },
      null,
      2,
    ),
  );
}

main();
