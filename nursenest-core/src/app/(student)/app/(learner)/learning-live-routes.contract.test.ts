import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

/** File lives at `src/app/(student)/app/(learner)/` — repo root is five parents up. */
const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..", "..", "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(repoRoot, rel), "utf8");
}

describe("learner live study routes import contract", () => {
  it("flashcards page wires FlashcardsHubClient (live /app/flashcards)", () => {
    const src = read("src/app/(student)/app/(learner)/flashcards/page.tsx");
    assert.match(src, /FlashcardsHubClient/);
    assert.match(src, /from "@\/components\/flashcards\/flashcards-hub-client"/);
  });

  it("practice-tests page wires PracticeTestsHubClient (live /app/practice-tests)", () => {
    const src = read("src/app/(student)/app/(learner)/practice-tests/page.tsx");
    assert.match(src, /PracticeTestsHubClient/);
    assert.match(src, /from "@\/components\/student\/practice-tests-hub-client"/);
  });

  it("practice-exams alias redirects to practice-tests hub", () => {
    const src = read("src/app/(student)/app/(learner)/practice-exams/page.tsx");
    assert.match(src, /redirect\(/);
    assert.match(src, /\/app\/practice-tests/);
  });
});
