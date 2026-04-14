/**
 * Apply lesson enrichments from data/lesson-enrichments/*.json into catalog.json.
 *
 * This script surgically replaces sections[], preTest[], and postTest[] in
 * catalog.json for any lesson that has a matching enrichment record. It does NOT
 * delete lessons, change slugs, or touch lessons with no enrichment record.
 *
 * Usage:
 *   npx tsx scripts/apply-lesson-enrichments.ts [--file <enrichment-file>] [--dry-run]
 *
 * After running this script, seed the DB:
 *   npm run db:seed-pathway-lessons
 *
 * Enrichment file format: data/lesson-enrichments/*.json
 *   {
 *     "version": 1,
 *     "description": "...",
 *     "lessons": [
 *       {
 *         "pathwayId": "ca-rn-nclex-rn",
 *         "slug": "ca-rn-heart-failure",
 *         "sections": [...],         // replaces sections[]
 *         "preTest": [...],          // replaces preTest[] (optional)
 *         "postTest": [...],         // replaces postTest[] (optional)
 *         "previewSectionCount": 2   // optional override
 *       }
 *     ]
 *   }
 */
import fs from "node:fs";
import path from "node:path";

const CATALOG_PATH = path.join(process.cwd(), "src/content/pathway-lessons/catalog.json");
const ENRICHMENT_DIR = path.join(process.cwd(), "data/lesson-enrichments");

type EnrichmentLesson = {
  pathwayId: string;
  slug: string;
  sections?: unknown[];
  preTest?: unknown[];
  postTest?: unknown[];
  previewSectionCount?: number;
  seoTitle?: string;
  seoDescription?: string;
};

type EnrichmentFile = {
  version: number;
  description: string;
  lessons: EnrichmentLesson[];
};

type CatalogLesson = Record<string, unknown>;
type CatalogShape = {
  version: number;
  pathways: Record<string, { lessons: CatalogLesson[] }>;
};

function loadEnrichmentFiles(targetFile?: string): EnrichmentFile[] {
  if (targetFile) {
    const absPath = path.isAbsolute(targetFile)
      ? targetFile
      : path.join(ENRICHMENT_DIR, targetFile);
    return [JSON.parse(fs.readFileSync(absPath, "utf8")) as EnrichmentFile];
  }

  if (!fs.existsSync(ENRICHMENT_DIR)) return [];
  return fs
    .readdirSync(ENRICHMENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(ENRICHMENT_DIR, f), "utf8")) as EnrichmentFile);
}

function applyEnrichments(
  catalog: CatalogShape,
  enrichments: EnrichmentLesson[],
  dryRun: boolean,
): { applied: number; notFound: string[] } {
  const index = new Map<string, EnrichmentLesson>();
  for (const e of enrichments) {
    index.set(`${e.pathwayId}::${e.slug}`, e);
  }

  let applied = 0;
  const notFound: string[] = [];

  for (const [pathwayId, bucket] of Object.entries(catalog.pathways)) {
    for (const lesson of bucket.lessons) {
      const slug = lesson.slug as string;
      const key = `${pathwayId}::${slug}`;
      const enrichment = index.get(key);
      if (!enrichment) continue;

      if (!dryRun) {
        if (enrichment.sections !== undefined) lesson.sections = enrichment.sections;
        if (enrichment.preTest !== undefined) lesson.preTest = enrichment.preTest;
        if (enrichment.postTest !== undefined) lesson.postTest = enrichment.postTest;
        if (enrichment.previewSectionCount !== undefined)
          lesson.previewSectionCount = enrichment.previewSectionCount;
        if (enrichment.seoTitle !== undefined) lesson.seoTitle = enrichment.seoTitle;
        if (enrichment.seoDescription !== undefined) lesson.seoDescription = enrichment.seoDescription;
      }
      applied++;
      index.delete(key);
    }
  }

  for (const remaining of index.keys()) {
    notFound.push(remaining);
  }

  return { applied, notFound };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.includes("--file") ? args[args.indexOf("--file") + 1] : undefined;

  console.log(`apply-lesson-enrichments: loading catalog from ${CATALOG_PATH}`);
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")) as CatalogShape;

  const enrichmentFiles = loadEnrichmentFiles(fileArg);
  if (enrichmentFiles.length === 0) {
    console.log("No enrichment files found. Place JSON files in data/lesson-enrichments/.");
    return;
  }

  const allLessons: EnrichmentLesson[] = [];
  for (const f of enrichmentFiles) {
    console.log(`  Loaded enrichment: "${f.description}" (${f.lessons.length} lessons)`);
    allLessons.push(...f.lessons);
  }

  const { applied, notFound } = applyEnrichments(catalog, allLessons, dryRun);

  if (notFound.length > 0) {
    console.warn("  WARNING: enrichment entries not matched in catalog (slug/pathway not found):");
    for (const k of notFound) console.warn(`    - ${k}`);
  }

  if (dryRun) {
    console.log(`\n[DRY RUN] Would apply ${applied} enrichments. Pass without --dry-run to write.`);
    return;
  }

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf8");
  console.log(`\nDone: applied ${applied} enrichments to catalog.json.`);
  console.log("Next: npm run db:seed-pathway-lessons");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
