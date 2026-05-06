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
