/**
 * RPN / REx-PN authority hub — dedicated smoke suite.
 *
 * Covers:
 *   1. Hub overview renders with correct title
 *   2. Authority cluster topic pages resolve without 404
 *   3. Static sub-pages (test-bank, lessons, flashcards, pricing) resolve
 *   4. SEO: title contains REx-PN and NurseNest
 *   5. Breadcrumbs reference Home and REx-PN
 *   6. Pricing page renders
 *   7. US NCLEX-PN (LVN/LPN) hub resolves
 */
import { expect, test } from "@playwright/test";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";

const REX_PN_HUB = "/canada/rpn/rex-pn";

const TOPIC_SLUGS = [
  "questions",
  "study-guide",
  "cat",
  "pharmacology",
  "priority-questions",
  "delegation-questions",
  "practice-questions",
  "study-plan",
] as const;

const STATIC_SLUGS = ["test-bank", "lessons", "flashcards", "pricing"] as const;

test.describe("RPN / REx-PN authority hub smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("REx-PN hub overview loads and contains key content", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    const response = await request.get(REX_PN_HUB, {
      headers: { cookie: "nn_global_region=canada" },
    });
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html).toMatch(/REx-PN/i);
    expect(html).toMatch(/2026/);
    expect(html).not.toMatch(/page not found/i);
  });

  test("REx-PN authority cluster topic pages resolve without 404", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    for (const slug of TOPIC_SLUGS) {
      const path = `${REX_PN_HUB}/${slug}`;
      const response = await request.get(path, {
        headers: { cookie: "nn_global_region=canada" },
      });
      expect(response.ok(), `Expected 200 for ${path}, got ${response.status()}`).toBeTruthy();
      const html = await response.text();
      expect(html, `Page ${path} returned a not-found page`).not.toMatch(/page not found/i);
    }
  });

  test("REx-PN static sub-pages resolve (test-bank, lessons, flashcards, pricing)", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    for (const slug of STATIC_SLUGS) {
      const path = `${REX_PN_HUB}/${slug}`;
      const response = await request.get(path, {
        headers: { cookie: "nn_global_region=canada" },
      });
      expect(response.ok(), `Expected 200 for ${path}, got ${response.status()}`).toBeTruthy();
    }
  });

  test("REx-PN hub SEO: title contains REx-PN and NurseNest", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    const response = await request.get(REX_PN_HUB, {
      headers: { cookie: "nn_global_region=canada" },
    });
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1] ?? "";
    expect(title, "Page title should mention REx-PN").toMatch(/REx-PN/i);
    expect(title, "Page title should mention NurseNest").toMatch(/NurseNest/i);
  });

  test("REx-PN hub breadcrumbs reference Home and REx-PN", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    const response = await request.get(REX_PN_HUB, {
      headers: { cookie: "nn_global_region=canada" },
    });
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html).toMatch(/Home/i);
    expect(html).toMatch(/REx-PN/i);
  });

  test("REx-PN pricing page renders with 200", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    const pricingPath = `${REX_PN_HUB}/pricing`;
    const response = await request.get(pricingPath, {
      headers: { cookie: "nn_global_region=canada" },
    });
    expect(
      response.ok(),
      `Expected 200 for ${pricingPath}, got ${response.status()}`,
    ).toBeTruthy();
  });

  test("REx-PN CAT exam topic page contains adaptive content", async ({ request, baseURL }) => {
    test.slow();
    requireOrigin(baseURL);
    const response = await request.get(`${REX_PN_HUB}/cat`, {
      headers: { cookie: "nn_global_region=canada" },
    });
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html).toMatch(/CAT|adaptive/i);
    expect(html).toMatch(/REx-PN/i);
  });

  test("US NCLEX-PN (LVN/LPN) hub resolves at /us/lpn/nclex-pn", async ({ page, baseURL }) => {
    test.slow();
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/lpn/nclex-pn");
    await expectNotPageNotFound(page);
  });
});
