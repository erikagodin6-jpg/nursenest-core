/**
 * SiteHeader marketing chrome: dark themes paint full-viewport-width surfaces on the sticky wrapper.
 * Regressions that move `.nn-header-dark-surface` or solid chrome back onto `<header>` only, or drop
 * `w-full` on the sticky ancestor, tend to reproduce a partial-width “slab” beside the logo (inner
 * `.nn-section-shell` / grid columns clipping the painted layer).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteHeaderTsx = path.join(__dirname, "../../components/layout/site-header.tsx");

describe("SiteHeader sticky chrome wrapper (site-header.tsx)", () => {
  it("keeps dark surface + nav chrome on full-width sticky wrapper, not header-only", () => {
    const src = fs.readFileSync(siteHeaderTsx, "utf8");
    assert.match(
      src,
      /className=\{`sticky top-0 z-50 w-full min-w-0\$\{isLightTheme \? "" : " nn-header-dark-surface"\}`\}/,
      "sticky wrapper must be w-full min-w-0 and host nn-header-dark-surface when dark",
    );
    assert.match(src, /stickyChromeStyle/, "dark/light chrome must flow through stickyChromeStyle");
    assert.match(
      src,
      /if \(isLightTheme\) return getNavChromeVars\(theme\)/,
      "light themes must keep CSS-var-only injection on sticky wrapper",
    );
    assert.match(
      src,
      /\{ \.\.\.getNavChromeStyle\(theme\), boxShadow: darkHeaderShadow \}/,
      "dark themes must merge getNavChromeStyle onto sticky wrapper for full-bleed paint",
    );
  });
});
