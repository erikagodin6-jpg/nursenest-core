import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LabLessonArticle, LabLessonPreview } from "@/components/labs/lab-lesson-page";
import { LabsHubPage } from "@/components/labs/labs-hub-page";
import {
  buildLabsStudyLinks,
  countLabsInventoryForTrack,
  getLabLessonByCategoryAndSlug,
  getLabLessonFlashcards,
  getLabLessonQuestions,
  listLabCategoriesForTrack,
} from "@/lib/labs/labs-engine";

test("labs hub renders categories and study-loop entry points", () => {
  const html = renderToStaticMarkup(
    <LabsHubPage
      trackLabel="RN"
      labTrack="rn"
      hasAccess
      categories={listLabCategoriesForTrack("rn")}
      inventory={countLabsInventoryForTrack("rn")}
      studyLinks={buildLabsStudyLinks("ca-rn-nclex-rn")}
    />,
  );

  assert.match(html, /Labs clinical reasoning engine/);
  assert.match(html, />Electrolytes</);
  assert.match(html, />ABGs</);
  assert.match(html, /Pathway lessons/);
  assert.match(html, /Flashcards/);
  assert.match(html, /Practice questions/);
  assert.match(html, /Practice tests/);
  assert.match(html, />\s*Start\s*</);
  assert.match(html, /Lab drills/);
  assert.match(html, /RN focus/);
});

test("lab lesson article renders full premium structure", () => {
  const lesson = getLabLessonByCategoryAndSlug("renal", "creatinine-bun-aki-patterns", "rn");
  assert.ok(lesson);

  const html = renderToStaticMarkup(
    <LabLessonArticle lesson={lesson!} flashcards={getLabLessonFlashcards(lesson!)} labTrack="rn" measurementSystem="US" />,
  );

  assert.match(html, /Normal range and physiology/);
  assert.match(html, /Step-by-step treatment algorithm/);
  assert.match(html, /Trend interpretation/);
  assert.match(html, /Pattern recognition/);
  assert.match(html, /Case-based micro scenarios/);
  assert.match(html, /Flashcard inventory/);
  assert.match(html, /0\.5-1\.2 mg\/dL/);
});

test("locked lab lesson still shows a meaningful preview instead of an empty paid state", () => {
  const lesson = getLabLessonByCategoryAndSlug("electrolytes", "potassium-priority-management", "rn");
  assert.ok(lesson);

  const html = renderToStaticMarkup(
    <LabLessonPreview
      lesson={lesson!}
      questions={getLabLessonQuestions(lesson!)}
      flashcards={getLabLessonFlashcards(lesson!)}
    />,
  );

  assert.match(html, /Preview/);
  assert.match(html, /Preview questions/);
  assert.match(html, /potassium becomes a nursing emergency/i);
});
