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

  it("allows the reduced marketing screenshot image quality used by below-fold screenshots", () => {
    const nextConfig = source("next.config.mjs");
    const screenshotStack = source("src/components/marketing/marketing-screenshot-stack.tsx");
    const heroCarousel = source("src/components/marketing/marketing-hero-carousel.tsx");

    assert.match(nextConfig, /qualities:\s*\[\s*68,\s*75\s*\]/);
    assert.match(screenshotStack, /MARKETING_PHOTO_QUALITY_BELOW_FOLD/);
    assert.match(heroCarousel, /quality=\{photoQuality\}/);
  });

  it("sets the marketing narrow viewport header before the mobile motion shell hydrates", () => {
    const proxy = source("src/proxy.ts");
    const shell = source("src/lib/ui/marketing-mobile-motion-shell.tsx");

    assert.match(proxy, /MARKETING_NARROW_VIEWPORT_HINT_HEADER/);
    assert.match(proxy, /computeMarketingNarrowViewportHintFromRequestHeaders/);
    assert.match(shell, /serverNarrowViewportHint/);
    assert.match(shell, /narrow\s*\?\s*children\s*:\s*<PageTransitionShellLazy/);
  });

  it("keeps framer route transitions off the initial mobile marketing bundle", () => {
    const shell = source("src/lib/ui/marketing-mobile-motion-shell.tsx");

    assert.match(shell, /dynamic\(/);
    assert.doesNotMatch(shell, /import\s+\{\s*PageTransitionShell\s*\}\s+from/);
    assert.match(shell, /ssr:\s*false/);
  });

  it("contains below-fold premium homepage paint while preserving gradients", () => {
    const premiumCss = source("src/app/premium-redesign-2026.css");

    assert.match(premiumCss, /\.nn-home-marketing-root \.nn-premium-home-section\s*\{[^}]*content-visibility:\s*auto/s);
    assert.match(premiumCss, /contain-intrinsic-size:\s*auto/);
    assert.match(premiumCss, /contain:\s*paint/);
    assert.match(premiumCss, /\.nn-premium-final-cta\s*\{[^}]*radial-gradient/s);
  });
});
