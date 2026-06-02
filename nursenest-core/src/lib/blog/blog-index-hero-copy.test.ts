import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_MARKETING_BLOG_INDEX,
  localizedMarketingBlogIndexCopy,
} from "@/lib/blog/blog-index-hero-copy";

test("default marketing blog index is not Canada-titled", () => {
  assert.ok(!/canada|rex-pn|canadian/i.test(DEFAULT_MARKETING_BLOG_INDEX.metadataTitle));
  assert.ok(!/canada|rex-pn|canadian/i.test(DEFAULT_MARKETING_BLOG_INDEX.metadataDescription));
  assert.ok(!/canada|rex-pn|canadian/i.test(DEFAULT_MARKETING_BLOG_INDEX.inlineH1Default));
});

test("US localized blog hero never includes Canada-only exam strings", () => {
  const us = localizedMarketingBlogIndexCopy("us", "United States", "nclex-rn");
  assert.ok(!/\bREx-PN\b/i.test(us.heroSubtitle));
  assert.ok(!/for Canada|Canadian\b/i.test(us.heroSubtitle));
  assert.match(us.heroSubtitle, /NCLEX-RN and NCLEX-PN/i);
});

test("Canada localized blog hero includes Canadian pathway context", () => {
  const ca = localizedMarketingBlogIndexCopy("canada", "Canada", "nclex-rn");
  assert.match(ca.heroSubtitle, /for Canada/i);
  assert.match(ca.heroSubtitle, /REx-PN/i);
});
