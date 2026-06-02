import "../src/lib/db/env-bootstrap";

import { prisma } from "../src/lib/db";
import { runLessonCompletionBatch } from "../src/lib/lessons/lesson-batch-completion";

const PATHWAY_ID = "us-rn-nclex-rn";
const BATCH_SIZE = 50;
const MAX_COMPLETE_ROUNDS = 20;

const REQUIRED_MATERNITY_TOPICS: Array<{ label: string; keys: string[] }> = [
  { label: "labor stages", keys: ["labor stage", "stages of labor", "labour stage"] },
  { label: "fetal monitoring", keys: ["fetal monitoring", "fetal heart", "fhr"] },
  { label: "complications", keys: ["preeclamps", "eclamps", "placenta previa", "placental abruption", "pph"] },
  { label: "postpartum care", keys: ["postpartum", "partum", "postnatal"] },
];

const MATERNITY_FOCUS_KEYS = [
  "maternity",
  "obstetric",
  "labor",
  "labour",
  "fetal monitoring",
  "fetal heart",
  "partum",
  "postpartum",
  "pregnan",
  "preeclamps",
  "eclamps",
  "placenta previa",
  "placental abruption",
  "postpartum hemorrhage",
  "pph",
];

function isMaternityText(text: string): boolean {
  const t = text.toLowerCase();
  return MATERNITY_FOCUS_KEYS.some((k) => t.includes(k));
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
      focusArea: "maternity",
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
      focusArea: "maternity",
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

  const maternityRows = allRows.filter((r) => isMaternityText(`${r.title} ${r.topic} ${r.bodySystem} ${r.slug}`));
  const corpus = maternityRows.map((r) => `${r.title} ${r.topic} ${r.bodySystem} ${r.slug}`.toLowerCase()).join("\n");
  const missingTopics = REQUIRED_MATERNITY_TOPICS.filter((t) => !t.keys.some((k) => corpus.includes(k.toLowerCase()))).map((t) => t.label);

  console.log(
    JSON.stringify(
      {
        pathwayId: PATHWAY_ID,
        lessonsCompleted: completed.size,
        lessonsUpgraded: upgraded.size,
        missingMaternityTopics: missingTopics,
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
