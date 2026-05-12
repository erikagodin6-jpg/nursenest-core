import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
/** Package root `nursenest-core/` (contains `src/`). */
const appRoot = join(here, "..", "..", "..");

function readSrc(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("sitemap blog slice uses merged slug rows (DB + static parity)", () => {
  const sitemapBlog = readSrc("src/lib/seo/sitemap-blog-xml.ts");
  assert.match(sitemapBlog, /getMergedBlogSitemapSlugRows/, "blog sitemap must use merged slug resolver");
  assert.ok(!sitemapBlog.includes("getSitemapPublishedBlogSlugsStrict"), "blog sitemap must not call strict helper directly");
});

test("safe-blog-queries exports merged sitemap helper alongside strict", () => {
  const q = readSrc("src/lib/blog/safe-blog-queries.ts");
  assert.match(q, /export async function getMergedBlogSitemapSlugRows/, "merged blog sitemap export must exist");
  assert.match(q, /export async function getSitemapPublishedBlogSlugsStrict/, "strict helper remains for scripts / diagnostics");
});

// ─── SEO hardening pass (2026-05-12) ────────────────────────────────────────

test("safe-blog-queries exports getSitemapBlogTagsAndCategories", () => {
  const q = readSrc("src/lib/blog/safe-blog-queries.ts");
  assert.match(
    q,
    /export async function getSitemapBlogTagsAndCategories/,
    "tag/category sitemap helper must be exported",
  );
});

test("getSitemapBlogTagsAndCategories seeds from both static corpus and DB", () => {
  const q = readSrc("src/lib/blog/safe-blog-queries.ts");
  assert.match(q, /listStaticBlogPostsForIndex.*getSitemapBlogTagsAndCategories|getSitemapBlogTagsAndCategories[\s\S]*listStaticBlogPostsForIndex/,
    "must read static posts");
  assert.match(q, /listBlogStaticLongtailRecords.*getSitemapBlogTagsAndCategories|getSitemapBlogTagsAndCategories[\s\S]*listBlogStaticLongtailRecords/,
    "must read longtail records");
  assert.match(q, /tagSet.*categorySet|categorySet.*tagSet/, "must maintain separate deduped sets for tags and categories");
});

test("sitemap-blog-xml imports getSitemapBlogTagsAndCategories", () => {
  const xml = readSrc("src/lib/seo/sitemap-blog-xml.ts");
  assert.match(xml, /getSitemapBlogTagsAndCategories/, "must import the tag/category helper");
});

test("sitemap-blog-xml emits /blog/tag/ entries from tag collection", () => {
  const xml = readSrc("src/lib/seo/sitemap-blog-xml.ts");
  assert.match(xml, /\/blog\/tag\//, "must emit /blog/tag/ prefix for tag hub URLs");
  assert.match(xml, /encodeURIComponent\(tag\)/, "must encode tag for URL safety");
});

test("sitemap-blog-xml emits /blog/category/ entries from category collection", () => {
  const xml = readSrc("src/lib/seo/sitemap-blog-xml.ts");
  assert.match(xml, /\/blog\/category\//, "must emit /blog/category/ prefix for category hub URLs");
  assert.match(xml, /encodeURIComponent\(cat\)/, "must encode category for URL safety");
});

test("sitemap-blog-xml deduplicates tag/category URLs via seenLoc", () => {
  const xml = readSrc("src/lib/seo/sitemap-blog-xml.ts");
  const seenLocMatches = (xml.match(/seenLoc/g) ?? []).length;
  assert.ok(seenLocMatches >= 4, `seenLoc must be checked for tag and category entries (found ${seenLocMatches} references)`);
});

test("sitemap-blog-xml wraps tag/category collection in try/catch (non-fatal)", () => {
  const xml = readSrc("src/lib/seo/sitemap-blog-xml.ts");
  assert.match(
    xml,
    /try\s*\{[\s\S]*getSitemapBlogTagsAndCategories[\s\S]*\}\s*catch/,
    "tag/category collection must be non-fatal (try/catch)",
  );
});

test("blog publish revalidation busts sitemap-blog.xml CDN cache", () => {
  const pub = readSrc("src/lib/blog/blog-revalidate-publishing.ts");
  assert.match(pub, /revalidatePath\(["']\/sitemap-blog\.xml["']\)/, "must revalidate sitemap-blog.xml on publish");
});

test("blog publish revalidation busts sitemap-fr-blog.xml and sitemap-es-blog.xml", () => {
  const pub = readSrc("src/lib/blog/blog-revalidate-publishing.ts");
  assert.match(pub, /revalidatePath\(["']\/sitemap-fr-blog\.xml["']\)/, "must revalidate French blog sitemap");
  assert.match(pub, /revalidatePath\(["']\/sitemap-es-blog\.xml["']\)/, "must revalidate Spanish blog sitemap");
});
