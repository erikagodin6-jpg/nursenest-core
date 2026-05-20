import assert from "node:assert/strict";
import { test } from "node:test";
import { buildThinLessonStudyExpansionPanels } from "@/components/lessons/pathway-lesson-thin-study-expansion";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function baseLesson(over: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  return {
    slug: "demo",
    title: "Demo",
    topic: "Topic",
    topicSlug: "topic",
    bodySystem: "Cardiovascular",
    previewSectionCount: 1,
    seoTitle: "Demo",
    seoDescription: "Short overview for learners who need orientation before the deep read.",
    sections: [],
    ...over,
  };
}

test("buildThinLessonStudyExpansionPanels uses seoDescription and traps without inventing fields", () => {
  const panels = buildThinLessonStudyExpansionPanels(
    baseLesson({
      studyCommonTraps: ["Do not confuse stable AAA with dissection urgency when BP is asymmetric."],
      seoDescription: "Abdominal aortic aneurysm overview for exam prep.",
    }),
  );
  const titles = panels.map((p) => p.title);
  assert.ok(titles.includes("Exam trap"));
  assert.ok(titles.includes("Topic overview"));
});

test("buildThinLessonStudyExpansionPanels includes clinical priority when activeExamMeta present", () => {
  const panels = buildThinLessonStudyExpansionPanels(
    baseLesson({
      activeExamMeta: { exam: "NCLEX_RN", yieldLevel: "high_yield", clinicalPriority: "urgent" },
    }),
  );
  assert.ok(panels.some((p) => p.title === "Clinical priority"));
});
