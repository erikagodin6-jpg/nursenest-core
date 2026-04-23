import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PathwayLessonsCurriculumHub } from "./pathway-lessons-curriculum-hub";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function lesson(overrides: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  return {
    slug: "lesson-slug",
    title: "Lesson title",
    topic: "Topic",
    topicSlug: "topic",
    system: "cardiovascular",
    bodySystem: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: "Lesson title | NurseNest",
    seoDescription: "A concise lesson summary for rendering tests.",
    sections: [
      {
        id: "clinical-meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: "This lesson body contains enough words to support a compact estimated duration in the board row.",
      },
    ],
    examRelevance: "core",
    ...overrides,
  };
}

describe("PathwayLessonsCurriculumHub", () => {
  it("renders browseable system-section cards (clinical grouping model)", () => {
    const cardio = lesson({ slug: "c-1", title: "Heart failure exacerbation", system: "cardiovascular", bodySystem: "cardiovascular" });
    const resp = lesson({
      slug: "r-1",
      title: "Asthma exacerbation and oxygen therapy",
      system: "respiratory",
      bodySystem: "respiratory",
    });
    const html = renderToStaticMarkup(
      <PathwayLessonsCurriculumHub lessons={[cardio, resp]} lessonsBasePath="/us/rn/nclex-rn/lessons" pathwayId="us-rn-nclex-rn" />,
    );
    assert.match(html, /id="cardiovascular"/);
    assert.match(html, /id="respiratory"/);
    assert.match(html, /grid grid-cols-1 gap-4/);
  });

  it("renders a compact board card with progress and wrapped lesson titles", () => {
    const lessons = Array.from({ length: 6 }, (_, index) =>
      lesson({
        slug: `cardiac-${index + 1}`,
        title: `Cardiac lesson ${index + 1}`,
      }),
    );

    const html = renderToStaticMarkup(
      <PathwayLessonsCurriculumHub
        lessons={lessons}
        lessonsBasePath="/us/np/fnp/lessons"
        progressMap={{
          "cardiac-1": "completed",
          "cardiac-2": "completed",
          "cardiac-3": "in_progress",
        }}
        canShowProgressMap
      />,
    );

    assert.match(html, /Cardiac/);
    assert.match(html, /2 of 6 completed/);
    assert.match(html, /Category progress/i);
    assert.match(html, /line-clamp-3/);
  });

  it("empty hub uses curriculum hub empty marker, not lesson detail loading shell", () => {
    const html = renderToStaticMarkup(<PathwayLessonsCurriculumHub lessons={[]} lessonsBasePath="/us/rn/nclex-rn/lessons" />);
    assert.match(html, /curriculum-hub-empty/);
    assert.ok(!html.includes("PathwayLessonDetailPageLoadingFallback"));
    assert.ok(!html.includes("pathway-lesson-detail-loading"));
  });
});
