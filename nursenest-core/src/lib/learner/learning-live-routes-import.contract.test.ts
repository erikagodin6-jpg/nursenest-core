import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const thisDir = path.dirname(fileURLToPath(import.meta.url));
/** `src/lib/learner/` → nursenest-core package root is three parents up. */
const repoRoot = path.resolve(thisDir, "..", "..", "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(repoRoot, rel), "utf8");
}

describe("learner live study routes import contract", () => {
  it("flashcards page wires FlashcardsHubClient (live /app/flashcards)", () => {
    const src = read("src/app/(student)/app/(learner)/flashcards/page.tsx");
    assert.match(src, /FlashcardsHubClient/);
    assert.match(src, /from "@\/components\/flashcards\/flashcards-hub-client"/);
    assert.match(src, /normalizeLearnerFlashcardsPathwayQueryId/);
    assert.match(src, /from "@\/lib\/flashcards\/flashcards-pathway-query"/);
  });

  it("practice-tests page wires PracticeTestsHubClient (live /app/practice-tests)", () => {
    const src = read("src/app/(student)/app/(learner)/practice-tests/page.tsx");
    assert.match(src, /PracticeTestsHubClient/);
    assert.match(src, /from "@\/components\/student\/practice-tests-hub-client"/);
    assert.match(src, /pathwayLessonPractice/);
  });

  it("practice-exams alias redirects to practice-tests hub", () => {
    const src = read("src/app/(student)/app/(learner)/practice-exams/page.tsx");
    assert.match(src, /redirect\(/);
    assert.match(src, /\/app\/practice-tests/);
    assert.match(src, /practice-tests\?\$\{suffix\}/);
    assert.match(src, /: "\/app\/practice-tests"/);
  });

  it("practice alias redirects to practice-tests hub", () => {
    const src = read("src/app/(student)/app/(learner)/practice/page.tsx");
    assert.match(src, /redirect\(/);
    assert.match(src, /\/app\/practice-tests/);
  });

  it("practice-tests hub page uses pathway picker surface (no silent default when context missing)", () => {
    const src = read("src/app/(student)/app/(learner)/practice-tests/page.tsx");
    assert.match(src, /FlashcardsPathwayPickSurface/);
    assert.match(src, /baseAppPath=\"\/app\/practice-tests\"/);
    assert.match(src, /resolveSubscribedQuestionBankPathways/);
  });

  it("practice-tests hub client stabilizes URL sync (avoids searchParams identity churn)", () => {
    const src = read("src/components/student/practice-tests-hub-client.tsx");
    assert.match(src, /searchParamString/);
    assert.match(src, /\[searchParamString, pathwayOptions\]/);
  });
});
