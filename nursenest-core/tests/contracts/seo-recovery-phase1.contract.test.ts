/**
 * SEO Recovery Phase 1 contract.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/seo-recovery-phase1.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf8");
}

describe("SEO recovery phase 1 reporting", () => {
  const auditScript = read("scripts/seo/google-indexing-emergency-audit.ts");

  it("generates dedicated 5xx inventory, root-cause, and Search Console recovery reports", () => {
    assert.match(auditScript, /seo-5xx-inventory\.md/, "5xx inventory report missing");
    assert.match(auditScript, /seo-5xx-root-cause-analysis\.md/, "5xx root cause report missing");
    assert.match(auditScript, /search-console-recovery-checklist\.md/, "Search Console checklist missing");
  });

  it("keeps 5xx inventory evidence explicit when GSC exports are unavailable", () => {
    assert.match(auditScript, /Unable To Verify/, "inventory must not invent missing GSC frequency/seen data");
    assert.match(auditScript, /provisional5xxRowsFromLiveTimeouts/, "live timeout evidence fallback missing");
  });
});

describe("crawl-health CI gate", () => {
  const packageJson = JSON.parse(read("package.json")) as { scripts: Record<string, string> };
  const seeds = read("tests/e2e/crawl-health/helpers/seed-urls.ts");

  it("exposes local and remote crawl-health scripts", () => {
    assert.equal(packageJson.scripts["qa:crawl-health"], "npx playwright test -c playwright.crawl-health.config.ts");
    assert.match(packageJson.scripts["qa:crawl-health:remote"] ?? "", /PLAYWRIGHT_SKIP_WEB_SERVER=1/);
  });

  it("seeds known 5xx-prone route classes across public crawler paths", () => {
    for (const route of [
      "/canada/rn/nclex-rn/questions",
      "/us/rn/nclex-rn/test-bank",
      "/canada/rpn/rex-pn/test-bank",
      "/canada/np/cnple/test-bank",
      "/us/np/pnp-pc/questions",
      "/canada/pn/rex-pn/rex-pn-practice-questions-cardiovascular",
      "/lessons",
      "/nursing-glossary",
      "/about",
    ]) {
      assert.match(seeds, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${route} missing from crawl seeds`);
    }
  });
});

describe("dynamic route hardening", () => {
  it("does not throw 500 for missing static test-bank registry entries", () => {
    for (const file of [
      "src/app/(marketing)/(default)/canada/rpn/rex-pn/test-bank/page.tsx",
      "src/app/(marketing)/(default)/canada/np/cnple/test-bank/page.tsx",
    ]) {
      const source = read(file);
      assert.match(source, /notFound\(\)/, `${file} must return 404 via notFound`);
      assert.doesNotMatch(source, /throw new Error/, `${file} must not throw missing content as 500`);
    }
  });

  it("bounds public question-hub body-system aggregate database reads", () => {
    const source = read("src/lib/questions/pathway-practice-body-system-aggregates.ts");
    assert.match(source, /withDatabaseFallbackTimeout/, "aggregate loader must use DB timeout fallback");
    assert.match(source, /AGGREGATE_TIMEOUT_MS/, "aggregate route budget constant missing");
  });
});
