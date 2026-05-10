/**
 * Regression: if `SiteHeader` uses `next/dynamic`, `import dynamic from "next/dynamic"` must exist
 * before any `dynamic()` call — otherwise `ReferenceError: dynamic is not defined` after hydration.
 *
 * (Utility strip used `dynamic()` historically; if reintroduced, this guard still applies.)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteHeaderPath = path.join(__dirname, "site-header.tsx");

describe("SiteHeader next/dynamic import", () => {
  it("imports dynamic from next/dynamic before any dynamic() call when dynamic() is used", () => {
    const src = fs.readFileSync(siteHeaderPath, "utf8");
    if (!/\bdynamic\s*\(/.test(src)) {
      return;
    }
    assert.match(src, /import\s+dynamic\s+from\s+["']next\/dynamic["']/);
    const importIdx = src.indexOf('from "next/dynamic"');
    const dynamicCallIdx = src.search(/\bdynamic\s*\(/);
    assert.ok(importIdx !== -1 && dynamicCallIdx !== -1, "expected import and dynamic() usage");
    assert.ok(importIdx < dynamicCallIdx, "import dynamic must appear before dynamic() call");
  });
});
