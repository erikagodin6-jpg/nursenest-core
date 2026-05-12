/**
 * CNPLE simulation flow E2E tests.
 *
 * Validates the marketing surfaces for CNPLE preparation:
 * - Simulation landing page renders correctly (no 404, key elements visible)
 * - Report card landing renders (guest preview + sign-in gate)
 * - Practice questions hub renders
 * - Flashcards lane renders
 * - CNPLE hub renders
 * - Mobile layout: sticky controls, no overflow
 * - Guest conversion: disclaimer visible, sign-in CTA reachable
 * - No "official exam" false claims appear in page content
 * - Content governance: prohibited phrases absent from rendered HTML
 *
 * NOTE: Full session-based simulation flow (next/back, review screen) requires
 * auth + question data — those tests live in the authenticated learner suite.
 * These tests cover the public marketing surfaces only.
 */

import { expect, test } from "@playwright/test";
import { gotoExpectOk, expectNotPageNotFound } from "../helpers/navigation-e2e";

const CNPLE_ROUTES = {
  hub: "/canada/np/cnple",
  simulation: "/canada/np/cnple/simulation",
  reportCard: "/canada/np/cnple/report-card",
  flashcards: "/canada/np/cnple/flashcards",
  questions: "/canada/np/cnple/questions",
  lessons: "/canada/np/cnple/lessons",
  // Top-level SEO hubs
  seoMain: "/cnple",
  practiceQuestions: "/cnple-practice-questions",
  simulationExam: "/cnple-simulation-exam",
  clinicalJudgment: "/cnple-clinical-judgment",
  prescribing: "/cnple-prescribing-questions",
} as const;

// Phrases that must NOT appear in rendered CNPLE page HTML
const FORBIDDEN_RENDERED_PHRASES = [
  "official cnple simulator",
  "exact cnple replica",
  "official exam format",
  "real cnple questions",
  "identical to the actual exam",
  "exact ccrnr simulation",
  "cnple computerized adaptive",
  "guaranteed to pass",
] as const;

test.describe("CNPLE simulation landing — guest", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("simulation landing page renders with correct heading", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulation);
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { name: /CNPLE Simulation/i })).toBeVisible();
  });

  test("simulation landing shows provisional disclaimer", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulation);
    const disclaimer = page.locator("[data-cnple-disclaimer]").first();
    await expect(disclaimer).toBeVisible({ timeout: 30_000 });
  });

  test("simulation start CTA is present and links correctly", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulation);
    const cta = page.locator("[data-nn-qa='cnple-sim-start-cta']").first();
    await expect(cta).toBeVisible({ timeout: 30_000 });
    // As a guest, CTA should link to login with callback
    const href = await cta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/login|signin|callbackUrl/i);
  });

  test("simulation page has FAQ section with questions", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulation);
    // FAQ heading should be present
    await expect(page.getByRole("heading", { name: /frequently asked questions/i }).first()).toBeVisible({ timeout: 30_000 });
  });

  test("simulation page does not contain governance-forbidden phrases", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulation);
    const content = (await page.locator("body").textContent())?.toLowerCase() ?? "";
    for (const phrase of FORBIDDEN_RENDERED_PHRASES) {
      expect(content, `Forbidden phrase found in simulation page: "${phrase}"`).not.toContain(phrase.toLowerCase());
    }
  });
});

test.describe("CNPLE report card — guest preview", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("report card page renders for guests", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.reportCard);
    await expectNotPageNotFound(page);
  });

  test("report card shows sign-in gate for guests", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.reportCard);
    // Guest should see a sign-in link
    const signInLink = page.locator("a[href*='login'], a[href*='signin']").first();
    await expect(signInLink).toBeVisible({ timeout: 30_000 });
  });

  test("report card shows provisional disclaimer for CNPLE pathway", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.reportCard);
    // The subtle disclaimer is conditionally shown for CNPLE
    const body = await page.locator("body").textContent() ?? "";
    // Disclaimer text from CNPLE_SPEC.disclaimers.short should appear somewhere
    expect(body.toLowerCase()).toMatch(/provisional|ccrnr|independent/i);
  });

  test("report card page does not contain governance-forbidden phrases", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.reportCard);
    const content = (await page.locator("body").textContent())?.toLowerCase() ?? "";
    for (const phrase of FORBIDDEN_RENDERED_PHRASES) {
      expect(content, `Forbidden phrase in report card: "${phrase}"`).not.toContain(phrase.toLowerCase());
    }
  });
});

test.describe("CNPLE hub and sub-routes — guest", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("CNPLE hub renders", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.hub);
    await expectNotPageNotFound(page);
  });

  test("CNPLE flashcards page renders", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.flashcards);
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 30_000 });
  });

  test("/cnple SEO hub renders with H1", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.seoMain);
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 30_000 });
  });

  test("/cnple-practice-questions SEO hub renders", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.practiceQuestions);
    await expectNotPageNotFound(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 30_000 });
  });

  test("/cnple-simulation-exam SEO hub renders", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulationExam);
    await expectNotPageNotFound(page);
  });

  test("/cnple-clinical-judgment SEO hub renders with FAQ", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.clinicalJudgment);
    await expectNotPageNotFound(page);
    // FAQ JSON-LD should be present
    const faqScript = page.locator('script[type="application/ld+json"]');
    const count = await faqScript.count();
    expect(count).toBeGreaterThan(0);
  });

  test("/cnple-prescribing-questions SEO hub renders", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.prescribing);
    await expectNotPageNotFound(page);
  });

  test("SEO hubs do not contain governance-forbidden phrases", async ({ page }) => {
    for (const route of [CNPLE_ROUTES.seoMain, CNPLE_ROUTES.simulationExam] as const) {
      await gotoExpectOk(page, route);
      const content = (await page.locator("body").textContent())?.toLowerCase() ?? "";
      for (const phrase of FORBIDDEN_RENDERED_PHRASES) {
        expect(content, `Forbidden phrase in ${route}: "${phrase}"`).not.toContain(phrase.toLowerCase());
      }
    }
  });
});

test.describe("CNPLE mobile layout — guest", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
  });

  test("simulation landing is usable on mobile", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulation);
    await expectNotPageNotFound(page);
    // H1 must be visible without horizontal scroll
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible({ timeout: 30_000 });
    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth, "No horizontal overflow on mobile simulation page").toBeLessThanOrEqual(
      viewportWidth + 2, // 2px tolerance for borders
    );
  });

  test("/cnple SEO hub is readable on mobile", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.seoMain);
    await expectNotPageNotFound(page);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });
});

test.describe("CNPLE internal links", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("simulation page links to practice questions", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulation);
    const practiceLink = page.locator(`a[href="${CNPLE_ROUTES.questions}"]`).first();
    await expect(practiceLink).toBeVisible({ timeout: 30_000 });
  });

  test("SEO hub pages contain internal CNPLE links", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.seoMain);
    // Should link to simulation or hub
    const cnpleLink = page.locator(`a[href*="/canada/np/cnple"]`).first();
    await expect(cnpleLink).toBeVisible({ timeout: 30_000 });
  });
});
