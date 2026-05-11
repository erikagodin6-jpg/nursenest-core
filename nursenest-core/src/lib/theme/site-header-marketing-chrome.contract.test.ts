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
      /className=\{`sticky top-0 z-50 w-full min-w-0\$\{isLightTheme\s*\?\s*""\s*:\s*" nn-header-dark-surface"\}`\}/,
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
      /const chrome = getNavChrome\(theme\)/,
      "dark themes must resolve chrome via getNavChrome for ink/border without inline backgroundColor",
    );
    assert.match(
      src,
      /\{\s*\.\.\.getNavChromeVars\(theme\),\s*color: chrome\.foreground,\s*borderColor: chrome\.border,/s,
      "dark sticky must spread getNavChromeVars + color/border only so premium .nn-header-dark-surface owns background",
    );
    assert.doesNotMatch(
      src,
      /getNavChromeStyle/,
      "SiteHeader must not import getNavChromeStyle — inline backgroundColor fights full-bleed glass CSS",
    );
  });

  it("declares marketing-row4 vs unified-dark on <header> (Midnight keeps row4; other dark themes unified)", () => {
    const src = fs.readFileSync(siteHeaderTsx, "utf8");
    assert.match(
      src,
      /data-nn-header-layout=\{marketingRow4Layout \? "marketing-row4" : "marketing-unified-dark"\}/,
    );
  });

  it("keeps authenticated mobile/tablet CTA row transparent — no nav-bg slab inside max-width shell", () => {
    const src = fs.readFileSync(siteHeaderTsx, "utf8");
    assert.match(
      src,
      /nn-header-mobile-only-flex relative z-\[1\] w-full[\s\S]{0,220}bg-transparent/,
      "signed-in mobile row must not paint opaque nav-bg inside nn-section-shell",
    );
  });

  it("places tier rail as sibling after primary band closes (full-bleed tier strip contract)", () => {
    const src = fs.readFileSync(siteHeaderTsx, "utf8");
    const closePrimary = src.indexOf("{/* /.nn-header-marketing-primary-band */}");
    const tierRail = src.indexOf("nn-marketing-nav-v31-tier-rail");
    assert.ok(closePrimary !== -1 && tierRail !== -1 && closePrimary < tierRail, "tier rail must follow primary band");
  });
});
