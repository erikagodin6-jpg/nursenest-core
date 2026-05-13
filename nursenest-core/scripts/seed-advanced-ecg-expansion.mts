/**
 * Seed the Advanced ECG specialty expansion (40 questions).
 * Covers: ARVC, tamponade/alternans, Takotsubo, LV aneurysm, massive PE,
 * HOCM, channelopathies, fascicular nuance, EP pearls, management layer,
 * telemetry workflow framing.
 *
 * Usage: npx tsx scripts/seed-advanced-ecg-expansion.mts
 */
import "./load-dotenv-for-cli.mts";
import { assertDatabaseUrlPresentOrExit } from "./lib/database-env-assert.mts";

assertDatabaseUrlPresentOrExit("seed-advanced-ecg-expansion.mts requires DATABASE_URL.");

import { prisma } from "./lib/prisma-script-client";
import { buildAdvancedEcgExpansion } from "../src/lib/advanced-ecg/advanced-ecg-curated-pack-expansion";

async function main() {
  const rows = buildAdvancedEcgExpansion();
  console.log(`[seed-adv-ecg-expansion] Upserting ${rows.length} expansion questions...`);

  let upserted = 0;
  for (const row of rows) {
    const id = String(row.id ?? "");
    if (!id) continue;
    await prisma.ecgVideoQuestion.upsert({ where: { id }, create: row, update: row });
    upserted += 1;
  }

  const total = await prisma.ecgVideoQuestion.count();
  const advancedLV = await prisma.ecgVideoQuestion.count({
    where: { level: "advanced", qaStatus: "approved", publishSafetyStatus: "safe", clinicianReviewedAt: { not: null } },
  });
  console.log(`[seed-adv-ecg-expansion] Upserted: ${upserted}`);
  console.log(`[seed-adv-ecg-expansion] Total ECG questions: ${total} | Advanced learner-visible: ${advancedLV}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
