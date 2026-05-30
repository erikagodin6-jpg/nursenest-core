import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LabLessonArticle } from "@/components/labs/lab-lesson-article";
import { LabLessonPreview } from "@/components/labs/lab-lesson-page";
import { LabsCategoryPage } from "@/components/labs/labs-category-page";
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

  assert.match(html, /Clinical Lab Workstation/);
  assert.match(html, />Electrolytes</);
  assert.match(html, />ABGs</);
  assert.match(html, /Pathway Lessons/);
  assert.match(html, /Flashcards/);
  assert.match(html, /Practice Questions/);
  assert.match(html, /Practice Tests/);
  assert.match(html, />\s*Start\s*</);
  assert.match(html, /Lab Drills/);
  assert.match(html, /RN focus/i);
  assert.match(html, /data-nn-labs-topic-card=/);
  assert.match(html, /Start/);
  assert.match(html, /href="\/app\/labs\/electrolytes\//);
});

test("lab lesson article renders full premium structure", () => {
  const lesson = getLabLessonByCategoryAndSlug("renal", "creatinine-bun-aki-patterns", "rn");
  assert.ok(lesson);

  const studyLinks = buildLabsStudyLinks("ca-rn-nclex-rn");
  const html = renderToStaticMarkup(
    <LabLessonArticle lesson={lesson!} labTrack="rn" measurementSystem="US" studyLinks={studyLinks} />,
  );

  assert.match(html, /Normal Range and Physiology/);
  assert.match(html, /Treatment Algorithm/);
  assert.match(html, /Trend Interpretation/);
  assert.match(html, /Pattern Recognition/);
  assert.match(html, /Case-Based Scenarios/);
  assert.match(html, /0\.5-1\.2 mg\/dL/);
});

test("locked lab lesson shows preview metadata without exposing questions or cases", () => {
  const lesson = getLabLessonByCategoryAndSlug("electrolytes", "potassium-priority-management", "rn");
  assert.ok(lesson);
  const questions = getLabLessonQuestions(lesson!);

  const html = renderToStaticMarkup(
    <LabLessonPreview lesson={lesson!} />,
  );

  assert.match(html, /Preview/);
  assert.match(html, /Locked activity/);
  assert.match(html, /Included in RN Premium/);
  assert.match(html, /potassium becomes a nursing emergency/i);
  assert.doesNotMatch(html, new RegExp(questions[0]?.stem.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") ?? "never-match"));
});

test("locked labs cards route the full card and CTA to upgrade instead of launching premium content", () => {
  const lessons = listLabCategoriesForTrack("rn")[0]?.lessons.slice(0, 2) ?? [];
  assert.ok(lessons.length > 0);

  const html = renderToStaticMarkup(
    <LabsCategoryPage
      heading="Electrolytes"
      description="Electrolyte interpretation."
      categorySlug="electrolytes"
      lessons={lessons}
      hasAccess={false}
      labTrack="rn"
    />,
  );

  assert.match(html, /data-nn-labs-category-card=/);
  assert.match(html, /data-nn-labs-card-access="locked"/);
  assert.match(html, /href="\/pricing\?feature=labs"/);
  assert.match(html, /Upgrade to Access Labs/);
  assert.doesNotMatch(html, /href="\/app\/labs\/electrolytes\//);
});

test("labs workstation shell keeps the siderail compact with a visible content gap", () => {
  const css = readFileSync("src/app/labs-workstation.css", "utf8");

  assert.match(css, /--nn-labs-sidebar-width:\s*clamp\(15rem,\s*18vw,\s*17rem\)/);
  assert.match(css, /--nn-labs-workstation-gap:\s*clamp\(1\.5rem,\s*3vw,\s*2\.5rem\)/);
  assert.match(css, /@media \(min-width:\s*1200px\)[\s\S]*grid-template-columns:\s*var\(--nn-labs-sidebar-width\) minmax\(0,\s*1fr\)/);
  assert.match(css, /gap:\s*var\(--nn-labs-workstation-gap\)/);
});
