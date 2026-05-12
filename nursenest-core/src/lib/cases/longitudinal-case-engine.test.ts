/**
 * Longitudinal case engine tests.
 * Run: `npx tsx --test src/lib/cases/longitudinal-case-engine.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildStepPayload,
  processStepAdvance,
  computeScore,
  parseDecisionsJson,
  isValidOptionId,
  classifyReadiness,
} from "@/lib/cases/longitudinal-case-engine";
import { CASE_HYPERTENSION_FOLLOWUP, CNPLE_SAMPLE_CASES } from "@/content/cases/cnple-sample-cases";
import type { CaseDecisionRecord } from "@/lib/cases/longitudinal-case-types";

// ── Sample case integrity ─────────────────────────────────────────────────────

describe("CNPLE sample case integrity", () => {
  it("has at least one sample case", () => {
    assert.ok(CNPLE_SAMPLE_CASES.length >= 1);
  });

  it("hypertension case has correct step count", () => {
    assert.equal(CASE_HYPERTENSION_FOLLOWUP.steps.length, 4);
    assert.equal(CASE_HYPERTENSION_FOLLOWUP.stepCount, 4);
  });

  it("all steps have valid correctOptionId in their options list", () => {
    for (const step of CASE_HYPERTENSION_FOLLOWUP.steps) {
      const ids = step.question.options.map((o) => o.id);
      assert.ok(
        ids.includes(step.question.correctOptionId),
        `Step ${step.index} correctOptionId "${step.question.correctOptionId}" not in options: [${ids.join(", ")}]`,
      );
    }
  });

  it("all steps have non-empty rationale and at least 2 options", () => {
    for (const step of CASE_HYPERTENSION_FOLLOWUP.steps) {
      assert.ok(step.question.rationale.length > 40, `Step ${step.index} rationale too short`);
      assert.ok(step.question.options.length >= 2, `Step ${step.index} has fewer than 2 options`);
    }
  });

  it("all steps have whyWrong entries for each incorrect option", () => {
    for (const step of CASE_HYPERTENSION_FOLLOWUP.steps) {
      const wrongIds = step.question.options
        .map((o) => o.id)
        .filter((id) => id !== step.question.correctOptionId);
      for (const id of wrongIds) {
        assert.ok(
          step.question.whyWrongByOptionId[id],
          `Step ${step.index} missing whyWrong for option ${id}`,
        );
      }
    }
  });

  it("all steps have consequences for every option", () => {
    for (const step of CASE_HYPERTENSION_FOLLOWUP.steps) {
      for (const opt of step.question.options) {
        assert.ok(
          step.question.consequencesByOptionId[opt.id],
          `Step ${step.index} missing consequence for option ${opt.id}`,
        );
      }
    }
  });

  it("case is not labelled CAT or ANCC/AANP in its content", () => {
    const allText = CASE_HYPERTENSION_FOLLOWUP.steps
      .map((s) => [s.scenarioText, s.question.stem, s.question.rationale].join(" "))
      .join(" ");
    assert.doesNotMatch(allText, /\bcnple\b.{0,60}\bcat\b/i);
    assert.doesNotMatch(allText, /\b(?:aanp|ancc)\b.{0,80}\bcnple\b/i);
  });
});

// ── buildStepPayload ──────────────────────────────────────────────────────────

describe("buildStepPayload", () => {
  it("strips correctOptionId in PRACTICE mode", () => {
    const payload = buildStepPayload("sess-1", CASE_HYPERTENSION_FOLLOWUP, 0, "PRACTICE");
    assert.equal(payload.stepIndex, 0);
    assert.equal(payload.mode, "PRACTICE");
    // correctOptionId must not be in the public question
    const q = payload.step.question as Record<string, unknown>;
    assert.equal(q.correctOptionId, undefined, "correctOptionId must be stripped from public payload");
    assert.equal(q.rationale, undefined, "rationale must be stripped from public payload");
  });

  it("strips correctOptionId in SIMULATION mode", () => {
    const payload = buildStepPayload("sess-2", CASE_HYPERTENSION_FOLLOWUP, 0, "SIMULATION");
    const q = payload.step.question as Record<string, unknown>;
    assert.equal(q.correctOptionId, undefined);
  });

  it("isLastStep is true for the last step", () => {
    const lastIdx = CASE_HYPERTENSION_FOLLOWUP.steps.length - 1;
    const payload = buildStepPayload("sess-3", CASE_HYPERTENSION_FOLLOWUP, lastIdx, "PRACTICE");
    assert.equal(payload.isLastStep, true);
  });

  it("isLastStep is false for non-last steps", () => {
    const payload = buildStepPayload("sess-4", CASE_HYPERTENSION_FOLLOWUP, 0, "PRACTICE");
    assert.equal(payload.isLastStep, false);
  });

  it("throws for out-of-bounds step index", () => {
    assert.throws(() => buildStepPayload("sess-5", CASE_HYPERTENSION_FOLLOWUP, 99, "PRACTICE"));
  });
});

// ── processStepAdvance ────────────────────────────────────────────────────────

describe("processStepAdvance — PRACTICE mode", () => {
  it("returns isCorrect=true when correct option chosen", () => {
    const step = CASE_HYPERTENSION_FOLLOWUP.steps[0]!;
    const result = processStepAdvance(
      "sess-a",
      CASE_HYPERTENSION_FOLLOWUP,
      0,
      step.question.correctOptionId,
      "PRACTICE",
      [],
    );
    assert.equal(result.isCorrect, true);
    assert.ok(result.rationale, "Practice mode must return rationale");
    assert.equal(result.whyWrong, null, "No whyWrong when correct");
    assert.ok(result.correctOptionId, "Practice mode must return correctOptionId");
  });

  it("returns isCorrect=false and whyWrong for wrong option", () => {
    const step = CASE_HYPERTENSION_FOLLOWUP.steps[0]!;
    const wrongId = step.question.options.find((o) => o.id !== step.question.correctOptionId)!.id;
    const result = processStepAdvance(
      "sess-b",
      CASE_HYPERTENSION_FOLLOWUP,
      0,
      wrongId,
      "PRACTICE",
      [],
    );
    assert.equal(result.isCorrect, false);
    assert.ok(result.whyWrong, "Practice mode must return whyWrong for incorrect answer");
    assert.ok(result.rationale, "Practice mode must return rationale even for wrong answer");
  });

  it("returns nextStep for non-final steps", () => {
    const step = CASE_HYPERTENSION_FOLLOWUP.steps[0]!;
    const result = processStepAdvance(
      "sess-c",
      CASE_HYPERTENSION_FOLLOWUP,
      0,
      step.question.correctOptionId,
      "PRACTICE",
      [],
    );
    assert.ok(result.nextStep, "Non-final step must return nextStep payload");
    assert.equal(result.completed, false);
    assert.equal(result.score, null);
  });

  it("returns completed=true and score for last step", () => {
    const lastIdx = CASE_HYPERTENSION_FOLLOWUP.steps.length - 1;
    const lastStep = CASE_HYPERTENSION_FOLLOWUP.steps[lastIdx]!;
    const priorDecisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps
      .slice(0, lastIdx)
      .map((s, i) => ({
        stepIndex: i,
        chosenOptionId: s.question.correctOptionId,
        isCorrect: true,
        cnpleDomainSlug: s.cnpleDomain,
        trajectory: "optimal" as const,
      }));
    const result = processStepAdvance(
      "sess-d",
      CASE_HYPERTENSION_FOLLOWUP,
      lastIdx,
      lastStep.question.correctOptionId,
      "PRACTICE",
      priorDecisions,
    );
    assert.equal(result.completed, true);
    assert.ok(result.score, "Last step must return score");
    assert.equal(result.nextStep, null);
  });
});

describe("processStepAdvance — SIMULATION mode", () => {
  it("withholds rationale and correctOptionId", () => {
    const step = CASE_HYPERTENSION_FOLLOWUP.steps[0]!;
    const result = processStepAdvance(
      "sess-sim",
      CASE_HYPERTENSION_FOLLOWUP,
      0,
      step.question.correctOptionId,
      "SIMULATION",
      [],
    );
    assert.equal(result.rationale, null, "SIMULATION mode must withhold rationale");
    assert.equal(result.whyWrong, null, "SIMULATION mode must withhold whyWrong");
    assert.equal(result.correctOptionId, null, "SIMULATION mode must withhold correctOptionId");
  });
});

// ── computeScore ──────────────────────────────────────────────────────────────

describe("computeScore", () => {
  it("100% score when all steps correct", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i,
      chosenOptionId: s.question.correctOptionId,
      isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain,
      trajectory: "optimal",
    }));
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    assert.equal(score.score0to100, 100);
    assert.equal(score.correctCount, 4);
    assert.equal(score.weakDomains.length, 0);
    assert.ok(score.strongDomains.length > 0);
  });

  it("0% score when all steps wrong", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => {
      const wrongId = s.question.options.find((o) => o.id !== s.question.correctOptionId)!.id;
      return {
        stepIndex: i,
        chosenOptionId: wrongId,
        isCorrect: false,
        cnpleDomainSlug: s.cnpleDomain,
        trajectory: "suboptimal",
      };
    });
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    assert.equal(score.score0to100, 0);
    assert.equal(score.correctCount, 0);
    assert.ok(score.weakDomains.length > 0);
  });

  it("partial score computes correctly", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i,
      chosenOptionId: i < 2 ? s.question.correctOptionId : s.question.options.find((o) => o.id !== s.question.correctOptionId)!.id,
      isCorrect: i < 2,
      cnpleDomainSlug: s.cnpleDomain,
      trajectory: i < 2 ? "optimal" : "suboptimal",
    }));
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    assert.equal(score.score0to100, 50); // 2/4 = 50%
  });

  it("recommendations are non-empty for any score", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i,
      chosenOptionId: s.question.correctOptionId,
      isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain,
      trajectory: "optimal",
    }));
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    assert.ok(score.recommendations.length > 0);
  });
});

// ── parseDecisionsJson ────────────────────────────────────────────────────────

describe("parseDecisionsJson", () => {
  it("returns empty array for non-array input", () => {
    assert.deepEqual(parseDecisionsJson(null), []);
    assert.deepEqual(parseDecisionsJson(""), []);
    assert.deepEqual(parseDecisionsJson({}), []);
  });

  it("parses valid decision records", () => {
    const raw = [
      { stepIndex: 0, chosenOptionId: "B", isCorrect: true, cnpleDomainSlug: "chronic-disease-management", trajectory: "optimal" },
    ];
    const result = parseDecisionsJson(raw);
    assert.equal(result.length, 1);
    assert.equal(result[0]?.chosenOptionId, "B");
  });

  it("filters out malformed entries", () => {
    const raw = [
      { stepIndex: 0, chosenOptionId: "B" },
      { notADecision: true },
      null,
      { stepIndex: 1, chosenOptionId: "A", isCorrect: false, cnpleDomainSlug: "pharmacotherapeutics", trajectory: "harmful" },
    ];
    const result = parseDecisionsJson(raw);
    assert.equal(result.length, 2);
  });
});

// ── isValidOptionId ───────────────────────────────────────────────────────────

describe("isValidOptionId", () => {
  it("returns true for valid option ID", () => {
    const step = CASE_HYPERTENSION_FOLLOWUP.steps[0]!;
    assert.equal(isValidOptionId(step, "A"), true);
    assert.equal(isValidOptionId(step, "B"), true);
  });

  it("returns false for invalid option ID", () => {
    const step = CASE_HYPERTENSION_FOLLOWUP.steps[0]!;
    assert.equal(isValidOptionId(step, "Z"), false);
    assert.equal(isValidOptionId(step, ""), false);
  });
});

// ── classifyReadiness ─────────────────────────────────────────────────────────

describe("classifyReadiness", () => {
  it("returns 'ready' for scores >= 80", () => {
    assert.equal(classifyReadiness(80), "ready");
    assert.equal(classifyReadiness(100), "ready");
  });

  it("returns 'approaching' for 65–79", () => {
    assert.equal(classifyReadiness(65), "approaching");
    assert.equal(classifyReadiness(79), "approaching");
  });

  it("returns 'developing' for 45–64", () => {
    assert.equal(classifyReadiness(45), "developing");
    assert.equal(classifyReadiness(64), "developing");
  });

  it("returns 'not_ready' for < 45", () => {
    assert.equal(classifyReadiness(0), "not_ready");
    assert.equal(classifyReadiness(44), "not_ready");
  });
});
