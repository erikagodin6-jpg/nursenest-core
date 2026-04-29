import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PathwayLessonsCurriculumHub } from "./pathway-lessons-curriculum-hub";
import { aggregatePathwayLessonProgress } from "./pathway-progress-aggregation";
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

    assert.match(html, /Cardiovascular/);
    assert.match(html, /33% complete/);
    assert.match(html, /2 of 6 lessons/);
    assert.match(html, /Category progress/i);
    assert.match(html, /line-clamp-3/);
  });

  it("does not render paid progress UI for anonymous or unpaid visitors", () => {
    const lessons = [
      lesson({ slug: "cardiac-1", title: "Cardiac lesson 1" }),
      lesson({ slug: "cardiac-2", title: "Cardiac lesson 2" }),
    ];

    const html = renderToStaticMarkup(
      <PathwayLessonsCurriculumHub
        lessons={lessons}
        lessonsBasePath="/canada/rn/nclex-rn/lessons"
        pathwayId="ca-rn-nclex-rn"
        progressMap={{ "cardiac-1": "completed" }}
        canShowProgressMap={false}
      />,
    );

    assert.doesNotMatch(html, /Category progress/i);
    assert.doesNotMatch(html, /1 of 2 completed/i);
    assert.match(html, /2 lessons/);
  });

  it("renders the same shared progress UI for RN, RPN/PN, NP, Allied, and New Grad paid users", () => {
    const pathways = [
      { pathwayId: "ca-rn-nclex-rn", base: "/canada/rn/nclex-rn/lessons" },
      { pathwayId: "ca-rpn-rex-pn", base: "/canada/pn/rex-pn/lessons" },
      { pathwayId: "us-np-fnp", base: "/us/np/fnp/lessons" },
      { pathwayId: "ca-allied-core", base: "/canada/allied/allied-health/lessons" },
      { pathwayId: "us-rn-new-grad-transition", base: "/us/rn/new-grad-transition/lessons" },
    ];
    const lessons = [
      lesson({ slug: "cardiac-1", title: "Cardiac lesson 1" }),
      lesson({ slug: "cardiac-2", title: "Cardiac lesson 2" }),
      lesson({ slug: "cardiac-3", title: "Cardiac lesson 3" }),
    ];

    for (const { pathwayId, base } of pathways) {
      const html = renderToStaticMarkup(
        <PathwayLessonsCurriculumHub
          lessons={lessons}
          preparedLessons={lessons}
          lessonsBasePath={base}
          pathwayId={pathwayId}
          progressMap={{
            "cardiac-1": "completed",
            "cardiac-2": "in_progress",
          }}
          canShowProgressMap
        />,
      );
      assert.match(html, /Category progress/i, pathwayId);
      assert.match(html, /33% complete/, pathwayId);
      assert.match(html, /1 of 3 lessons/, pathwayId);
      assert.match(html, /data-testid="lesson-card-link"/, pathwayId);
    }
  });

  it("aggregates category progress consistently across tier pathway ids", () => {
    const lessons = [
      lesson({ slug: "one", title: "One" }),
      lesson({ slug: "two", title: "Two" }),
      lesson({ slug: "three", title: "Three" }),
    ];
    for (const pathwayId of [
      "ca-rn-nclex-rn",
      "ca-rpn-rex-pn",
      "us-np-fnp",
      "ca-allied-core",
      "us-rn-new-grad-transition",
    ]) {
      const counts = aggregatePathwayLessonProgress(lessons, {
        one: "completed",
        two: "in_progress",
        three: "not_started",
      });
      assert.deepEqual(
        counts,
        { completedCount: 1, inProgressCount: 1, totalCount: 3 },
        pathwayId,
      );
    }
  });

  it("empty hub uses curriculum hub empty marker, not lesson detail loading shell", () => {
    const html = renderToStaticMarkup(<PathwayLessonsCurriculumHub lessons={[]} lessonsBasePath="/us/rn/nclex-rn/lessons" />);
    assert.match(html, /curriculum-hub-empty/);
    assert.ok(!html.includes("PathwayLessonDetailPageLoadingFallback"));
    assert.ok(!html.includes("pathway-lesson-detail-loading"));
  });

  it("renders lesson card titles with QA hooks and non-empty text (bounded preview rows per section)", () => {
    const lessons = Array.from({ length: 12 }, (_, index) =>
      lesson({
        slug: `preview-${index + 1}`,
        title: `Clinical topic ${index + 1}`,
        bodySystem: "cardiovascular",
        system: "cardiovascular",
      }),
    );
    const html = renderToStaticMarkup(
      <PathwayLessonsCurriculumHub
        lessons={lessons}
        preparedLessons={lessons.slice(0, 12)}
        lessonsBasePath="/canada/rn/nclex-rn/lessons"
        pathwayId="ca-rn-nclex-rn"
      />,
    );
    const titleMatches = [...html.matchAll(/data-testid="lesson-card-title"/g)];
    assert.ok(titleMatches.length >= 10);
    assert.match(html, /data-testid="lesson-card-link"/);
    assert.match(html, /data-testid="lesson-card"/);
    assert.match(html, /Clinical Topic 1/);
    assert.match(html, /text-\[var\(--theme-body-text\)\]/);
  });
});
