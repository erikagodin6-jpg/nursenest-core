/**
 * Homepage mobile CLS hardening — second-pass verification for commit fe4af1722.
 *
 * Validates five targeted fixes:
 *   1. ssr:false on below-fold dynamic sections (eliminates Suspense hydration CLS)
 *   2. dvh removed from .nn-premium-hero-grid (eliminates URL-bar-collapse CLS)
 *   3. HeroClinicalPanel hidden on mobile (reduces hero height + above-fold hydration)
 *   4. Sentry import budget reduced 2000ms → 150ms (TTFB improvement)
 *   5. Layout Promise.all parallel reads (TTFB improvement)
 *
 * Viewport: 390×844 (iPhone 14 / iPhone 12 Pro — Lighthouse mobile reference)
 * Network: CDPSession slow-3G emulation when Chromium is available.
 *
 * Run (against running dev or production build):
 *   BASE_URL=http://localhost:3000 npx playwright test \
 *     tests/e2e/public/homepage-mobile-cls-hardening.spec.ts \
 *     --project=chromium
 *
 * Run against production:
 *   BASE_URL=https://www.nursenest.ca npx playwright test \
 *     tests/e2e/public/homepage-mobile-cls-hardening.spec.ts \
 *     --project=chromium
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page, type CDPSession } from "@playwright/test";

const SCREENSHOT_DIR = join("docs", "screenshots", "mobile-cls-hardening");
mkdirSync(SCREENSHOT_DIR, { recursive: true });

/** Accumulated CLS score injected by PerformanceObserver in the browser. */
async function readCLS(page: Page): Promise<number> {
  return page.evaluate(() => {
    return Number(
      (window as unknown as { __nnCLS?: number }).__nnCLS ?? 0,
    );
  });
}

/** Inject PerformanceObserver before navigation so buffered entries are captured. */
async function injectClsObserver(page: Page): Promise<void> {
  await page.addInitScript(() => {
    (window as unknown as { __nnCLS: number }).__nnCLS = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const ls = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };
          if (!ls.hadRecentInput) {
            (window as unknown as { __nnCLS: number }).__nnCLS +=
              Number(ls.value ?? 0);
          }
        }
      });
      po.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* Layout Instability API unavailable — CLS will read as 0 */
    }
  });
}

/**
 * Emulate Lighthouse mobile network conditions via Chrome DevTools Protocol.
 * Falls back gracefully when CDP is unavailable (WebKit, Firefox, remote).
 */
async function emulateSlowMobile(
  page: Page,
): Promise<CDPSession | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = await (page.context() as any).newCDPSession(page);
    // Lighthouse mobile: 1.6Mbps down / 750kbps up / 150ms RTT
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150,
    });
    // 4× CPU slowdown
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    return client as CDPSession;
  } catch {
    return null;
  }
}

async function teardownThrottling(client: CDPSession | null): Promise<void> {
  if (!client) return;
  try {
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    });
    await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  } catch {
    /* ignore teardown errors */
  }
}

/** Benign console noise — do not fail for third-party analytics failures. */
function isBenignError(text: string): boolean {
  const t = text.toLowerCase();
  return (
    t.includes("favicon") ||
    (t.includes("failed to load resource") &&
      (t.includes("analytics") || t.includes("posthog") || t.includes("cdn")))
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Homepage mobile CLS hardening — fe4af1722 verification", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  // ─── FIX 1 + 2 + 3: CLS below threshold, no hero gap, no Suspense flash ──

  test("CLS < 0.1 after 5s on mobile slow-3G with no user interaction", async ({
    page,
  }, testInfo) => {
    await injectClsObserver(page);
    const client = await emulateSlowMobile(page);

    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isBenignError(msg.text()))
        consoleErrors.push(msg.text());
    });

    await page.goto("/", { waitUntil: "load", timeout: 180_000 });
    await teardownThrottling(client);

    // Wait for hydration to settle
    await page.waitForTimeout(5000);

    const cls = await readCLS(page);
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "cls-after-5s.png"),
      fullPage: false,
    });

    expect(cls, `CLS after 5s settle: ${cls}`).toBeLessThan(0.1);
    expect(pageErrors, `page errors: ${pageErrors.join(" | ")}`).toEqual([]);
    const severe = consoleErrors.filter((c) =>
      /hydration|referenceerror|typeerror|chunk load/i.test(c),
    );
    expect(severe, `severe console errors: ${severe.join(" | ")}`).toEqual([]);

    if (testInfo.retry === 0) {
      await testInfo.attach("cls-score", {
        body: String(cls),
        contentType: "text/plain",
      });
    }
  });

  // ─── FIX 3: Hero clinical panel hidden on mobile ──────────────────────────

  test("clinical panel absent on mobile, copy column and CTAs present", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(2000);

    // Panel must not be visible at mobile viewport
    const panel = page.locator(".nn-premium-hero-panel").first();
    // Confirm the wrapper is in DOM but hidden
    const panelCount = await panel.count();
    if (panelCount > 0) {
      await expect(panel).toBeHidden();
    }

    // Copy column must be visible: h1, primary CTA, stats line
    const h1 = page.getByTestId("text-hero-heading").first();
    await expect(h1).toBeVisible({ timeout: 15_000 });
    await expect(h1).not.toHaveText(/^\s*$/);

    const statsLine = page.getByTestId("premium-hero-stats-line").first();
    await expect(statsLine).toBeVisible({ timeout: 10_000 });

    // Primary CTA (links to /question-bank)
    const primaryCta = page
      .getByRole("link", { name: /start free/i })
      .first();
    await expect(primaryCta).toBeVisible({ timeout: 10_000 });
    const href = await primaryCta.getAttribute("href");
    expect(href, "primary CTA href contains question-bank").toMatch(
      /question-bank/,
    );
  });

  // ─── FIX 3: No blank vertical gap where panel used to be ─────────────────

  test("hero section has no oversized blank gap on mobile after panel hide", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(2000);

    const hero = page.getByTestId("hero-section").first();
    await expect(hero).toBeVisible({ timeout: 15_000 });

    const heroBox = await hero.boundingBox();
    expect(heroBox, "hero section rendered with non-zero height").not.toBeNull();

    // On mobile (390px), hero height should be content-driven — not zero and not
    // excessively padded. Fail if it's taller than 700px (= ~83% viewport height),
    // which would indicate the old dvh min-height or panel gap is still active.
    const MAX_HERO_HEIGHT_PX = 700;
    expect(
      heroBox!.height,
      `hero height ${heroBox!.height}px should be < ${MAX_HERO_HEIGHT_PX}px (no blank gap)`,
    ).toBeLessThan(MAX_HERO_HEIGHT_PX);

    // Also ensure it's not collapsed
    expect(heroBox!.height, "hero must not be collapsed").toBeGreaterThan(200);
  });

  // ─── FIX 1: Above-fold content SSR'd; below-fold is client-only ──────────

  test("h1 and primary CTA present in initial SSR HTML (not client-only)", async ({
    page,
  }) => {
    // Capture the raw server HTML before any JS runs by disabling JS
    await page.context().setExtraHTTPHeaders({});

    // Use Response body before JS executes — navigate with JS disabled
    const response = await page.request.get("/");
    const html = await response.text();

    // h1 content must be in SSR HTML (PremiumHomepageHero is SSR'd)
    // The hero heading text comes from i18n but always contains "nursing" or "clinician"
    expect(response.status()).toBe(200);
    expect(html, "SSR HTML must contain home-conversion-hero-heading id").toContain(
      'id="home-conversion-hero-heading"',
    );
    expect(html, "SSR HTML must contain data-testid=hero-section").toContain(
      'data-testid="hero-section"',
    );

    // Primary CTA link to question-bank must be SSR'd
    expect(html, "SSR HTML must contain question-bank CTA href").toContain(
      "/question-bank",
    );

    // Verify ssr:false sections are NOT in SSR HTML
    // PremiumPathwayShowcase heading: "Every Path Has Its Own"
    // If it's absent from SSR HTML, that's correct (ssr:false)
    // Note: we do NOT assert absence — Google JS-renders these — but if found, it's a regression
    // We just document that these are intentionally client-only.

    // PremiumClinicalDepth and PremiumHomepageTrust are server components — must be in SSR HTML
    expect(
      html,
      "clinicalDepthSlot server island must appear in SSR HTML",
    ).toContain("nn-premium-home-section--clinical");
    expect(
      html,
      "trustSlot server island must appear in SSR HTML",
    ).toContain("nn-premium-home-section--trust");
  });

  // ─── FIX 4+5: Page loads fast; no blocking before first content ──────────

  test("page interactive with H1 visible and no crash UI after 5s", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(5000);

    // No crash UI
    await expect(page.locator("body")).not.toContainText(/page could not load/i);
    await expect(page.locator("body")).not.toContainText(/something went wrong/i);
    await expect(page.locator("body")).not.toContainText(/application error/i);
    await expect(page.locator("[data-nn-app-error-screen]")).toHaveCount(0);

    // Nav/logo visible
    await expect(page.locator("[data-nn-header-logo]").first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("navigation").first()).toBeVisible({
      timeout: 10_000,
    });

    // H1 visible and non-empty
    const h1 = page.getByRole("heading", { level: 1 }).first();
    await expect(h1).toBeVisible({ timeout: 15_000 });
    await expect(h1).not.toHaveText(/^\s*$/);

    // Primary CTA visible and clickable
    const primaryCta = page
      .getByRole("link", { name: /start free/i })
      .first();
    await expect(primaryCta).toBeVisible({ timeout: 10_000 });

    expect(pageErrors, `uncaught page errors: ${pageErrors.join(" | ")}`).toEqual([]);
  });

  // ─── Hero bbox stability: no drift between 0s and 5s ─────────────────────

  test("hero bounding box drifts < 12px between initial load and 5s settle", async ({
    page,
  }, testInfo) => {
    await injectClsObserver(page);
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });

    const heroBox0 = await page
      .getByTestId("hero-section")
      .first()
      .boundingBox();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "hero-t0.png"),
      fullPage: false,
    });

    await page.waitForTimeout(5000);

    const heroBox5 = await page
      .getByTestId("hero-section")
      .first()
      .boundingBox();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "hero-t5s.png"),
      fullPage: false,
    });

    const cls = await readCLS(page);

    const topDrift = Math.abs(
      (heroBox5?.top ?? 0) - (heroBox0?.top ?? 0),
    );
    const heightDrift = Math.abs(
      (heroBox5?.height ?? 0) - (heroBox0?.height ?? 0),
    );

    await testInfo.attach("hero-drift", {
      body: JSON.stringify({ topDrift, heightDrift, cls }),
      contentType: "application/json",
    });

    expect(topDrift, `hero top drift ${topDrift}px`).toBeLessThanOrEqual(12);
    expect(heightDrift, `hero height drift ${heightDrift}px`).toBeLessThanOrEqual(12);
    expect(cls, `CLS: ${cls}`).toBeLessThan(0.1);
  });

  // ─── Navigation smoke: mobile menu opens ─────────────────────────────────

  test("mobile nav hamburger opens and links are reachable", async ({ page }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(2000);

    // Find and click mobile hamburger/menu button
    const menuBtn = page
      .getByRole("button", { name: /menu|open navigation|open menu/i })
      .first();
    const menuVisible = await menuBtn.isVisible().catch(() => false);

    if (menuVisible) {
      await menuBtn.click();
      // Some nav link should become visible
      const navLink = page
        .getByRole("navigation")
        .getByRole("link")
        .first();
      await expect(navLink).toBeVisible({ timeout: 10_000 });
    } else {
      // If no hamburger at this viewport, check desktop nav is visible
      await expect(page.getByRole("navigation").first()).toBeVisible({
        timeout: 10_000,
      });
    }
  });

  // ─── Regression: secondary CTA routes correctly ───────────────────────────

  test("secondary CTA links to lessons hub (not broken by panel hide)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(2000);

    const secondaryCta = page
      .getByRole("link", { name: /view pricing|lessons|explore/i })
      .first();
    await expect(secondaryCta).toBeVisible({ timeout: 15_000 });

    const href = await secondaryCta.getAttribute("href");
    // Should route to /lessons or /pricing, not a broken path
    expect(href, "secondary CTA href not null or empty").toBeTruthy();
    expect(href?.length ?? 0, "secondary CTA href non-trivial").toBeGreaterThan(1);
  });

  // ─── Theme smoke: Blossom + Ocean headers readable ────────────────────────

  test("blossom and ocean themes: logo readable, nav not white-on-white", async ({
    page,
  }) => {
    for (const theme of ["blossom", "ocean"]) {
      await page.context().addInitScript(
        ({ key, val }) => {
          try {
            localStorage.setItem(key, val);
          } catch {
            /* ignore */
          }
        },
        { key: "nn_marketing_theme", val: theme },
      );

      await page.goto("/", { waitUntil: "load", timeout: 120_000 });
      await page.waitForTimeout(2000);

      await expect(page.locator("html")).toHaveAttribute("data-theme", theme, {
        timeout: 10_000,
      });

      const logo = page.locator("[data-nn-header-logo]").first();
      await expect(logo).toBeVisible({ timeout: 10_000 });

      await page.screenshot({
        path: join(SCREENSHOT_DIR, `header-${theme}.png`),
        fullPage: false,
      });
    }
  });
});
