import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCatBlueprintAdminDiagnostics,
  buildMappingQualityWarnings,
  CAT_BLUEPRINT_WARN_POOL_EXAM_SIM_FRACTION,
  CAT_BLUEPRINT_WARN_SESSION_DELIVERED_FRACTION,
  sessionMappedFractionFromResultsLocal,
} from "@/lib/exams/cat-blueprint-mapping-quality";
import type { CatAnswerResult } from "@/lib/exams/cat-types";

describe("sessionMappedFractionFromResultsLocal", () => {
  it("updates as mapped answers accumulate (NCLEX + AANP tags)", () => {
    const a: CatAnswerResult = {
      questionId: "1",
      correct: true,
      categoryKey: "k1",
      difficulty: 3,
      blueprintMappingSource: "nclex_client_needs",
    };
    const b: CatAnswerResult = {
      questionId: "2",
      correct: false,
      categoryKey: "k2",
      difficulty: 3,
      blueprintMappingSource: "fallback",
    };
    const c: CatAnswerResult = {
      questionId: "3",
      correct: true,
      categoryKey: "aanp-assessment-diagnosis",
      difficulty: 3,
      blueprintMappingSource: "aanp_blueprint",
    };
    assert.equal(sessionMappedFractionFromResultsLocal([a]), 1);
    assert.equal(sessionMappedFractionFromResultsLocal([a, b]), 0.5);
    assert.equal(sessionMappedFractionFromResultsLocal([a, b, c]), 2 / 3);
  });
});

describe("buildMappingQualityWarnings", () => {
  it("flags exam simulation pool under threshold", () => {
    const w = buildMappingQualityWarnings({
      poolMappedFraction: 0.5,
      sessionMappedFraction: 1,
      scoredCount: 0,
      presentationMode: "exam_simulation",
    });
    assert.ok(w.some((x) => x.code === "exam_sim_pool_mapping_low"));
  });

  it("flags delivered session under threshold when scored", () => {
    const w = buildMappingQualityWarnings({
      poolMappedFraction: 1,
      sessionMappedFraction: 0.2,
      scoredCount: 5,
      presentationMode: "practice",
    });
    assert.ok(w.some((x) => x.code === "session_delivered_mapping_low"));
  });
});

describe("buildCatBlueprintAdminDiagnostics", () => {
  it("counts fallback keys and lists top fallback blueprint keys", () => {
    const results: CatAnswerResult[] = [
      {
        questionId: "1",
        correct: true,
        categoryKey: "Cardiac",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      },
      {
        questionId: "2",
        correct: true,
        categoryKey: "Cardiac",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      },
      {
        questionId: "3",
        correct: true,
        categoryKey: "Pharm",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      },
      {
        questionId: "4",
        correct: true,
        categoryKey: "x",
        difficulty: 3,
        blueprintMappingSource: "nclex_client_needs",
      },
    ];
    const admin = buildCatBlueprintAdminDiagnostics({
      results,
      poolMappedFraction: 0.95,
      presentationMode: "practice",
    });
    assert.equal(admin.deliveredMappedCount, 1);
    assert.equal(admin.deliveredFallbackCount, 3);
    assert.equal(admin.topFallbackBlueprintKeysDelivered[0]?.blueprintKey, "Cardiac");
    assert.equal(admin.topFallbackBlueprintKeysDelivered[0]?.count, 2);
    assert.equal(admin.qualityThresholds.poolMappedFractionWarning, 0.9);
    assert.equal(admin.qualityThresholds.sessionMappedFractionWarning, 0.85);
    assert.equal(admin.deliveredPercentMapped, 25);
    assert.equal(admin.deliveredPercentFallback, 75);
    const cardiac = admin.fallbackDistributionDelivered.find((e) => e.blueprintKey === "Cardiac");
    assert.ok(cardiac);
    assert.equal(cardiac!.count, 2);
    assert.equal(cardiac!.percentOfFallbackItems, 66.67);
    assert.equal(cardiac!.percentOfTotalScored, 50);
  });
});

describe("threshold constants", () => {
  it("matches spec (exam pool 0.90, session 0.85)", () => {
    assert.equal(CAT_BLUEPRINT_WARN_POOL_EXAM_SIM_FRACTION, 0.9);
    assert.equal(CAT_BLUEPRINT_WARN_SESSION_DELIVERED_FRACTION, 0.85);
  });
});
