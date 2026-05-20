import assert from "node:assert";
import { describe, it } from "vitest";
import { recommendNextActionsForLessonContinue } from "@/lib/learner/adaptive-recommendations";
import {
  assignStudyNextMode,
  filterSuppressed,
  reorderForAfterActivity,
} from "@/lib/learner/smart-study-next-helpers";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";

describe("filterSuppressed", () => {
  it("drops hrefs on suppression list", () => {
    const recs: StudyNextRecommendation[] = [
      {
        type: "weak_topic_qbank",
        href: "/app/questions?x=1",
        title: "Drill",
        reasonCode: "weak_topic_high_confidence",
        reasonShort: "r",
        confidence: "high",
      },
      {
        type: "continue_pathway_lesson",
        href: "/app/lessons/foo",
        title: "Lesson",
        reasonCode: "continue_path_started",
        reasonShort: "r",
        confidence: "high",
      },
    ];
    const out = filterSuppressed(recs, ["/app/lessons/foo"]);
    assert.equal(out.length, 1);
    assert.equal(out[0]!.href, "/app/questions?x=1");
  });
});

describe("assignStudyNextMode", () => {
  it("maps same body system lesson", () => {
    const rec: StudyNextRecommendation = {
      type: "same_body_system_lesson",
      href: "/app/lessons/x",
      title: "t",
      reasonCode: "continue_same_body_system",
      reasonShort: "s",
      confidence: "medium",
    };
    assert.equal(assignStudyNextMode(rec), "continue_body_system");
  });
});

describe("reorderForAfterActivity", () => {
  it("after flashcards boosts qbank ahead of more flashcards", () => {
    const recs: StudyNextRecommendation[] = [
      {
        type: "weak_topic_flashcards",
        href: "/fc",
        title: "f",
        reasonCode: "weak_topic_high_confidence",
        reasonShort: "",
        confidence: "high",
      },
      {
        type: "weak_topic_qbank",
        href: "/q",
        title: "q",
        reasonCode: "weak_topic_high_confidence",
        reasonShort: "",
        confidence: "high",
      },
    ];
    const out = reorderForAfterActivity(recs, "flashcards");
    assert.equal(out[0]!.type, "weak_topic_qbank");
  });
});

describe("recommendNextActionsForLessonContinue + sameBodySystemLesson", () => {
  it("inserts same-body lesson after sequential when distinct", () => {
    const r = recommendNextActionsForLessonContinue({
      currentLessonId: "a",
      nextPathwayLesson: { id: "b", title: "Sequential" },
      sameBodySystemLesson: { id: "c", title: "Cardio deeper" },
      weakRows: [],
    });
    assert.ok(r);
    assert.equal(r!.primary.kind, "next_pathway_lesson");
    assert.ok(r!.secondary.some((s) => s.kind === "same_body_system_lesson" && s.href === "/app/lessons/c"));
  });

  it("dedupes when same body equals sequential next", () => {
    const r = recommendNextActionsForLessonContinue({
      currentLessonId: "a",
      nextPathwayLesson: { id: "b", title: "Same" },
      sameBodySystemLesson: { id: "b", title: "Same" },
      weakRows: [],
    });
    assert.ok(r);
    assert.equal(r!.primary.href, "/app/lessons/b");
    assert.ok(!r!.secondary.some((s) => s.kind === "same_body_system_lesson"));
  });
});
