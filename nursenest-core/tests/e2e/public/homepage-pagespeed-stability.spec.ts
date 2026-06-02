import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";
import {
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  themeOptionsForPublicMarketingPicker,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { assertDocumentNoHorizontalOverflow } from "../helpers/visual-layout-assertions";

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const SCREENSHOT_DIR = join("docs", "screenshots", "premium-mobile-performance-audit");
const ROUTES = [
  { id: "homepage", path: "/" },
  { id: "lessons", path: "/canada/rn/nclex-rn/lessons" },
  { id: "dashboard", path: "/app" },
  { id: "auth", path: "/login" },
  { id: "cat", path: "/canada/rn/nclex-rn/cat" },
  { id: "flashcards", path: "/flashcards" },
] as const;

mkdirSync(SCREENSHOT_DIR, { recursive: true });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(
    ({ dismissedKey }) => {
      try {
        localStorage.setItem(dismissedKey, "1");
      } catch {
        /* private mode / quota */
      }
    },
    { dismissedKey: SELECTOR_DISMISSED_LS },
  );
});

async function selectThemeViaPicker(page: Page, themeId: string): Promise<void> {
  const option = themeOptionsForPublicMarketingPicker().find((o) => o.id === themeId);
  expect(option, `public theme option ${themeId}`).toBeTruthy();
  const trigger = page.getByRole("button", { name: /^Theme\b/i }).first();
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.click();
  await page.getByRole("option", { name: new RegExp(option!.label, "i") }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", themeId, { timeout: 15_000 });
}

async function readLayoutShiftScore(page: Page): Promise<number> {
  return page.evaluate(() => {
    return Number((window as unknown as { __nnCumulativeLayoutShift?: number }).__nnCumulativeLayoutShift ?? 0);
  });
}

test.describe("Homepage PageSpeed stability", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("homepage has no severe CLS, console errors, mobile overflow, or sticky-nav jumps", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.addInitScript(() => {
      (window as unknown as { __nnCumulativeLayoutShift: number }).__nnCumulativeLayoutShift = 0;
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as PerformanceEntry & {
              value?: number;
              hadRecentInput?: boolean;
            };
            if (!layoutShift.hadRecentInput) {
              (window as unknown as { __nnCumulativeLayoutShift: number }).__nnCumulativeLayoutShift +=
                Number(layoutShift.value ?? 0);
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
      } catch {
        /* Layout Instability API may be unavailable in some browsers. */
      }
    });

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    const main = page.locator("main");
    await expect(main).toBeVisible({ timeout: 30_000 });
    await expect(main.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 30_000 });
    await assertDocumentNoHorizontalOverflow(page);

    const headerBefore = await page.locator("header.nn-header-animate-in").first().boundingBox();
    await page.evaluate(() => window.scrollTo(0, 420));
    await page.waitForTimeout(500);
    const headerAfter = await page.locator("header.nn-header-animate-in").first().boundingBox();

    expect(headerBefore?.height ?? 0).toBeGreaterThan(40);
    expect(Math.abs((headerAfter?.height ?? 0) - (headerBefore?.height ?? 0))).toBeLessThanOrEqual(2);

    const settings = page.getByRole("button", { name: /Region and language settings/i });
    await settings.click();
    await expect(page.getByRole("heading", { name: /Region & Settings/i })).toBeVisible({ timeout: 15_000 });
    await assertDocumentNoHorizontalOverflow(page);

    await page.waitForTimeout(5000);
    const cls = await readLayoutShiftScore(page);
    expect(cls, `homepage CLS after 5s should stay below severe threshold`).toBeLessThan(0.1);
    expect(pageErrors, `page errors: ${pageErrors.join(" | ")}`).toEqual([]);
    expect(consoleErrors, `console errors: ${consoleErrors.join(" | ")}`).toEqual([]);
  });

  test("mobile layout landmarks: minimal bbox drift after 5s + strict CLS (no drawer open)", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __nnCumulativeLayoutShift: number }).__nnCumulativeLayoutShift = 0;
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as PerformanceEntry & {
              value?: number;
              hadRecentInput?: boolean;
            };
            if (!layoutShift.hadRecentInput) {
              (window as unknown as { __nnCumulativeLayoutShift: number }).__nnCumulativeLayoutShift +=
                Number(layoutShift.value ?? 0);
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
      } catch {
        /* Layout Instability API may be unavailable in some browsers. */
      }
    });

    await page.goto("/", { waitUntil: "load", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("hero-section")).toBeVisible({ timeout: 30_000 });

    const sample = async () =>
      page.evaluate(() => {
        const rect = (sel: string) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { top: r.top, left: r.left, width: r.width, height: r.height };
        };
        return {
          header: rect("header.nn-header-animate-in"),
          hero: rect('[data-testid="hero-section"]'),
          footer: rect("footer[data-nn-footer-root]"),
        };
      });

    const before = await sample();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "homepage-mobile-layout-before.png"),
      fullPage: false,
    });

    await page.waitForTimeout(5000);

    const after = await sample();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, "homepage-mobile-layout-after.png"),
      fullPage: false,
    });

    const drift = (a: { top: number; height: number } | null, b: { top: number; height: number } | null) => {
      if (!a || !b) return 999;
      return Math.abs(a.top - b.top) + Math.abs(a.height - b.height);
    };

    expect(before.header?.height ?? 0, "header height before settle").toBeGreaterThan(40);
    expect(drift(before.header, after.header), "header bbox drift (top+height)").toBeLessThanOrEqual(8);
    expect(drift(before.hero, after.hero), "hero bbox drift").toBeLessThanOrEqual(12);
    expect(drift(before.footer, after.footer), "footer bbox drift").toBeLessThanOrEqual(16);

    const cls = await readLayoutShiftScore(page);
    expect(cls, `strict homepage CLS after 5s (no user input)`).toBeLessThan(0.05);
  });

  test("captures requested route/theme screenshots for the mobile performance audit", async ({ page }) => {
    for (const themeId of PUBLIC_MARKETING_THEME_ALLOWLIST) {
      await page.goto("/", { waitUntil: "load", timeout: 120_000 });
      await dismissMarketingScrims(page);
      await selectThemeViaPicker(page, themeId);
      await page.screenshot({
        path: join(SCREENSHOT_DIR, `homepage-${themeId}-mobile.png`),
        fullPage: true,
      });

      await page.context().addInitScript(
        ({ key, theme }) => {
          try {
            localStorage.setItem(key, theme);
          } catch {
            /* ignore */
          }
        },
        { key: THEME_STORAGE_KEY, theme: themeId },
      );

      for (const route of ROUTES.filter((r) => r.id !== "homepage")) {
        await page.goto(route.path, { waitUntil: "load", timeout: 120_000 });
        await dismissMarketingScrims(page).catch(() => {});
        await page.screenshot({
          path: join(SCREENSHOT_DIR, `${route.id}-${themeId}-mobile.png`),
          fullPage: true,
        });
      }
    }
  });
});
