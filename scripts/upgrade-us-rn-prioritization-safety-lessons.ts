import "../src/lib/db/env-bootstrap";

import { prisma } from "../src/lib/db";
import { runLessonCompletionBatch } from "../src/lib/lessons/lesson-batch-completion";

const PATHWAY_ID = "us-rn-nclex-rn";
const BATCH_SIZE = 50;
const MAX_COMPLETE_ROUNDS = 20;

const REQUIRED_TOPICS: Array<{ label: string; keys: string[] }> = [
  { label: "ABC framework", keys: ["abc", "airway breathing circulation"] },
  { label: "delegation", keys: ["delegation", "scope", "assign task"] },
  { label: "triage", keys: ["triage", "priority level", "mass casualty"] },
  { label: "patient deterioration", keys: ["deterioration", "rapid response", "escalation"] },
  { label: "decision-making emphasis", keys: ["clinical judgment", "decision-making", "prioritize"] },
];

const FOCUS_KEYS = [
  "priorit",
  "abc",
  "airway breathing circulation",
  "delegation",
  "triage",
  "deterioration",
  "rapid response",
  "clinical judgment",
  "decision-making",
  "safety",
  "escalation",
  "unstable patient",
];

function isPrioritySafetyText(text: string): boolean {
  const t = text.toLowerCase();
  return FOCUS_KEYS.some((k) => t.includes(k));
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
      focusArea: "prioritization_safety",
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
      focusArea: "prioritization_safety",
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

  const focusedRows = allRows.filter((r) => isPrioritySafetyText(`${r.title} ${r.topic} ${r.bodySystem} ${r.slug}`));
  const corpus = focusedRows.map((r) => `${r.title} ${r.topic} ${r.bodySystem} ${r.slug}`.toLowerCase()).join("\n");
  const missingTopics = REQUIRED_TOPICS.filter((t) => !t.keys.some((k) => corpus.includes(k.toLowerCase()))).map((t) => t.label);

  console.log(
    JSON.stringify(
      {
        pathwayId: PATHWAY_ID,
        lessonsCompleted: completed.size,
        lessonsUpgraded: upgraded.size,
        missingPrioritizationSafetyTopics: missingTopics,
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
