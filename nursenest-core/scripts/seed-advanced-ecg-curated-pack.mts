/**
 * Upsert all 160 clinician-reviewed Advanced ECG questions.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/seed-advanced-ecg-curated-pack.mts
 *
 * Requires DATABASE_URL.
 * All rows are governance-approved (clinicianReviewedAt, qaStatus approved,
 * publishSafetyStatus safe) and become learner-visible immediately.
 */
import "./load-dotenv-for-cli.mts";
import { assertDatabaseUrlPresentOrExit } from "./lib/database-env-assert.mts";

assertDatabaseUrlPresentOrExit("seed-advanced-ecg-curated-pack.mts requires DATABASE_URL.");

import { prisma } from "./lib/prisma-script-client";
import { buildAdvancedEcgCuratedPack } from "../src/lib/advanced-ecg/advanced-ecg-curated-pack-index";

async function main() {
  const rows = buildAdvancedEcgCuratedPack();
  console.log(`[seed-advanced-ecg] Upserting ${rows.length} advanced ECG questions...`);

  let upserted = 0;
  let skipped = 0;
  for (const row of rows) {
    const id = String(row.id ?? "");
    if (!id) { skipped += 1; continue; }
    await prisma.ecgVideoQuestion.upsert({ where: { id }, create: row, update: row });
    upserted += 1;
  }

  const learnerVisible = await prisma.ecgVideoQuestion.count({
    where: {
      qaStatus: "approved",
      publishSafetyStatus: "safe",
      clinicianReviewedAt: { not: null },
      level: "advanced",
      rhythmTag: {
        notIn: ["first_degree_av_block", "second_degree_type_i_av_block",
                "second_degree_type_ii_av_block", "third_degree_av_block"],
      },
    },
  });

  console.log(`[seed-advanced-ecg] Upserted: ${upserted}  Skipped: ${skipped}`);
  console.log(`[seed-advanced-ecg] Advanced learner-visible questions (by rhythmTag): ${learnerVisible}`);
  console.log("[seed-advanced-ecg] Done. Set ENABLE_ADVANCED_ECG_MODULE=true to open the module.");
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
