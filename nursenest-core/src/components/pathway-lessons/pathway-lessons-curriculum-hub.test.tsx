import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonsCurriculumHub } from "./pathway-lessons-curriculum-hub";

function lesson(overrides: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  return {
    slug: overrides.slug ?? "lesson-1",
    title: overrides.title ?? "Foundations of care",
    topic: overrides.topic ?? "Fundamentals",
    topicSlug: overrides.topicSlug ?? "fundamentals",
    system: overrides.system ?? "fundamentals",
    bodySystem: overrides.bodySystem ?? "General",
    previewSectionCount: overrides.previewSectionCount ?? 3,
    seoTitle: overrides.seoTitle ?? "Foundations of care",
    seoDescription: overrides.seoDescription ?? "Short descriptor",
    sections: overrides.sections ?? [],
    ...overrides,
  };
}

test("PathwayLessonsCurriculumHub renders compact board cards with counts and overflow control", () => {
  const pathway = getExamPathwayById("ca-rpn-rex-pn");
  assert.ok(pathway);

  const html = renderToStaticMarkup(
    <PathwayLessonsCurriculumHub
      pathway={pathway}
      lessonsBasePath="/canada/rpn/rex-pn/lessons"
      lessons={[
        lesson({ slug: "fund-1", title: "Vitals review", topic: "Fundamentals", topicSlug: "fundamentals", bodySystem: "Vital signs" }),
        lesson({ slug: "fund-2", title: "Medication safety", topic: "Safety", topicSlug: "safety", bodySystem: "Medication safety" }),
        lesson({ slug: "fund-3", title: "Isolation precautions", topic: "Safety", topicSlug: "safety", bodySystem: "Infection control" }),
        lesson({ slug: "fund-4", title: "Therapeutic communication", topic: "Communication", topicSlug: "communication", bodySystem: "Communication" }),
        lesson({ slug: "fund-5", title: "Pain assessment", topic: "Fundamentals", topicSlug: "fundamentals", bodySystem: "General" }),
        lesson({ slug: "fund-6", title: "Fall prevention", topic: "Safety", topicSlug: "safety", bodySystem: "Safety" }),
      ]}
      progressMap={{
        "fund-1": "completed",
        "fund-2": "completed",
        "fund-3": "in_progress",
      }}
      canShowProgressMap
    />,
  );

  assert.match(html, /Foundations and safety/);
  assert.match(html, /2\/6 complete/);
  assert.match(html, /Show more \(1\)/);
  assert.match(html, /Vitals review/);
  assert.match(html, /Medication safety/);
});
