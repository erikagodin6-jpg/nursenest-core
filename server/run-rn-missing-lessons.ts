import { generateMissingRnLessons } from "./rn-missing-lessons-generator";

async function main() {
  console.log("[Runner] Starting Missing RN Lesson Generation...");
  const start = Date.now();

  try {
    const result = await generateMissingRnLessons();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    
    console.log("\n========================================");
    console.log("  Missing RN Lesson Generation Report");
    console.log("========================================");
    console.log(`  Lessons inserted:    ${result.lessonsInserted}`);
    console.log(`  Flashcards inserted: ${result.flashcardsInserted}`);
    console.log(`  Errors:              ${result.errors.length}`);
    console.log(`  Time elapsed:        ${elapsed}s`);
    console.log("========================================\n");
    
    if (result.errors.length > 0) {
      console.log("Errors:");
      result.errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
    }
    
    process.exit(0);
  } catch (err) {
    console.error("[Runner] Fatal error:", err);
    process.exit(1);
  }
}

main();
