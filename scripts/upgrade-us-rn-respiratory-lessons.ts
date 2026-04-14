import "../src/lib/db/env-bootstrap";

import { prisma } from "../src/lib/db";
import { runLessonCompletionBatch } from "../src/lib/lessons/lesson-batch-completion";

const PATHWAY_ID = "us-rn-nclex-rn";
const BATCH_SIZE = 50;
const MAX_COMPLETE_ROUNDS = 20;

const REQUIRED_RESP_TOPICS: Array<{ label: string; keys: string[] }> = [
  { label: "COPD", keys: ["copd", "chronic obstructive"] },
  { label: "asthma", keys: ["asthma", "status asthmaticus"] },
  { label: "pneumonia", keys: ["pneumonia"] },
  { label: "ARDS", keys: ["ards", "acute respiratory distress"] },
  { label: "pulmonary embolism", keys: ["pulmonary embol", "pe"] },
  { label: "oxygen therapy", keys: ["oxygen therapy", "oxygenation"] },
  { label: "ABGs", keys: ["abg", "arterial blood gas"] },
  { label: "ventilation basics", keys: ["ventilation", "ventilator"] },
  { label: "lung sounds", keys: ["lung sound", "wheeze", "crackle", "rhonchi"] },
];

const RESP_FOCUS_KEYS = [
  "respir",
  "copd",
  "asthma",
  "pneumonia",
  "ards",
  "pulmonary embol",
  "pe",
  "oxygen",
  "abg",
  "arterial blood gas",
  "ventilat",
  "lung sound",
  "wheeze",
  "crackle",
  "rhonchi",
];

const RESP_EXCLUDE_KEYS = ["fetal lung", "newborn", "obstetric", "labor", "postpartum"];

function isRespText(text: string): boolean {
  const t = text.toLowerCase();
  if (RESP_EXCLUDE_KEYS.some((k) => t.includes(k))) return false;
  return RESP_FOCUS_KEYS.some((k) => t.includes(k));
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
      focusArea: "respiratory",
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

  for (let offset = 0; ; offset += BATCH_SIZE) {
    const report = await runLessonCompletionBatch({
      pathwayId: PATHWAY_ID,
      batchSize: BATCH_SIZE,
      offset,
      write: true,
      mode: "refine",
      focusArea: "respiratory",
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

  const respRows = allRows.filter((r) => isRespText(`${r.title} ${r.topic} ${r.bodySystem} ${r.slug}`));
  const corpus = respRows.map((r) => `${r.title} ${r.topic} ${r.bodySystem} ${r.slug}`.toLowerCase()).join("\n");

  const missingTopics = REQUIRED_RESP_TOPICS.filter((t) => !t.keys.some((k) => corpus.includes(k.toLowerCase()))).map((t) => t.label);

  console.log(
    JSON.stringify(
      {
        pathwayId: PATHWAY_ID,
        lessonsCompleted: completed.size,
        lessonsUpgraded: upgraded.size,
        missingRespiratoryTopics: missingTopics,
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
