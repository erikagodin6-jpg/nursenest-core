/**
 * Run: `npx tsx --test scripts/blog/pathophysiology-nursing-blog-seed-catalog.test.ts`
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPathophysiologyBlogBody,
  enumeratePathophysiologySeeds,
  excerptFromBody,
} from "./pathophysiology-nursing-blog-seed-catalog";

test("enumeratePathophysiologySeeds yields 500 unique slugs by default", () => {
  const topics = enumeratePathophysiologySeeds(500);
  assert.equal(topics.length, 500);
  const slugs = new Set(topics.map((t) => t.slug));
  assert.equal(slugs.size, 500);
});

test("body builds with internal links and disclaimer", () => {
  const topics = enumeratePathophysiologySeeds(1);
  const html = buildPathophysiologyBlogBody(topics[0]!);
  assert.match(html, /Educational use only/);
  assert.match(html, /\/blog/);
  assert.match(html, /question-bank/);
  const ex = excerptFromBody(html);
  assert.ok(ex.length > 40);
});
