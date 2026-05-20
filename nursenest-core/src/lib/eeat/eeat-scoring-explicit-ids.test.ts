import test from "node:test";
import assert from "node:assert/strict";
import { sectionCompletenessFraction } from "@/lib/eeat/eeat-scoring";

test("sectionCompletenessFraction counts preTestQuestionIds as practice checkpoint signal", () => {
  const frac = sectionCompletenessFraction({
    sections: [{ kind: "introduction", body: "x" }],
    preTestQuestionIds: ["id-one-xxxxxxxxxx"],
  });
  assert.ok(frac > 0);
});
