import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveCssFile } from "@/lib/test-utils/resolve-css-imports";

const ROOT = process.cwd();

function source(path: string) {
  return readFileSync(join(ROOT, path), "utf8");
}

function sourceCss(path: string) {
  return resolveCssFile(join(ROOT, path));
}

describe("mobile PageSpeed hotfix contract", () => {
  it("loads the mobile CLS hotfix last in the marketing CSS cascade", () => {
    const index = source("src/app/styles/marketing/index.css");
    const hotfixImport = '@import "./mobile-cls-hotfix.css";';

    assert.ok(index.includes(hotfixImport), "marketing CSS must import mobile-cls-hotfix.css");
    assert.equal(
      index.trim().endsWith(hotfixImport),
      true,
      "mobile-cls-hotfix.css must remain the last marketing import so it wins the cascade",
    );
  });

  it("reserves mobile header geometry before hydration", () => {
    const css = sourceCss("src/app/styles/marketing/index.css");

    assert.match(css, /--nn-marketing-header-mobile-reserved-height:\s*5\.25rem/);
    assert.match(css, /\[data-nn-header-layout="marketing-row4"\][^{]*\{[^}]*min-height:\s*var\(--nn-marketing-header-mobile-reserved-height/s);
    assert.match(css, /\[data-nn-header-layout="marketing-unified-dark"\][^{]*\{[^}]*min-height:\s*var\(--nn-marketing-header-mobile-reserved-height/s);
  });

  it("keeps desktop header rail out of the mobile layout tree", () => {
    const css = sourceCss("src/app/styles/marketing/index.css");

    assert.match(css, /\.nn-marketing-nav-v31-tier-rail[\s\S]*display:\s*none\s*!important/);
    assert.match(css, /\.nn-header-desktop-grid[\s\S]*display:\s*none\s*!important/);
  });

  it("removes mobile sticky and glass compositor work from the first paint path", () => {
    const css = sourceCss("src/app/styles/marketing/index.css");

    assert.match(css, /\.sticky\.top-0\.z-50\[data-nn-cls-region="site-header"\][^{]*\{[^}]*position:\s*relative\s*!important/s);
    assert.match(css, /backdrop-filter:\s*none\s*!important/);
    assert.match(css, /box-shadow:\s*none\s*!important/);
  });

  it("contains mobile marketing sections and hero surfaces to lower CLS and TBT", () => {
    const css = sourceCss("src/app/styles/marketing/index.css");

    assert.match(css, /content-visibility:\s*auto/);
    assert.match(css, /contain-intrinsic-size:\s*auto\s+720px/);
    assert.match(css, /\.nn-premium-hero-grid[\s\S]*contain:\s*layout paint style/);
    assert.match(css, /main > section:nth-of-type\(n \+ 2\)/);
  });

  it("suppresses non-essential mobile transitions and animations during Lighthouse load", () => {
    const css = sourceCss("src/app/styles/marketing/index.css");

    assert.match(css, /\.nn-header-animate-in[\s\S]*animation:\s*none\s*!important/);
    assert.match(css, /\.nav-item[\s\S]*transition:\s*none\s*!important/);
    assert.match(css, /\.nn-nav-cta[\s\S]*transition:\s*none\s*!important/);
  });

  it("keeps mobile decorative paint effects out of the critical path", () => {
    const css = sourceCss("src/app/styles/marketing/index.css");

    assert.match(css, /\.nn-premium-card/);
    assert.match(css, /\.nn-pathway-card/);
    assert.match(css, /\.nn-pricing-card/);
    assert.match(css, /box-shadow:\s*none\s*!important/);
    assert.match(css, /filter:\s*none\s*!important/);
    assert.match(css, /backdrop-filter:\s*none\s*!important/);
    assert.match(css, /-webkit-backdrop-filter:\s*none\s*!important/);
  });

  it("blocks mobile hover transforms from causing compositor churn", () => {
    const css = sourceCss("src/app/styles/marketing/index.css");

    assert.match(css, /hover:shadow/);
    assert.match(css, /hover:-translate/);
    assert.match(css, /hover:scale/);
    assert.match(css, /transform:\s*none\s*!important/);
  });
});
