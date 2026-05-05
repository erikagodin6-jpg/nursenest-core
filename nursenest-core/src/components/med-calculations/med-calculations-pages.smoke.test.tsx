import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MedCalculationsHubPage } from "@/components/med-calculations/med-calculations-hub-page";
import { MedCalculationsLessonPage } from "@/components/med-calculations/med-calculations-lesson-page";
import {
  buildMedCalcStudyLinks,
  countMedCalcInventoryForTrack,
  getMedCalcFlashcards,
  getMedCalcLessonByCategoryAndSlug,
  getMedCalcQuestions,
  listMedCalcCategoriesForTrack,
} from "@/lib/med-calculations/med-calculations-engine";

test("med calculations hub renders all core sections", () => {
  const html = renderToStaticMarkup(
    <MedCalculationsHubPage
      trackLabel="RN"
      hasAccess
      categories={listMedCalcCategoriesForTrack("rn")}
      inventory={countMedCalcInventoryForTrack("rn")}
      studyLinks={buildMedCalcStudyLinks("ca-rn-nclex-rn")}
    />,
  );

  assert.match(html, /High-stakes med calculations training/);
  assert.match(html, />Tablets</);
  assert.match(html, />Heparin protocols</);
  assert.match(html, /Strict practice mode/);
});

test("med calculations lesson renders structured teaching sections", () => {
  const lesson = getMedCalcLessonByCategoryAndSlug("heparin-protocols", "heparin-weight-based-protocols", "rn");
  assert.ok(lesson);

  const html = renderToStaticMarkup(
    <MedCalculationsLessonPage
      userId="test-user"
      lesson={lesson!}
      questions={getMedCalcQuestions(lesson!)}
      flashcards={getMedCalcFlashcards(lesson!)}
      hasAccess
      trackLabel="RN"
      studyLinks={buildMedCalcStudyLinks("ca-rn-nclex-rn", lesson!.questionTopic)}
    />,
  );

  assert.match(html, /Concept explanation/);
  assert.match(html, /Strict practice mode/);
  assert.match(html, /Heparin protocols/);
});
