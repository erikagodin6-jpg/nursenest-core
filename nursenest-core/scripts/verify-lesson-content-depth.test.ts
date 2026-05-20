import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { buildLessonContentDepthSummary } from "./verify-lesson-content-depth";

const scriptPath = path.join(process.cwd(), "scripts", "verify-lesson-content-depth.ts");
const catalogDir = path.join(process.cwd(), "src", "content", "pathway-lessons");
const RN_PATHWAY_IDS = ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const;
const RN_SKIP_FILES = new Set([
  "rn-nclex-catalog-import-state.json",
  "rn-nclex-master-map.json",
  "rn-nclex-explicit-inventory-aliases.json",
  "nclex-rn-source-checklist.json",
]);

function countRawJsonBackedRnLessons() {
  let total = 0;
  for (const fileName of fs.readdirSync(catalogDir).sort()) {
    if (!fileName.endsWith(".json") || RN_SKIP_FILES.has(fileName)) continue;
    const raw = JSON.parse(fs.readFileSync(path.join(catalogDir, fileName), "utf8")) as {
      pathways?: Record<string, unknown>;
    };
    for (const pathwayId of RN_PATHWAY_IDS) {
      const bucket = raw?.pathways?.[pathwayId];
      const lessons = Array.isArray(bucket)
        ? bucket
        : bucket && typeof bucket === "object" && Array.isArray((bucket as { lessons?: unknown[] }).lessons)
          ? (bucket as { lessons: unknown[] }).lessons
          : [];
      total += lessons.length;
    }
  }
  return total;
}

test("RPN/PN lesson depth verifier reports JSON-backed live lessons only", () => {
  const summary = buildLessonContentDepthSummary(false);
  const source = fs.readFileSync(scriptPath, "utf8");
  const liveTotal =
    getCatalogPathwayLessonsSync("ca-rpn-rex-pn").length +
    getCatalogPathwayLessonsSync("us-lpn-nclex-pn").length;

  assert.equal(summary.reports.rpnJsonBacked.liveCatalogLessonsTotal, liveTotal);
  assert.equal(
    summary.totals.rpnJsonBackedLessonsTotal + summary.totals.rpnJsonBackedScopedGoldExcluded,
    liveTotal,
  );
  assert.equal(
    summary.totals.rpnJsonBackedEnriched + summary.totals.rpnJsonBackedUnmatched,
    summary.totals.rpnJsonBackedLessonsTotal,
  );
  assert.ok(summary.totals.rpnJsonBackedUnmatched > 0);
  assert.ok(summary.totals.rpnJsonBackedAdequate <= summary.totals.rpnJsonBackedEnriched);
  assert.equal(
    summary.reports.rpnJsonBacked.missingRequiredSections,
    summary.totals.rpnJsonBackedMissingRequiredSection,
  );
  assert.doesNotMatch(
    source,
    /summary\.totals\.rpnExpandLessonsTotal > 0 && summary\.totals\.rpnExpandPassing !== summary\.totals\.rpnExpandLessonsTotal/,
  );
});

test("RN lesson depth verifier uses JSON-backed live denominator and rejects legacy section remnants", () => {
  const summary = buildLessonContentDepthSummary(false);
  const source = fs.readFileSync(scriptPath, "utf8");
  const liveTotal =
    getCatalogPathwayLessonsSync("ca-rn-nclex-rn").length +
    getCatalogPathwayLessonsSync("us-rn-nclex-rn").length;
  const rawJsonBackedTotal = countRawJsonBackedRnLessons();

  assert.ok(summary.totals.rnJsonClinicalLessonsTotal > 0);
  assert.ok(summary.totals.rnJsonClinicalLessonsTotal <= liveTotal);
  assert.equal(summary.totals.rnJsonClinicalLessonsTotal, rawJsonBackedTotal);
  assert.equal(summary.totals.rnJsonClinicalLegacySectionLessons, 0);
  assert.match(source, /RN_JSON_CLINICAL_PATHWAY_IDS = \["ca-rn-nclex-rn", "us-rn-nclex-rn"\]/);
});
