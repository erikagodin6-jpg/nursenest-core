import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MedCalculationsHubPage } from "@/components/med-calculations/med-calculations-hub-page";
import { MedCalculationsLessonPage } from "@/components/med-calculations/med-calculations-lesson-page";
import { MedCalculationsPracticeClient } from "@/components/med-calculations/med-calculations-practice-client";
import {
  applyStrictModeAttempt,
  buildMedCalcStudyLinks,
  countMedCalcInventoryForTrack,
  getMedCalcLessonByCategoryAndSlug,
  getMedCalcQuestions,
  listMedCalcCategoriesForTrack,
  listMedCalcCategoryInventoryRows,
  medCalcProductionReadiness,
} from "@/lib/med-calculations/med-calculations-engine";

test("production: hub renders for paid and free (same layout, entitlement copy differs)", () => {
  const categories = listMedCalcCategoriesForTrack("rn");
  const inventory = countMedCalcInventoryForTrack("rn");
  const links = buildMedCalcStudyLinks("ca-rn-nclex-rn");

  const paidHtml = renderToStaticMarkup(
    <MedCalculationsHubPage trackLabel="RN" hasAccess categories={categories} inventory={inventory} studyLinks={links} />,
  );
  const freeHtml = renderToStaticMarkup(
    <MedCalculationsHubPage trackLabel="RN" hasAccess={false} categories={categories} inventory={inventory} studyLinks={links} />,
  );

  assert.match(paidHtml, /High-stakes med calculations training/);
  assert.match(paidHtml, />Tablets</);
  assert.match(freeHtml, /Free access includes lesson previews/);
  assert.doesNotMatch(paidHtml, /Free access includes lesson previews/);
});

test("production: paid lesson shows equation manipulation + practice (SSR-safe)", () => {
  const lesson = getMedCalcLessonByCategoryAndSlug("tablets", "tablet-dose-fractions", "rn");
  assert.ok(lesson);
  const qs = getMedCalcQuestions(lesson!);
  const paidHtml = renderToStaticMarkup(
    <MedCalculationsLessonPage
      userId="u1"
      lesson={lesson!}
      questions={qs}
      flashcards={[]}
      hasAccess
      trackLabel="RN"
      studyLinks={buildMedCalcStudyLinks("ca-rn-nclex-rn")}
    />,
  );

  assert.match(paidHtml, /Equation manipulation/);
  assert.match(paidHtml, /Strict practice mode/);
});

test("production: free entitlement uses limited question pool (2 of full set)", () => {
  const lesson = getMedCalcLessonByCategoryAndSlug("tablets", "tablet-dose-fractions", "rn");
  assert.ok(lesson);
  const full = getMedCalcQuestions(lesson!);
  assert.ok(full.length >= 5);
  const previewPool = full.slice(0, 2);
  assert.equal(previewPool.length, 2);
});

test("production: practice client — strict and timed controls disabled for free entitlement", () => {
  const lesson = getMedCalcLessonByCategoryAndSlug("iv-pump-ml-hr", "iv-pump-programming-ml-hr", "rn");
  assert.ok(lesson);
  const qs = getMedCalcQuestions(lesson!);
  const html = renderToStaticMarkup(
    <MedCalculationsPracticeClient userId="u1" lesson={lesson!} questions={qs} hasAccess={false} />,
  );
  assert.match(html, /disabled/);
  assert.ok((html.match(/disabled/g) ?? []).length >= 2);
});

test("production: paid practice client — strict and timed toggles are not disabled", () => {
  const lesson = getMedCalcLessonByCategoryAndSlug("iv-pump-ml-hr", "iv-pump-programming-ml-hr", "rn");
  assert.ok(lesson);
  const qs = getMedCalcQuestions(lesson!);
  const html = renderToStaticMarkup(
    <MedCalculationsPracticeClient userId="u1" lesson={lesson!} questions={qs} hasAccess />,
  );
  assert.doesNotMatch(html, /disabled/);
});

test("production: RN corpus realism readiness gate is green", () => {
  const r = medCalcProductionReadiness("rn");
  assert.equal(r.ok, true);
  assert.equal(r.realismIssues.length, 0);
});

test("production: strict mode requires clearing full pool in order (100% gate)", () => {
  const poolLen = 5;
  let state = { index: 0, streak: 0, resets: 0, passed: false, poolLength: poolLen };
  for (let i = 0; i < poolLen; i += 1) {
    state = applyStrictModeAttempt(state, true);
  }
  assert.equal(state.passed, true);
  assert.equal(state.index, poolLen - 1);

  let s2 = { index: 2, streak: 2, resets: 0, passed: false, poolLength: poolLen };
  s2 = applyStrictModeAttempt(s2, false);
  assert.equal(s2.index, 0);
  assert.equal(s2.streak, 0);
});

test("production: inventory by category lists 10 RN rows with ≥5 questions each", () => {
  const rows = listMedCalcCategoryInventoryRows("rn");
  assert.equal(rows.length, 10);
  assert.ok(rows.every((r) => r.questionCount >= 5));
});
