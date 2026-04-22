import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizePlanString,
  safeParseBlogControlPanelPlan,
} from "@/lib/blog/blog-control-panel-plan-normalize";

function minimalValidPlan() {
  return {
    titleOptions: ["Primary long title for nursing blog", "Secondary long title for nursing blog"],
    recommendedSlug: "primary-long-title-for-nursing-blog",
    metaTitle: "Meta title here at least three chars",
    metaDescription: "m".repeat(22),
    outline: [
      { h2: "First section title", bullets: ["bullet one text here"] },
      { h2: "Second section title" },
      { h2: "Third section title" },
    ],
  };
}

describe("normalizePlanString", () => {
  it("passes through strings", () => {
    assert.equal(normalizePlanString("hello", "t"), "hello");
  });

  it("joins string[] with comma-space for scalar-like paths", () => {
    assert.equal(normalizePlanString(["a", "b"], "metaTitle"), "a, b");
  });

  it("joins string[] with newline for metaDescription path", () => {
    assert.equal(normalizePlanString(["line a", "line b"], "metaDescription"), "line a\nline b");
  });

  it("converts null and undefined to empty string", () => {
    assert.equal(normalizePlanString(null, "x"), "");
    assert.equal(normalizePlanString(undefined, "x"), "");
  });

  it("converts number and boolean", () => {
    assert.equal(normalizePlanString(42, "n"), "42");
    assert.equal(normalizePlanString(false, "b"), "false");
  });

  it("throws for plain object", () => {
    assert.throws(() => normalizePlanString({ a: 1 }, "bad"), /Refusing to coerce plain object/);
  });
});

describe("safeParseBlogControlPanelPlan", () => {
  it("accepts valid string-only plan", () => {
    const r = safeParseBlogControlPanelPlan(minimalValidPlan());
    assert.equal(r.success, true);
    if (r.success) {
      assert.ok(r.data.metaDescription.length >= 20);
    }
  });

  it("coerces string[] on metaDescription then validates", () => {
    const raw = {
      ...minimalValidPlan(),
      metaDescription: ["First paragraph of meta text xx", "Second paragraph of meta text yy"],
    };
    const r = safeParseBlogControlPanelPlan(raw);
    assert.equal(r.success, true);
    if (r.success) {
      assert.ok(r.data.metaDescription.includes("\n"));
    }
  });

  it("fails with normalizeError when object is used for a string scalar", () => {
    const raw = {
      ...minimalValidPlan(),
      metaTitle: { not: "a string" },
    };
    const r = safeParseBlogControlPanelPlan(raw);
    assert.equal(r.success, false);
    if (!r.success) {
      assert.ok(r.normalizeError?.includes("metaTitle"));
    }
  });

  it("coerces short number metaTitle to string then fails Zod min length", () => {
    const raw = {
      ...minimalValidPlan(),
      metaTitle: 1,
    };
    const r = safeParseBlogControlPanelPlan(raw);
    assert.equal(r.success, false);
    if (!r.success) {
      assert.ok(r.zodError);
    }
  });

  it("coerces h3 from a single string to one-element array", () => {
    const raw = {
      ...minimalValidPlan(),
      outline: [
        { h2: "First section title", h3: "single h3 string value" },
        { h2: "Second section title" },
        { h2: "Third section title" },
      ],
    };
    const r = safeParseBlogControlPanelPlan(raw);
    assert.equal(r.success, true);
    if (r.success) {
      assert.deepEqual(r.data.outline[0]?.h3, ["single h3 string value"]);
    }
  });
});
