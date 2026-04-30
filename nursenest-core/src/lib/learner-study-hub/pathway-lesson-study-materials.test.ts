import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";
import {
  getPracticeQuestionsForPathway,
  getStudySystemsForPathway,
  flashcardLessonVirtualDiagnosticsForPathway,
} from "@/lib/learner-study-hub/pathway-lesson-study-materials";

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
  it("flashcard diagnostics helper returns null for empty pathway", () => {
    assert.equal(flashcardLessonVirtualDiagnosticsForPathway("", { selectedCategories: [], filterModeLabel: "all" }), null);
    assert.equal(flashcardLessonVirtualDiagnosticsForPathway("   ", { selectedCategories: [], filterModeLabel: "all" }), null);
  });

  it("RN catalog pathway exposes published lesson systems and bounded practice aggregation", () => {
    const pid = "ca-rn-nclex-rn";
    const systems = getStudySystemsForPathway(pid);
    assert.ok(systems.publishedLessonCount >= 0);
    assert.ok(Array.isArray(systems.systems));

    const practice = getPracticeQuestionsForPathway(pid, { maxLessons: 120, maxQuestions: 2000 });
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
  });
});
