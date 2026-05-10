import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("robots.txt route source (static gate)", () => {
  it("declares User-agent, core disallow rules, and four canonical HTTPS sitemap lines (main + blog + allied + new-grad)", () => {
    const src = readFileSync(join(HERE, "../../app/robots.txt/route.ts"), "utf8");
    assert.match(src, /User-agent:\s*\*/);
    assert.match(src, /Disallow:\s*\/app\//);
    assert.match(src, /Sitemap:/);
    assert.match(src, /sitemap\.xml/);
    assert.match(src, /sitemap-blog\.xml/);
    assert.match(src, /sitemap-allied\.xml/);
    assert.match(src, /sitemap-new-grad\.xml/);
    assert.match(src, /CANONICAL_PRODUCTION_ORIGIN/);
    assert.match(src, /CANONICAL_SITEMAP_LINES/);
    assert.match(src, /Disallow:\s*\/seo\//);
    assert.match(src, /must not use http:\/\//);
    assert.match(src, /allied\.nursenest\.ca/);
  });
});
