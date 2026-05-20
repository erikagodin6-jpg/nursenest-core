import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ALLIED_LEGACY_EXAM_QUESTION_CAREER_TYPES } from "@/lib/allied/allied-exam-question-scope";

describe("Pharmacy Tech allied question scope", () => {
  it("keeps Pharmacy Tech mapped to the legacy pharmacyTech career type", () => {
    assert.deepEqual(ALLIED_LEGACY_EXAM_QUESTION_CAREER_TYPES["pharmacy-tech"], ["pharmacyTech"]);
  });
});
