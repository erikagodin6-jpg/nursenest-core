import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";
import { THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";

const SCREENSHOT_DIR = join("docs", "screenshots", "faq-premium-redesign");
mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function openFaq(page: Page, theme: "ocean" | "blossom" | "midnight" = "ocean") {
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, value);
      document.documentElement.setAttribute("data-theme", value);
    },
    { key: THEME_STORAGE_KEY, value: theme },
  );
  await page.goto("/faq", { waitUntil: "load", timeout: 120_000 });
  await expect(page.getByTestId("marketing-faq-legal")).toBeVisible({ timeout: 30_000 });
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme, { timeout: 10_000 });
}

async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
}

test.describe("Premium FAQ redesign", () => {
  test("mobile accordions are accessible, polished, and free of overflow", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openFaq(page, "midnight");

    const shell = page.getByTestId("premium-faq-shell");
    await expect(shell).toBeVisible();
    await expect(page.getByTestId("premium-faq-sticky-cta")).toBeVisible();

    const firstTrigger = page.getByTestId("premium-faq-accordion-trigger").first();
    await expect(firstTrigger).toBeVisible();
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
    await firstTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

    const minTapTarget = await firstTrigger.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return Math.min(rect.width, rect.height);
    });
    expect(minTapTarget).toBeGreaterThanOrEqual(44);
    expect(await hasHorizontalOverflow(page)).toBe(false);

    await page.screenshot({ path: testInfo.outputPath("faq-mobile-midnight.png"), fullPage: true });
  });

  test("FAQ copy uses consistent capitalization for high-visibility labels", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openFaq(page, "ocean");

    const labels = await page
      .locator(
        "[data-faq-capitalization-check] :is(h1,h2,h3,button,a,.nn-faq-chip,.nn-faq-section-label)",
      )
      .evaluateAll((nodes) =>
        nodes
          .map((node) => node.textContent?.replace(/\s+/g, " ").trim() ?? "")
          .filter(Boolean),
      );

    const badLabels = labels.filter((label) =>
      /^(start studying now|view faq|premium features included|product questions|what does the platform look like|start for free)$/u.test(
        label,
      ),
    );
    expect(badLabels).toEqual([]);
    await expect(page.getByRole("link", { name: "Start Studying Now" })).toBeVisible();
  });

  test("Ocean, Blossom, and Midnight share structure while changing premium surfaces", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    const snapshots: Record<string, { background: string; border: string; height: number }> = {};
    for (const theme of ["ocean", "blossom", "midnight"] as const) {
      await openFaq(page, theme);
      const card = page.getByTestId("premium-faq-card").first();
      await expect(card).toBeVisible();
      snapshots[theme] = await card.evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          background: cs.backgroundColor,
          border: cs.borderColor,
          height: Math.round(document.documentElement.scrollHeight),
        };
      });
      await page.screenshot({
        path: join(SCREENSHOT_DIR, `faq-desktop-${theme}.png`),
        fullPage: true,
      });
      await page.screenshot({ path: testInfo.outputPath(`faq-desktop-${theme}.png`), fullPage: false });
    }

    expect(snapshots.ocean.background).not.toBe(snapshots.midnight.background);
    expect(snapshots.blossom.border).not.toBe(snapshots.midnight.border);
    const heights = Object.values(snapshots).map((s) => s.height);
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(96);
  });

  test("reduced motion disables FAQ accordion transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await openFaq(page, "blossom");

    const transition = await page.getByTestId("premium-faq-card").first().evaluate((el) => {
      return getComputedStyle(el).transitionDuration;
    });
    expect(transition).toMatch(/^(0s|0ms)(,\s*(0s|0ms))*$/);
  });
});
