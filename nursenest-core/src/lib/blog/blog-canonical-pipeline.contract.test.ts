import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
/** Package root (`nursenest-core/` app): `src/lib/blog` → three parents up. */
const appRoot = join(here, "..", "..", "..");

function readSrc(rel: string): string {
  return readFileSync(join(appRoot, "src", rel), "utf8");
}

function readScript(rel: string): string {
  return readFileSync(join(appRoot, rel), "utf8");
}

test("admin blog PATCH publish uses publishBlogPostCanonical (single write path)", () => {
  const admin = readSrc("app/api/admin/blog/[id]/route.ts");
  assert.match(admin, /publishBlogPostCanonical\(/);
  assert.match(admin, /admin_patch_publish_now/);
});

test("public blog detail reads getPublishedBlogPostBySlug from safe-blog-queries", () => {
  const page = readSrc("app/(marketing)/(default)/blog/[slug]/page.tsx");
  assert.match(page, /getPublishedBlogPostBySlug/);
  assert.match(page, /safe-blog-queries/);
});

test("public blog index imports safe-blog-queries list path", () => {
  const page = readSrc("app/(marketing)/(default)/blog/page.tsx");
  assert.match(page, /safe-blog-queries/);
});

test("blog sitemap slice uses merged slug helper from safe-blog-queries", () => {
  const sitemap = readSrc("lib/seo/sitemap-blog-xml.ts");
  assert.match(sitemap, /getMergedBlogSitemapSlugRows/);
});

test("audit-hidden-blogs runner: dry-run exits before apply; apply guarded", () => {
  const runner = readScript("scripts/audit-hidden-blogs-runner.mts");
  assert.match(
    runner,
    /if \(!cli\.apply && !cli\.applyJobs\)/,
    "must exit dry-run when neither apply flag is set",
  );
  assert.match(runner, /if \(cli\.apply\) \{/, "post publish loop must be inside cli.apply only");
  assert.match(runner, /if \(cli\.applyJobs\) \{/, "job defer loop must be separate");
  assert.match(runner, /--repair-content/, "repair flag must be acknowledged");
  assert.match(runner, /audit_hidden_blogs_apply/, "apply context must be explicit");
});

test("publishBlogPostCanonical includes audit_hidden_blogs_apply context", () => {
  const pub = readSrc("lib/blog/publish-blog-post-canonical.ts");
  assert.match(pub, /audit_hidden_blogs_apply/);
});

test("import-hidden-blog-content script only mutates when --apply and Prisma client exist", () => {
  const script = readScript("scripts/blog/import-hidden-blog-content.mts");
  assert.match(script, /if \(!args\.apply \|\| !prisma\) continue/);
  assert.match(script, /--publish requires --apply/);
});

// ─── SEO hardening pass (2026-05-12) ────────────────────────────────────────

test("blog post metadata emits twitter card with summary_large_image", () => {
  const page = readSrc("app/(marketing)/(default)/blog/[slug]/page.tsx");
  assert.match(page, /twitter/, "metadata must include twitter object");
  assert.match(page, /summary_large_image/, "twitter card must be summary_large_image");
});

test("blog post metadata emits OG image via resolveBlogOgImageAbsolute", () => {
  const page = readSrc("app/(marketing)/(default)/blog/[slug]/page.tsx");
  assert.match(page, /resolveBlogOgImageAbsolute/, "must import resolveBlogOgImageAbsolute");
  assert.match(page, /ogImage.*images.*url.*ogImage|images.*url.*ogImage/s, "must spread ogImage into openGraph.images");
});

test("blog index generateMetadata reads searchParams for pagination canonical", () => {
  const page = readSrc("app/(marketing)/(default)/blog/page.tsx");
  assert.match(page, /searchParams.*Promise.*page/, "generateMetadata must accept searchParams");
  assert.match(
    page,
    /canonicalPath.*page <= 1.*\/blog.*\/blog\?page=\$\{page\}/s,
    "canonical must be /blog for page 1 and /blog?page=N for page N",
  );
});

test("blog index canonical uses page-aware path in alternates", () => {
  const page = readSrc("app/(marketing)/(default)/blog/page.tsx");
  assert.match(page, /alternates.*canonical.*absoluteUrl\(canonicalPath\)/s, "alternates.canonical must use canonicalPath variable");
  assert.match(page, /openGraph.*url.*absoluteUrl\(canonicalPath\)/s, "openGraph.url must also use canonicalPath");
});

test("blog detail page redirects career-scoped posts to canonical path", () => {
  const page = readSrc("app/(marketing)/(default)/blog/[slug]/page.tsx");
  assert.match(page, /from "next\/navigation".*redirect|redirect.*from "next\/navigation"/s, "must import redirect from next/navigation");
  assert.match(page, /expectedCanonicalBlogPath/, "must import expectedCanonicalBlogPath");
  assert.match(
    page,
    /expectedCanonicalBlogPath\(slug, post\.careerSlug\)/,
    "must call expectedCanonicalBlogPath with slug and post.careerSlug",
  );
  assert.match(
    page,
    /if \(canonicalPath !== `\/blog\/\$\{slug\}`\) redirect\(canonicalPath\)/,
    "must redirect when canonical path differs from /blog/{slug}",
  );
});

test("blog tag page emits page-specific canonical for paginated results", () => {
  const page = readSrc("app/(marketing)/(default)/blog/tag/[tag]/page.tsx");
  assert.match(page, /canonicalPath.*page <= 1.*path.*page/s, "tag page canonical must vary by page number");
  assert.match(page, /alternates.*canonical.*absoluteUrl\(canonicalPath\)/s, "alternates.canonical must use canonical path");
});

test("blog category page emits page-specific canonical for paginated results", () => {
  const page = readSrc("app/(marketing)/(default)/blog/category/[category]/page.tsx");
  assert.match(page, /canonicalPath.*page <= 1.*path.*page/s, "category page canonical must vary by page number");
  assert.match(page, /alternates.*canonical.*absoluteUrl\(canonicalPath\)/s, "alternates.canonical must use canonical path");
});
