import assert from "node:assert/strict";
import { test } from "node:test";
import {
  blogSeoBundleSchema,
  normalizeBlogBreadcrumbsForStorage,
  parseBlogSeoBundle,
  resolvePublicCanonicalUrl,
  sanitizeCanonicalPath,
} from "./blog-seo-automation";

test("sanitizeCanonicalPath only accepts matching /blog/slug", () => {
  assert.equal(sanitizeCanonicalPath("my-post", "/blog/my-post"), "/blog/my-post");
  assert.equal(sanitizeCanonicalPath("my-post", "/blog/other"), null);
  assert.equal(sanitizeCanonicalPath("my-post", null), null);
});

test("normalizeBlogBreadcrumbsForStorage fixes weak AI trails", () => {
  const rows = normalizeBlogBreadcrumbsForStorage("x", "Title", []);
  assert.equal(rows.length, 3);
  assert.equal(rows[2].href, "/blog/x");
});

test("parseBlogSeoBundle accepts valid bundle", () => {
  const raw = {
    version: 1,
    normalizedBreadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "T", href: "/blog/slug" },
    ],
    suggestedExcerpt: "x".repeat(80),
    emitFaqSchema: true,
    focusKeywords: ["a", "b"],
    imageAlts: [],
  };
  const p = parseBlogSeoBundle(raw);
  assert.ok(p);
  assert.ok(blogSeoBundleSchema.safeParse(raw).success);
});

test("resolvePublicCanonicalUrl uses default without override", () => {
  assert.ok(resolvePublicCanonicalUrl("abc", null).endsWith("/blog/abc"));
});
