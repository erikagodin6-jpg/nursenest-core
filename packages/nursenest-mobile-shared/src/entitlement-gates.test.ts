import { describe, expect, it } from "vitest";
import { canShowPaidLessonProgressRow } from "./entitlement-gates.js";

describe("canShowPaidLessonProgressRow", () => {
  it("is false without access", () => {
    expect(canShowPaidLessonProgressRow({ hasAccess: false, canShowLessonProgress: true })).toBe(false);
  });

  it("is false when progress flag off", () => {
    expect(canShowPaidLessonProgressRow({ hasAccess: true, canShowLessonProgress: false })).toBe(false);
  });

  it("is true only when both flags set", () => {
    expect(canShowPaidLessonProgressRow({ hasAccess: true, canShowLessonProgress: true })).toBe(true);
  });
});
