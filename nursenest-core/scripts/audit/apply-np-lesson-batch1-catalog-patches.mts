/**
 * Applies NP batch 1 legacy five-block bodies to us-np-fnp catalog lessons listed in
 * np-lesson-fix-batch-1-plan.json (catalog-backed rows only; scoped-gold handled in TS modules).
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/apply-np-lesson-batch1-catalog-patches.mts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildNpBatch1CatalogSections } from "./np-batch1-catalog-bodies.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..", "..");
const PLAN = join(REPO, "data", "audit", "np-lesson-fix-batch-1-plan.json");
const CATALOG = join(__dirname, "../../src/content/pathway-lessons/catalog.json");

type PlanDoc = { lessons: Array<{ slug: string; pathwayId: string }> };
type CatalogJson = {
  version: number;
  pathways: Record<string, { lessons: Array<Record<string, unknown> & { slug: string }> }>;
};

function main() {
  const plan = JSON.parse(readFileSync(PLAN, "utf8")) as PlanDoc;
  const slugSet = new Set(plan.lessons.filter((l) => l.pathwayId === "us-np-fnp").map((l) => l.slug));
  const raw = readFileSync(CATALOG, "utf8");
  const data = JSON.parse(raw) as CatalogJson;
  const bucket = data.pathways["us-np-fnp"];
  if (!bucket?.lessons?.length) {
    console.error("No us-np-fnp lessons in catalog");
    process.exit(1);
  }
  let touched = 0;
  for (const lesson of bucket.lessons) {
    if (!slugSet.has(lesson.slug)) continue;
    const meta = {
      slug: String(lesson.slug),
      title: String(lesson.title ?? ""),
      topic: String(lesson.topic ?? ""),
      topicSlug: String(lesson.topicSlug ?? ""),
      bodySystem: String(lesson.bodySystem ?? ""),
      seoDescription: String(lesson.seoDescription ?? ""),
    };
    const sections = buildNpBatch1CatalogSections(meta);
    if (!sections) {
      console.warn("No NP batch builder for", lesson.slug, "(skipped)");
      continue;
    }
    lesson.sections = sections;
    touched += 1;
  }
  writeFileSync(CATALOG, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Updated ${touched} FNP catalog lessons (NP batch 1).`);
}

main();
