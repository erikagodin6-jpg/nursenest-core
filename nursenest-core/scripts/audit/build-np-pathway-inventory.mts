/**
 * NP pathway inventory: registry definitions + bundled catalog + audit counts.
 * Run: cd nursenest-core && npx tsx scripts/audit/build-np-pathway-inventory.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");
const CATALOG = join(__dirname, "../../src/content/pathway-lessons/catalog.json");
const AUDIT = join(ROOT, "data/audit/lesson-completeness-audit.json");
const OUT = join(ROOT, "data/audit/np-pathway-inventory.json");

type CatalogJson = { pathways: Record<string, { lessons: unknown[] }> };

function main() {
  const npPathways = EXAM_PATHWAYS.filter((p: ExamPathwayDefinition) => p.examFamily === ExamFamily.NP);
  const catalog = JSON.parse(readFileSync(CATALOG, "utf8")) as CatalogJson;
  const audit = JSON.parse(readFileSync(AUDIT, "utf8")) as { lessons: Array<{ pathwayId: string }> };

  const auditCount = new Map<string, number>();
  for (const l of audit.lessons) {
    if (!npPathways.some((p) => p.id === l.pathwayId)) continue;
    auditCount.set(l.pathwayId, (auditCount.get(l.pathwayId) ?? 0) + 1);
  }

  const pathways = npPathways.map((p) => {
    const bundled = catalog.pathways[p.id]?.lessons?.length ?? 0;
    return {
      pathwayId: p.id,
      country: p.countrySlug,
      examCode: p.examCode,
      examFamily: p.examFamily,
      displayName: p.displayName,
      stripeTier: p.stripeTier,
      status: p.status,
      acquisitionMode: p.acquisitionMode,
      activeInProduction: p.status === "active",
      bundledCatalogLessonCount: bundled,
      auditLessonRows: auditCount.get(p.id) ?? 0,
      hasBundledContent: bundled > 0,
    };
  });

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        note: "bundledCatalogLessonCount comes from pathway-lessons/catalog.json; auditLessonRows from lesson-completeness-audit.",
        pathways,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log("Wrote", OUT);
}

main();
