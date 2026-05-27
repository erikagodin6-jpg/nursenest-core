import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const practiceRunner = readFileSync(
  join(root, "src/components/exam/nclex-practice-runner.tsx"),
  "utf-8",
);
const catRunner = readFileSync(
  join(root, "src/components/exam/nclex-cat-runner.tsx"),
  "utf-8",
);
const layout = readFileSync(
  join(root, "src/components/exam/nclex-exam-layout.tsx"),
  "utf-8",
);
const runPage = readFileSync(
  join(root, "src/app/(app)/app/(learner)/practice-tests/[id]/page.tsx"),
  "utf-8",
);

describe("NCLEX practice exam shell", () => {
  it("submits via linear_commit with full rationale panel + lesson links", () => {
    assert.ok(practiceRunner.includes('action: "linear_commit"'));
    assert.ok(!practiceRunner.includes('action: "commit_answer"'));
    assert.ok(practiceRunner.includes("nn-nclex-rationale-sidebar"));
    assert.ok(practiceRunner.includes("relatedLessons"));
    assert.ok(layout.includes("nn-nclex-practice-rationale-band"));
  });

  it("uses single-column CAT-aligned layout (no side split)", () => {
    const practiceSection = layout.slice(
      layout.indexOf("NclexPracticeExamLayout"),
      layout.length,
    );
    assert.ok(practiceSection.includes("nn-nclex-practice-rationale-band"));
    assert.ok(!practiceSection.includes("<NclexRationalePanel"));
  });

  it("supports LOFT presentation on the same layout grid (CNPLE)", () => {
    assert.ok(layout.includes('shellPresentation === "loft"'));
    assert.ok(layout.includes("nn-cat-adaptive-exam-session"));
    assert.ok(layout.includes("data-nn-loft-simulation-shell"));
  });

  it("routes linear exam delivery to NclexPracticeRunner for premium pathways", () => {
    assert.ok(runPage.includes("resolvePremiumNclexShellRoute"));
    assert.ok(runPage.includes('nclexShellMode === "practice"'));
    assert.ok(runPage.includes("shellPresentation"));
  });
});

describe("NCLEX CAT exam shell", () => {
  it("exposes E2E hooks and two-step submit then advance", () => {
    assert.ok(layout.includes("data-cat-exam-root"));
    assert.ok(layout.includes("data-nn-qa-cat-exam-submit-answer"));
    assert.ok(layout.includes("data-nn-qa-cat-exam-advance"));
    assert.ok(catRunner.includes("submitted_locked"));
    assert.ok(catRunner.includes("onSubmitAnswer={lockAnswer}"));
    assert.ok(!catRunner.includes("submitAndAdvance"));
  });

  it("does not mount practice rationale on CAT shell", () => {
    const catSection = layout.slice(
      layout.indexOf("NclexCatExamLayout"),
      layout.indexOf("NclexPracticeExamLayout"),
    );
    assert.ok(!catSection.includes("nn-question-session-rationale"));
    assert.ok(!catSection.includes("NclexRationalePanel"));
  });
});
