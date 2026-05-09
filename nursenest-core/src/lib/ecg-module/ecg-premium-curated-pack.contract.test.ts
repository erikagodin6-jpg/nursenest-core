import assert from "node:assert/strict";
import test from "node:test";
import type { Prisma } from "@prisma/client";
import { buildEcgPremiumCuratedPack } from "@/lib/ecg-module/ecg-premium-curated-pack";
import { validateEcgStripClinicalConfig } from "@/lib/ecg-module/ecg-strip-clinical-validation";

function categoryCounts(rows: Prisma.EcgVideoQuestionCreateInput[]) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const tags = row.topicTags as string[];
    const cat = tags.find((t) => t.startsWith("category:"))?.replace("category:", "") ?? "unknown";
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }
  return map;
}

test("ECG premium curated pack: clinical strip validation passes for every item", () => {
  const pack = buildEcgPremiumCuratedPack();
  assert.ok(pack.length >= 40, `expected ≥40 curated items, got ${pack.length}`);

  for (const row of pack) {
    const rhythmTag = typeof row.rhythmTag === "string" ? row.rhythmTag : "";
    const result = validateEcgStripClinicalConfig(row.mediaConfig, {
      correctAnswer: rhythmTag,
      highRiskManualReviewed: Boolean(row.manualReviewedAt),
    });
    assert.equal(
      result.failures.length,
      0,
      `${row.id}: ${result.failures.join("; ") || "validation mismatch"}`,
    );
    assert.equal(result.needsManualReview, false, `${row.id}: unexpected manual review gate`);
  }
});

test("ECG premium curated pack: category coverage snapshot", () => {
  const pack = buildEcgPremiumCuratedPack();
  const counts = categoryCounts(pack);
  assert.equal((counts.get("rhythm_interpretation_mcq") ?? 0) >= 5, true);
  assert.equal((counts.get("waveform_identification_drill") ?? 0) >= 4, true);
  assert.equal((counts.get("ngn_ecg_case") ?? 0) >= 4, true);
  assert.equal((counts.get("telemetry_prioritization") ?? 0) >= 4, true);
  assert.equal((counts.get("medication_ecg_integration") ?? 0) >= 4, true);
  assert.equal((counts.get("acls_rhythm_progression") ?? 0) >= 4, true);
  assert.equal((counts.get("electrolyte_ecg") ?? 0) >= 4, true);
  assert.equal((counts.get("artifact_vs_true_rhythm") ?? 0) >= 4, true);
  assert.equal((counts.get("progressive_curated_set") ?? 0) >= 4, true);
});
