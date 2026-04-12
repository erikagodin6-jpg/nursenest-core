import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyContentItemLesson,
  contentItemMatchesLessonBankProbe,
  contentItemMatchesPrimaryNursingSurface,
} from "./lesson-accessibility-audit";
import { buildContentItemLessonRow } from "./test-fixtures";

describe("lesson-accessibility-audit", () => {
  it("orphans published lesson when tier is not on any subscriber ladder", () => {
    const row = buildContentItemLessonRow({
      id: "1",
      slug: "x",
      title: "X",
      tier: "orphan_tier_xyz",
    });
    assert.equal(contentItemMatchesLessonBankProbe(row, "US", "NP"), false);
    const c = classifyContentItemLesson(row);
    assert.equal(c.classification, "ORPHANED");
  });

  it("US NP sees np tier BOTH region", () => {
    const row = buildContentItemLessonRow({
      id: "2",
      slug: "y",
      title: "Y",
      tier: "np",
    });
    assert.equal(contentItemMatchesLessonBankProbe(row, "US", "NP"), true);
    assert.equal(contentItemMatchesPrimaryNursingSurface(row), true);
    assert.equal(classifyContentItemLesson(row).classification, "ACCESSIBLE");
  });

  it("free tier visible to RN ladder", () => {
    const row = buildContentItemLessonRow({
      id: "3",
      slug: "z",
      title: "Z",
      tier: "free",
    });
    assert.equal(classifyContentItemLesson(row).classification, "ACCESSIBLE");
  });
});
