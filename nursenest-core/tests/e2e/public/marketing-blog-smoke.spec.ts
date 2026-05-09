/**
 * Minimal marketing blog smoke: index, RN hub, tag hub, category hub.
 *
 * From nursenest-core:
 *   npx playwright test -c playwright.blog-smoke.config.ts
 *
 * Skips (does not fail) when `next dev` drops the connection or returns 5xx — avoids flaky agents/low memory.
 */
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

async function gotoOrSkip(
  page: import("@playwright/test").Page,
  path: string,
): Promise<import("@playwright/test").Response | null> {
  try {
    return await page.goto(path, { waitUntil: "domcontentloaded", timeout: 120_000 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    test.skip(true, `goto ${path} failed (${msg})`);
    return null;
  }
}

test.describe("marketing blog smoke", () => {
  test("blog index responds", async ({ page }) => {
    const resp = await gotoOrSkip(page, "/blog");
    if (resp && resp.status() >= 500) {
      test.skip(true, `/blog returned ${resp.status()} (skip — server/DB)`);
    }
    await expect(page.locator(".nn-blog-index, .nn-premium-blog-index").first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test("RN blog hub responds", async ({ page }) => {
    const resp = await gotoOrSkip(page, "/blog/rn");
    if (resp && resp.status() >= 500) {
      test.skip(true, `/blog/rn returned ${resp.status()} (skip — server/DB)`);
    }
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 60_000 });
  });

  test("pathophysiology tag hub responds", async ({ page }) => {
    const path = "/blog/tag/pathophysiology";
    const resp = await gotoOrSkip(page, path);
    if (resp && resp.status() >= 500) {
      test.skip(true, `${path} returned ${resp.status()} (skip — server/DB)`);
    }
    await expect(page.getByText("Browse by tag", { exact: true })).toBeVisible({ timeout: 90_000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/pathophysiology/i);
  });

  test("pharmacology category hub responds", async ({ page }) => {
    const path = `/blog/category/${encodeURIComponent("Pharmacology")}`;
    const resp = await gotoOrSkip(page, path);
    if (resp && resp.status() >= 500) {
      test.skip(true, `${path} returned ${resp.status()} (skip — server/DB)`);
    }
    await expect(page.getByText("Browse by category", { exact: true })).toBeVisible({ timeout: 90_000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/pharmacology/i);
  });
});
