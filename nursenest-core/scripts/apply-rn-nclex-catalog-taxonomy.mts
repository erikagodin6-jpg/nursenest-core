/**
 * One-shot / repeatable: normalize `topic` + `title` for `us-rn-nclex-rn` and `ca-rn-nclex-rn` in catalog.json,
 * and remove merged duplicate lesson rows (see {@link RN_NCLEX_DUPLICATE_SLUGS_TO_REMOVE}).
 *
 * Run from nursenest-core:
 *   npx tsx scripts/apply-rn-nclex-catalog-taxonomy.mts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  RN_NCLEX_CONTROLLED_TOPICS,
  RN_NCLEX_DUPLICATE_SLUGS_TO_REMOVE,
  premiumTitleForRnNclexLesson,
} from "../src/lib/lessons/rn-nclex-catalog-taxonomy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "../src/content/pathway-lessons/catalog.json");

const PATHWAY_IDS = ["us-rn-nclex-rn", "ca-rn-nclex-rn"] as const;

const INTERNAL_LESSON_LINK_PATCHES: Record<(typeof PATHWAY_IDS)[number], Record<string, string>> = {
  "us-rn-nclex-rn": {
    "LESSON:pulmonary-embolism-nclex-rn": "LESSON:us-rn-pulmonary-embolism",
    "LESSON:heart-failure-nclex-rn": "LESSON:us-rn-heart-failure",
    "LESSON:myocardial-infarction-nclex-rn": "LESSON:us-rn-myocardial-infarction",
    "LESSON:insulin-hypoglycemia-hy": "LESSON:us-rn-insulin-hypoglycemia",
  },
  "ca-rn-nclex-rn": {
    "LESSON:pulmonary-embolism-nclex-rn": "LESSON:ca-rn-pulmonary-embolism",
    "LESSON:heart-failure-nclex-rn": "LESSON:ca-rn-heart-failure",
    "LESSON:myocardial-infarction-nclex-rn": "LESSON:ca-rn-myocardial-infarction",
    "LESSON:insulin-hypoglycemia-hy": "LESSON:ca-rn-insulin-hypoglycemia",
  },
};

type CatalogJson = {
  pathways: Record<string, { lessons: Array<Record<string, unknown> & { slug?: string; title?: string; topic?: string }> }>;
};

function patchLessonArrayInternalLinks(
  lessons: Array<Record<string, unknown>>,
  replacements: Record<string, string>,
): void {
  let blob = JSON.stringify(lessons);
  for (const [from, to] of Object.entries(replacements)) {
    if (!blob.includes(from)) continue;
    blob = blob.split(from).join(to);
  }
  const next = JSON.parse(blob) as Array<Record<string, unknown>>;
  lessons.length = 0;
  lessons.push(...next);
}

function main() {
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  const data = JSON.parse(raw) as CatalogJson;
  const removeSet = new Set<string>(RN_NCLEX_DUPLICATE_SLUGS_TO_REMOVE);

  for (const pathwayId of PATHWAY_IDS) {
    const bucket = data.pathways[pathwayId];
    if (!bucket?.lessons) throw new Error(`Missing pathway ${pathwayId}`);
    const before = bucket.lessons.length;
    bucket.lessons = bucket.lessons.filter((l) => !removeSet.has(String(l.slug ?? "")));
    const removed = before - bucket.lessons.length;
    // eslint-disable-next-line no-console
    console.error(`[apply-rn-nclex-catalog-taxonomy] ${pathwayId}: removed ${removed} duplicate row(s), ${bucket.lessons.length} remain`);

    patchLessonArrayInternalLinks(bucket.lessons, INTERNAL_LESSON_LINK_PATCHES[pathwayId]);

    for (const lesson of bucket.lessons) {
      const { title, topic } = premiumTitleForRnNclexLesson(lesson, pathwayId);
      lesson.title = title;
      lesson.topic = topic;
      if (!RN_NCLEX_CONTROLLED_TOPICS.includes(topic as (typeof RN_NCLEX_CONTROLLED_TOPICS)[number])) {
        throw new Error(`Post-normalize topic not controlled: ${topic} slug=${lesson.slug}`);
      }
    }
  }

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  // eslint-disable-next-line no-console
  console.error(`[apply-rn-nclex-catalog-taxonomy] wrote ${CATALOG_PATH}`);
}

main();
