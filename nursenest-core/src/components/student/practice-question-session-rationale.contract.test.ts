import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, "practice-question-session-client.tsx");

describe("PracticeQuestionSessionClient rationale timing", () => {
  it("routes practice questions through the shared flashcard learner surface", () => {
    const src = readFileSync(clientPath, "utf8");
    assert.ok(src.includes("QuestionRenderer"));
    assert.ok(src.includes('data-nn-exam-workspace-mode="practice"'));
    assert.ok(src.includes("onBeforeAnswerReveal={submitPracticeMcqAnswer}"));
    assert.ok(src.includes("onBeforeSataReveal={submitPracticeSataAnswer}"));
    assert.equal(src.includes("ExamSessionShell"), false);
    assert.equal(src.includes("nn-question-session--split"), false);
  });
});
