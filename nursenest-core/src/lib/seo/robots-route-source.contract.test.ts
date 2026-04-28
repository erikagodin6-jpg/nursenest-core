import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("robots.txt route source (static gate)", () => {
  it("declares User-agent, core disallow rules, and a single canonical sitemap line", () => {
    const src = readFileSync(join(HERE, "../../app/robots.txt/route.ts"), "utf8");
    assert.match(src, /User-agent:\s*\*/);
    assert.match(src, /Disallow:\s*\/app\//);
    assert.match(src, /Sitemap:/);
    assert.match(src, /sitemap\.xml/);
  });
});
