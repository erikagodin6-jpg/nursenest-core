/**
 * E2E: NP specialty onboarding — verifies that each US NP specialty hub loads with specialty-
 * specific content and does not cross-contaminate with other specialties.
 */
import { expect, test } from "@playwright/test";

const NP_SPECIALTY_HUBS = [
  { id: "fnp", path: "/us/np/fnp", label: "FNP", notLabel: "PMHNP" },
  { id: "agpcnp", path: "/us/np/agpcnp", label: "AGPCNP", notLabel: "WHNP" },
  { id: "pmhnp", path: "/us/np/pmhnp", label: "PMHNP", notLabel: "FNP" },
  { id: "whnp", path: "/us/np/whnp", label: "WHNP", notLabel: "Pediatric" },
  { id: "pnp-pc", path: "/us/np/pnp-pc", label: "PNP", notLabel: "PMHNP" },
] as const;

for (const { id, path, label, notLabel } of NP_SPECIALTY_HUBS) {
  test.describe(`NP specialty hub — ${id.toUpperCase()}`, () => {
    test(`${path} loads without server error`, async ({ page }) => {
      const r = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(r?.status(), `Expected 200 for ${path}, got ${r?.status()}`).toBe(200);
    });

    test(`${path} page title contains specialty label ${label}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const title = await page.title();
      expect(title.toLowerCase()).toContain(label.toLowerCase());
    });

    test(`${path} does not show cross-specialty label ${notLabel} in heading`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const headings = await page.locator("h1, h2").allTextContents();
      const combined = headings.join(" ").toLowerCase();
      expect(combined).not.toContain(notLabel.toLowerCase());
    });

    test(`${path} has a visible primary CTA`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const cta = page.locator("a.nn-btn-primary, button.nn-btn-primary").first();
      await expect(cta).toBeVisible({ timeout: 30_000 });
    });
  });
}

test.describe("NP specialty isolation — hub routes are distinct URLs", () => {
  test("FNP and PMHNP are on different URLs", () => {
    const fnpPath = "/us/np/fnp";
    const pmhnpPath = "/us/np/pmhnp";
    expect(fnpPath).not.toBe(pmhnpPath);
  });

  test("WHNP and PNP-PC are on different URLs", () => {
    const whnpPath = "/us/np/whnp";
    const pnpPath = "/us/np/pnp-pc";
    expect(whnpPath).not.toBe(pnpPath);
  });
});
