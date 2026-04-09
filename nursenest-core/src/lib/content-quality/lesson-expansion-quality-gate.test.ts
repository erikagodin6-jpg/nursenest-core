import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateLessonExpansionQuality,
  gateErrors,
  LESSON_EXPANSION_QUALITY_RULEBOOK,
} from "@/lib/content-quality/lesson-expansion-quality-gate";

describe("lesson-expansion-quality-gate", () => {
  it("exports a rulebook with uniqueness, quality, and metadata sections", () => {
    assert.ok(LESSON_EXPANSION_QUALITY_RULEBOOK.uniqueness.length >= 2);
    assert.ok(LESSON_EXPANSION_QUALITY_RULEBOOK.lessonQuality.length >= 2);
    assert.ok(LESSON_EXPANSION_QUALITY_RULEBOOK.metadata.length >= 2);
  });

  it("errors on internal ops language in seoDescription", () => {
    const row = {
      slug: "test-lesson",
      title: "Valid title for NCLEX-PN (United States)",
      topic: "Safety",
      topicSlug: "safety",
      seoTitle: "Valid | NurseNest",
      seoDescription:
        "Blueprint expansion: test. Pathway-scoped practice for NCLEX-PN (United States) with enough words to satisfy length heuristics when combined with other checks.",
      sections: [
        { kind: "clinical_meaning", body: "x ".repeat(200) },
        { kind: "exam_relevance", body: "y ".repeat(120) },
        { kind: "core_concept", body: "z ".repeat(100) },
        { kind: "clinical_scenario", body: "a ".repeat(100) },
        { kind: "takeaways", body: "Bank drill practice questions review mock exam " + "w ".repeat(80) },
      ],
    };
    const v = evaluateLessonExpansionQuality(row, { pathwayId: "us-lpn-nclex-pn", cohort: [] });
    assert.ok(gateErrors(v).some((e) => e.ruleId === "M1"));
  });

  it("errors when Canada RPN lesson brands as NCLEX-PN in title", () => {
    const row = {
      slug: "bad",
      title: "Topic — NCLEX-PN (wrong for Canada RPN)",
      topic: "X",
      topicSlug: "safety",
      seoTitle: "x",
      seoDescription:
        "Clinical focus: teaching. Pathway-scoped practice for REx-PN (Canada)—exam-style prioritization, monitoring, and scope-safe actions you can rehearse with timed questions in the bank. Extra words for length.",
      sections: [
        { kind: "clinical_meaning", body: "x ".repeat(200) },
        { kind: "exam_relevance", body: "y ".repeat(120) },
        { kind: "core_concept", body: "z ".repeat(100) },
        { kind: "clinical_scenario", body: "a ".repeat(100) },
        { kind: "takeaways", body: "Bank practice questions " + "w ".repeat(80) },
      ],
    };
    const v = evaluateLessonExpansionQuality(row, { pathwayId: "ca-rpn-rex-pn", cohort: [] });
    assert.ok(gateErrors(v).some((e) => e.ruleId === "M2"));
  });
});
