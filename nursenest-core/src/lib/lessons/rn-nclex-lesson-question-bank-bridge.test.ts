import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getRnNclexLessonQuestionBankBridgeClauses } from "@/lib/lessons/rn-nclex-lesson-question-bank-bridge";

describe("rn-nclex-lesson-question-bank-bridge", () => {
  it("returns clauses for US RN + MI slug", () => {
    const clauses = getRnNclexLessonQuestionBankBridgeClauses("us-rn-nclex-rn", "myocardial-infarction-nclex-rn");
    assert.ok(clauses.length >= 2);
    assert.ok(JSON.stringify(clauses).toLowerCase().includes("myocardial"));
  });

  it("is empty for non-RN pathways", () => {
    assert.deepEqual(getRnNclexLessonQuestionBankBridgeClauses("us-lpn-nclex-pn", "copd-nclex-rn"), []);
  });

  it("adds generic phrase bridge for unlisted nclex-rn slug", () => {
    const clauses = getRnNclexLessonQuestionBankBridgeClauses("ca-rn-nclex-rn", "stroke-and-transient-ischemic-attack-nclex-rn");
    assert.ok(clauses.length >= 1);
  });
});
