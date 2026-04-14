/**
 * One-off generator: legacy NurseNest contentMap → import JSON for
 * `scripts/import-nurse-nest-legacy.ts` (lessons only).
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/build-safe-restoration-lesson-import.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { contentMap } from "../../external/NurseNest/client/src/data/lessons/index.ts";
import { convertLegacyLesson } from "./convert-legacy-lesson-to-enrichment";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PATHWAY_ID = "us-rn-nclex-rn";
const TOPIC = "Critical Care";
const TOPIC_SLUG = "critical-care";
const BODY_SYSTEM = "Multisystem";

/** High-value clinical topics: shock, sepsis, AKI, HF, stroke, resuscitation, ICU core — legacy keys. */
const RESTORE_KEYS = [
  "icu-aki-management",
  "icu-ards-management",
  "icu-cardiac-arrest-management",
  "icu-fluid-electrolyte-management",
  "icu-hemodynamic-monitoring",
  "icu-multi-organ-dysfunction",
  "icu-mechanical-ventilation",
  "acls-cardiac-arrest",
  "cardiogenic-shock",
  "fever-workup-sepsis",
  "icu-hypothermia-management",
  "icu-massive-transfusion",
  "shock-overview-lesson",
  "sepsis-protocol-algorithm",
  "heart-failure-overview-lesson",
  "stroke-protocol-thrombolytic",
  "icu-neurological-monitoring",
] as const;

const OUT_DIR = path.join(
  __dirname,
  "../data/import-staging/safe-rn-critical-care-2026/lessons",
);
const OUT_FILE = path.join(OUT_DIR, "restoration-batch-1.json");

function main() {
  const rows: Record<string, unknown>[] = [];
  for (const key of RESTORE_KEYS) {
    const lesson = contentMap[key];
    if (!lesson?.title) {
      console.error(`Missing lesson: ${key}`);
      process.exit(1);
    }
    const enrichment = convertLegacyLesson({
      pathwayId: PATHWAY_ID,
      slug: key,
      lesson,
    });
    if (!enrichment.sections?.length) {
      console.error(`No sections for ${key}`);
      process.exit(1);
    }
    rows.push({
      pathwayId: PATHWAY_ID,
      slug: key,
      title: lesson.title,
      topic: TOPIC,
      topicSlug: TOPIC_SLUG,
      bodySystem: BODY_SYSTEM,
      previewSectionCount: enrichment.previewSectionCount,
      seoTitle: `${lesson.title} | ${PATHWAY_ID}`,
      seoDescription: `${lesson.title}: critical care nursing lesson (legacy import).`,
      sections: enrichment.sections,
      ...(enrichment.preTest ? { preTest: enrichment.preTest } : {}),
      ...(enrichment.postTest ? { postTest: enrichment.postTest } : {}),
    });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(rows, null, 2), "utf8");
  console.log(`Wrote ${rows.length} lessons → ${OUT_FILE}`);
}

main();
