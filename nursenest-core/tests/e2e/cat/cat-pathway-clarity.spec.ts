import { test, expect } from "@playwright/test";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();

test.describe("CAT pathway pre-click clarity (marketing)", () => {
  test("US NCLEX-RN CAT entry names the exam on the marketing surface", async ({ page, context }) => {
    await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: "US", url: baseURL }]);
    await page.goto(`${baseURL}/us/rn/nclex-rn/cat`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Readiness Exam/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /NCLEX-RN overview/i })).toBeVisible();
  });

  test("REx-PN CAT landing shows exam in primary controls", async ({ page, context }) => {
    await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: "CA", url: baseURL }]);
    await page.goto(`${baseURL}/canada/rpn/rex-pn/cat`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /REx-PN CAT/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Sign in for REx-PN CAT/i })).toBeVisible();
  });

  test("FNP hub CAT shortcut names the board track", async ({ page, context }) => {
    await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: "US", url: baseURL }]);
    await page.goto(`${baseURL}/us/np/fnp`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /CAT prep - FNP/i })).toBeVisible();
  });

  test("practice-exams hub lists pathways without implying a single default exam", async ({ page, context }) => {
    await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: "US", url: baseURL }]);
    await page.goto(`${baseURL}/practice-exams`, { waitUntil: "domcontentloaded" });
    const section = page.getByRole("region", { name: /CAT-style sessions/i });
    await expect(section).toBeVisible();
    await expect(section.getByRole("link").first()).toBeVisible();
  });
});
