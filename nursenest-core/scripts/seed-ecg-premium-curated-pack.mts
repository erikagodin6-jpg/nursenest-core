/**
 * Upsert clinically validated ECG premium questions from {@link buildEcgPremiumCuratedPack}.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/seed-ecg-premium-curated-pack.mts
 *
 * Requires DATABASE_URL (see `scripts/load-dotenv-for-cli.mts`).
 */
import "./load-dotenv-for-cli.mts";
import { assertDatabaseUrlPresentOrExit } from "./lib/database-env-assert.mts";

assertDatabaseUrlPresentOrExit("seed-ecg-premium-curated-pack.mts requires DATABASE_URL.");

import { prisma } from "./lib/prisma-script-client";
import { buildEcgPremiumCuratedPack } from "../src/lib/ecg-module/ecg-premium-curated-pack";

async function main() {
  const rows = buildEcgPremiumCuratedPack();
  let upserted = 0;
  for (const row of rows) {
    const id = String(row.id ?? "");
    if (!id) continue;
    await prisma.ecgVideoQuestion.upsert({
      where: { id },
      create: row,
      update: row,
    });
    upserted += 1;
  }
  console.log(`[seed-ecg-premium-curated-pack] Upserted ${upserted} ecg_video_questions rows.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
