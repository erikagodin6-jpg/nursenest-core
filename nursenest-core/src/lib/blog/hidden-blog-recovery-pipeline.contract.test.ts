import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("package scripts expose hidden blog audit/import/verification commands", () => {
  const pkg = JSON.parse(readAppFile("package.json")) as { scripts?: Record<string, string> };
  assert.equal(
    pkg.scripts?.["blog:audit:hidden"],
    "npx tsx scripts/blog/report-hidden-content-audit.mts",
  );
  assert.equal(
    pkg.scripts?.["blog:audit:hidden:db"],
    "npx tsx scripts/blog/report-hidden-content-audit.mts --require-database",
  );
  assert.equal(
    pkg.scripts?.["blog:import-hidden"],
    "npx tsx scripts/blog/import-hidden-blog-content.mts",
  );
  assert.equal(
    pkg.scripts?.["blog:verify-publication-readiness"],
    "npx tsx scripts/blog/verify-blog-publication-readiness.mts",
  );
  assert.equal(
    pkg.scripts?.["blog:report:ssot"],
    "npx tsx scripts/blog/write-blog-admin-public-ssot.mts",
  );
});

test("hidden import script stays dry-run first and guards writes", () => {
  const script = readAppFile("scripts/blog/import-hidden-blog-content.mts");
  assert.match(script, /let dryRun = true;/);
  assert.match(script, /if \(a === "--apply"\) \{/);
  assert.match(script, /if \(args\.publish && !args\.apply\)/);
  assert.match(script, /if \(!args\.apply \|\| !prisma\) continue;/);
  assert.match(script, /publishBlogPostCanonical\(/);
  assert.match(script, /audit_hidden_blogs_apply/);
});

test("publication readiness verifier exists and writes the expected report", () => {
  const verifierPath = join(appRoot, "scripts", "blog", "verify-blog-publication-readiness.mts");
  assert.equal(existsSync(verifierPath), true, "expected verifier script to exist");
  const verifier = readFileSync(verifierPath, "utf8");
  assert.match(verifier, /blog-publication-readiness\.md/);
  assert.match(verifier, /BlogPostStatus\.PUBLISHED/);
  assert.match(verifier, /blogPostIsLive/);
});

test("admin/public SSOT report writer documents canonical BlogPost backing", () => {
  const ssotWriter = readAppFile("scripts/blog/write-blog-admin-public-ssot.mts");
  assert.match(ssotWriter, /Canonical public English blog posts.*BlogPost/);
  assert.match(ssotWriter, /LocalizedBlogArticle/);
  assert.match(ssotWriter, /ContentItem/);
});
