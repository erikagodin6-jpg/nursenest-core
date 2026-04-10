import { expect, test } from "@playwright/test";
import { publicMarketingCatHrefForOffering } from "../src/lib/exam-pathways/practice-exams-cat-start";
import { MARKETING_REGION_COOKIE } from "../src/lib/region/marketing-region-cookie";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test.describe("CAT entrypoint routing", () => {
  for (const region of ["US", "CA"] as const) {
    test(`/practice-exams links to pathway CAT pages (${region})`, async ({ context, page }) => {
      await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: region, url: baseURL }]);
      await page.goto("/practice-exams", { waitUntil: "domcontentloaded" });

      for (const offering of ["rn", "pn", "np", "allied"] as const) {
        const href = publicMarketingCatHrefForOffering(region, offering);
        await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
      }
    });
  }

  for (const catPath of ["/us/rn/nclex-rn/cat", "/canada/rpn/rex-pn/cat", "/us/np/fnp/cat"] as const) {
    test(`sign-in callback returns to same CAT path (${catPath})`, async ({ page }) => {
      await page.goto(catPath, { waitUntil: "domcontentloaded" });
      const signIn = page.getByRole("link", { name: "Sign in to continue" });
      await expect(signIn).toBeVisible();
      const href = await signIn.getAttribute("href");
      expect(href).toBeTruthy();
      const callbackUrl = new URL(href!, baseURL).searchParams.get("callbackUrl");
      expect(callbackUrl).toBe(catPath);
    });
  }

  test("blocked waitlist pathway keeps lessons and question bank available", async ({ page }) => {
    await page.goto("/canada/np/cnple/cat", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("CAT start unavailable — use links below")).toBeVisible();
    await expect(page.locator('a[href="/canada/np/cnple/lessons"]')).toBeVisible();
    await expect(page.locator('a[href="/canada/np/cnple/questions"]')).toBeVisible();
  });

  test("allied CAT page stays pathway-scoped", async ({ page }) => {
    const catPath = "/us/allied/allied-health/cat";
    await page.goto(catPath, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Adaptive (CAT) practice" })).toBeVisible();
    await expect(page.locator('a[href="/us/allied/allied-health/lessons"]')).toBeVisible();
    await expect(page.locator('a[href="/us/allied/allied-health/questions"]')).toBeVisible();

    const signIn = page.getByRole("link", { name: "Sign in to continue" });
    if (await signIn.isVisible()) {
      const href = await signIn.getAttribute("href");
      expect(href).toBeTruthy();
      const callbackUrl = new URL(href!, baseURL).searchParams.get("callbackUrl");
      expect(callbackUrl).toBe(catPath);
    } else {
      await expect(page.getByText("CAT start unavailable — use links below")).toBeVisible();
    }
  });

  test("tampered invalid pathway CAT route is blocked", async ({ page }) => {
    const response = await page.goto("/us/rpn/rex-pn/cat", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });
});
