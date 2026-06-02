import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { respiratoryTherapyExamQuestionPoolWhere } from "@/lib/allied/allied-respiratory-pool-scope";

describe("allied-respiratory-pool-scope", () => {
  it("builds a non-null respiratory pool AND clause for RT audits", () => {
    const w = respiratoryTherapyExamQuestionPoolWhere();
    assert.ok(w && typeof w === "object");
    assert.ok("AND" in (w as object));
  });
});
