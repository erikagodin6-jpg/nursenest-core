import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const runnerPath = join(__dirname, "../../components/student/practice-test-runner-client.tsx");
const hubPath = join(__dirname, "../../components/student/practice-tests-hub-client.tsx");

describe("Practice exam — premium convergence hooks", () => {
  const runnerSrc = readFileSync(runnerPath, "utf8");
  const hubSrc = readFileSync(hubPath, "utf8");

  it("marks linear practice sessions with convergence classes + QA attributes", () => {
    assert.equal(runnerSrc.includes("linearPracticeExamConvergence"), true);
    assert.equal(runnerSrc.includes("nn-practice-exam-convergence"), true);
    assert.equal(runnerSrc.includes("data-nn-practice-exam-convergence"), true);
    assert.equal(runnerSrc.includes("nn-practice-exam-convergence--tutor-split"), true);
    assert.equal(runnerSrc.includes("data-nn-qa-practice-exam-results-root"), true);
  });

  it("tags the practice hub builder for convergence / screenshots", () => {
    assert.equal(hubSrc.includes("data-nn-practice-exam-hub-convergence"), true);
  });
});
