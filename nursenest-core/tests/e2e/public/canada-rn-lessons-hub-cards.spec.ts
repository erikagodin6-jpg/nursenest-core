/**
 * Public marketing: Canada RN NCLEX lessons hub — multi-card library + detail navigation smoke.
 *
 * Run (local): `cd nursenest-core && npx playwright test tests/e2e/public/canada-rn-lessons-hub-cards.spec.ts`
 */
import { expect, test } from "@playwright/test";

test.describe("Canada RN lessons hub (public)", () => {
  test("/canada/rn/nclex-rn/lessons shows a lesson library and lesson detail links resolve", async ({ page }) => {
    const r = await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded" });
    expect(r?.ok(), `HTTP ${r?.status()}`).toBeTruthy();

    await expect(page.locator("#pathway-lesson-library")).toBeVisible({ timeout: 60_000 });

    const retryShell = page.getByText("Lessons temporarily unavailable");
    const emptyCurriculum = page.locator('[data-nn-empty="curriculum-hub-empty"]');
    await expect(retryShell).toHaveCount(0);
    await expect(emptyCurriculum).toHaveCount(0);

    const lessonLinks = page.locator('#pathway-lesson-library a[href*="/lessons/"]');
    await expect(lessonLinks.first()).toBeVisible({ timeout: 60_000 });
    const n = await lessonLinks.count();
    expect(n, "expected at least 12 public lesson links on first paint").toBeGreaterThanOrEqual(12);

    for (let i = 0; i < Math.min(3, n); i += 1) {
      const href = (await lessonLinks.nth(i).getAttribute("href"))?.trim();
      expect(href, `lesson link ${i} missing href`).toBeTruthy();
      const detail = await page.goto(href!, { waitUntil: "domcontentloaded" });
      expect(detail?.ok(), `detail HTTP ${detail?.status()} for ${href}`).toBeTruthy();
      expect(detail?.status(), `expected 2xx lesson detail for ${href}`).toBeLessThan(400);
      await page.goto("/canada/rn/nclex-rn/lessons", { waitUntil: "domcontentloaded" });
      await expect(page.locator("#pathway-lesson-library")).toBeVisible({ timeout: 60_000 });
    }
  });
});
