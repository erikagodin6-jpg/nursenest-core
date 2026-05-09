/**
 * Regression: `SiteHeader` uses `next/dynamic` for `MarketingHeaderUtilityStrip`.
 * A missing `import dynamic from "next/dynamic"` yields `ReferenceError: dynamic is not defined`
 * after hydration when the header chunk executes — users see marketing `error.tsx` ("Page could not load").
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteHeaderPath = path.join(__dirname, "site-header.tsx");

describe("SiteHeader next/dynamic import", () => {
  it("imports dynamic from next/dynamic before calling dynamic()", () => {
    const src = fs.readFileSync(siteHeaderPath, "utf8");
    assert.match(src, /import\s+dynamic\s+from\s+["']next\/dynamic["']/);
    const importIdx = src.indexOf('from "next/dynamic"');
    const dynamicCallIdx = src.search(/\bdynamic\s*\(/);
    assert.ok(importIdx !== -1 && dynamicCallIdx !== -1, "expected import and dynamic() usage");
    assert.ok(importIdx < dynamicCallIdx, "import dynamic must appear before dynamic() call");
  });
});
