import { generateRnLessons } from "./rn-lesson-generator";

type GenerationResult = {
  lessonsInserted: number;
  flashcardsInserted: number;
  questionsLinked: number;
  errors: string[];
};

function printReport(result: GenerationResult, elapsedSeconds: string): void {
  console.log("\n========================================");
  console.log("  RN Lesson Library Generation Report");
  console.log("========================================");
  console.log(`  Lessons inserted:    ${result.lessonsInserted}`);
  console.log(`  Flashcards inserted: ${result.flashcardsInserted}`);
  console.log(`  Questions linked:    ${result.questionsLinked}`);
  console.log(`  Errors:              ${result.errors.length}`);
  console.log(`  Time elapsed:        ${elapsedSeconds}s`);
  console.log("========================================\n");

  if (result.errors.length > 0) {
    console.log("Errors:");
    result.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
}

async function main(): Promise<void> {
  console.log("[Runner] Starting RN Lesson Library Generation...");
  const startTime = Date.now();

  try {
    const result = (await generateRnLessons()) as GenerationResult;
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

    printReport(result, elapsedSeconds);
    process.exit(0);
  } catch (error) {
    console.error("[Runner] Fatal error:", error);
    process.exit(1);
  }
}

void main();