import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const ROOT = process.cwd();

function source(path: string) {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("homepage PageSpeed performance contracts", () => {
  it("does not force scroll position during homepage hydration", () => {
    const homeClient = source("src/components/marketing/home-restored-client.tsx");
    assert.equal(homeClient.includes("window.scrollTo"), false);
  });

  it("keeps carousel transitions composited and avoids clip-path slide reveals", () => {
    const carousel = source("src/components/marketing/marketing-hero-carousel.tsx");
    const globals = source("src/app/globals.css");

    assert.equal(carousel.includes("[clip-path:"), false);
    assert.equal(globals.includes("clip-path"), false);
  });

  it("does not animate backdrop filters on sticky or hero chrome", () => {
    const premiumCss = source("src/app/premium-redesign-2026.css");

    assert.doesNotMatch(premiumCss, /transition:\s*[^;]*backdrop-filter/);
    assert.match(premiumCss, /\.nn-premium-hero-panel[^{]*\{[^}]*backdrop-filter:\s*none/s);
  });

  it("defers PostHog initialization until idle or user interaction", () => {
    const analytics = source("src/lib/observability/product-analytics.ts");

    assert.match(analytics, /requestIdleCallback|setTimeout/);
    assert.equal(analytics.includes("void initPosthogClient().catch"), false);
  });

  it("throttles sticky header scroll state with requestAnimationFrame", () => {
    const header = source("src/components/layout/site-header.tsx");

    assert.match(header, /requestAnimationFrame/);
    assert.doesNotMatch(header, /setIsScrolled\(window\.scrollY > 8\)/);
  });

  it("skips full theme token rewrites when the resolved theme has not changed", () => {
    const hydration = source("src/components/theme/theme-state-hydration.tsx");

    assert.match(hydration, /lastAppliedThemeRef/);
  });

  it("keeps homepage image and static asset delivery inside mobile performance budgets", () => {
    const imageDelivery = source("src/lib/marketing-image-delivery.ts");
    const nextConfig = source("next.config.mjs");

    assert.match(imageDelivery, /MARKETING_PHOTO_QUALITY_HOME_SCREENSHOT_SECTION\s*=\s*74/);
    assert.match(nextConfig, /max-age=31536000, immutable/);
  });

  it("uses Next-compatible static asset header matchers so local Playwright can start reliably", () => {
    const nextConfig = source("next.config.mjs");
    const headerSources = [...nextConfig.matchAll(/source:\s*"([^"]+)"/g)].map((match) => match[1]);

    assert.equal(headerSources.some((sourcePattern) => sourcePattern.includes("/:path*.")), false);
    assert.match(nextConfig, /source:\s*"\/:path\*\\\\\.:assetExt\(png\|jpg\|jpeg\|webp\|avif\|svg\|ico\|woff2\)"/);
  });
});
