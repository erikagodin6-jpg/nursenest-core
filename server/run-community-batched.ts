import { runCommunityNursingSubspecialty } from "./community-nursing-expansion-engine";
import fs from "fs";

const SUBSPECIALTIES = [
  "Public Health Nursing",
  "Community Health Nursing",
  "Palliative Care Nursing",
  "Hospice Nursing",
  "Occupational Health Nursing",
];

const BATCH_TARGET = 50;
const TOTAL_PER_SPECIALTY = 500;
const STATUS_FILE = "/tmp/community-expansion-status.json";

function writeStatus(status: any) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

async function main() {
  const grandResults: Record<string, any> = {};
  const startTime = new Date().toISOString();

  writeStatus({ phase: "starting", startTime, subspecialties: SUBSPECIALTIES });

  for (const subspecialty of SUBSPECIALTIES) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Starting: ${subspecialty} (target: ${TOTAL_PER_SPECIALTY})`);
    console.log(`${"=".repeat(60)}`);

    try {
      const result = await runCommunityNursingSubspecialty(subspecialty, TOTAL_PER_SPECIALTY, (p) => {
        const currentStatus = {
          phase: "generating",
          currentSubspecialty: subspecialty,
          batch: p.batchNumber,
          questionsThisBatch: p.questionsGenerated,
          completed: Object.keys(grandResults),
          startTime,
        };
        writeStatus(currentStatus);
      });

      grandResults[subspecialty] = {
        questions: result.totalQuestionsInserted,
        flashcards: result.totalFlashcardsCreated,
        images: result.totalImagesAttached,
        lessonLinks: result.totalLessonLinksAdded,
        duplicates: result.totalDuplicatesRejected,
      };

      console.log(`\nCompleted ${subspecialty}: ${result.totalQuestionsInserted} questions, ${result.totalFlashcardsCreated} flashcards`);
    } catch (err: any) {
      console.error(`Error in ${subspecialty}:`, err.message);
      grandResults[subspecialty] = { error: err.message };
    }
  }

  const totalQuestions = Object.values(grandResults).reduce((s: number, r: any) => s + (r.questions || 0), 0);
  const totalFlashcards = Object.values(grandResults).reduce((s: number, r: any) => s + (r.flashcards || 0), 0);

  const finalStatus = {
    phase: "complete",
    startTime,
    completedAt: new Date().toISOString(),
    totalQuestions,
    totalFlashcards,
    subspecialtyResults: grandResults,
  };

  writeStatus(finalStatus);

  console.log(`\n${"=".repeat(60)}`);
  console.log("FINAL SUMMARY");
  console.log(`${"=".repeat(60)}`);
  console.log(JSON.stringify(finalStatus, null, 2));

  process.exit(0);
}

main().catch((err) => {
  writeStatus({ phase: "fatal_error", error: err.message });
  console.error("Fatal error:", err);
  process.exit(1);
});
