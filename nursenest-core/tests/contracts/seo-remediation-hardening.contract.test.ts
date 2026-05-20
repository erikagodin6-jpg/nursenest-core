/**
 * Platform SEO hardening contracts — canonical origin, sitemap index integrity, classifier sanity.
 * Does not replace HTTP crawl tests (`npm run test:seo-sitemap`, Playwright SEO specs).
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/seo-remediation-hardening.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { CANONICAL_PRODUCTION_ORIGIN } from "../../src/lib/seo/canonical-site";
import { buildSitemapIndexXmlForOrigin } from "../../src/lib/seo/sitemap-index-children";
import {
  extractLocStringsFromXml,
  validateSitemapXmlWellFormed,
} from "../../src/lib/seo/sitemap-segment-validator";

const ROOT = process.cwd();

describe("canonical + sitemap index invariants", () => {
  it("uses HTTPS apex production origin (GSC canonical)", () => {
    assert.equal(CANONICAL_PRODUCTION_ORIGIN, "https://nursenest.ca");
  });

  it("sitemap index XML is well-formed and child sitemap locs are unique", () => {
    const origin = CANONICAL_PRODUCTION_ORIGIN.replace(/\/$/, "");
    const xml = buildSitemapIndexXmlForOrigin(origin);
    const wf = validateSitemapXmlWellFormed(xml);
    assert.equal(wf.ok, true);
    const locs = extractLocStringsFromXml(xml);
    assert.ok(locs.length > 0);
    const uniq = new Set(locs);
    assert.equal(
      uniq.size,
      locs.length,
      `duplicate <loc> in sitemap index: ${locs.length - uniq.size} dupes`,
    );
    for (const loc of locs) {
      assert.match(loc, /^https:\/\/nursenest\.ca\/sitemap-[a-z0-9-]+\.xml$/);
      assert.ok(!loc.includes("localhost"), loc);
      assert.ok(!loc.startsWith("http://"), loc);
    }
  });

  it("robots route keeps single Sitemap directive guardrails", () => {
    const src = fs.readFileSync(path.join(ROOT, "src/app/robots.txt/route.ts"), "utf8");
    assert.match(src, /assertCanonicalSitemapDirectives/);
    assert.match(src, /CANONICAL_PRODUCTION_ORIGIN.*sitemap\.xml/);
  });
});
