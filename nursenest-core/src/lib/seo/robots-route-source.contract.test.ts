import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("robots.txt route source (static gate)", () => {
  it("declares User-agent, core disallow rules, and a single Sitemap line for the sitemap index", () => {
    const src = readFileSync(join(HERE, "../../app/robots.txt/route.ts"), "utf8");
    assert.match(src, /User-agent:\s*\*/);
    assert.match(src, /Disallow:\s*\/app\//);
    assert.match(src, /Sitemap:/);
    assert.match(src, /Sitemap:.*sitemap\.xml/);
    assert.match(src, /CANONICAL_PRODUCTION_ORIGIN/);
    assert.match(src, /CANONICAL_SITEMAP_LINES/);
    assert.match(src, /Disallow:\s*\/seo\//);
    assert.match(src, /must not use http:\/\//);
    assert.match(src, /allied\.nursenest\.ca/);
    assert.match(src, /exactly \$\{CANONICAL_SITEMAP_LINES\.length\}/);
  });

  it("does not import MARKETING_LANGUAGES or isLocaleRobotsPathDisallowed (no per-locale Disallow loop)", () => {
    const src = readFileSync(join(HERE, "../../app/robots.txt/route.ts"), "utf8");
    assert.equal(
      /MARKETING_LANGUAGES|isLocaleRobotsPathDisallowed/.test(src),
      false,
      "robots.txt route must not iterate marketing locales — locale readiness is controlled via page-level noindex,follow",
    );
  });
});
