import "../src/lib/db/env-bootstrap";

import { prisma } from "../src/lib/db";
import { runLessonCompletionBatch } from "../src/lib/lessons/lesson-batch-completion";

const PATHWAY_ID = "us-rn-nclex-rn";
const BATCH_SIZE = 50;
const MAX_COMPLETE_ROUNDS = 20;

const REQUIRED_CARDIO_TOPICS: Array<{ label: string; keys: string[] }> = [
  { label: "heart failure", keys: ["heart failure", "chf"] },
  { label: "myocardial infarction", keys: ["myocard", "mi", "stemi", "nstemi"] },
  { label: "angina (stable/unstable)", keys: ["angina", "stable angina", "unstable angina"] },
  { label: "arrhythmias (AFib, VT, VF, etc.)", keys: ["arrhythm", "afib", "vf", "vt", "dysrhythm"] },
  { label: "hypertension", keys: ["hypertension", "htn", "hypertensive"] },
  { label: "hypotension", keys: ["hypotension", "orthostatic"] },
  { label: "shock types", keys: ["shock", "cardiogenic shock", "obstructive shock"] },
  { label: "valvular disorders", keys: ["valv", "aortic stenosis", "mitral"] },
  { label: "peripheral vascular disease", keys: ["peripheral vascular", "pad", "pvd", "arterial disease"] },
  { label: "DVT / PE", keys: ["dvt", "pe", "pulmonary embol", "venous thrombo"] },
  { label: "cardiac meds", keys: ["antihypertensive", "antidysrhyth", "beta blocker", "ace inhibitor", "anticoagul"] },
];

const CARDIO_FOCUS_KEYS = [
  "cardio",
  "heart",
  "myocard",
  "angina",
  "arrhythm",
  "hypertension",
  "hypotension",
  "shock",
  "valv",
  "vascular",
  "dvt",
  "pe",
  "pulmonary embol",
  "anticoagul",
  "antihypertens",
  "antidysrhyth",
];

const CARDIO_EXCLUDE_KEYS = ["fetal heart", "obstetric", "labor", "postpartum", "newborn"];

function isCardioText(text: string): boolean {
  const t = text.toLowerCase();
  if (CARDIO_EXCLUDE_KEYS.some((k) => t.includes(k))) return false;
  return CARDIO_FOCUS_KEYS.some((k) => t.includes(k));
}

async function main() {
  const upgraded = new Set<string>();
  const completed = new Set<string>();

  let previousPartialSignature = "";

  for (let round = 1; round <= MAX_COMPLETE_ROUNDS; round += 1) {
    const report = await runLessonCompletionBatch({
      pathwayId: PATHWAY_ID,
      batchSize: BATCH_SIZE,
      write: true,
      mode: "complete",
      focusArea: "cardiovascular",
      onlyNotComplete: true,
    });

    if (report.batchSize === 0) break;
    for (const item of report.items) {
      if (item.updated) upgraded.add(item.lessonId);
      if (item.statusAfter === "COMPLETE") completed.add(item.lessonId);
    }

    const partialSignature = report.items
      .filter((i) => i.statusAfter !== "COMPLETE")
      .map((i) => i.slug)
      .sort()
      .join("|");

    if (report.lessonsStillPartial === 0) break;
    if (report.lessonsCompleted === 0 && partialSignature === previousPartialSignature) break;
    previousPartialSignature = partialSignature;
  }

  // Refine all currently complete cardiovascular lessons in paged batches.
  for (let offset = 0; ; offset += BATCH_SIZE) {
    const report = await runLessonCompletionBatch({
      pathwayId: PATHWAY_ID,
      batchSize: BATCH_SIZE,
      offset,
      write: true,
      mode: "refine",
      focusArea: "cardiovascular",
      onlyCompleted: true,
    });
    if (report.batchSize === 0) break;
    for (const item of report.items) {
      if (item.updated) upgraded.add(item.lessonId);
      if (item.statusAfter === "COMPLETE") completed.add(item.lessonId);
    }
    if (report.batchSize < BATCH_SIZE) break;
  }

  const allRows = await prisma.pathwayLesson.findMany({
    where: { pathwayId: PATHWAY_ID, locale: "en", status: "PUBLISHED" },
    select: { id: true, slug: true, title: true, topic: true, bodySystem: true },
  });

  const cardioRows = allRows.filter((r) => isCardioText(`${r.title} ${r.topic} ${r.bodySystem} ${r.slug}`));
  const corpus = cardioRows.map((r) => `${r.title} ${r.topic} ${r.bodySystem} ${r.slug}`.toLowerCase()).join("\n");

  const missingTopics = REQUIRED_CARDIO_TOPICS.filter((t) => !t.keys.some((k) => corpus.includes(k.toLowerCase()))).map((t) => t.label);

  console.log(
    JSON.stringify(
      {
        pathwayId: PATHWAY_ID,
        lessonsCompleted: completed.size,
        lessonsUpgraded: upgraded.size,
        missingCardioTopics: missingTopics,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
