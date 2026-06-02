import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const OUT = path.join(process.cwd(), "reports", "figma-navigation-preview-2026-05-08");

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const v of ["a", "b", "c"]) {
    fs.mkdirSync(path.join(OUT, v), { recursive: true });
  }
});

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function setTheme(page: import("@playwright/test").Page, themeId: string) {
  await page.evaluate((id) => {
    document.documentElement.setAttribute("data-theme", id);
  }, themeId);
}

test("capture figma navigation preview screenshots", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Stable PNG capture uses chromium project only.");

  for (const v of ["a", "b", "c"] as const) {
    const d = path.join(OUT, v);

    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto(`/preview/figma-navigation/${v}?auth=anon`);
    await setTheme(page, "ocean");
    await expect(page.locator(`header[data-preview-nav-variant="${v}"]`)).toBeVisible();
    await page.screenshot({ path: path.join(d, "desktop-anonymous-light.png") });

    await page.goto(`/preview/figma-navigation/${v}?auth=learner`);
    await setTheme(page, "ocean");
    await page.screenshot({ path: path.join(d, "desktop-learner-light.png") });

    await page.goto(`/preview/figma-navigation/${v}?auth=anon&dropdown=1`);
    await setTheme(page, "ocean");
    await page.screenshot({ path: path.join(d, "desktop-dropdown-open-light.png") });

    await setTheme(page, "midnight-ink");
    await page.screenshot({ path: path.join(d, "desktop-dropdown-open-dark.png") });

    await page.goto(`/preview/figma-navigation/${v}?auth=anon`);
    await setTheme(page, "midnight-ink");
    await page.screenshot({ path: path.join(d, "desktop-anonymous-dark.png") });

    await page.goto(`/preview/figma-navigation/${v}?auth=anon`);
    await setTheme(page, "ocean");
    await page.evaluate(() => window.scrollTo(0, 360));
    await sleep(250);
    await expect(page.locator("header[data-preview-scrolled='true']")).toBeVisible();
    await page.screenshot({ path: path.join(d, "desktop-sticky-scrolled-light.png") });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/preview/figma-navigation/${v}?auth=anon`);
    await setTheme(page, "ocean");
    await page.screenshot({ path: path.join(d, "mobile-anonymous-light.png") });

    await page.goto(`/preview/figma-navigation/${v}?auth=learner`);
    await setTheme(page, "ocean");
    await page.screenshot({ path: path.join(d, "mobile-learner-light.png") });

    await page.goto(`/preview/figma-navigation/${v}?auth=anon`);
    await setTheme(page, "ocean");
    await page.getByRole("button", { name: "Open menu" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.screenshot({ path: path.join(d, "mobile-sheet-open-light.png") });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
});
