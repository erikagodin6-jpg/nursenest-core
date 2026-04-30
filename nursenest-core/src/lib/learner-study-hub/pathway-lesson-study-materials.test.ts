import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";
import {
  aggregatePracticeQuestionsFromInventoryLessons,
  getPracticeQuestionsForPathway,
  getStudySystemsForPathway,
  flashcardLessonVirtualDiagnosticsForPathway,
} from "@/lib/learner-study-hub/pathway-lesson-study-materials";
import { collectMergedLessonVirtualFlashcardsForPathway } from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";

describe("pathway-lesson-learner-study-guards", () => {
  it("requires structuralQuality.publicComplete for learner inventory", () => {
    assert.equal(
      pathwayLessonEligibleForLearnerStudyInventory({
        structuralQuality: { publicComplete: false, issues: [], warnings: [], structureMode: "premium", internalStudyLinkCount: 0 },
      } as PathwayLessonRecord),
      false,
    );
    assert.equal(
      pathwayLessonEligibleForLearnerStudyInventory({
        structuralQuality: { publicComplete: true, issues: [], warnings: [], structureMode: "premium", internalStudyLinkCount: 0 },
      } as PathwayLessonRecord),
      true,
    );
    assert.equal(pathwayLessonEligibleForLearnerStudyInventory({} as PathwayLessonRecord), false);
  });
});

describe("pathway-lesson-study-materials", () => {
  it("flashcard diagnostics helper returns null for empty pathway", async () => {
    assert.equal(await flashcardLessonVirtualDiagnosticsForPathway("", { selectedCategories: [], filterModeLabel: "all" }), null);
    assert.equal(await flashcardLessonVirtualDiagnosticsForPathway("   ", { selectedCategories: [], filterModeLabel: "all" }), null);
  });

  it("RN catalog pathway exposes published lesson systems and bounded practice aggregation", async () => {
    const pid = "ca-rn-nclex-rn";
    const systems = await getStudySystemsForPathway(pid);
    assert.ok(systems.publishedLessonCount >= 0);
    assert.ok(Array.isArray(systems.systems));

    const practice = await getPracticeQuestionsForPathway(pid, { maxLessons: 120, maxQuestions: 2000 });
    assert.equal(practice.pathwayId, pid);
    const stems = new Set<string>();
    for (const q of practice.questions) {
      assert.ok(q.lessonHref.length > 3);
      assert.ok(
        q.lessonHref.includes("lessonSlug=") || q.lessonHref.startsWith("/app/lessons/"),
        "lesson link must use hub lessonSlug or direct lesson id",
      );
      assert.ok(q.stem.length > 2);
      stems.add(`${q.lessonSlug}|${q.stem.trim().toLowerCase().slice(0, 120)}`);
    }
    assert.equal(stems.size, practice.questions.length, "practice list must be stem-deduped per lesson");
    assert.ok(Array.isArray(practice.byBodySystem));
  });
});

describe("pathway-lesson-study-materials prisma inventory aggregation", () => {
  const structuralOk = {
    publicComplete: true,
    issues: [] as string[],
    warnings: [] as string[],
    structureMode: "premium" as const,
    internalStudyLinkCount: 0,
  };

  function baseLesson(over: Partial<PathwayLessonRecord>): PathwayLessonRecord {
    return {
      slug: "demo-lesson",
      title: "Demo",
      topic: "Topic",
      topicSlug: "topic-a",
      bodySystem: "cardiovascular",
      previewSectionCount: 1,
      seoTitle: "Demo",
      seoDescription: "Demo",
      sections: [],
      structuralQuality: structuralOk,
      ...over,
    } as PathwayLessonRecord;
  }

  it("excludes draft / structurally incomplete lessons from practice aggregation", () => {
    const good = baseLesson({ slug: "a" });
    const bad = baseLesson({
      slug: "b",
      structuralQuality: { ...structuralOk, publicComplete: false },
    });
    const r = aggregatePracticeQuestionsFromInventoryLessons("path-x", [good, bad], { maxLessons: 10, maxQuestions: 50 });
    assert.ok(r.questions.every((q) => q.lessonSlug === "a"));
  });

  it("dedupes practice stems on pathwayId + lessonSlug + normalized text", () => {
    const lesson = baseLesson({
      preTest: [
        { question: "Same stem?", options: ["Yes", "No"], correct: 0 },
        { question: "same stem?", options: ["A", "B"], correct: 1 },
      ],
    });
    const r = aggregatePracticeQuestionsFromInventoryLessons("pathway-1", [lesson], { maxLessons: 5, maxQuestions: 20 });
    assert.equal(r.questions.filter((q) => q.stem.toLowerCase().startsWith("same stem")).length, 1);
  });

  it("does not report false empty diagnostics when PathwayLesson rows exist but virtual merge is empty", () => {
    const lesson = baseLesson({
      slug: "empty-virtual",
      sections: [{ id: "x", heading: "H", kind: "intro", body: "Short", checkpointQuestions: [] }],
    });
    const { diagnostics } = collectMergedLessonVirtualFlashcardsForPathway("pathway-1", [lesson]);
    assert.equal(diagnostics.catalogLessonCount, 1);
    assert.ok(diagnostics.totalVirtualCards >= 0);
  });
});
