/**
 * Marketing SiteHeader: responsive layout (lg+ desktop vs mobile), no nav/auth overlap,
 * utility band stacked above primary row, brand leaf slot + wordmark share computed color,
 * tier band below primary, stable screenshots after settle wait.
 *
 * From nursenest-core:
 *   npx playwright test tests/e2e/public/marketing-header-layout-responsive.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { publicMarketingThemeChoiceCount } from "../../../src/lib/theme/theme-registry";
import { resolveE2eAppBaseUrl } from "../helpers/e2e-env";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const THEME_STORAGE_KEY = "nursenest-theme";

/** Screenshots land under `nursenest-core/docs/screenshots/marketing-header` (package root). */
const SHOT_DIR = path.join(process.cwd(), "docs", "screenshots", "marketing-header");

/** Stabilization matrix: grep `Ocean / Blossom / Midnight` targets this set only. */
const MARKETING_THEME_READABILITY_THEMES = ["ocean", "blossom", "midnight"] as const;

test.describe.configure({ mode: "serial" });

test.afterEach(async ({ page }, testInfo) => {
  /* Serial suite: tests that navigate (e.g. /pricing) must not leave the next test on a shell
   * without marketing-row4 or against a cold navigation state. */
  if (testInfo.status === "skipped") return;
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {});
});

test.beforeEach(async ({ context, browserName }) => {
  test.skip(browserName !== "chromium", "Marketing header layout probes run on Chromium only.");
  await context.addInitScript(
    ({ dismissedKey, themeKey }: { dismissedKey: string; themeKey: string }) => {
      try {
        localStorage.setItem(dismissedKey, "1");
        /* Light marketing row4: utility band only renders when `isLightTheme` (ocean/aurora/…). */
        localStorage.setItem(themeKey, "ocean");
      } catch {
        /* ignore */
      }
    },
    { dismissedKey: SELECTOR_DISMISSED_LS, themeKey: THEME_STORAGE_KEY },
  );
  fs.mkdirSync(SHOT_DIR, { recursive: true });
});

async function settle(page: import("@playwright/test").Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded", { timeout: 30_000 }).catch(() => {});
  /* Stable screenshots + hydration; avoid networkidle (can hang on long-polling / analytics). */
  await page.waitForTimeout(5000);
}

/** Theme storage hydrates asynchronously; set both storage and html attr for deterministic header probes. */
async function gotoHomeLightMarketing(page: import("@playwright/test").Page, theme = "ocean"): Promise<void> {
  await page.addInitScript(({ themeKey, themeId }) => {
    try {
      localStorage.setItem(themeKey, themeId);
    } catch {
      /* ignore */
    }
  }, { themeKey: THEME_STORAGE_KEY, themeId: theme });
  /* Header checks only need first render; `load` can stall behind long-lived analytics/session work. */
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.evaluate(({ themeKey, themeId }) => {
    try {
      localStorage.setItem(themeKey, themeId);
      document.documentElement.setAttribute("data-theme", themeId);
    } catch {
      /* ignore */
    }
  }, { themeKey: THEME_STORAGE_KEY, themeId: theme });
  await expect(page.locator("header[data-nn-header-layout]").first()).toBeVisible({
    timeout: 180_000,
  });
}

/**
 * Marketing pricing lives at `/pricing` (EN default) or `/{locale}/pricing` (localized prefix).
 * Some hubs use `…/pricing` as a trailing segment — treat any pathname segment exactly `pricing`.
 */
function urlPathnameHasPricingSegment(url: URL): boolean {
  return url.pathname
    .toLowerCase()
    .split("/")
    .some((segment) => segment === "pricing");
}

function utilityBarLocator(page: import("@playwright/test").Page) {
  return page.locator(".nn-marketing-nav-v31-bar-a[data-nn-header-band='utility']").first();
}

function primaryRowLocator(page: import("@playwright/test").Page) {
  return page.locator("header.nn-header-logo-row .nn-header-desktop-grid").first();
}

function tierBandLocator(page: import("@playwright/test").Page) {
  return page.locator(".nn-marketing-nav-v31-tier-rail[data-nn-header-band='tier']").first();
}

test.describe("Marketing header layout — responsive", () => {
  test("desktop 1280: utility above primary, nav/auth no overlap, brand colors match, nav works", async ({
    page,
    baseURL,
  }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHomeLightMarketing(page);
    await settle(page);
    await dismissMarketingScrims(page);

    await page.screenshot({
      path: path.join(SHOT_DIR, `after-fix-${testInfo.project.name}-1280x900.png`),
      fullPage: false,
    });

    await expect(page.locator('header[data-nn-header-layout="marketing-row4"]')).toBeVisible({ timeout: 60_000 });

    const utility = utilityBarLocator(page);
    const primary = primaryRowLocator(page);
    const tier = tierBandLocator(page);

    await expect(utility).toBeVisible({ timeout: 60_000 });
    await expect(primary).toBeVisible({ timeout: 60_000 });
    await expect(tier).toBeVisible({ timeout: 60_000 });

    const stackOk = await page.evaluate(() => {
      const u = document.querySelector(".nn-marketing-nav-v31-bar-a[data-nn-header-band='utility']");
      const p = document.querySelector("header.nn-header-logo-row .nn-header-desktop-grid");
      if (!u || !p) return { ok: false as const, reason: "missing nodes" };
      const ur = u.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      return { ok: ur.bottom <= pr.top + 1.5, ub: ur.bottom, pt: pr.top };
    });
    expect(stackOk.ok, JSON.stringify(stackOk)).toBe(true);

    const noOverlap = await page.evaluate(() => {
      function overlap(a: DOMRect, b: DOMRect) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }
      const nav = document.querySelector(".nn-header-main-marketing-nav");
      const auth = document.querySelector(".nn-header-desktop-auth-cluster");
      if (!nav || !auth) return { ok: false as const, reason: "missing nav/auth" };
      const a = nav.getBoundingClientRect();
      const b = auth.getBoundingClientRect();
      return { ok: !overlap(a, b), nav: a, auth: b };
    });
    expect(noOverlap.ok, JSON.stringify(noOverlap)).toBe(true);

    const brandMatch = await page.evaluate(() => {
      const leaf = document.querySelector("[data-nn-header-lockup=\"leaf\"]");
      const word = document.querySelector("[data-nn-header-lockup=\"wordmark\"]");
      if (!leaf || !word) return { ok: false as const };
      const lc = getComputedStyle(leaf).color;
      const wc = getComputedStyle(word).color;
      return { ok: lc === wc, lc, wc };
    });
    expect(brandMatch.ok, JSON.stringify(brandMatch)).toBe(true);

    const nav = page.locator("header .nn-header-main-marketing-nav");
    const pricing = nav.getByRole("link", { name: /^pricing$/i }).first();
    await expect(pricing).toBeVisible();
    const href = await pricing.getAttribute("href");
    expect(href, "pricing nav link must expose href").toBeTruthy();
    const resolved = new URL(href!, (baseURL && baseURL.trim()) || resolveE2eAppBaseUrl());
    expect(urlPathnameHasPricingSegment(resolved), `expected pricing path segment in ${resolved.pathname}`).toBe(
      true,
    );

    const utilityCluster = utilityBarLocator(page).locator('[data-testid="marketing-header-utility-cluster"]');
    /* Order is stable: country trigger, language toggle (aria-expanded), optional theme control. */
    await expect(utilityCluster.getByRole("button").first()).toBeVisible({ timeout: 30_000 });
    await expect(utilityCluster.locator("button[aria-expanded]").first()).toBeVisible({ timeout: 30_000 });

    const noHotPinkChrome = await page.evaluate(() => {
      const HOT = "rgb(255, 105, 180)";
      const header = document.querySelector('header[data-nn-header-layout="marketing-row4"]');
      if (!header) return { ok: false as const, reason: "no header" };
      const lockup = header.querySelector("[data-nn-header-brand-lockup]");
      const fg = lockup ? getComputedStyle(lockup).color : "";
      if (fg === HOT) return { ok: false as const, reason: "lockup color is hotpink" };
      return { ok: true as const, fg };
    });
    expect(noHotPinkChrome.ok, JSON.stringify(noHotPinkChrome)).toBe(true);

    await pricing.scrollIntoViewIfNeeded();
    await pricing.click({ trial: true });
  });

  test("desktop 1024: utility above primary, no nav/auth overlap, brand colors match, key hrefs", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await gotoHomeLightMarketing(page);
    await settle(page);
    await dismissMarketingScrims(page);

    await page.screenshot({
      path: path.join(SHOT_DIR, `after-fix-${testInfo.project.name}-1024x900.png`),
      fullPage: false,
    });

    await expect(page.locator('header[data-nn-header-layout="marketing-row4"]')).toBeVisible({ timeout: 60_000 });

    const utility = utilityBarLocator(page);
    const primary = primaryRowLocator(page);
    await expect(utility).toBeVisible({ timeout: 60_000 });
    await expect(primary).toBeVisible({ timeout: 60_000 });

    const stackOk = await page.evaluate(() => {
      const u = document.querySelector(".nn-marketing-nav-v31-bar-a[data-nn-header-band='utility']");
      const p = document.querySelector("header.nn-header-logo-row .nn-header-desktop-grid");
      if (!u || !p) return { ok: false as const, reason: "missing nodes" };
      const ur = u.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      return { ok: ur.bottom <= pr.top + 1.5, ub: ur.bottom, pt: pr.top };
    });
    expect(stackOk.ok, JSON.stringify(stackOk)).toBe(true);

    const noOverlap = await page.evaluate(() => {
      function overlap(a: DOMRect, b: DOMRect) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }
      const nav = document.querySelector(".nn-header-main-marketing-nav");
      const auth = document.querySelector(".nn-header-desktop-auth-cluster");
      if (!nav || !auth) return { ok: false as const };
      return { ok: !overlap(nav.getBoundingClientRect(), auth.getBoundingClientRect()) };
    });
    expect(noOverlap.ok).toBe(true);

    const brandMatch = await page.evaluate(() => {
      const leaf = document.querySelector("[data-nn-header-lockup=\"leaf\"]");
      const word = document.querySelector("[data-nn-header-lockup=\"wordmark\"]");
      if (!leaf || !word) return { ok: false as const };
      return { ok: getComputedStyle(leaf).color === getComputedStyle(word).color };
    });
    expect(brandMatch.ok).toBe(true);

    const nav = page.locator("header .nn-header-main-marketing-nav");
    const pricing = nav.getByRole("link", { name: /^pricing$/i }).first();
    const blog = nav.getByRole("link", { name: /^blog$/i }).first();
    const faq = nav.getByRole("link", { name: /^faq$/i }).first();
    await expect(pricing).toHaveAttribute("href", /pricing/);
    await expect(blog).toHaveAttribute("href", /\/blog/);
    await expect(faq).toHaveAttribute("href", /\/faq/);
  });

  test("tablet 768: mobile chrome; brand cluster vs controls do not overlap", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await gotoHomeLightMarketing(page);
    await settle(page);

    await page.screenshot({
      path: path.join(SHOT_DIR, `after-fix-${testInfo.project.name}-768x1024.png`),
      fullPage: false,
    });

    await expect(primaryRowLocator(page)).toBeHidden();
    await expect(page.locator("header").first()).toBeVisible({ timeout: 60_000 });

    const mobileOk = await page.evaluate(() => {
      function overlap(a: DOMRect, b: DOMRect) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }
      const header = document.querySelector("header");
      if (!header) return { ok: false as const, reason: "missing marketing header" };
      const brand = header.querySelector(".nn-header-mobile-brand-auth-cluster");
      const controls = header.querySelector(
        ".top-bar.nn-header-mobile-only-flex > div.nn-header-mobile-only-flex",
      );
      if (!brand || !controls) return { ok: false as const, reason: "missing mobile clusters" };
      return { ok: !overlap(brand.getBoundingClientRect(), controls.getBoundingClientRect()) };
    });
    expect(mobileOk.ok, JSON.stringify(mobileOk)).toBe(true);

    await expect(page.getByRole("button", { name: /open menu|menu/i })).toBeVisible({ timeout: 60_000 });

    /* Mobile chrome: keep the top bar from turning into an overcrowded control strip. */
    const mobileControlCount = await page.evaluate(() => {
      const header = document.querySelector("header");
      if (!header) return -1;
      return header.querySelectorAll("a[href], button:not([hidden])").length;
    });
    expect(mobileControlCount).toBeGreaterThan(0);
    expect(mobileControlCount).toBeLessThan(24);
  });

  test("mobile 390: menu visible; tier/desktop rows absent", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHomeLightMarketing(page);
    await settle(page);

    await page.screenshot({
      path: path.join(SHOT_DIR, `after-fix-${testInfo.project.name}-390x844.png`),
      fullPage: false,
    });

    await expect(primaryRowLocator(page)).toBeHidden();
    await expect(tierBandLocator(page)).toBeHidden();
    await expect(page.getByRole("button", { name: /open menu|menu/i })).toBeVisible({ timeout: 60_000 });
  });

  test("theme control in utility band when multiple public themes (chromium)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHomeLightMarketing(page);
    await settle(page);

    if (publicMarketingThemeChoiceCount() <= 1) {
      test.skip(true, "Single public marketing theme — theme picker intentionally omitted.");
    }

    const themeBtn = utilityBarLocator(page).locator("button[aria-haspopup=\"listbox\"]").first();
    await expect(themeBtn).toBeVisible({ timeout: 30_000 });
    await expect(themeBtn).toBeEnabled();
  });

  test("desktop 1280: Aurora header uses capped shell width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHomeLightMarketing(page, "aurora");
    await settle(page);
    await dismissMarketingScrims(page);

    await expect(page.locator('html[data-theme="aurora"]')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('header[data-nn-header-layout="marketing-row4"]')).toBeVisible({ timeout: 60_000 });

    const auroraCap = await page.evaluate(() => {
      const shell = document.querySelector(".nn-header-primary-inner-shell.nn-section-shell");
      const frame = document.querySelector(".nn-marketing-nav-v31-frame");
      if (!(shell instanceof HTMLElement) || !(frame instanceof HTMLElement)) {
        return { ok: false as const, reason: "missing capped shell or nav frame" };
      }
      const shellStyle = getComputedStyle(shell);
      const maxWidth = Number.parseFloat(shellStyle.maxWidth);
      const shellRect = shell.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      return {
        ok:
          shell.classList.contains("nn-section-shell") &&
          Number.isFinite(maxWidth) &&
          maxWidth > 0 &&
          shellRect.width <= maxWidth + 96 &&
          frameRect.width <= window.innerWidth + 1,
        maxWidth: shellStyle.maxWidth,
        shellWidth: shellRect.width,
        frameWidth: frameRect.width,
        viewportWidth: window.innerWidth,
      };
    });
    expect(auroraCap.ok, JSON.stringify(auroraCap)).toBe(true);
  });
});

test.describe("Marketing header — Ocean / Blossom / Midnight", () => {
  test("desktop 1440: v4 hierarchy, recessed tier, no button wall", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const theme of MARKETING_THEME_READABILITY_THEMES) {
      await gotoHomeLightMarketing(page, theme);
      await settle(page);
      await dismissMarketingScrims(page);

      await expect(page.locator("header").first(), `${theme} header`).toBeVisible({ timeout: 60_000 });

      const hierarchy = await page.evaluate(() => {
        function parseAlpha(color: string): number {
          if (!color || color === "transparent") return 0;
          const rgba = color.match(/rgba?\([^,]+,[^,]+,[^,]+(?:,\s*([\d.]+))?\)/i);
          if (rgba) return rgba[1] === undefined ? 1 : Number(rgba[1]);
          const srgb = color.match(/color\(srgb\s+[\d.]+\s+[\d.]+\s+[\d.]+(?:\s*\/\s*([\d.]+))?\)/i);
          if (srgb) return srgb[1] === undefined ? 1 : Number(srgb[1]);
          return 1;
        }
        function overlap(a: DOMRect, b: DOMRect) {
          return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        }
        const primary = document.querySelector(".nn-header-desktop-grid");
        const nav = document.querySelector(".nn-header-main-marketing-nav");
        const auth = document.querySelector(".nn-header-desktop-auth-cluster");
        const utility =
          document.querySelector(".nn-marketing-nav-v31-bar-a[data-nn-header-band='utility']") ??
          document.querySelector("[data-testid='marketing-header-utility-inline']");
        const tier = document.querySelector(".nn-marketing-nav-v31-tier-rail[data-nn-header-band='tier']");
        const links = Array.from(document.querySelectorAll(".nn-header-main-marketing-nav a.nn-marketing-nav-link"));
        if (!primary || !nav || !auth || !tier || links.length === 0) {
          return { ok: false as const, reason: "missing desktop header pieces" };
        }
        const primaryRect = primary.getBoundingClientRect();
        const tierRect = tier.getBoundingClientRect();
        const utilityRect = utility?.getBoundingClientRect() ?? null;
        const linksWithHeavyChrome = links.filter((link) => {
          const style = getComputedStyle(link);
          return parseAlpha(style.backgroundColor) > 0.08 || parseAlpha(style.borderTopColor) > 0.12;
        }).length;
        const tierChip = tier.querySelector("a");
        const tierStyle = tierChip ? getComputedStyle(tierChip) : null;
        const utilitySeparated = utilityRect
          ? utilityRect.bottom <= primaryRect.top + 2 || utilityRect.left >= primaryRect.right - 360
          : true;
        return {
          ok: true as const,
          noOverlap: !overlap(nav.getBoundingClientRect(), auth.getBoundingClientRect()),
          utilitySeparated,
          tierSecondary: tierRect.height < primaryRect.height,
          noButtonWall: linksWithHeavyChrome <= links.length,
          readablePrimary: primaryRect.height > 0,
          tierTextOpacity: tierStyle ? parseAlpha(tierStyle.color) : 1,
          linksWithHeavyChrome,
          primaryHeight: primaryRect.height,
          tierHeight: tierRect.height,
        };
      });

      expect(hierarchy.ok, JSON.stringify({ theme, hierarchy })).toBe(true);
      if (!hierarchy.ok) continue;
      expect(hierarchy.noOverlap, JSON.stringify({ theme, hierarchy })).toBe(true);
      if (theme !== "midnight") {
        expect(hierarchy.utilitySeparated, JSON.stringify({ theme, hierarchy })).toBe(true);
      }
      expect(hierarchy.tierSecondary, JSON.stringify({ theme, hierarchy })).toBe(true);
      expect(hierarchy.noButtonWall, JSON.stringify({ theme, hierarchy })).toBe(true);
      expect(hierarchy.readablePrimary, JSON.stringify({ theme, hierarchy })).toBe(true);
      expect(hierarchy.tierTextOpacity, JSON.stringify({ theme, hierarchy })).toBeGreaterThan(0.5);
    }
  });

  test("desktop 1280: chrome screenshots + readability token guards", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const HOT_PINK = "rgb(255, 105, 180)";

    for (const theme of MARKETING_THEME_READABILITY_THEMES) {
      await gotoHomeLightMarketing(page, theme);
      await settle(page);
      await dismissMarketingScrims(page);

      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const layout = theme === "midnight" ? "marketing-unified-dark" : "marketing-row4";
      await expect(page.locator(`header[data-nn-header-layout="${layout}"]`).first()).toBeVisible({
        timeout: 60_000,
      });

      const utilityBand = page.locator("[data-testid='marketing-header-utility-band']").first();
      await expect(utilityBand).toBeVisible({ timeout: 30_000 });
      const utilityCluster = page.locator('[data-testid="marketing-header-utility-cluster"]').first();
      await expect(utilityCluster).toBeVisible({ timeout: 30_000 });
      await expect(utilityCluster.getByRole("button").first()).toBeVisible({ timeout: 15_000 });
      await expect(utilityCluster.locator("button[aria-expanded]").first()).toBeVisible({ timeout: 15_000 });
      if (publicMarketingThemeChoiceCount() > 1) {
        const themeBtn = utilityBarLocator(page).locator('button[aria-haspopup="listbox"]').first();
        await expect(themeBtn).toBeVisible({ timeout: 15_000 });
      }

      /* Desktop lockup lives under `[data-testid="marketing-header-primary-row"]` (mobile row is hidden at lg+). */
      const brandRegionOk = await page.evaluate(({ headerLayout }) => {
        const header = document.querySelector(`header[data-nn-header-layout="${headerLayout}"]`);
        const primaryRow = header?.querySelector('[data-testid="marketing-header-primary-row"]');
        const leaf =
          primaryRow?.querySelector('[data-nn-header-lockup="leaf"]') ??
          header?.querySelector('[data-nn-header-lockup="leaf"]');
        const word =
          primaryRow?.querySelector('[data-nn-header-lockup="wordmark"]') ??
          header?.querySelector('[data-nn-header-lockup="wordmark"]');
        if (!leaf || !word) return { ok: false as const, reason: "missing lockup" };
        const lr = leaf.getBoundingClientRect();
        const wr = word.getBoundingClientRect();
        const lc = getComputedStyle(leaf).color;
        const wc = getComputedStyle(word).color;
        const ok =
          lr.width >= 8 &&
          lr.height >= 8 &&
          wr.width >= 24 &&
          wr.height >= 8 &&
          lc === wc &&
          lc !== "transparent";
        return { ok: ok as const, lr: lr.width, wr: wr.width, lc, wc };
      }, { headerLayout: layout });
      expect(brandRegionOk.ok, JSON.stringify(brandRegionOk)).toBe(true);

      await page.screenshot({
        path: path.join(SHOT_DIR, `theme-nav-${theme}-1280x900-${testInfo.project.name}.png`),
        fullPage: false,
      });

      const chromeAudit = await page.evaluate(
        ({ themeId, hotPink }: { themeId: string; hotPink: string }) => {
          function relLuminance(rgb: [number, number, number]): number {
            const lin = rgb.map((c) => {
              const x = c / 255;
              return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
            });
            return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
          }
          function parseRgb(color: string): [number, number, number] | null {
            const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
            if (!m) return null;
            return [Number(m[1]), Number(m[2]), Number(m[3])];
          }
          function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
            const l1 = relLuminance(fg);
            const l2 = relLuminance(bg);
            const L1 = Math.max(l1, l2);
            const L2 = Math.min(l1, l2);
            return (L1 + 0.05) / (L2 + 0.05);
          }
          /** Nav chrome “hot pink” guard — classic hot pink + neon magenta/fuchsia accents. */
          function isForbiddenNavPink(rgb: [number, number, number] | null): boolean {
            if (!rgb) return false;
            const [r, g, b] = rgb;
            if (r === 255 && g === 105 && b === 180) return true;
            if (r >= 235 && b >= 165 && g <= 130) return true;
            return false;
          }
          function scanHeaderChromePink(h: Element | null): { hit: boolean; sample?: string } {
            if (!h) return { hit: false };
            /* Shell surfaces only — avoid CTA/link brand hues. */
            const nodes = h.querySelectorAll(
              ".nn-marketing-nav-v31-frame, .nn-header-desktop-grid, .nn-marketing-nav-v31-tier-inner, [data-testid='marketing-header-utility-band'], .nn-marketing-nav-v31-bar-a",
            );
            for (const el of Array.from(nodes).slice(0, 40)) {
              const s = getComputedStyle(el);
              for (const c of [s.color, s.backgroundColor, s.borderColor]) {
                const p = parseRgb(c);
                if (isForbiddenNavPink(p)) return { hit: true, sample: c };
              }
            }
            return { hit: false };
          }

          const layoutSel = themeId === "midnight" ? "marketing-unified-dark" : "marketing-row4";
          const header = document.querySelector(`header[data-nn-header-layout="${layoutSel}"]`);
          const tierChip = header?.querySelector(
            ".nn-marketing-nav-v31-tier-rail[data-nn-header-band='tier'] a, .nn-marketing-tier-chip",
          );
          const tierColor = tierChip ? getComputedStyle(tierChip).color : "";
          const pinkScan = scanHeaderChromePink(header);

          const wordmark = header?.querySelector('[data-nn-header-lockup="wordmark"]') ?? null;
          const frame = header?.querySelector(".nn-marketing-nav-v31-frame") ?? null;
          const grid = header?.querySelector(".nn-header-desktop-grid") ?? null;
          const wmFg = wordmark ? parseRgb(getComputedStyle(wordmark).color) : null;
          const frameBg = frame ? parseRgb(getComputedStyle(frame).backgroundColor) : null;
          const gridBg = grid ? parseRgb(getComputedStyle(grid).backgroundColor) : null;
          const refBg =
            frameBg && relLuminance(frameBg) > 0.04 ? frameBg : gridBg && relLuminance(gridBg) > 0.04 ? gridBg : null;
          const lockupContrast = wmFg && refBg ? contrastRatio(wmFg, refBg) : 0;

          const lum = (c: string) => {
            const p = parseRgb(c);
            return p ? relLuminance(p) : 0;
          };
          const inkRgb: [number, number, number] = [18, 22, 33];
          const dist = (c: string) => {
            const p = parseRgb(c);
            if (!p) return 999;
            return Math.hypot(p[0] - inkRgb[0], p[1] - inkRgb[1], p[2] - inkRgb[2]);
          };

          if (themeId === "ocean" || themeId === "blossom") {
            const util = header?.querySelector("[data-testid='marketing-header-utility-band']") ?? null;
            const tierRail = header?.querySelector(".nn-marketing-nav-v31-tier-rail[data-nn-header-band='tier']") ?? null;
            const primaryGrid = header?.querySelector(".nn-header-desktop-grid") ?? null;
            const uBg = util ? getComputedStyle(util).backgroundColor : "";
            const tBg = tierRail ? getComputedStyle(tierRail).backgroundColor : "";
            const shellBg = primaryGrid ? getComputedStyle(primaryGrid).backgroundColor : "";
            let shellLum = lum(shellBg);
            let shellBgSample = shellBg;
            if (shellLum < 0.03 && primaryGrid) {
              let cur: Element | null = primaryGrid;
              for (let i = 0; i < 8 && cur; i++) {
                const bg = getComputedStyle(cur).backgroundColor;
                const lv = lum(bg);
                if (lv > 0.03) {
                  shellLum = lv;
                  shellBgSample = bg;
                  break;
                }
                cur = cur.parentElement;
              }
            }
            /* Pastel / clinical light shells stay well above ink-black (~lum 0.02). */
            const shellNotNearBlack = shellLum > 0.14 || dist(shellBgSample) > 55;
            const blossomExtra =
              themeId === "blossom"
                ? {
                    blossomShellPastel: shellLum > 0.2,
                  }
                : {};

            return {
              theme: themeId,
              tierColor,
              hotPinkTier: tierColor === hotPink || isForbiddenNavPink(parseRgb(tierColor)),
              hotPinkChrome: pinkScan.hit,
              utilityNotInkBlack: dist(uBg) > 40 || lum(uBg) > 0.45,
              tierNotInkBlack: dist(tBg) > 40 || lum(tBg) > 0.45,
              shellNotNearBlack,
              lockupContrast,
              ...blossomExtra,
            };
          }

          if (themeId === "midnight") {
            const tierInner = header?.querySelector(".nn-marketing-nav-v31-tier-inner") ?? null;
            const innerBg = tierInner ? getComputedStyle(tierInner).backgroundColor : "";
            const ip = parseRgb(innerBg);
            const innerLum = ip ? relLuminance(ip) : 0;
            const login =
              header?.querySelector("a.nav-item.nn-header-login-receded, a.nn-header-login-receded") ?? null;
            const loginLink =
              login ??
              Array.from(header?.querySelectorAll("a.nav-item") ?? []).find((a) =>
                /log\s*in/i.test(a.textContent ?? ""),
              );
            const loginColor = loginLink ? getComputedStyle(loginLink).color : "";
            const lp = parseRgb(loginColor);
            const loginLum = lp ? relLuminance(lp) : 0;
            const tierLum = parseRgb(tierColor) ? relLuminance(parseRgb(tierColor)!) : 0;
            const utilText = header?.querySelector("[data-testid='marketing-header-utility-band']") ?? null;
            const utilColor = utilText ? getComputedStyle(utilText).color : "";
            const utilLum = parseRgb(utilColor) ? relLuminance(parseRgb(utilColor)!) : 0;
            return {
              theme: themeId,
              tierColor,
              hotPinkTier: tierColor === hotPink || isForbiddenNavPink(parseRgb(tierColor)),
              hotPinkChrome: pinkScan.hit,
              tierInnerLum: innerLum,
              loginOnGlass: loginLum > 0.78,
              tierReadable: tierLum > 0.78,
              utilityTextLum: utilLum,
              utilityReadable: utilLum > 0.72,
              headerOk: Boolean(header),
            };
          }

          return { theme: themeId, tierColor, hotPinkTier: tierColor === hotPink, hotPinkChrome: pinkScan.hit };
        },
        { themeId: theme, hotPink: HOT_PINK },
      );

      expect(chromeAudit.hotPinkTier, JSON.stringify(chromeAudit)).toBe(false);
      expect(chromeAudit.hotPinkChrome, JSON.stringify(chromeAudit)).toBe(false);

      if (theme === "ocean" || theme === "blossom") {
        const light = chromeAudit as {
          utilityNotInkBlack: boolean;
          tierNotInkBlack: boolean;
          shellNotNearBlack: boolean;
          lockupContrast: number;
          blossomShellPastel?: boolean;
        };
        expect(light.utilityNotInkBlack, JSON.stringify(chromeAudit)).toBe(true);
        expect(light.tierNotInkBlack, JSON.stringify(chromeAudit)).toBe(true);
        expect(light.shellNotNearBlack, JSON.stringify(chromeAudit)).toBe(true);
        expect(light.lockupContrast, JSON.stringify(chromeAudit)).toBeGreaterThanOrEqual(2.85);
        if (theme === "blossom") {
          expect(light.blossomShellPastel, JSON.stringify(chromeAudit)).toBe(true);
        }
      }
      if (theme === "midnight") {
        const dark = chromeAudit as {
          loginOnGlass: boolean;
          tierReadable: boolean;
          utilityReadable: boolean;
        };
        expect(dark.loginOnGlass, JSON.stringify(chromeAudit)).toBe(true);
        expect(dark.tierReadable, JSON.stringify(chromeAudit)).toBe(true);
        expect(dark.utilityReadable, JSON.stringify(chromeAudit)).toBe(true);
      }
    }
  });

  test("mobile 390: Ocean / Blossom / Midnight nav screenshots", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const theme of MARKETING_THEME_READABILITY_THEMES) {
      await gotoHomeLightMarketing(page, theme);
      await settle(page);
      await page.screenshot({
        path: path.join(SHOT_DIR, `theme-nav-${theme}-390x844-${testInfo.project.name}.png`),
        fullPage: false,
      });
    }
  });
});
