import assert from "node:assert/strict";
import test from "node:test";
import {
  CLINICAL_REASONING_PATHWAYS,
  NCJMM_STEPS,
  PROFESSION_TRACKS,
  expertReasoningSummary,
  listClinicalReasoningPathways,
  scoreClinicalReasoningAttempt,
} from "@/lib/clinical-reasoning/clinical-reasoning-pathways-engine";

test("clinical reasoning pathways follow the NCJMM six-step model", () => {
  const pathway = CLINICAL_REASONING_PATHWAYS[0];
  assert.deepEqual(pathway.steps.map((step) => step.key), NCJMM_STEPS.map((step) => step.key));
  assert.equal(pathway.steps.length, 6);
  assert.ok(pathway.steps.every((step) => step.expertThinking.length > 50));
  assert.ok(pathway.steps.every((step) => step.noviceThinking.length > 50));
  assert.ok(pathway.steps.every((step) => step.breakpointQuestions.length >= 3));
});

test("clinical reasoning engine supports all requested professions", () => {
  assert.deepEqual(Object.keys(PROFESSION_TRACKS).sort(), [
    "mlt",
    "np",
    "ot",
    "paramedic",
    "psw",
    "pt",
    "rn",
    "rpn_lpn",
    "rt",
  ]);
  assert.ok(listClinicalReasoningPathways("rn").length >= 1);
  assert.ok(listClinicalReasoningPathways("rt").length >= 1);
  assert.ok(listClinicalReasoningPathways("psw").length >= 1);
});

test("best decisions produce a strong reasoning score", () => {
  const pathway = CLINICAL_REASONING_PATHWAYS[0];
  const selections = Object.fromEntries(
    pathway.steps.map((step) => [step.key, step.options.find((option) => option.quality === "best")?.id ?? ""]),
  );
  const score = scoreClinicalReasoningAttempt(pathway, { pathwayId: pathway.id, selections });
  assert.ok(score.overall >= 80);
  assert.equal(score.thinkingErrors.length, 0);
  assert.ok(score.outcomeSummary.every((line) => !line.includes("no decision")));
});

test("unsafe decisions identify thinking errors and consequences", () => {
  const pathway = CLINICAL_REASONING_PATHWAYS[0];
  const selections = Object.fromEntries(
    pathway.steps.map((step) => [step.key, step.options.find((option) => option.quality === "unsafe")?.id ?? step.options[0].id]),
  );
  const score = scoreClinicalReasoningAttempt(pathway, { pathwayId: pathway.id, selections });
  assert.ok(score.overall < 45);
  assert.ok(score.thinkingErrors.length >= 2);
  assert.match(score.outcomeSummary.join(" "), /Delayed|worsen|deteriorate/i);
});

test("expert reasoning summary is available for teaching mode", () => {
  const pathway = CLINICAL_REASONING_PATHWAYS[0];
  const summary = expertReasoningSummary(pathway);
  assert.equal(summary.length, 6);
  assert.match(summary.join(" "), /Recognize Cues/);
  assert.match(summary.join(" "), /Evaluate Outcomes/);
});
