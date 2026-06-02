import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAdvancedQuestionExpansionDashboard,
  listAdvancedFormatTargets,
  listAdvancedNgnSeedQuestions,
  validateAdvancedQuestionQuality,
  type AdvancedQuestionProfession,
} from "./advanced-question-expansion";

const REQUIRED_PROFESSIONS: readonly AdvancedQuestionProfession[] = [
  "rn",
  "rpn-lpn",
  "np-cnple",
  "np-fnp",
  "np-agpcnp",
  "np-pmhnp",
  "np-pnp-pc",
  "np-whnp",
  "np-enp",
  "rt",
  "paramedic",
  "ot",
  "pt",
  "mlt",
];

test("advanced-format minimum targets match the expansion requirements", () => {
  const targets = listAdvancedFormatTargets();
  for (const profession of REQUIRED_PROFESSIONS) {
    assert.ok(targets.some((row) => row.profession === profession), `missing target for ${profession}`);
  }

  const rn = targets.find((row) => row.profession === "rn");
  assert.equal(rn?.sata, 5000);
  assert.equal(rn?.matrix, 2000);
  assert.equal(rn?.bowtie, 2000);

  const rpn = targets.find((row) => row.profession === "rpn-lpn");
  assert.equal(rpn?.sata, 3000);
  assert.equal(rpn?.matrix, 1500);
  assert.equal(rpn?.bowtie, 1500);

  for (const target of targets.filter((row) => row.profession.startsWith("np-"))) {
    assert.equal(target.sata, 1000);
    assert.equal(target.matrix, 500);
    assert.equal(target.bowtie, 500);
  }

  const rt = targets.find((row) => row.profession === "rt");
  const paramedic = targets.find((row) => row.profession === "paramedic");
  assert.equal(rt?.sata, 1500);
  assert.equal(paramedic?.sata, 1500);
});

test("seed questions are clinically realistic and pass advanced quality contracts", () => {
  for (const question of listAdvancedNgnSeedQuestions()) {
    assert.deepEqual(validateAdvancedQuestionQuality(question), [], question.id);
    assert.match(question.clinicalContext, /\b(client|patient|resident|adolescent|year-old)\b/i);
    assert.ok(question.detailedRationale.length > 200);
    assert.ok(question.clinicalPearl.length > 40);
    assert.ok(question.safetyAlert.length > 40);
  }
});

test("SATA seed items have multiple correct answers and plausible distractors", () => {
  const sataQuestions = listAdvancedNgnSeedQuestions().filter((item) => item.format === "sata");
  assert.ok(sataQuestions.length >= 2);
  for (const question of sataQuestions) {
    const correct = question.options?.filter((item) => item.correct).length ?? 0;
    const incorrect = question.options?.filter((item) => !item.correct).length ?? 0;
    assert.ok(correct >= 2, `${question.id} needs multiple correct answers`);
    assert.ok(incorrect >= 2, `${question.id} needs multiple distractors`);
  }
});

test("matrix questions test clinical discrimination, not trivial true false grids", () => {
  const matrixQuestions = listAdvancedNgnSeedQuestions().filter((item) => item.format === "matrix");
  assert.ok(matrixQuestions.length >= 3);
  for (const question of matrixQuestions) {
    const rows = question.matrixRows ?? [];
    assert.ok(rows.length >= 4);
    assert.ok(rows.some((row) => row.assessment === "critical"));
    assert.ok(rows.some((row) => row.intervention === "escalate"));
    assert.ok(rows.every((row) => row.rationale.length > 70));
  }
});

test("bowtie questions include NCJMM condition, findings, actions, monitoring, and complications", () => {
  const bowties = listAdvancedNgnSeedQuestions().filter((item) => item.format === "bowtie");
  assert.ok(bowties.length >= 2);
  for (const question of bowties) {
    assert.ok(question.bowtie);
    assert.ok(question.bowtie.assessmentFindings.length >= 3);
    assert.ok(question.bowtie.immediateActions.length >= 3);
    assert.ok(question.bowtie.monitoringPriorities.length >= 3);
    assert.ok(question.bowtie.complications.length >= 2);
    assert.match(question.bowtie.rationale, /\bcondition|risk|life-threatening|priority|unsafe|requires|because|not expected|must\b/i);
  }
});

test("dashboard reports readiness by profession, tier, question type, body system, and monetization", () => {
  const dashboard = buildAdvancedQuestionExpansionDashboard();
  assert.ok(dashboard.readinessByProfessionTierAndType.length > 0);
  assert.ok(dashboard.readinessByBodySystem.length > 0);
  assert.ok(dashboard.gaps.length > 0);
  assert.deepEqual(dashboard.qualityFailures, []);

  const rnSata = dashboard.readinessByProfessionTierAndType.find(
    (row) => row.profession === "rn" && row.tier === "tier-3" && row.questionType === "sata",
  );
  assert.equal(rnSata?.target, 5000);
  assert.equal(rnSata?.monetizationStatus, "review-gated");

  const bodySystems = dashboard.readinessByBodySystem.map((row) => row.bodySystem);
  assert.ok(bodySystems.includes("respiratory"));
  assert.ok(bodySystems.includes("maternal-newborn"));
  assert.ok(bodySystems.includes("laboratory"));
});
