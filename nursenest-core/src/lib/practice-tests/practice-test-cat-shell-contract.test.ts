import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const runnerPath = join(__dirname, "../../components/student/practice-test-runner-client.tsx");

describe("Practice test runner — CAT shell contract", () => {
  const src = readFileSync(runnerPath, "utf8");

  it("does not mount the retired split-board linear right column", () => {
    assert.equal(src.includes("PracticeTestLinearRightColumn"), false);
    assert.equal(src.includes("nn-practice-test-linear-board"), false);
    assert.equal(src.includes("resolvePracticeLinearRightColumnPhase"), false);
  });

  it("renders per-item rationale via PracticeTestPerItemRationale (inline under options)", () => {
    assert.equal(src.includes("PracticeTestPerItemRationale"), true);
    const rationalePath = join(__dirname, "../../components/study/practice-test-per-item-rationale.tsx");
    const rationaleSrc = readFileSync(rationalePath, "utf8");
    assert.equal(rationaleSrc.includes("data-nn-practice-per-item-rationale"), true);
  });

  it("keeps linear + legacy sessions on CAT QuestionCard + AnswerOptionRow (exam stack)", () => {
    assert.equal(src.includes("examStackedLayout"), true);
    assert.equal(src.includes("examDetachedFooter"), true);
    assert.equal(src.includes("examStemScrollPartition"), true);
    assert.equal(src.includes("nn-cat-adaptive-exam-session"), true);
    assert.equal(src.includes("AnswerOptionRow"), true);
  });

  it("wires CAT + linear SATA rows through the same state helpers as single-select (no pre-reveal collapse)", () => {
    const catStateMatches = src.match(/state=\{catOptState\(canonical\)\}/g) ?? [];
    assert.equal(
      catStateMatches.length,
      2,
      "CAT MCQ and CAT SATA must both pass catOptState(canonical) into AnswerOptionRow",
    );
    const linearStateMatches = src.match(/state=\{linearOptState\(canonical\)\}/g) ?? [];
    assert.equal(
      linearStateMatches.length,
      2,
      "Linear MCQ and linear SATA must both pass linearOptState(canonical) into AnswerOptionRow",
    );
  });

  it("does not reintroduce PracticeQuestionCard in the legacy branch", () => {
    assert.equal(src.includes("PracticeQuestionCard"), false);
  });

  it("keeps legacy + linear runner branches off the old split study grid (CAT study split stays earlier in file only)", () => {
    const legacyStart = src.indexOf("if (!catMode && !isLinearEngine)");
    const linearStart = src.indexOf("// LINEAR PRACTICE / EXAM");
    assert.ok(legacyStart > 0 && linearStart > legacyStart, "expected legacy block before linear block");
    const legacySlice = src.slice(legacyStart, linearStart);
    assert.equal(legacySlice.includes("nn-question-session"), false);

    const tailFromLinear = src.slice(linearStart);
    assert.equal(tailFromLinear.includes("nn-question-session"), false);
  });
});
