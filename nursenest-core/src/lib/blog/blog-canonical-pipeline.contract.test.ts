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
