import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  legacyLessonTitleSimilarity,
  pickSingleTitleMatch,
} from "@/lib/legacy/legacy-lesson-match";

describe("legacy-lesson-match", () => {
  it("scores highly for near-identical titles", () => {
    assert.ok(legacyLessonTitleSimilarity("Acute MI: troponins", "Acute MI Troponins") > 0.5);
  });

  it("picks one row when clearly best", () => {
    const rows = [
      { title: "Unrelated topic about skin", id: "a" },
      { title: "Fluid and electrolyte balance in acute care", id: "b" },
      { title: "Fluid electrolyte balance acute care nursing", id: "c" },
    ];
    const pick = pickSingleTitleMatch("Fluid and electrolyte balance in acute care", rows, 0.75, 0.03);
    assert.equal(pick.match, "one");
    if (pick.match === "one") assert.equal(pick.row.id, "b");
  });

  it("returns ambiguous when two titles tie", () => {
    const rows = [
      { title: "Heart failure overview", id: "1" },
      { title: "Heart failure overview", id: "2" },
    ];
    const pick = pickSingleTitleMatch("Heart failure overview", rows, 0.9, 0.01);
    assert.equal(pick.match, "ambiguous");
  });
});
