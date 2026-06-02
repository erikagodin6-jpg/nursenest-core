import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EXAM_DAY_FILTERS,
  EXAM_DAY_HIGH_YIELD_BLOCKS,
  EXAM_DAY_SESSION_LENGTHS,
  buildExamDayReviewResources,
  examDayCardCountForLength,
  examDayQuestionCountForLength,
} from "@/lib/exam-day/exam-day-mode";

const root = process.cwd();

describe("Exam Day Mode", () => {
  it("defines the required final-review filters and session lengths", () => {
    assert.deepEqual(
      EXAM_DAY_FILTERS.map((filter) => filter.label),
      ["Most Missed", "Highest Yield", "Recently Incorrect", "Must Know", "Frequently Tested"],
    );
    assert.deepEqual([...EXAM_DAY_SESSION_LENGTHS], [15, 30, 60]);
    assert.equal(examDayCardCountForLength(15), 25);
    assert.equal(examDayCardCountForLength(30), 50);
    assert.equal(examDayCardCountForLength(60), 100);
    assert.equal(examDayQuestionCountForLength(15), 25);
    assert.equal(examDayQuestionCountForLength(30), 50);
    assert.equal(examDayQuestionCountForLength(60), 75);
  });

  it("creates one focused entry point for flashcards, questions, ECG, pharmacology, and labs", () => {
    const resources = buildExamDayReviewResources({
      pathwayId: "ca-rn-nclex-rn",
      filterId: "recently-incorrect",
      sessionLength: 30,
    });
    assert.deepEqual(
      resources.map((resource) => resource.id),
      ["flashcards", "questions", "ecg", "pharmacology", "labs"],
    );
    assert.match(resources[0]!.href, /\/app\/flashcards\?/);
    assert.match(resources[0]!.href, /mode=incorrect/);
    assert.match(resources[1]!.href, /\/app\/practice-tests\?/);
    assert.match(resources[1]!.href, /focus=missed/);
    for (const resource of resources) {
      assert.match(resource.href, /pathwayId=ca-rn-nclex-rn/);
      assert.match(resource.href, /examDay=1/);
    }
  });

  it("surfaces high-yield pearls, memory hooks, and NCLEX takeaways", () => {
    assert.ok(EXAM_DAY_HIGH_YIELD_BLOCKS.length >= 5);
    for (const block of EXAM_DAY_HIGH_YIELD_BLOCKS) {
      assert.ok(block.pearl.length >= 40, `${block.id} should include a meaningful pearl`);
      assert.ok(block.memoryHook.length >= 8, `${block.id} should include a memory hook`);
      assert.match(block.nclexTakeaway, /question|questions|exam|stems|distractors/i);
      assert.ok(block.tags.length > 0, `${block.id} should be mapped to review surfaces`);
    }
  });

  it("adds a protected learner route and a token-aware client surface", () => {
    const page = readFileSync(join(root, "src/app/(app)/app/(learner)/exam-day/page.tsx"), "utf8");
    const client = readFileSync(join(root, "src/components/exam-day/exam-day-mode-client.tsx"), "utf8");
    assert.match(page, /getProtectedRouteSession/);
    assert.match(page, /resolveEntitlementForPage/);
    assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
    assert.match(client, /data-nn-exam-day-mode/);
    assert.match(client, /var\(--semantic-/);
    assert.doesNotMatch(client, /#[0-9a-fA-F]{3,8}\b/);
  });
});
