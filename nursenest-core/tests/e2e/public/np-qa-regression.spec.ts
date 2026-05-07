import { expect, test } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();

test.describe("NP browser QA regressions", () => {
  test("signup filters United States NP exam choices to US NP specialties", async ({ page }) => {
    await page.goto(`${baseURL}/signup`, { waitUntil: "domcontentloaded" });

    await expect(page.getByPlaceholder("First name")).toBeVisible();
    await expect(page.getByPlaceholder("Last name")).toBeVisible();
    await expect(page.getByPlaceholder(/Placeholder First Name/i)).toHaveCount(0);
    await expect(page.getByPlaceholder(/Placeholder Last Name/i)).toHaveCount(0);

    await page.locator('select[name="country"]').selectOption("US");
    await page.locator('select[name="tier"]').selectOption("NP");

    const labels = await page.locator('select[name="examFocus"] option').evaluateAll((options) =>
      options.map((option) => option.textContent?.trim() ?? ""),
    );
    expect(labels).toEqual([
      "FNP - Family Nurse Practitioner",
      "AGPCNP - Adult-Gerontology Primary Care NP",
      "PMHNP - Psychiatric-Mental Health NP",
      "WHNP - Women's Health NP",
      "PNP-PC - Pediatric Primary Care NP",
    ]);
    expect(labels.join(" ")).not.toMatch(/Canada|CNPLE|REx-PN|NCLEX-RN/i);
  });

  test("legacy EN NP hubs and CAT pages emit pathway-specific titles", async ({ page }) => {
    await page.goto(`${baseURL}/en/np/fnp`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/FNP Exam Prep/i);
    await expect(page).not.toHaveTitle(/Canada-First/i);

    await page.goto(`${baseURL}/en/np/fnp/cat`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/FNP/i);
    await expect(page).not.toHaveTitle(/^$/);
  });

  test("header Start Free CTA points to signup", async ({ page }) => {
    await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
    const startFree = page.getByRole("link", { name: /Start free account/i }).first();
    await expect(startFree).toBeVisible();
    const href = await startFree.getAttribute("href");
    expect(new URL(href ?? "", baseURL).pathname).toMatch(/\/signup$/);

    await startFree.click();
    await expect(page).toHaveURL(/\/signup(?:\?|$)/);
  });
});
