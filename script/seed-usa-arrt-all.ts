import { execSync } from "child_process";

const SEED_FILES = [
  "script/seed-usa-arrt-questions-patient-care.ts",
  "script/seed-usa-arrt-questions-patient-care-2.ts",
  "script/seed-usa-arrt-questions-patient-care-3.ts",
  "script/seed-usa-arrt-questions-patient-care-4.ts",
  "script/seed-usa-arrt-questions-safety.ts",
  "script/seed-usa-arrt-questions-safety-2.ts",
  "script/seed-usa-arrt-questions-safety-3.ts",
  "script/seed-usa-arrt-questions-safety-4.ts",
  "script/seed-usa-arrt-questions-image-production.ts",
  "script/seed-usa-arrt-questions-image-production-2.ts",
  "script/seed-usa-arrt-questions-image-production-3.ts",
  "script/seed-usa-arrt-questions-image-production-4.ts",
  "script/seed-usa-arrt-questions-procedures.ts",
  "script/seed-usa-arrt-questions-procedures-2.ts",
  "script/seed-usa-arrt-questions-procedures-3.ts",
  "script/seed-usa-arrt-questions-procedures-4.ts",
  "script/seed-usa-arrt-questions-procedures-5.ts",
  "script/seed-usa-arrt-questions-procedures-6.ts",
  "script/seed-usa-arrt-questions-equipment.ts",
  "script/seed-usa-arrt-questions-equipment-2.ts",
  "script/seed-usa-arrt-questions-equipment-3.ts",
  "script/seed-usa-arrt-questions-equipment-4.ts",
  "script/seed-usa-arrt-artifacts.ts",
  "script/seed-usa-arrt-flashcards.ts",
  "script/seed-usa-arrt-positioning.ts",
  "script/seed-usa-arrt-case-studies.ts",
  "script/seed-usa-arrt-lessons.ts",
  "script/seed-usa-arrt-seo-images.ts",
  "script/seed-usa-arrt-supplement.ts",
];

async function runAll() {
  console.log(`\n=== USA ARRT Content Seeder ===`);
  console.log(`Running ${SEED_FILES.length} seed files...\n`);

  let passed = 0;
  let failed = 0;

  for (const file of SEED_FILES) {
    try {
      console.log(`▶ ${file}`);
      const output = execSync(`npx tsx ${file}`, {
        encoding: "utf-8",
        timeout: 120_000,
        env: { ...process.env },
      });
      console.log(`  ${output.trim()}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ FAILED: ${err.message?.slice(0, 200)}`);
      failed++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Passed: ${passed}/${SEED_FILES.length}`);
  if (failed > 0) console.log(`Failed: ${failed}/${SEED_FILES.length}`);
  console.log(`Done.\n`);
}

runAll();
