import { expect, test } from "@playwright/test";
import { publicMarketingCatHrefForOffering } from "../src/lib/exam-pathways/practice-exams-cat-start";
import { MARKETING_REGION_COOKIE } from "../src/lib/region/marketing-region-cookie";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

test.describe("CAT entrypoint routing", () => {
  for (const region of ["US", "CA"] as const) {
    test(`/practice-exams links to pathway CAT pages (${region})`, async ({ context, page }) => {
      await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: region, url: baseURL }]);
      await page.goto(`${baseURL}/practice-exams`, { waitUntil: "domcontentloaded" });

      if (region === "CA") {
        await expect(page.getByRole("button", { name: /Country: Canada/i }).first()).toBeVisible();
      } else {
        await expect(page.getByRole("button", { name: /Country: United States/i }).first()).toBeVisible();
      }

      const offerings = region === "CA" ? (["pn", "np", "allied"] as const) : (["rn", "pn", "np", "allied"] as const);
      for (const offering of offerings) {
        const href = publicMarketingCatHrefForOffering(region, offering);
        await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
      }
    });
  }

  for (const catPath of ["/us/rn/nclex-rn/cat", "/canada/rpn/rex-pn/cat"] as const) {
    test(`sign-in callback returns to same CAT path (${catPath})`, async ({ page }) => {
      await page.goto(catPath, { waitUntil: "domcontentloaded" });
      const encodedPath = encodeURIComponent(catPath);
      const signInForCat = page.locator(`a[href*="callbackUrl=${encodedPath}"]`).first();
      await expect(signInForCat).toBeVisible();
      const href = await signInForCat.getAttribute("href");
      expect(href).toBeTruthy();
      const callbackUrl = new URL(href!, baseURL).searchParams.get("callbackUrl");
      expect(callbackUrl).toBe(catPath);
    });
  }

  test("US FNP CAT keeps pathway-scoped fallback links when unavailable", async ({ page }) => {
    const catPath = "/us/np/fnp/cat";
    await page.goto(catPath, { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="/us/np/fnp/lessons"]').first()).toBeVisible();
    await expect(page.locator('a[href="/us/np/fnp/questions"]').first()).toBeVisible();
    await expect(page.locator(`a[href*="callbackUrl=${encodeURIComponent(catPath)}"]`)).toHaveCount(0);
  });

  test("blocked waitlist pathway keeps lessons and question bank available", async ({ page }) => {
    await page.goto("/canada/np/cnple/cat", { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="/canada/np/cnple/lessons"]').first()).toBeVisible();
    await expect(page.locator('a[href="/canada/np/cnple/questions"]').first()).toBeVisible();
    await expect(page.locator('a[href*="callbackUrl=%2Fcanada%2Fnp%2Fcnple%2Fcat"]')).toHaveCount(0);
  });

  test("allied CAT page stays pathway-scoped", async ({ page }) => {
    const catPath = "/us/allied/allied-health/cat";
    await page.goto(catPath, { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="/us/allied/allied-health/lessons"]')).toBeVisible();
    await expect(page.locator('a[href="/us/allied/allied-health/questions"]')).toBeVisible();

    const signInForCat = page.locator(`a[href*="callbackUrl=${encodeURIComponent(catPath)}"]`).first();
    if (await signInForCat.isVisible()) {
      const href = await signInForCat.getAttribute("href");
      expect(href).toBeTruthy();
      const callbackUrl = new URL(href!, baseURL).searchParams.get("callbackUrl");
      expect(callbackUrl).toBe(catPath);
    } else {
      await expect(page.getByRole("link", { name: "Lessons" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Question bank" })).toBeVisible();
    }
  });

  test("tampered invalid pathway CAT route is blocked", async ({ page }) => {
    const response = await page.goto("/us/rpn/rex-pn/cat", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    await expect(page.locator('a[href*="callbackUrl=%2Fus%2Frpn%2Frex-pn%2Fcat"]')).toHaveCount(0);
  });
});
