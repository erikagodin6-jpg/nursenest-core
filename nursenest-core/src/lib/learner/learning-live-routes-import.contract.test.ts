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
    const src = read("src/app/(app)/app/(learner)/flashcards/page.tsx");
    assert.match(src, /FlashcardsHubClient/);
    assert.match(src, /from "@\/components\/flashcards\/flashcards-hub-client"/);
    assert.match(src, /normalizeLearnerFlashcardsPathwayQueryId/);
    assert.match(src, /from "@\/lib\/flashcards\/flashcards-pathway-query"/);
    assert.match(src, /requireExplicitRequestedPathwayId:\s*true/);
    assert.match(src, /FlashcardsPathwayPickSurface/);
    assert.match(src, /loadFlashcardsExamInventoryForPathway/);
  });

  it("practice-tests page wires PracticeTestsHubClient (live /app/practice-tests)", () => {
    const src = read("src/app/(app)/app/(learner)/practice-tests/page.tsx");
    assert.match(src, /PracticeTestsHubClient/);
    assert.match(src, /from "@\/components\/student\/practice-tests-hub-client"/);
    assert.match(src, /initialDiscovery/);
    assert.doesNotMatch(src, /getPathwayLessonPracticeHubSnapshot/);
  });

  it("practice-exams route redirects to the canonical practice-tests hub", () => {
    const src = read("src/app/(app)/app/(learner)/practice-exams/page.tsx");
    assert.match(src, /redirect\(/);
    assert.match(src, /\/app\/practice-tests/);
    assert.doesNotMatch(src, /PracticeTestsPage|PracticeTestsHubClient/);
  });

  it("practice alias redirects to practice-tests hub", () => {
    const src = read("src/app/(app)/app/(learner)/practice/page.tsx");
    assert.match(src, /redirect\(/);
    assert.match(src, /\/app\/practice-tests/);
  });

  it("practice-tests hub page uses pathway picker surface (no silent default when context missing)", () => {
    const src = read("src/app/(app)/app/(learner)/practice-tests/page.tsx");
    assert.match(src, /FlashcardsPathwayPickSurface/);
    assert.match(src, /baseAppPath=\"\/app\/practice-tests\"/);
    assert.match(src, /resolveSubscribedQuestionBankPathways/);
    assert.match(src, /normalizeLearnerFlashcardsPathwayQueryId/);
    assert.match(src, /pathwayQueryRaw/);
    assert.match(src, /requireExplicitRequestedPathwayId:\s*true/);
  });

  it("question bank gated entry normalizes pathwayId like flashcards hub", () => {
    const src = read("src/app/(app)/app/(learner)/questions/question-bank-gated-server.tsx");
    assert.match(src, /normalizeLearnerFlashcardsPathwayQueryId/);
    assert.match(src, /pathwayQueryRaw/);
  });

  it("GET /api/flashcards/custom-session normalizes pathwayId", () => {
    const src = read("src/app/api/flashcards/custom-session/route.ts");
    assert.match(src, /normalizeLearnerFlashcardsPathwayQueryId/);
  });

  it("/app/cat alias redirects to practice-tests hub", () => {
    const src = read("src/app/(app)/app/(learner)/cat/page.tsx");
    assert.match(src, /redirect\(/);
    assert.match(src, /\/app\/practice-tests/);
  });

  it("practice-tests hub client stabilizes URL sync (avoids searchParams identity churn)", () => {
    const src = read("src/components/student/practice-tests-hub-client.tsx");
    assert.match(src, /searchParamString/);
    assert.match(src, /\[pathwayOptions,\s*searchParamString\]/);
    assert.doesNotMatch(src, /qp\.get\("cat"\)/);
    assert.match(src, /qp\.get\("catLaunch"\)/);
    assert.doesNotMatch(src, /router\.replace\(/);
    assert.doesNotMatch(src, /router\.push\(/);
    assert.match(src, /data-nn-e2e-practice-exams-builder/);
    assert.match(src, /data-nn-e2e-practice-session-size/);
    assert.match(src, /data-nn-qa-practice-hub-start-test/);
  });
});
