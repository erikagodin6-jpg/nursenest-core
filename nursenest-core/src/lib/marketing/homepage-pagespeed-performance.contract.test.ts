import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getMarketingHeroImageUrlChain } from "@/lib/marketing-hero-image";
import { resolveCssFile } from "@/lib/test-utils/resolve-css-imports";

const ROOT = process.cwd();

function source(path: string) {
  return readFileSync(join(ROOT, path), "utf8");
}

/** Load a CSS file resolving one level of @import — needed after the CSS split. */
function sourceCss(path: string) {
  return resolveCssFile(join(ROOT, path));
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
    const premiumCss = sourceCss("src/app/premium-redesign-2026.css");

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
    const premiumCss = sourceCss("src/app/premium-redesign-2026.css");
    const globals = source("src/app/globals.css");
    // nn-header-animate-in CLS guard: rule was extracted from globals.css to
    // marketing-global.css (marketing routes only) — check either location is valid.
    const marketingGlobal = sourceCss("src/app/styles/marketing/marketing-global.css");
    const animNonePattern = /\.nn-header-animate-in\s*\{[^}]*animation:\s*none/s;
    assert.ok(
      animNonePattern.test(globals) || animNonePattern.test(marketingGlobal),
      "nn-header-animate-in CLS guard (animation:none) must be in globals.css or marketing-global.css",
    );
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
    const premiumCss = sourceCss("src/app/premium-redesign-2026.css");

    assert.match(premiumCss, /\.nn-home-marketing-root \.nn-premium-home-section\s*\{[^}]*content-visibility:\s*auto/s);
    assert.match(premiumCss, /contain-intrinsic-size:\s*auto/);
    assert.match(premiumCss, /contain:\s*paint/);
    assert.match(premiumCss, /\.nn-premium-final-cta\s*\{[^}]*radial-gradient/s);
  });

  it("defers below-fold screenshot carousel SSR to reduce initial hydration cost", () => {
    const homeClient = source("src/components/marketing/home-restored-client.tsx");

    // Screenshot carousel must be ssr:false — it has 8+ effects and setInterval.
    // This eliminates the most expensive hydration reconciliation from the initial paint.
    assert.match(homeClient, /HomeHeroScreenshotSectionLazy/);
    assert.match(homeClient, /ssr:\s*false/);
  });

  it("defers analytics beacon SSR to prevent blocking first paint", () => {
    const homeClient = source("src/components/marketing/home-restored-client.tsx");

    assert.match(homeClient, /FunnelHomepageViewBeaconLazy/);
    // Both the analytics beacon and the screenshot carousel must have ssr: false
    const ssrFalseCount = (homeClient.match(/ssr:\s*false/g) ?? []).length;
    assert.ok(ssrFalseCount >= 2, `expected at least 2 ssr: false entries, got ${ssrFalseCount}`);
  });

  it("mounts homepage analytics only after initial paint and idle time", () => {
    const homeClient = source("src/components/marketing/home-restored-client.tsx");

    assert.match(homeClient, /function IdleAfterPaint/);
    assert.match(homeClient, /runAfterInitialPaint/);
    assert.match(homeClient, /requestIdleCallback/);
    assert.match(homeClient, /<IdleAfterPaint>\s*<FunnelHomepageViewBeaconLazy/s);
  });

  it("keeps below-fold homepage chunks outside the initial Lighthouse window", () => {
    const homeClient = source("src/components/marketing/home-restored-client.tsx");

    assert.match(homeClient, /rootMargin\s*=\s*"360px 0px"/);
    assert.match(homeClient, /rootMargin="480px 0px"/);
    assert.doesNotMatch(homeClient, /rootMargin="900px 0px"/);
    assert.doesNotMatch(homeClient, /rootMargin="1100px 0px"/);
  });

  it("guards Prisma homepage stats module from entering browser bundles", () => {
    const stats = source("src/lib/marketing/public-home-stats.ts");

    // server-only guard must appear before the first Prisma import
    assert.match(stats, /['"]server-only['"]/);
    const serverOnlyIdx = stats.indexOf("server-only");
    const prismaIdx = stats.indexOf("@prisma/client");
    assert.ok(
      serverOnlyIdx < prismaIdx,
      `server-only guard (pos ${serverOnlyIdx}) must precede @prisma/client import (pos ${prismaIdx})`,
    );
  });

  it("keeps ECG strip path as a module-level constant to avoid recomputation on hydration", () => {
    const hero = source("src/components/marketing/home/premium-homepage-hero.tsx");

    // The ECG path must be computed at module level (outside any function/component).
    // This prevents redundant CPU work during hero hydration.
    assert.match(hero, /const _ECG_PATH\s*=/);
    assert.doesNotMatch(hero, /buildSinusRhythmPath\([^)]+\)[^;]*\n[^}]*return\s*\(/);
  });

  it("PremiumClinicalDepth is a server island with no use-client directive", () => {
    const clinicalDepth = source("src/components/marketing/home/premium-clinical-depth.tsx");

    // Must NOT have "use client" — this section is a Server Component
    assert.doesNotMatch(clinicalDepth, /["']use client["']/);
    // Must NOT import React hooks (no useMarketingI18n, no useState, no useEffect)
    assert.doesNotMatch(clinicalDepth, /useMarketingI18n/);
    assert.doesNotMatch(clinicalDepth, /useState|useEffect|useCallback|useMemo/);
    // Must accept messages as a prop (server-island pattern)
    assert.match(clinicalDepth, /messages:\s*Record<string,\s*string>/);
  });

  it("PremiumHomepageTrust is a server island with no use-client directive", () => {
    const trust = source("src/components/marketing/home/premium-homepage-trust.tsx");

    // Must NOT have "use client" — this section is a Server Component
    assert.doesNotMatch(trust, /["']use client["']/);
    // Must NOT import useMarketingI18n hook
    assert.doesNotMatch(trust, /useMarketingI18n/);
    assert.doesNotMatch(trust, /useState|useEffect|useCallback/);
    // Must accept messages as a prop (server-island pattern)
    assert.match(trust, /messages:\s*Record<string,\s*string>/);
    // Must not import the client-only BrandTrustInline (uses its own server-safe variant)
    assert.doesNotMatch(trust, /from.*brand-trust-inline/);
  });

  it("HomeRestoredClient accepts server island slots for static sections", () => {
    const homeClient = source("src/components/marketing/home-restored-client.tsx");

    // Must declare named slots for server-rendered islands
    assert.match(homeClient, /clinicalDepthSlot\?:\s*React\.ReactNode/);
    assert.match(homeClient, /trustSlot\?:\s*React\.ReactNode/);
    // Must NOT dynamically import the sections that are now server islands
    assert.doesNotMatch(homeClient, /dynamic\([^)]*premium-clinical-depth/);
    assert.doesNotMatch(homeClient, /dynamic\([^)]*premium-homepage-trust/);
  });

  it("SiteHeader shows guest CTAs immediately without a session-loading skeleton", () => {
    const header = source("src/components/layout/site-header.tsx");

    // The skeleton pulse placeholders must be absent — they caused CLS when session resolved.
    // Verified fix: guest buttons (Log In / Start Free) render on first paint for Lighthouse.
    assert.doesNotMatch(header, /isSessionPending\s*\?\s*\(/);
    // ThemePicker and MarketingLanguagePreferenceList must be dynamically imported (mobile-drawer
    // only — keeping their code out of the initial JS bundle reduces TBT).
    assert.match(header, /ThemePickerLazy/);
    assert.match(header, /MarketingLanguagePreferenceListLazy/);
  });

  it("marketing nav link and header have no non-composited transitions that fire on page load", () => {
    const marketingGlobal = sourceCss("src/app/styles/marketing/marketing-global.css");
    const headerNav = sourceCss("src/app/styles/marketing/header-nav.css");

    // The sticky header wrapper must not have a CSS box-shadow transition — it caused a
    // non-composited animation to fire on initial page load (via the :has() rule).
    assert.doesNotMatch(headerNav, /\.sticky\.top-0\.z-50\s*\{[^}]*transition:\s*[^}]*box-shadow/s,
      "sticky header CSS wrapper must not transition box-shadow (was triggering on page load)");

    // Nav links must not transition background-color — they appear in bulk in the DOM
    // (header + tier rail + potentially mobile drawer) and cause many non-composited animation
    // entries in PSI even if hover never fires during Lighthouse measurement.
    assert.doesNotMatch(headerNav, /\.nn-marketing-nav-link\s*\{[^}]*transition:[^}]*background-color/s,
      "nn-marketing-nav-link in header-nav.css must not transition background-color");

    // HIW how-it-works cards must not transition box-shadow — visible on the homepage.
    assert.doesNotMatch(marketingGlobal, /\.nn-hiw-step-card\s*\{[^}]*transition:[^}]*box-shadow/s,
      "nn-hiw-step-card must not transition box-shadow");
    assert.doesNotMatch(marketingGlobal, /\.nn-hiw-feature-card\s*\{[^}]*transition:[^}]*box-shadow/s,
      "nn-hiw-feature-card must not transition box-shadow");
    assert.doesNotMatch(marketingGlobal, /\.nn-hiw-preview-card\s*\{[^}]*transition:[^}]*box-shadow/s,
      "nn-hiw-preview-card must not transition box-shadow");
    // The marketing nav link transition in marketing-global.css must be compositor-safe.
    assert.doesNotMatch(marketingGlobal, /\.nn-marketing-nav-link\s*\{[^}]*transition:[^}]*box-shadow/s,
      "nn-marketing-nav-link in marketing-global.css must not transition box-shadow");
  });

  it("carousel section reserves min-height matching the skeleton to prevent CLS", () => {
    const carouselSection = source("src/components/marketing/home-hero-screenshot-section.tsx");

    // The real carousel bounded div must have min-h matching the skeleton placeholder so
    // the section does not grow when the real content replaces the skeleton (avoiding CLS).
    assert.match(carouselSection, /min-h-\[min\(24rem/);
  });

  it("HomeRestoredWithDeferredStats renders server islands and passes them as slots", () => {
    const serverStats = source(
      "src/components/marketing/home-restored-with-deferred-stats.server.tsx",
    );

    // Must import both server island components
    assert.match(serverStats, /PremiumClinicalDepth/);
    assert.match(serverStats, /PremiumHomepageTrust/);
    // Must pass the slots to HomeRestoredClient
    assert.match(serverStats, /clinicalDepthSlot/);
    assert.match(serverStats, /trustSlot/);
    // Must load messages for the server islands
    assert.match(serverStats, /loadServerIslandMessagesSafe|loadMarketingMessageShards/);
  });

  it("server island message loader loads pages, marketing, and brand shards", () => {
    const serverStats = source(
      "src/components/marketing/home-restored-with-deferred-stats.server.tsx",
    );

    // The message loader must request the shards needed for clinical depth and trust sections
    assert.match(serverStats, /["']pages["']/);
    assert.match(serverStats, /["']marketing["']/);
    assert.match(serverStats, /["']brand["']/);
  });
});
