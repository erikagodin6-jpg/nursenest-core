import assert from "node:assert/strict";
import { test } from "node:test";
import { validateInternalCourseModuleContent } from "@/lib/internal-courses/module-content-schema";

test("validateInternalCourseModuleContent: valid ecg", () => {
  const r = validateInternalCourseModuleContent("ecg", {
    title: "t",
    stripSummary: "s",
    question: "q",
    answer: "a",
    rationale: "r",
  });
  assert.equal(r.ok, true);
});

test("validateInternalCourseModuleContent: quiz rejects wrong correctId", () => {
  const r = validateInternalCourseModuleContent("quiz", {
    question: "q",
    options: [
      { id: "a", text: "A" },
      { id: "b", text: "B" },
    ],
    correctId: "x",
    rationale: "r",
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.ok(r.issues.some((i) => /correctId/i.test(i)));
});

test("validateInternalCourseModuleContent: decision_tree rejects dangling next", () => {
  const r = validateInternalCourseModuleContent("decision_tree", {
    rootId: "start",
    nodes: [
      { id: "start", prompt: "p", choices: [{ label: "go", next: "missing" }] },
    ],
  });
  assert.equal(r.ok, false);
});

test("validateInternalCourseModuleContent: invalid shape returns issues not raw payload", () => {
  const r = validateInternalCourseModuleContent("ecg", "not-an-object");
  assert.equal(r.ok, false);
  if (!r.ok) assert.ok(r.issues.length > 0);
});
