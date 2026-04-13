/**
 * Mirror CA-RN enrichment files to their US-RN equivalents.
 *
 * CA-RN lessons use slugs like `ca-rn-heart-failure`.
 * US-RN lessons use the same slug pattern: `us-rn-heart-failure`.
 * The pathway IDs differ: `ca-rn-nclex-rn` → `us-rn-nclex-rn`.
 *
 * For most spine lessons the content is 90%+ identical.
 * This script:
 *   1. Reads all enrichment files in data/lesson-enrichments/
 *   2. For each CA-RN lesson entry, creates a US-RN mirror
 *   3. Adjusts slug (ca-rn- → us-rn-) and pathwayId
 *   4. Adjusts Canadian-specific wording (SI units references, provincial scope language)
 *   5. Writes mirror entries back to the enrichment files (or new files)
 *
 * Usage:
 *   npx tsx scripts/mirror-ca-to-us-enrichments.ts [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";

const ENRICHMENT_DIR = path.join(process.cwd(), "data/lesson-enrichments");

type LessonEntry = Record<string, unknown>;

type EnrichmentFile = {
  version: number;
  description: string;
  lessons: LessonEntry[];
};

function adaptForUSContext(text: string): string {
  // Replace Canadian-specific exam/scope references in section bodies
  return text
    .replace(/NCLEX-RN, Canada/g, "NCLEX-RN, US")
    .replace(/Canadian NCLEX-RN/g, "NCLEX-RN")
    .replace(/Canada RN context/g, "US RN context")
    .replace(/Provincial practice standards/g, "State Nurse Practice Act")
    .replace(/provincial practice/g, "state practice")
    .replace(/college scope/g, "state board scope")
    .replace(/Canadian acute-care/g, "US acute-care")
    .replace(/SI labs where stems show mmol\/L/g, "conventional units (mg/dL, mEq/L)")
    .replace(/\(mmol\/L\)/g, "(mg/dL, mEq/L)")
    .replace(/mmol\/L/g, "mg/dL or mEq/L")
    .replace(/Canada:/g, "US:")
    .replace(/Canadian/g, "US");
}

function mirrorLesson(lesson: LessonEntry): LessonEntry | null {
  const slug = lesson.slug as string;
  const pathwayId = lesson.pathwayId as string;

  if (!pathwayId.startsWith("ca-rn-") || !slug.startsWith("ca-rn-")) return null;

  const usSlug = slug.replace(/^ca-rn-/, "us-rn-");
  const usPathwayId = pathwayId.replace(/^ca-rn-/, "us-rn-");

  const mirrored: LessonEntry = {
    ...lesson,
    pathwayId: usPathwayId,
    slug: usSlug,
  };

  // Adapt seoTitle, seoDescription
  if (typeof mirrored.seoTitle === "string")
    mirrored.seoTitle = adaptForUSContext(mirrored.seoTitle);
  if (typeof mirrored.seoDescription === "string")
    mirrored.seoDescription = adaptForUSContext(mirrored.seoDescription);

  // Adapt section bodies
  if (Array.isArray(mirrored.sections)) {
    mirrored.sections = (mirrored.sections as LessonEntry[]).map((s) => {
      const adapted = { ...s };
      if (typeof adapted.body === "string") adapted.body = adaptForUSContext(adapted.body);
      if (typeof adapted.heading === "string") adapted.heading = adaptForUSContext(adapted.heading);
      return adapted;
    });
  }

  return mirrored;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (!fs.existsSync(ENRICHMENT_DIR)) {
    console.error("Enrichment directory not found:", ENRICHMENT_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(ENRICHMENT_DIR).filter((f) => f.endsWith(".json"));
  let total = 0;

  for (const file of files) {
    const filePath = path.join(ENRICHMENT_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as EnrichmentFile;

    const existing = new Set(data.lessons.map((l) => `${l.pathwayId}::${l.slug}`));
    const newMirrors: LessonEntry[] = [];

    for (const lesson of data.lessons) {
      const mirror = mirrorLesson(lesson);
      if (!mirror) continue;
      const key = `${mirror.pathwayId}::${mirror.slug}`;
      if (!existing.has(key)) {
        newMirrors.push(mirror);
        existing.add(key);
      }
    }

    if (newMirrors.length === 0) {
      console.log(`${file}: no new mirrors needed`);
      continue;
    }

    console.log(`${file}: adding ${newMirrors.length} US-RN mirrors`);

    if (!dryRun) {
      data.lessons.push(...newMirrors);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    }

    total += newMirrors.length;
  }

  console.log(`\n${dryRun ? "[DRY RUN] Would add" : "Added"} ${total} US-RN mirror lessons total.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
