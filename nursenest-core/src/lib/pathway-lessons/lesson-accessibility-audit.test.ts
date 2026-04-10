import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyContentItemLesson,
  contentItemMatchesLessonBankProbe,
  contentItemMatchesPrimaryNursingSurface,
} from "./lesson-accessibility-audit";

describe("lesson-accessibility-audit", () => {
  it("orphans published lesson when tier is not on any subscriber ladder", () => {
    const row = {
      id: "1",
      slug: "x",
      title: "X",
      type: "lesson",
      status: "published",
      tier: "orphan_tier_xyz",
      regionScope: "BOTH",
    };
    assert.equal(contentItemMatchesLessonBankProbe(row, "US", "NP"), false);
    const c = classifyContentItemLesson(row);
    assert.equal(c.classification, "ORPHANED");
  });

  it("US NP sees np tier BOTH region", () => {
    const row = {
      id: "2",
      slug: "y",
      title: "Y",
      type: "lesson",
      status: "published",
      tier: "np",
      regionScope: "BOTH",
    };
    assert.equal(contentItemMatchesLessonBankProbe(row, "US", "NP"), true);
    assert.equal(contentItemMatchesPrimaryNursingSurface(row), true);
    assert.equal(classifyContentItemLesson(row).classification, "ACCESSIBLE");
  });

  it("free tier visible to RN ladder", () => {
    const row = {
      id: "3",
      slug: "z",
      title: "Z",
      type: "lesson",
      status: "published",
      tier: "free",
      regionScope: "BOTH",
    };
    assert.equal(classifyContentItemLesson(row).classification, "ACCESSIBLE");
  });
});
