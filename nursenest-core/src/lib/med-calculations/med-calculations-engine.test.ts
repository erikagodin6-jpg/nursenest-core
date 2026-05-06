import assert from "node:assert/strict";
import test from "node:test";
import { TierCode } from "@prisma/client";
import {
  applyStrictModeAttempt,
  buildMedCalcStudyLinks,
  countMedCalcInventoryForTrack,
  evaluateMedCalcAnswer,
  getMedCalcLessonByCategoryAndSlug,
  getMedCalcQuestions,
  listMedCalcCategoriesForTrack,
  listMedCalcCategoryInventoryRows,
  medCalcProductionReadiness,
  medCalcTrackFromTier,
  validateMedCalcInventory,
} from "@/lib/med-calculations/med-calculations-engine";

test("med calculations hub categories are populated", () => {
  const categories = listMedCalcCategoriesForTrack("rn");
  assert.equal(categories.length, 10);
  assert.ok(categories.every((category) => category.lessons.length >= 1));
});

test("every med calculations lesson has question inventory and realism passes", () => {
  assert.deepEqual(validateMedCalcInventory("rn"), []);
  for (const category of listMedCalcCategoriesForTrack("rn")) {
    for (const lesson of category.lessons) {
      assert.ok(lesson.dimensionalAnalysisMethod.length >= 1);
      assert.ok(lesson.ratioProportionMethod.length >= 1);
      assert.ok(lesson.formulaMethod.length >= 1);
      assert.ok(lesson.equationManipulation.length >= 2);
      assert.ok(lesson.unitConversions.length >= 1);
      assert.ok(lesson.workedExamples.length >= 1);
      assert.ok(getMedCalcQuestions(lesson).length >= 5);
    }
  }
});

test("numeric answer validation enforces rounding and exact answers", () => {
  const lesson = getMedCalcLessonByCategoryAndSlug("iv-flow-rates", "gravity-iv-flow-rates", "rn");
  assert.ok(lesson);
  const question = getMedCalcQuestions(lesson!)[0]!;

  const wrong = evaluateMedCalcAnswer(question, "31.25");
  assert.equal(wrong.accepted, false);
  assert.ok(wrong.mistakes.some((msg) => /whole gtt\/min/i.test(msg)));

  const right = evaluateMedCalcAnswer(question, "31");
  assert.equal(right.accepted, true);
});

test("strict mode resets on an incorrect answer and passes only at 100 percent", () => {
  const start = { index: 0, streak: 0, resets: 0, passed: false, poolLength: 4 };
  const correct1 = applyStrictModeAttempt(start, true);
  assert.deepEqual(correct1, { index: 1, streak: 1, resets: 0, passed: false, poolLength: 4 });

  const miss = applyStrictModeAttempt(correct1, false);
  assert.deepEqual(miss, { index: 0, streak: 0, resets: 1, passed: false, poolLength: 4 });

  const nearEnd = { index: 3, streak: 3, resets: 0, passed: false, poolLength: 4 };
  const pass = applyStrictModeAttempt(nearEnd, true);
  assert.equal(pass.passed, true);
});

test("study links connect to existing study systems", () => {
  const links = buildMedCalcStudyLinks("ca-rn-nclex-rn", "heparin");
  assert.equal(links.flashcardsHref, "/app/flashcards?pathwayId=ca-rn-nclex-rn&topicCode=heparin");
  assert.equal(links.questionsHref, "/app/questions?pathwayId=ca-rn-nclex-rn&topic=heparin");
  assert.match(links.catHref, /\/app\/practice-tests/);
  assert.equal(links.medicationDrillsHref, "/app/medication-drills?pathwayId=ca-rn-nclex-rn");
});

test("inventory counts are non-empty and tier mapping remains stable", () => {
  const inventory = countMedCalcInventoryForTrack("rn");
  assert.ok(inventory.categoryCount >= 10);
  assert.ok(inventory.lessonCount >= 10);
  assert.ok(inventory.questionCount >= 50);

  assert.equal(medCalcTrackFromTier(TierCode.RN), "rn");
  assert.equal(medCalcTrackFromTier(TierCode.RPN), "pn");
  assert.equal(medCalcTrackFromTier(TierCode.NP), "np");
});

test("category inventory rows reconcile with aggregate totals", () => {
  const inventory = countMedCalcInventoryForTrack("rn");
  const rows = listMedCalcCategoryInventoryRows("rn");
  assert.equal(rows.length, inventory.categoryCount);
  const sumQuestions = rows.reduce((s, r) => s + r.questionCount, 0);
  const sumFlash = rows.reduce((s, r) => s + r.flashcardCount, 0);
  assert.equal(sumQuestions, inventory.questionCount);
  assert.equal(sumFlash, inventory.flashcardCount);
  assert.ok(rows.every((r) => r.questionCount >= 5 && r.lessonCount >= 1));
});

test("production readiness passes for RN inventory", () => {
  const readiness = medCalcProductionReadiness("rn");
  assert.equal(readiness.ok, true);
  assert.deepEqual(readiness.realismIssues, []);
});

test("production readiness passes for PN and NP inventory", () => {
  for (const track of ["pn", "np"] as const) {
    const readiness = medCalcProductionReadiness(track);
    assert.equal(readiness.ok, true, `${track} realism: ${readiness.realismIssues.join("; ")}`);
  }
});
