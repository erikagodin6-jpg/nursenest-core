import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const practiceTestsLayoutPath = path.resolve(process.cwd(), "src/app/(app)/app/(learner)/practice-tests/layout.tsx");
const loftCssPath = path.resolve(process.cwd(), "src/app/learner-loft-simulation.css");
const shellPath = path.resolve(process.cwd(), "src/components/exam/exam-session-shell.tsx");
const resolverPath = path.resolve(process.cwd(), "src/lib/practice-tests/linear-runner-session-mode.ts");

function read(filePath: string): string {
  return readFileSync(filePath, "utf8");
}

describe("LOFT simulation shell", () => {
  const practiceTestsLayout = read(practiceTestsLayoutPath);
  const loftCss = read(loftCssPath);
  const shell = read(shellPath);
  const resolver = read(resolverPath);

  it("loads the LOFT stylesheet in the practice-tests segment shell", () => {
    assert.equal(practiceTestsLayout.includes("@/app/learner-loft-simulation.css"), true);
  });

  it("keeps LOFT distinct from adaptive CAT styling", () => {
    assert.equal(shell.includes('"cat" | "loft" | "practice" | "review"'), true);
    assert.equal(loftCss.includes("--nn-loft-simulation-shell"), true);
    assert.equal(loftCss.includes("nn-cat-adaptive-exam-session:not(.nn-cat-premium-convergence)"), true);
  });

  it("routes linear exam delivery toward LOFT shell mode", () => {
    assert.equal(resolver.includes("resolveLearnerExamShellModeForPracticeRunner"), true);
    assert.equal(resolver.includes('linearDeliveryMode === "exam"'), true);
    assert.equal(resolver.includes('return "loft"'), true);
  });
});
