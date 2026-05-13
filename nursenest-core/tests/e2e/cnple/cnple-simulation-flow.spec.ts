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

// ── Regression tests added 2026-05-13 (P0 content wiring fix) ────────────────

test.describe("CNPLE lesson hub — content wiring regression", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("lesson hub renders at least one lesson card (not blank)", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.lessons);
    await expectNotPageNotFound(page);
    // Should render at least one lesson link — not a blank page
    const lessonLinks = page.locator("main a[href*='/lessons/']").filter({ visible: true });
    await expect(lessonLinks.first()).toBeVisible({ timeout: 30_000 });
    const count = await lessonLinks.count();
    expect(count, "CNPLE lesson hub must show at least 5 lessons").toBeGreaterThanOrEqual(5);
  });

  test("lesson hub page does not show empty/blank state", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.lessons);
    const body = (await page.locator("main").textContent()) ?? "";
    // Should not render generic empty/coming-soon fallback when 1,463 lessons exist
    expect(body.length, "Lesson hub main content must not be near-empty").toBeGreaterThan(500);
  });
});

test.describe("CNPLE flashcard hub — inventory regression", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("flashcard hub renders a visible primary CTA (no blank state)", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.flashcards);
    await expectNotPageNotFound(page);
    // Should render either live CTA or coming-soon alternative CTAs — never blank
    const anyCta = page
      .locator("main a[href]")
      .filter({ hasText: /sign in|flashcard|lesson|simulation|question|start/i })
      .filter({ visible: true })
      .first();
    await expect(anyCta, "Flashcard hub must show at least one actionable CTA").toBeVisible({ timeout: 30_000 });
  });
});

test.describe("CNPLE /cat redirect regression", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("/canada/np/cnple/cat redirects to /simulation (not blank or 404)", async ({ page }) => {
    // The /cat route should redirect CNPLE to /simulation
    const response = await page.goto("/canada/np/cnple/cat", { waitUntil: "domcontentloaded" });
    const finalUrl = page.url();
    // Either a redirect occurred (final URL is simulation) or page loaded with simulation content
    const isAtSimulation = finalUrl.includes("/simulation");
    const body = (await page.locator("body").textContent()) ?? "";
    const hasSimContent = body.toLowerCase().includes("cnple simulation") ||
                          body.toLowerCase().includes("loft") ||
                          body.toLowerCase().includes("start cnple");
    expect(
      isAtSimulation || hasSimContent,
      `/canada/np/cnple/cat must redirect to /simulation or show simulation content. Final URL: ${finalUrl}`,
    ).toBe(true);
    // Must not 404
    expect(response?.status(), "CNPLE /cat must not 404").not.toBe(404);
  });
});

test.describe("CNPLE simulation — LOFT copy regression (no stale CAT wording)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("simulation page uses LOFT/simulation language, not CAT/adaptive language", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.simulation);
    const content = (await page.locator("body").textContent())?.toLowerCase() ?? "";
    // LOFT-specific terms must be present
    expect(content, "Simulation page must mention LOFT or linear").toMatch(/loft|linear/);
    // Must NOT claim it is a CAT adaptive exam
    expect(content, "Simulation page must not claim to be a CAT adaptive exam").not.toContain(
      "computerized adaptive test",
    );
  });

  test("simulation page inventory stats mention real content", async ({ page }) => {
    await gotoExpectOk(page, CNPLE_ROUTES.hub);
    const content = (await page.locator("body").textContent()) ?? "";
    // Hub should now mention real inventory counts
    const hasLessons = /1[,.]?4\d\d\s*lessons?|lessons?.*1[,.]?4\d\d/i.test(content);
    const hasQuestions = /2[,.]?8\d\d|practice questions?/i.test(content);
    expect(
      hasLessons || hasQuestions,
      "CNPLE hub must mention lesson or question inventory (1,463 lessons or 2,838+ questions)",
    ).toBe(true);
  });
});
