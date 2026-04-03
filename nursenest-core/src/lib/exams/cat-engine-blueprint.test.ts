import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCatReport,
  coerceCatBlueprintDiagnostics,
  createInitialAdaptiveState,
  mergeBlueprintDiagnosticsPostScore,
  validateCatQuestionPool,
  type CatPoolRow,
} from "@/lib/exams/cat-engine";
import type { CatAdaptiveState, CatAnswerResult } from "@/lib/exams/cat-types";
import { NCLEX_RN_US_EXAM_CONFIG } from "@/lib/exams/exam-config";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { createCatPracticeTestPayload } from "@/lib/practice-tests/cat-session";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

describe("mergeBlueprintDiagnosticsPostScore", () => {
  it("recomputes sessionMappedFraction after each scored result (replay-style)", () => {
    const baseDiag = {
      examConfigId: NCLEX_RN_US_EXAM_CONFIG.id,
      poolCountsByBlueprintKey: { a: 5 },
      sessionCountsByBlueprintKey: {},
      poolMappedFraction: 0.8,
      sessionMappedFraction: 0,
    };
    const r1: CatAnswerResult = {
      questionId: "q1",
      correct: true,
      categoryKey: "k",
      difficulty: 3,
      blueprintMappingSource: "fallback",
    };
    const r2: CatAnswerResult = {
      questionId: "q2",
      correct: true,
      categoryKey: "k",
      difficulty: 3,
      blueprintMappingSource: "nclex_client_needs",
    };
    const m1 = mergeBlueprintDiagnosticsPostScore(baseDiag, [r1]);
    assert.equal(m1.sessionMappedFraction, 0);
    const m2 = mergeBlueprintDiagnosticsPostScore(baseDiag, [r1, r2]);
    assert.equal(m2.sessionMappedFraction, 0.5);
  });
});

describe("coerceCatBlueprintDiagnostics", () => {
  it("fills defaults when optional blueprint fields are missing (loose JSON)", () => {
    const raw = {
      examConfigId: "nclex-rn-us",
      poolCountsByBlueprintKey: { x: 2 },
    };
    const d = coerceCatBlueprintDiagnostics(raw);
    assert.ok(d);
    assert.equal(d!.examConfigId, "nclex-rn-us");
    assert.equal(d!.poolMappedFraction, 0);
    assert.equal(d!.sessionMappedFraction, 0);
    assert.deepEqual(d!.sessionCountsByBlueprintKey, {});
  });

  it("returns undefined when examConfigId is absent", () => {
    assert.equal(coerceCatBlueprintDiagnostics({ poolMappedFraction: 1 }), undefined);
  });
});

describe("buildCatReport blueprintAdminDiagnostics", () => {
  it("attaches admin diagnostics and warnings for low session mapping", () => {
    const results: CatAnswerResult[] = [
      {
        questionId: "1",
        correct: true,
        categoryKey: "G",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      },
      {
        questionId: "2",
        correct: true,
        categoryKey: "G",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      },
    ];
    const state: CatAdaptiveState = {
      ...createInitialAdaptiveState(),
      results,
      catPresentationMode: "exam_simulation",
      catBlueprintDiagnostics: {
        examConfigId: NCLEX_RN_US_EXAM_CONFIG.id,
        poolCountsByBlueprintKey: { G: 10 },
        sessionCountsByBlueprintKey: {},
        poolMappedFraction: 0.5,
        sessionMappedFraction: 0,
      },
    };
    const report = buildCatReport(state);
    assert.ok(report.blueprintAdminDiagnostics);
    assert.ok(report.blueprintAdminDiagnostics!.mappingQualityWarnings.length >= 1);
    assert.ok(
      report.blueprintAdminDiagnostics!.mappingQualityWarnings.some((w) => w.code === "exam_sim_pool_mapping_low"),
    );
    assert.ok(
      report.blueprintAdminDiagnostics!.mappingQualityWarnings.some((w) => w.code === "session_delivered_mapping_low"),
    );
    assert.equal(report.blueprintAdminDiagnostics!.fallbackDistributionDelivered.length, 1);
    assert.equal(report.blueprintAdminDiagnostics!.fallbackDistributionDelivered[0]!.blueprintKey, "G");
    assert.equal(report.blueprintAdminDiagnostics!.qualityThresholds.poolMappedFractionWarning, 0.9);
  });
});

describe("finalize-style replay (incremental merge)", () => {
  it("matches per-step mergeBlueprintDiagnosticsPostScore after each appended result", () => {
    const baseDiag = {
      examConfigId: NCLEX_RN_US_EXAM_CONFIG.id,
      poolCountsByBlueprintKey: { x: 1 },
      sessionCountsByBlueprintKey: {},
      poolMappedFraction: 1,
      sessionMappedFraction: 0,
    };
    const acc: CatAnswerResult[] = [];
    const step = (r: CatAnswerResult) => {
      acc.push(r);
      return mergeBlueprintDiagnosticsPostScore(baseDiag, acc);
    };
    step({
      questionId: "a",
      correct: true,
      categoryKey: "F",
      difficulty: 3,
      blueprintMappingSource: "fallback",
    });
    const mid = step({
      questionId: "b",
      correct: true,
      categoryKey: "N",
      difficulty: 3,
      blueprintMappingSource: "nclex_client_needs",
    });
    assert.equal(mid.sessionMappedFraction, 0.5);
    assert.equal(mid.sessionCountsByBlueprintKey["F"], 1);
    assert.equal(mid.sessionCountsByBlueprintKey["N"], 1);
  });
});

describe("validateCatQuestionPool", () => {
  it("returns cat_pool_invalid-compatible message when pool is too small", () => {
    const rows: CatPoolRow[] = Array.from({ length: 10 }, (_, i) => ({
      id: `id-${i}`,
      difficulty: 3,
      bodySystem: "S",
      topic: "T",
    }));
    const v = validateCatQuestionPool(rows, { minPoolSize: 75 });
    assert.equal(v.ok, false);
    assert.ok(v.ok === false && v.error.includes("75"));
  });
});

describe("createCatPracticeTestPayload (no DB path)", () => {
  it("returns exam_sim_unsupported_pathway for NCLEX-PN pathway before pool fetch", async () => {
    const entitlement: AccessScope = {
      hasAccess: true,
      reason: "admin_override",
      tier: "RN",
      country: "US",
    };
    const out = await createCatPracticeTestPayload(
      "test-user",
      entitlement,
      "random",
      {
        questionCount: 85,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: "us-lpn-nclex-pn",
      },
      false,
      null,
      "exam_simulation",
    );
    assert.equal(out.ok, false);
    assert.equal(out.ok === false && out.code, PRACTICE_TEST_CAT_CREATE_CODE.exam_sim_unsupported_pathway);
  });
});

describe("PRACTICE_TEST_CAT_CREATE_CODE", () => {
  it("aligns with API contract strings", () => {
    assert.equal(PRACTICE_TEST_CAT_CREATE_CODE.exam_sim_disabled, "exam_sim_disabled");
    assert.equal(PRACTICE_TEST_CAT_CREATE_CODE.exam_sim_unsupported_pathway, "exam_sim_unsupported_pathway");
    assert.equal(PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found, "pathway_not_found");
    assert.equal(PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled, "pathway_not_entitled");
    assert.equal(PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid, "cat_pool_invalid");
    assert.equal(PRACTICE_TEST_CAT_CREATE_CODE.cat_pick_failed, "cat_pick_failed");
  });
});
