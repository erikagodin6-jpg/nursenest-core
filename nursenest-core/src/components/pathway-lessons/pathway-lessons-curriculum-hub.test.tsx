import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
  it("renders a compact board card with progress and show-more affordance", () => {
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
    assert.match(html, /2\/6/);
    assert.match(html, /Show more/);
    assert.match(html, /Category progress/i);
  });
});
