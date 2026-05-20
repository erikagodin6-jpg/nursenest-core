import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

test("robots.txt route documents single Sitemap line for sitemap index", () => {
  const src = readFileSync(join(HERE, "route.ts"), "utf8");
  assert.match(src, /CANONICAL_SITEMAP_LINES\s*=\s*\[\s*`Sitemap:/);
  assert.match(src, /sitemap\.xml`/);
  assert.match(src, /must contain exactly \$\{CANONICAL_SITEMAP_LINES\.length\}/);
});
