/**
 * SEO hardening contract tests for the blog pipeline.
 *
 * Coverage:
 *  - OG / Twitter metadata helpers (resolveBlogOgImageAbsolute, resolveOpenGraphCopy)
 *  - twitter:card constant in blog post page
 *  - Paginated blog canonical path behaviour (/blog vs /blog?page=N)
 *  - Career-scoped canonical routing (expectedCanonicalBlogPath)
 *  - Redirect guard on /blog/[slug] for career-scoped posts
 *  - Sitemap tag + category hub inclusion (sitemap-blog-xml.ts contract)
 *  - Sitemap entry deduplication contract
 *  - Publish revalidation surfaces for sitemap-blog.xml / sitemap-fr-blog.xml / sitemap-es-blog.xml
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  resolveBlogOgImageAbsolute,
  resolveOpenGraphCopy,
  type BlogSeoBundle,
} from "@/lib/blog/blog-seo-automation";
import { expectedCanonicalBlogPath } from "@/lib/blog/generated-blog-post-publish";

const here = dirname(fileURLToPath(import.meta.url));
// nursenest-core/ (contains src/)
const appRoot = join(here, "..", "..", "..");

function readSrc(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

function minBundle(overrides?: Partial<BlogSeoBundle>): BlogSeoBundle {
  return {
    version: 1,
    normalizedBreadcrumbs: [],
    suggestedExcerpt: "x".repeat(20),
    emitFaqSchema: false,
    focusKeywords: [],
    imageAlts: [],
    ...overrides,
  };
}

// ── OG / Twitter metadata helpers ────────────────────────────────────────────

test("resolveBlogOgImageAbsolute returns undefined when no image provided", () => {
  assert.equal(resolveBlogOgImageAbsolute(null, null), undefined);
  assert.equal(resolveBlogOgImageAbsolute(null, undefined), undefined);
  assert.equal(resolveBlogOgImageAbsolute(null, ""), undefined);
  assert.equal(resolveBlogOgImageAbsolute(null, "  "), undefined);
});

test("resolveBlogOgImageAbsolute accepts well-formed absolute https cover image URL", () => {
  const url = "https://cdn.nursenest.ca/img/nclex-study.jpg";
  assert.equal(resolveBlogOgImageAbsolute(null, url), url);
});

test("resolveBlogOgImageAbsolute wraps site-relative cover path with absoluteUrl", () => {
  const result = resolveBlogOgImageAbsolute(null, "/cdn/nclex-study.jpg");
  assert.ok(typeof result === "string", "expected a string result");
  assert.ok(result.startsWith("https://"), `expected https URL, got ${result}`);
  assert.ok(result.endsWith("/cdn/nclex-study.jpg"), `expected path suffix, got ${result}`);
});

test("resolveBlogOgImageAbsolute prefers bundle openGraphImageUrl over cover image", () => {
  const bundleUrl = "https://cdn.nursenest.ca/img/bundle-override.jpg";
  const result = resolveBlogOgImageAbsolute(
    minBundle({ openGraphImageUrl: bundleUrl }),
    "https://cdn.nursenest.ca/img/cover.jpg",
  );
  assert.equal(result, bundleUrl);
});

test("resolveBlogOgImageAbsolute rejects bare relative paths (no leading slash)", () => {
  assert.equal(resolveBlogOgImageAbsolute(null, "img/relative.jpg"), undefined);
});

test("resolveBlogOgImageAbsolute rejects insecure http URLs", () => {
  assert.equal(resolveBlogOgImageAbsolute(null, "http://cdn.nursenest.ca/img/nclex.jpg"), undefined);
});

test("resolveOpenGraphCopy falls back to title and description when no bundle", () => {
  const { title, description } = resolveOpenGraphCopy(null, "My title", "My description");
  assert.equal(title, "My title");
  assert.equal(description, "My description");
});

test("resolveOpenGraphCopy uses bundle overrides when set", () => {
  const bundle = minBundle({ openGraphTitle: "OG title override", openGraphDescription: "OG desc override" });
  const { title, description } = resolveOpenGraphCopy(bundle, "Fallback title", "Fallback desc");
  assert.equal(title, "OG title override");
  assert.equal(description, "OG desc override");
});

test("resolveOpenGraphCopy falls back when bundle fields are null/empty", () => {
  const bundle = minBundle({ openGraphTitle: null, openGraphDescription: null });
  const { title } = resolveOpenGraphCopy(bundle, "Fallback", "Fallback desc");
  assert.equal(title, "Fallback");
});

// ── twitter:card / og:image source audit (page component) ────────────────────

test("blog post generateMetadata emits twitter:card as summary_large_image", () => {
  const src = readSrc("src/app/(marketing)/(default)/blog/[slug]/page.tsx");
  assert.match(src, /card:\s*["']summary_large_image["']/, "twitter:card must be summary_large_image");
});

test("blog post generateMetadata emits twitter:image when ogImage resolves", () => {
  const src = readSrc("src/app/(marketing)/(default)/blog/[slug]/page.tsx");
  assert.match(src, /twitter:/, "twitter metadata object must be present");
  // Conditional images spread: `...(ogImage ? { images: [...] } : {})`
  assert.match(src, /ogImage.*images/, "twitter images must be conditional on ogImage");
});

test("blog post generateMetadata emits og:image when ogImage resolves", () => {
  const src = readSrc("src/app/(marketing)/(default)/blog/[slug]/page.tsx");
  assert.match(src, /openGraph:/, "openGraph metadata object must be present");
  assert.match(src, /resolveBlogOgImageAbsolute/, "OG image must go through resolveBlogOgImageAbsolute");
});

test("career blog post generateMetadata also emits twitter:card and og:image", () => {
  const src = readSrc(
    "src/app/(marketing)/(default)/nursing/[careerSlug]/blog/[postSlug]/page.tsx",
  );
  assert.match(src, /card:\s*["']summary_large_image["']/, "career blog twitter:card must be summary_large_image");
  assert.match(src, /resolveBlogOgImageAbsolute/, "career blog OG image must go through resolveBlogOgImageAbsolute");
});

// ── Paginated canonical behaviour ─────────────────────────────────────────────

test("blog index canonical uses /blog for page <= 1", () => {
  const src = readSrc("src/app/(marketing)/(default)/blog/page.tsx");
  assert.match(
    src,
    /page\s*<=\s*1\s*\?\s*["'`]\/blog["'`]/,
    "canonical must be /blog when page <= 1",
  );
});

test("blog index canonical uses /blog?page=N for page > 1", () => {
  const src = readSrc("src/app/(marketing)/(default)/blog/page.tsx");
  assert.match(
    src,
    /`\/blog\?page=\$\{page\}`/,
    "canonical must embed page number for page > 1",
  );
});

test("blog index generateMetadata does not default paginated canonical to /blog", () => {
  // The canonical path must never unconditionally be "/blog" — it must branch on page.
  const src = readSrc("src/app/(marketing)/(default)/blog/page.tsx");
  // Confirm the conditional expression exists and is not just a literal "/blog".
  assert.match(src, /canonicalPath\s*=\s*page\s*<=\s*1/, "canonicalPath must use page guard");
});

// ── Career-scoped canonical routing ──────────────────────────────────────────

test("expectedCanonicalBlogPath: null/empty careerSlug → /blog/{slug}", () => {
  assert.equal(expectedCanonicalBlogPath("my-post", null), "/blog/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", ""), "/blog/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", "  "), "/blog/my-post");
});

test("expectedCanonicalBlogPath: rn careerSlug → /blog/rn/{slug}", () => {
  assert.equal(expectedCanonicalBlogPath("my-post", "rn"), "/blog/rn/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", "RN"), "/blog/rn/my-post");
});

test("expectedCanonicalBlogPath: nursing careers → /nursing/{career}/blog/{slug}", () => {
  assert.equal(expectedCanonicalBlogPath("my-post", "pn"), "/nursing/pn/blog/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", "np"), "/nursing/np/blog/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", "lpn"), "/nursing/lpn/blog/my-post");
});

test("expectedCanonicalBlogPath: allied profession careers → /allied-health/{key}/blog/{slug}", () => {
  assert.equal(expectedCanonicalBlogPath("my-post", "paramedic"), "/allied-health/paramedic/blog/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", "respiratory"), "/allied-health/respiratory/blog/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", "mlt"), "/allied-health/mlt/blog/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", "imaging"), "/allied-health/imaging/blog/my-post");
  assert.equal(expectedCanonicalBlogPath("my-post", "sonography"), "/allied-health/sonography/blog/my-post");
});

test("blog post page redirects when career-scoped canonical differs from /blog/{slug}", () => {
  const src = readSrc("src/app/(marketing)/(default)/blog/[slug]/page.tsx");
  assert.match(src, /expectedCanonicalBlogPath/, "must call expectedCanonicalBlogPath");
  assert.match(src, /canonicalPath\s*!==\s*`\/blog\/\$\{slug\}`/, "must compare against plain /blog/{slug}");
  assert.match(src, /redirect\(canonicalPath\)/, "must redirect to canonical path");
});

// ── Sitemap tag and category hub inclusion ────────────────────────────────────

test("sitemap-blog-xml fetches tag and category hubs for sitemap inclusion", () => {
  const src = readSrc("src/lib/seo/sitemap-blog-xml.ts");
  assert.match(src, /getSitemapBlogTagsAndCategories/, "must call tag+category collector");
  assert.match(src, /\/blog\/tag\//, "must build tag hub URLs");
  assert.match(src, /\/blog\/category\//, "must build category hub URLs");
});

test("sitemap-blog-xml deduplicates entries with a seenLoc Set", () => {
  const src = readSrc("src/lib/seo/sitemap-blog-xml.ts");
  assert.match(src, /seenLoc\s*=\s*new Set/, "must initialise seenLoc Set");
  assert.match(src, /seenLoc\.has\(/, "must check seenLoc before adding");
  assert.match(src, /seenLoc\.add\(/, "must add to seenLoc after check");
});

test("sitemap-blog-xml fallback entry is always /blog (never empty urlset)", () => {
  const src = readSrc("src/app/sitemap-blog.xml/route.ts");
  assert.match(src, /loc:\s*`\$\{origin\}\/blog`/, "fallback entry must be /blog");
});

test("tag hubs with zero posts emit noindex via metadata", () => {
  const tagSrc = readSrc("src/app/(marketing)/(default)/blog/tag/[tag]/page.tsx");
  assert.match(tagSrc, /count\s*===\s*0.*robots.*index:\s*false/s, "tag page must noindex when count === 0");
});

test("category hubs with zero posts emit noindex via metadata", () => {
  const catSrc = readSrc("src/app/(marketing)/(default)/blog/category/[category]/page.tsx");
  assert.match(catSrc, /count\s*===\s*0.*robots.*index:\s*false/s, "category page must noindex when count === 0");
});

// ── Publish revalidation: all three blog sitemaps ─────────────────────────────

test("revalidateBlogPublishingSurfaces revalidates sitemap-blog.xml", () => {
  const src = readSrc("src/lib/blog/blog-revalidate-publishing.ts");
  assert.match(src, /revalidatePath\(["']\/sitemap-blog\.xml["']\)/, "must revalidate /sitemap-blog.xml");
});

test("revalidateBlogPublishingSurfaces revalidates sitemap-fr-blog.xml", () => {
  const src = readSrc("src/lib/blog/blog-revalidate-publishing.ts");
  assert.match(src, /revalidatePath\(["']\/sitemap-fr-blog\.xml["']\)/, "must revalidate /sitemap-fr-blog.xml");
});

test("revalidateBlogPublishingSurfaces revalidates sitemap-es-blog.xml", () => {
  const src = readSrc("src/lib/blog/blog-revalidate-publishing.ts");
  assert.match(src, /revalidatePath\(["']\/sitemap-es-blog\.xml["']\)/, "must revalidate /sitemap-es-blog.xml");
});
