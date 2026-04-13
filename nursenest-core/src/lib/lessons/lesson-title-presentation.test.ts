import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";

describe("cleanLessonTitleForDisplay", () => {
  it("removes exam suffix and keeps medical acronym casing", () => {
    const title = cleanLessonTitleForDisplay("copd exacerbation nclex-rn");
    assert.equal(title, "COPD Exacerbation");
  });

  it("removes pathway and country parenthetical noise", () => {
    const title = cleanLessonTitleForDisplay("Heart Failure Management (NCLEX-RN, US)");
    assert.equal(title, "Heart Failure Management");
  });
});
