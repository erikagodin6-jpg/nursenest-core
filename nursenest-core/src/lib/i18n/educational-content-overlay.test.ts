import { describe, expect, it, beforeEach } from "vitest";
import {
  applyQuestionEducationalOverlayForDisplay,
  clearEducationalOverlayCachesForTests,
  mergeQuestionApiPayload,
  normalizeExamQuestionOptionsArray,
} from "@/lib/i18n/educational-content-overlay";

describe("educational-content-overlay", () => {
  beforeEach(() => {
    clearEducationalOverlayCachesForTests();
  });

  it("normalizeExamQuestionOptionsArray handles string array and label objects", () => {
    expect(normalizeExamQuestionOptionsArray(["a", "b"])).toEqual(["a", "b"]);
    expect(normalizeExamQuestionOptionsArray([{ label: "x" }, { label: "y" }])).toEqual(["x", "y"]);
  });

  it("English locale returns unchanged stem/options and no displayOptions", () => {
    const row = { id: "q1", stem: "Stem", options: ["A", "B"] as unknown, rationale: "R" };
    const m = applyQuestionEducationalOverlayForDisplay(row, "en");
    expect(m.stem).toBe("Stem");
    expect(m.displayOptions).toBeUndefined();
    expect(m.overlayApplied).toBe(false);
  });

  it("mergeQuestionApiPayload preserves topic when not in overlay", () => {
    const q = { id: "x", stem: "S", options: ["a"], topic: "T" };
    const out = mergeQuestionApiPayload(q, "en");
    expect(out.topic).toBe("T");
  });
});
