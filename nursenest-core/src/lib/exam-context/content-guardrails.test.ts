import assert from "node:assert/strict";
import test from "node:test";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { validateLearnerCopyForExamContext } from "@/lib/exam-context/content-guardrails";

test("CA PN guardrails flag US-centric phrasing", () => {
  const ctx = buildGlobalExamContext("ca-rpn-rex-pn", "en");
  assert.ok(ctx);
  const violations = validateLearnerCopyForExamContext(
    "Review LVN delegation and UAP rules before NCLEX-PN day.",
    ctx!,
  );
  assert.ok(violations.length >= 2);
});

test("US PN guardrails flag REx-PN leakage", () => {
  const ctx = buildGlobalExamContext("us-lpn-nclex-pn", "en");
  assert.ok(ctx);
  const violations = validateLearnerCopyForExamContext(
    "This mirrors the REx-PN decision style for Canadian Practical Nurse Exam prep.",
    ctx!,
  );
  assert.ok(violations.length >= 1);
});

test("clean copy passes without violations", () => {
  const ctx = buildGlobalExamContext("us-rn-nclex-rn", "en");
  assert.ok(ctx);
  const violations = validateLearnerCopyForExamContext(
    "Focus on safety and priority-setting for this NCLEX-RN aligned practice set.",
    ctx!,
  );
  assert.deepEqual(violations, []);
});
