/**
 * Regression: invalid dashboard hrefs must not reach Next.js Link (production crash / inert UI).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { coerceSafeLearnerNavHref } from "@/lib/learner/safe-app-href";

describe("coerceSafeLearnerNavHref", () => {
  it("keeps normal /app paths", () => {
    assert.equal(coerceSafeLearnerNavHref("/app/questions"), "/app/questions");
    assert.equal(coerceSafeLearnerNavHref("/app/lessons/foo"), "/app/lessons/foo");
    assert.equal(coerceSafeLearnerNavHref("/app"), "/app");
  });

  it("replaces empty, hash-only, protocol-relative, and non-app paths", () => {
    assert.equal(coerceSafeLearnerNavHref(""), "/app/questions");
    assert.equal(coerceSafeLearnerNavHref("   "), "/app/questions");
    assert.equal(coerceSafeLearnerNavHref("#"), "/app/questions");
    assert.equal(coerceSafeLearnerNavHref(null), "/app/questions");
    assert.equal(coerceSafeLearnerNavHref("//evil.com"), "/app/questions");
    assert.equal(coerceSafeLearnerNavHref("/marketing/foo"), "/app/questions");
    assert.equal(coerceSafeLearnerNavHref("https://x.test/app/foo"), "/app/questions");
  });
});
