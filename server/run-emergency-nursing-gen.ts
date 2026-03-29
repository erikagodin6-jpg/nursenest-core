import { runEmergencyNursingGeneration } from "./emergency-nursing-generator";

async function main() {
  console.log(`[Runner] Emergency Nursing Question Generator`);
  console.log(`[Runner] Started at: ${new Date().toISOString()}`);
  console.log(`[Runner] DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
  console.log(`[Runner] PROD_DATABASE_URL set: ${!!process.env.PROD_DATABASE_URL}`);
  console.log(`[Runner] AI_INTEGRATIONS_OPENAI_API_KEY set: ${!!process.env.AI_INTEGRATIONS_OPENAI_API_KEY}`);
  console.log(`[Runner] AI_INTEGRATIONS_OPENAI_BASE_URL: ${process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "(not set)"}`);

  try {
    const result = await runEmergencyNursingGeneration((progress) => {
      console.log(`[Runner] Progress: ${progress.subspecialty} batch #${progress.batchNumber} - ${progress.questionsGenerated} questions, ${progress.flashcardsCreated} flashcards`);
    });

    console.log(`\n[Runner] ========== FINAL SUMMARY ==========`);
    console.log(JSON.stringify(result.grandTotal, null, 2));

    console.log(`\n[Runner] === Emergency Nursing Distribution ===`);
    console.log(JSON.stringify(result.emergencyNursing.topicDistribution, null, 2));
    console.log(JSON.stringify(result.emergencyNursing.difficultyDistribution, null, 2));

    console.log(`\n[Runner] === Trauma Nursing Distribution ===`);
    console.log(JSON.stringify(result.traumaNursing.topicDistribution, null, 2));
    console.log(JSON.stringify(result.traumaNursing.difficultyDistribution, null, 2));

    console.log(`\n[Runner] === Pediatric Emergency Distribution ===`);
    console.log(JSON.stringify(result.pediatricEmergency.topicDistribution, null, 2));
    console.log(JSON.stringify(result.pediatricEmergency.difficultyDistribution, null, 2));

    console.log(`\n[Runner] Completed at: ${new Date().toISOString()}`);
  } catch (err: any) {
    console.error(`[Runner] FATAL ERROR:`, err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

main().then(() => {
  console.log("[Runner] Done. Exiting.");
  process.exit(0);
}).catch((err) => {
  console.error("[Runner] Unhandled error:", err);
  process.exit(1);
});
