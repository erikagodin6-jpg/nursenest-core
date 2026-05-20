import { runCommunityNursingSubspecialty, runFullCommunityNursingExpansion, getCommunityNursingExpansionStatus } from "./community-nursing-expansion-engine";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "full";

  if (command === "status") {
    const status = await getCommunityNursingExpansionStatus();
    console.log(JSON.stringify(status, null, 2));
    process.exit(0);
  }

  if (command === "single") {
    const subspecialty = args[1] || "Public Health Nursing";
    const targetCount = parseInt(args[2] || "500");
    console.log(`Starting single subspecialty: ${subspecialty}, target: ${targetCount}`);
    const result = await runCommunityNursingSubspecialty(subspecialty, targetCount, (p) => {
      console.log(`Progress: batch ${p.batchNumber}, ${p.questionsGenerated} questions generated`);
    });
    console.log("\n=== FINAL SUMMARY ===");
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  if (command === "full") {
    console.log("Starting full Community & Other Nursing expansion (2,500 questions across 5 subspecialties)");
    const result = await runFullCommunityNursingExpansion((p) => {
      console.log(`Progress: batch ${p.batchNumber} (${p.tier}), ${p.questionsGenerated} questions generated`);
    });
    console.log("\n=== GRAND TOTAL ===");
    console.log(JSON.stringify(result.grandTotal, null, 2));
    console.log("\n=== PER SUBSPECIALTY ===");
    for (const [name, summary] of Object.entries(result.subspecialties)) {
      console.log(`\n${name}: ${summary.totalQuestionsInserted} questions, ${summary.totalFlashcardsCreated} flashcards`);
    }
    process.exit(0);
  }

  console.log("Usage: npx tsx server/run-community-nursing-expansion.ts [full|single|status] [subspecialty] [targetCount]");
  process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
