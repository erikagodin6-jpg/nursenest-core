import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

describe("question peer analytics (contract)", () => {
  it("grade route wires peer analytics and attemptMode", () => {
    const src = read("app/api/questions/grade/route.ts");
    assert.match(src, /recordQuestionPeerAnalyticsAndBuildPayload/);
    assert.match(src, /parseGradeAttemptMode/);
    assert.match(src, /peerStats/);
  });

  it("peer analytics skips CAT mode at source", () => {
    const src = read("lib/questions/question-peer-analytics.ts");
    assert.match(src, /PracticeQuestionAnswerMode\.cat/);
    assert.match(src, /QUESTION_PEER_ANALYTICS_ENABLED/);
  });

  it("peer analytics stays enabled by default and waits for a stable sample", () => {
    const src = read("lib/questions/question-peer-analytics.ts");
    assert.match(src, /if\s*\(!v\)\s*return true/);
    assert.match(src, /QUESTION_PEER_ANALYTICS_MIN_SAMPLE\s*=\s*50/);
    assert.match(src, /Answer analytics will appear once enough learners have completed this question/);
  });

  it("question bank client sends practice attemptMode and can store peerStats", () => {
    const src = read("components/student/question-bank-practice-client.tsx");
    assert.match(src, /attemptMode:\s*"practice"/);
    assert.match(src, /QuestionBankPeerPerformancePanel/);
    assert.match(src, /peerStats/);
  });

  it("practice session maps session mode to grade attemptMode", () => {
    const src = read("components/student/practice-question-session-client.tsx");
    assert.match(src, /attemptMode:/);
  });
});
