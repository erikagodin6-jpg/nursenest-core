import assert from "node:assert/strict";
import test from "node:test";

import type { PrePublishValidationResult } from "@/lib/blog/blog-pre-publish-validation";
import { blogRecoveryRevalidationTargets } from "@/lib/legacy/legacy-blog-recovery-revalidate";
import {
  BLOG_RECOVERY_HARD_MIN_WORDS,
  filterBlockingForEmergencyPublish,
  hasObviousPlaceholderText,
  hasUnsafeHtml,
  recoveryBodyWordCount,
} from "@/lib/legacy/legacy-blog-draft-recovery-gates";

function mockResult(blockingIds: string[]): PrePublishValidationResult {
  const blocking = blockingIds.map((id) => ({
    id: id as import("@/lib/blog/blog-pre-publish-validation").PrePublishCheckId,
    severity: "block" as const,
    message: id,
    fix: "fix",
  }));
  return {
    issues: blocking,
    blocking,
    warnings: [],
    okToPublish: blocking.length === 0,
    hasWarnings: false,
  };
}

test("emergency mode removes soft body_word_count when words meet hard floor", () => {
  const r = mockResult(["body_word_count"]);
  const out = filterBlockingForEmergencyPublish(r, BLOG_RECOVERY_HARD_MIN_WORDS + 50, true);
  assert.equal(out.length, 0);
});

test("emergency mode keeps body_word_count block when under hard floor", () => {
  const r = mockResult(["body_word_count"]);
  const out = filterBlockingForEmergencyPublish(r, BLOG_RECOVERY_HARD_MIN_WORDS - 1, true);
  assert.equal(out.length, 1);
});

test("slug_unique is never bypassed in emergency", () => {
  const r = mockResult(["slug_unique"]);
  const out = filterBlockingForEmergencyPublish(r, 500, true);
  assert.equal(out.length, 1);
});

test("hasUnsafeHtml detects script tags", () => {
  assert.equal(hasUnsafeHtml("<p>ok</p><script>x</script>"), true);
  assert.equal(hasUnsafeHtml("<p>ok</p>"), false);
});

test("placeholder detection", () => {
  assert.equal(hasObviousPlaceholderText("lorem ipsum here", "Title"), true);
  assert.equal(hasObviousPlaceholderText("<p>Clinical content about fluids.</p>", "Fluids"), false);
});

test("revalidation targets include /blog and article path", () => {
  const t = blogRecoveryRevalidationTargets("my-slug");
  assert.ok(t.paths.includes("/blog"));
  assert.ok(t.paths.includes("/blog/my-slug"));
});

test("word count from html", () => {
  const html = `<p>${Array.from({ length: 320 }, () => "word").join(" ")}</p>`;
  assert.ok(recoveryBodyWordCount(html) >= 300);
});
