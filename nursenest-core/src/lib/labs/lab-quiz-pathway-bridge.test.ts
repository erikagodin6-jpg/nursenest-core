import assert from "node:assert/strict";
import test from "node:test";
import { getLabLessonByCategoryAndSlug, getLabLessonQuestions } from "@/lib/labs/labs-engine";
import { labLessonLinkedLearningSignals, labQuestionsToPathwayQuizItems } from "@/lib/labs/lab-quiz-pathway-bridge";

test("lab questions map to pathway quiz contract with rationale + distribution", () => {
  const lesson = getLabLessonByCategoryAndSlug("electrolytes", "potassium-priority-management", "rn");
  assert.ok(lesson);
  const items = labQuestionsToPathwayQuizItems(getLabLessonQuestions(lesson!));
  assert.ok(items.length >= 6);
  const first = items[0]!;
  assert.ok(first.question.length > 40);
  assert.ok(first.options.length >= 4);
  assert.ok(typeof first.correct === "number");
  assert.ok(first.rationale?.includes("Illustrative answer distribution"));
});

test("lab lesson linked-learning signals mirror pathway topic wiring", () => {
  const lesson = getLabLessonByCategoryAndSlug("renal", "creatinine-bun-aki-patterns", "rn");
  assert.ok(lesson);
  const sig = labLessonLinkedLearningSignals(lesson!);
  assert.equal(sig.bidirectionalTopicKey, "creatinine");
  assert.equal(sig.flashcardsLinked, true);
  assert.equal(sig.practiceQuestionsLinked, true);
});
