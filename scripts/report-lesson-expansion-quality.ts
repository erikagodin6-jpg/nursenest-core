/**
 * Report editorial quality gate results for pathway catalog lessons (default: bp26- expansion slugs).
 *
 * Run: npx tsx scripts/report-lesson-expansion-quality.ts
 * Output: data/reports/lesson-expansion-quality-report.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  evaluatePathwayCatalogExpansionQuality,
  type CatalogLessonRowInput,
} from "@/lib/content-quality/lesson-expansion-quality-gate";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const REPORT_PATH = path.join(ROOT, "data/reports/lesson-expansion-quality-report.json");

const EXPANSION_PREFIX = "bp26-";

type CatalogShape = {
  pathways: Record<string, { lessons: unknown[] }>;
};

function main(): void {
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(raw) as CatalogShape;

  const pathways = [
    "us-lpn-nclex-pn",
    "ca-rpn-rex-pn",
    "us-np-fnp",
    "us-rn-nclex-rn",
    "ca-rn-nclex-rn",
  ];

  const report: {
    generatedAt: string;
    pathways: Record<
      string,
      {
        scanned: number;
        summary: { errors: number; warnings: number };
        violations: Record<string, ReturnType<typeof evaluatePathwayCatalogExpansionQuality>["bySlug"][string]>;
      }
    >;
  } = { generatedAt: new Date().toISOString(), pathways: {} };

  for (const pathwayId of pathways) {
    const lessons = (catalog.pathways[pathwayId]?.lessons ?? []) as CatalogLessonRowInput[];
    /** Only expansion-wave rows — do not run near-duplicate heuristics across the entire legacy catalog. */
    const target = lessons.filter((l) => typeof l.slug === "string" && l.slug.startsWith(EXPANSION_PREFIX));
    const r = evaluatePathwayCatalogExpansionQuality(target, pathwayId);
    report.pathways[pathwayId] = {
      scanned: target.length,
      summary: r.summary,
      violations: r.bySlug,
    };
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  console.log("Lesson expansion quality report:", REPORT_PATH);
  for (const [pid, row] of Object.entries(report.pathways)) {
    console.log(`  ${pid}: scanned=${row.scanned} errors=${row.summary.errors} warnings=${row.summary.warnings}`);
  }
}

main();
