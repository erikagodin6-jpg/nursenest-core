import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getMarketingHeroImageUrlChain } from "@/lib/marketing-hero-image";

const ROOT = process.cwd();

function source(path: string) {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("homepage PageSpeed performance contracts", () => {
  it("seeds persisted marketing theme before hydration via root layout beforeInteractive script", () => {
    const rootLayout = source("src/app/layout.tsx");
    const seed = source("src/lib/theme/marketing-theme-before-interactive-seed.ts");
    assert.match(rootLayout, /marketingThemeBeforeInteractiveInlineScript/);
    assert.match(rootLayout, /strategy="beforeInteractive"/);
    assert.match(seed, /PUBLIC_MARKETING_THEME_ALLOWLIST/);
    assert.match(seed, /THEME_STORAGE_KEY/);
  });

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

    assert.match(imageDelivery, /MARKETING_PHOTO_QUALITY_HOME_SCREENSHOT_SECTION\s*=\s*68/);
    assert.match(nextConfig, /max-age=31536000, immutable/);
  });

  it("tries optimized homepage screenshot variants before raw PNG fallbacks", () => {
    const chain = getMarketingHeroImageUrlChain({
      objectKey: "screenshot10.png",
      publicCdnUrl: "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot10.png",
      optimizedWidthOrder: "smallestFirst",
    });

    assert.match(chain[0] ?? "", /screenshot10-480w\.webp$/);
    assert.ok(
      chain.findIndex((src) => /screenshot10-480w\.webp$/.test(src)) <
        chain.findIndex((src) => /screenshot10\.png$/.test(src)),
      "optimized WebP variants must be attempted before raw PNG",
    );
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
    assert.match(shell, /narrow\s*\|\|\s*!mounted\s*\?\s*children\s*:\s*<PageTransitionShellLazy/);
  });

  it("keeps framer route transitions off the initial mobile marketing bundle", () => {
    const shell = source("src/lib/ui/marketing-mobile-motion-shell.tsx");

    assert.match(shell, /dynamic\(/);
    assert.doesNotMatch(shell, /import\s+\{\s*PageTransitionShell\s*\}\s+from/);
    assert.match(shell, /ssr:\s*false/);
  });

  it("locks above-the-fold homepage geometry before hydration", () => {
    const premiumCss = source("src/app/premium-redesign-2026.css");
    const globals = source("src/app/globals.css");

    assert.match(globals, /\.nn-header-animate-in\s*\{[^}]*animation:\s*none/s);
    assert.match(premiumCss, /\[data-nn-header-layout="marketing-row4"\]\s*\{[^}]*min-height:/s);
    assert.match(premiumCss, /\.nn-premium-hero-grid\s*\{[^}]*min-height:\s*clamp/s);
    assert.match(premiumCss, /\.nn-premium-home-section\s*\{[^}]*min-height:/s);
  });

  it("ships production security headers without blocking Stripe/auth popups", () => {
    const nextConfig = source("next.config.mjs");

    assert.match(nextConfig, /Content-Security-Policy/);
    assert.match(nextConfig, /Strict-Transport-Security/);
    assert.match(nextConfig, /X-Frame-Options/);
    assert.match(nextConfig, /Cross-Origin-Opener-Policy/);
    assert.match(nextConfig, /same-origin-allow-popups/);
    assert.match(nextConfig, /https:\/\/js\.stripe\.com/);
    assert.match(nextConfig, /https:\/\/checkout\.stripe\.com/);
  });

  it("contains below-fold premium homepage paint while preserving gradients", () => {
    const premiumCss = source("src/app/premium-redesign-2026.css");

    assert.match(premiumCss, /\.nn-home-marketing-root \.nn-premium-home-section\s*\{[^}]*content-visibility:\s*auto/s);
    assert.match(premiumCss, /contain-intrinsic-size:\s*auto/);
    assert.match(premiumCss, /contain:\s*paint/);
    assert.match(premiumCss, /\.nn-premium-final-cta\s*\{[^}]*radial-gradient/s);
  });
});
