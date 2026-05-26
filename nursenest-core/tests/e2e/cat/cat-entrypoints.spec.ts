import { expect, test } from "@playwright/test";
import { publicMarketingCatHrefForOffering } from "../../../src/lib/exam-pathways/practice-exams-cat-start";
import { marketingCatPathForPathwayId } from "../../../src/lib/exam-pathways/practice-exams-cat-start";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();

const activeCatCallbackPathwayIds = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
] as const;

const unavailableButPathwayScopedCatPathwayIds = [
  "us-np-fnp",
  "us-np-pmhnp",
] as const;

const loftRedirectCatPathwayIds = [
  "ca-np-cnple",
] as const;

function requiredMarketingCatPath(pathwayId: string): string {
  const path = marketingCatPathForPathwayId(pathwayId);
  if (!path) throw new Error(`Missing marketing CAT path for ${pathwayId}`);
  return path;
}

test.describe("CAT entrypoint routing", () => {
  for (const region of ["US", "CA"] as const) {
    test(`/practice-exams links to pathway CAT pages (${region})`, async ({ context, page }) => {
      await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: region, url: baseURL }]);
      await page.goto(`${baseURL}/practice-exams`, { waitUntil: "domcontentloaded" });

      if (region === "CA") {
        await page.getByRole("group", { name: "Region" }).getByRole("button", { name: "Canada", exact: true }).click();
      }

      const offerings = ["rn", "pn", "np", "allied"] as const;
      for (const offering of offerings) {
        const href = publicMarketingCatHrefForOffering(region, offering);
        await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
      }
    });
  }

  for (const pathwayId of activeCatCallbackPathwayIds) {
    const catPath = requiredMarketingCatPath(pathwayId);
    test(`sign-in callback returns to same CAT path (${pathwayId})`, async ({ page }) => {
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

  for (const pathwayId of unavailableButPathwayScopedCatPathwayIds) {
    const catPath = requiredMarketingCatPath(pathwayId);
    const basePath = catPath.replace(/\/cat$/, "");
    test(`NP CAT page remains pathway-scoped whether available or unavailable (${pathwayId})`, async ({ page }) => {
      await page.goto(catPath, { waitUntil: "domcontentloaded" });
      await expect(page.locator(`a[href="${basePath}/lessons"]`).first()).toBeVisible();
      await expect(page.locator(`a[href="${basePath}/questions"]`).first()).toBeVisible();
      const signInForCat = page.locator(`a[href*="callbackUrl=${encodeURIComponent(catPath)}"]`).first();
      if (await signInForCat.isVisible()) {
        const href = await signInForCat.getAttribute("href");
        expect(href).toBeTruthy();
        const callbackUrl = new URL(href!, baseURL).searchParams.get("callbackUrl");
        expect(callbackUrl).toBe(catPath);
      }
    });
  }

  for (const pathwayId of loftRedirectCatPathwayIds) {
    const catPath = requiredMarketingCatPath(pathwayId);
    const basePath = catPath.replace(/\/cat$/, "");
    test(`CNPLE CAT route resolves to pathway-scoped LOFT simulation (${pathwayId})`, async ({ page }) => {
      const redirectResponse = await fetch(new URL(catPath, baseURL), { redirect: "manual" });
      expect([200, 307, 308]).toContain(redirectResponse.status);
      if (redirectResponse.status !== 200) {
        expect(redirectResponse.headers.get("location")).toBe(`${basePath}/simulation`);
      }

      await page.goto(`${basePath}/simulation`, { waitUntil: "domcontentloaded" });
      await expect(page.locator(`a[href="${basePath}/lessons"]`).first()).toBeVisible();
      await expect(page.locator(`a[href="${basePath}/questions"]`).first()).toBeVisible();
      await expect(page.locator(`a[href*="callbackUrl=${encodeURIComponent(catPath)}"]`)).toHaveCount(0);
    });
  }

  test("allied CAT page stays pathway-scoped", async ({ page }) => {
    const catPath = "/allied/allied-health/cat";
    await page.goto(catPath, { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="/allied/allied-health/lessons"]')).toBeVisible();
    await expect(page.locator('a[href="/allied/allied-health/questions"]')).toBeVisible();

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
    await page.goto("/us/rpn/rex-pn/cat", { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href*="callbackUrl=%2Fus%2Frpn%2Frex-pn%2Fcat"]')).toHaveCount(0);
  });

  test("Canada RPN uses canonical PN route segment, not stale internal rpn segment", async () => {
    expect(requiredMarketingCatPath("ca-rpn-rex-pn")).toBe("/canada/pn/rex-pn/cat");
  });
});
