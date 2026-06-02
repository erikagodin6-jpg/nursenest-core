import assert from "node:assert/strict";
import test from "node:test";
import {
  BLOG_POST_FALLBACK_CREATED_AT,
  blogPostCreatedAtIso,
  parseBlogPostCreatedAt,
} from "./safe-blog-post-date";

test("parseBlogPostCreatedAt: empty static date uses fallback", () => {
  const d = parseBlogPostCreatedAt("");
  assert.equal(d.getTime(), BLOG_POST_FALLBACK_CREATED_AT.getTime());
  assert.doesNotThrow(() => d.toISOString());
});

test("blogPostCreatedAtIso: never throws for invalid input", () => {
  const iso = blogPostCreatedAtIso("not-a-date");
  assert.match(iso, /^\d{4}-\d{2}-\d{2}T/);
});
