import assert from "node:assert/strict";
import test from "node:test";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";

test("US NCLEX-RN context is conventional, RN, entry-level scope", () => {
  const ctx = buildGlobalExamContext("us-rn-nclex-rn", "en");
  assert.ok(ctx);
  assert.equal(ctx.examType, "NCLEX_RN");
  assert.equal(ctx.nursingRole, "RN");
  assert.equal(ctx.scopeLevel, "entry_level");
  assert.equal(ctx.unitSystem, "CON");
  assert.equal(ctx.measurementSystem, "US");
  assert.equal(ctx.difficultyTier, "tier2_clinical_judgment");
});

test("US NCLEX-PN context is conventional and foundational PN scope", () => {
  const ctx = buildGlobalExamContext("us-lpn-nclex-pn", "en");
  assert.ok(ctx);
  assert.equal(ctx.examType, "NCLEX_PN");
  assert.equal(ctx.nursingRole, "PN");
  assert.equal(ctx.scopeLevel, "foundational");
  assert.equal(ctx.unitSystem, "CON");
  assert.equal(ctx.measurementSystem, "US");
  assert.equal(ctx.difficultyTier, "tier1_foundational");
});

test("Canada REx-PN context is SI and foundational RPN scope", () => {
  const ctx = buildGlobalExamContext("ca-rpn-rex-pn", "en");
  assert.ok(ctx);
  assert.equal(ctx.examType, "REX_PN");
  assert.equal(ctx.nursingRole, "RPN");
  assert.equal(ctx.scopeLevel, "foundational");
  assert.equal(ctx.unitSystem, "SI");
  assert.equal(ctx.measurementSystem, "SI");
  assert.equal(ctx.difficultyTier, "tier1_foundational");
});

test("NP specialty context carries advanced-practice metadata", () => {
  const ctx = buildGlobalExamContext("us-np-pmhnp", "en");
  assert.ok(ctx);
  assert.equal(ctx.examType, "PMHNP");
  assert.equal(ctx.nursingRole, "NP");
  assert.equal(ctx.scopeLevel, "advanced_practice");
  assert.equal(ctx.specialty, "pmhnp");
  assert.equal(ctx.clinicalJudgmentLevel, "advanced_diagnostic");
  assert.equal(ctx.difficultyTier, "tier3_advanced");
});
