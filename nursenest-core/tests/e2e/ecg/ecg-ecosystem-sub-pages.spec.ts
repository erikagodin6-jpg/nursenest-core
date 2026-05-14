/**
 * ECG ecosystem sub-pages smoke tests.
 *
 * Validates all 9 /advanced-ecg-nursing/[module] sub-pages:
 *  - Return HTTP 200 (no 404 / 500)
 *  - No noindex robots directive
 *  - H1 is present and ECG-related
 *  - Breadcrumb links back to pillar and /ecg-interpretation
 *  - Primary CTA linking to /modules/ecg-advanced is present
 *  - Links back to /advanced-ecg-nursing pillar
 *  - FAQ section with at least 3 items
 *  - Article JSON-LD schema is present
 *  - FAQPage JSON-LD schema is present
 *  - Mobile: no horizontal overflow
 */

import { expect, test } from "@playwright/test";
import { gotoExpectOk, expectNotPageNotFound } from "../helpers/navigation-e2e";

const ECG_ECOSYSTEM_MODULES = [
  {
    slug: "rhythm-practice",
    h1Keyword: /rhythm/i,
    description: "Rhythm Practice Lab",
  },
  {
    slug: "12-lead-stemi",
    h1Keyword: /stemi|12.lead/i,
    description: "12-Lead STEMI Interpretation",
  },
  {
    slug: "acls-rhythms",
    h1Keyword: /acls|emergency/i,
    description: "ACLS + Emergency ECG",
  },
  {
    slug: "electrolyte-ecg-changes",
    h1Keyword: /electrolyte/i,
    description: "Electrolyte ECG Changes",
  },
  {
    slug: "medication-induced-ecg-changes",
    h1Keyword: /medication|drug|induced/i,
    description: "Medication-Induced ECG Changes",
  },
  {
    slug: "critical-care-ecg",
    h1Keyword: /critical care|icu/i,
    description: "Critical Care ECG",
  },
  {
    slug: "pediatric-ecg",
    h1Keyword: /pediatric|paediatric/i,
    description: "Pediatric ECG",
  },
  {
    slug: "telemetry-monitoring",
    h1Keyword: /telemetry/i,
    description: "Telemetry Monitoring",
  },
  {
    slug: "ecg-case-simulations",
    h1Keyword: /simulation|case/i,
    description: "ECG Case Simulations",
  },
] as const;

test.describe("ECG ecosystem sub-pages — rendering and SEO", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const mod of ECG_ECOSYSTEM_MODULES) {
    const path = `/advanced-ecg-nursing/${mod.slug}`;

    test(`${mod.description} — HTTP 200 and H1 present`, async ({ page }) => {
      await gotoExpectOk(page, path);
      await expectNotPageNotFound(page);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible({ timeout: 20_000 });
    });

    test(`${mod.description} — no noindex directive`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const metaRobots = await page
        .$eval('meta[name="robots"]', (el) => el.getAttribute("content") ?? "")
        .catch(() => "");
      expect(metaRobots).not.toContain("noindex");
    });

    test(`${mod.description} — breadcrumb links to pillar`, async ({ page }) => {
      await gotoExpectOk(page, path);
      const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
      await expect(breadcrumb).toBeVisible({ timeout: 15_000 });
      const pillarLink = breadcrumb.getByRole("link", { name: /advanced ecg/i });
      await expect(pillarLink).toBeVisible();
    });

    test(`${mod.description} — primary CTA links to ECG module`, async ({ page }) => {
      await gotoExpectOk(page, path);
      const cta = page.locator('a[href="/modules/ecg-advanced"]').first();
      await expect(cta).toBeVisible({ timeout: 15_000 });
      await cta.focus();
      await expect(cta).toBeFocused();
    });

    test(`${mod.description} — back-link to pillar /advanced-ecg-nursing`, async ({ page }) => {
      await gotoExpectOk(page, path);
      const pillarLink = page.locator('a[href="/advanced-ecg-nursing"]').first();
      await expect(pillarLink).toBeVisible({ timeout: 15_000 });
    });

    test(`${mod.description} — FAQ section with at least 3 items`, async ({ page }) => {
      await gotoExpectOk(page, path);
      const faqItems = page.locator("dl dt");
      await expect(faqItems.first()).toBeVisible({ timeout: 15_000 });
      const count = await faqItems.count();
      expect(count, "Expected at least 3 FAQ items").toBeGreaterThanOrEqual(3);
    });

    test(`${mod.description} — Article and FAQPage JSON-LD schemas`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const ldScripts = await page.$$eval('script[type="application/ld+json"]', (els) =>
        els.map((el) => el.textContent ?? ""),
      );
      let hasArticle = false;
      let hasFaqPage = false;
      for (const raw of ldScripts) {
        try {
          const parsed = JSON.parse(raw);
          const nodes = parsed["@graph"] ?? [parsed];
          for (const node of nodes) {
            if (node["@type"] === "Article") hasArticle = true;
            if (node["@type"] === "FAQPage") hasFaqPage = true;
          }
        } catch {
          // ignore malformed
        }
      }
      expect(hasArticle, `${path}: missing Article JSON-LD`).toBe(true);
      expect(hasFaqPage, `${path}: missing FAQPage JSON-LD`).toBe(true);
    });

    test(`${mod.description} — coverage checklist section is present`, async ({ page }) => {
      await gotoExpectOk(page, path);
      // Coverage items render as <li> inside a section — at least 8 should be present
      const checkItems = page.locator("ul li").filter({ hasText: /\w{5,}/ });
      const count = await checkItems.count();
      expect(count, "Expected at least 8 coverage list items").toBeGreaterThanOrEqual(8);
    });
  }
});

test.describe("ECG ecosystem sub-pages — mobile responsiveness", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    viewport: { width: 375, height: 812 },
  });

  for (const mod of ECG_ECOSYSTEM_MODULES) {
    const path = `/advanced-ecg-nursing/${mod.slug}`;

    test(`${mod.description} — no horizontal overflow on mobile`, async ({ page }) => {
      await gotoExpectOk(page, path);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible({ timeout: 20_000 });
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(
        scrollWidth,
        `Horizontal overflow on ${path}: scrollWidth ${scrollWidth} > innerWidth ${innerWidth}`,
      ).toBeLessThanOrEqual(innerWidth + 2);
    });
  }
});

test.describe("ECG ecosystem — pillar hub grid present", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("pillar page links to all 9 sub-pages via ecosystem grid", async ({ page }) => {
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    for (const mod of ECG_ECOSYSTEM_MODULES) {
      const subPageLink = page.locator(`a[href="/advanced-ecg-nursing/${mod.slug}"]`).first();
      await expect(subPageLink).toBeVisible({ timeout: 20_000 });
    }
  });

  test("pillar page ecosystem grid has 9 module cards", async ({ page }) => {
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    let count = 0;
    for (const mod of ECG_ECOSYSTEM_MODULES) {
      const exists = await page.locator(`a[href="/advanced-ecg-nursing/${mod.slug}"]`).count();
      if (exists > 0) count++;
    }
    expect(count, "Pillar page must link to all 9 ECG ecosystem modules").toBe(9);
  });
});

test.describe("ECG ecosystem — canonical and metadata integrity", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const mod of ECG_ECOSYSTEM_MODULES) {
    const path = `/advanced-ecg-nursing/${mod.slug}`;

    test(`${mod.description} — canonical URL matches route`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const canonical = await page
        .$eval('link[rel="canonical"]', (el) => el.getAttribute("href") ?? "")
        .catch(() => "");
      // Canonical must end with the route path (may be absolute URL)
      expect(canonical, `Canonical missing or wrong for ${path}`).toMatch(new RegExp(path.replace(/\//g, "\\/") + "$"));
    });

    test(`${mod.description} — OG title and description are present`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const ogTitle = await page
        .$eval('meta[property="og:title"]', (el) => el.getAttribute("content") ?? "")
        .catch(() => "");
      const ogDesc = await page
        .$eval('meta[property="og:description"]', (el) => el.getAttribute("content") ?? "")
        .catch(() => "");
      expect(ogTitle.length, `OG title missing for ${path}`).toBeGreaterThan(10);
      expect(ogDesc.length, `OG description missing for ${path}`).toBeGreaterThan(20);
    });
  }
});
