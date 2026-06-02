import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveBlogTopicPresentation } from "@/lib/blog/blog-post-category-visual";

describe("resolveBlogTopicPresentation", () => {
  it("maps pathophysiology to info + archive href", () => {
    const r = resolveBlogTopicPresentation("Pathophysiology review");
    assert.equal(r.variant, "info");
    assert.match(r.categoryArchiveHref ?? "", /^\/blog\/category\//);
    assert.ok(r.displayLabel.length > 0);
  });

  it("returns muted for unknown categories with archive", () => {
    const r = resolveBlogTopicPresentation("Custom editorial label");
    assert.equal(r.variant, "muted");
    assert.ok(r.categoryArchiveHref?.includes(encodeURIComponent("Custom editorial label")));
  });

  it("handles empty category", () => {
    const r = resolveBlogTopicPresentation(null);
    assert.equal(r.displayLabel, "");
    assert.equal(r.categoryArchiveHref, null);
  });
});
