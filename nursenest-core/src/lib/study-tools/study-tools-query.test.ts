import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseStudyToolsCategoryParam } from "@/lib/study-tools/study-tools-query";

describe("parseStudyToolsCategoryParam", () => {
  it("parses known canonical ids", () => {
    const out = parseStudyToolsCategoryParam("cardiovascular,pharmacology,bogus");
    assert.deepEqual(out, ["cardiovascular", "pharmacology"]);
  });

  it("returns empty for null", () => {
    assert.deepEqual(parseStudyToolsCategoryParam(null), []);
  });
});
