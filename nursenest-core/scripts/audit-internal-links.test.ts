import assert from "node:assert/strict";
import { test } from "node:test";
import { createRouteValidator, isValidInternalPath, collectApiPatterns, collectPagePatterns } from "./audit-internal-links";

test("rejects garbage under locale-prefixed marketing paths", () => {
  const { isValidPath } = createRouteValidator();
  assert.equal(isValidPath("/fr/not-a-valid-programmatic-or-static-page"), false);
});

test("accepts programmatic slug and locale × programmatic", () => {
  const { isValidPath } = createRouteValidator();
  assert.equal(isValidPath("/nclex-rn-practice-questions"), true);
  assert.equal(isValidPath("/fr/nclex-rn-practice-questions"), true);
});

test("accepts exam hub paths", () => {
  const { isValidPath } = createRouteValidator();
  assert.equal(isValidPath("/us/rn/nclex-rn"), true);
});

test("accepts learner app paths", () => {
  const pages = collectPagePatterns();
  const apis = collectApiPatterns();
  assert.equal(isValidInternalPath("/app/questions", pages, apis), true);
  assert.equal(isValidInternalPath("/api/health", pages, apis), true);
});
