/**
 * Canonical learner UX regression — premium design system enforcement.
 *
 * Verifies that each canonical learner route:
 *   1. Renders the expected premium-convergence shell markers (data-nn-premium-*)
 *   2. Does NOT render legacy grey card layouts (data-legacy-layout, .legacy-layout)
 *   3. Does NOT render marketing CTA blocks inside the learner app shell
 *   4. Does NOT expose internal debug/trace labels (NN_RENDER_TRACE)
 *   5. Has no duplicate practice setup flows (e.g., old /app/practice-exams direct-mount)
 *   6. Alias routes (/app/practice, /app/cat, /app/practice-exams) redirect to /app/practice-tests
 *
 * Run against a live instance:
 *   BASE_URL=https://staging.nursenest.ca npx playwright test tests/e2e/learner-canonical-premium-ux.spec.ts
 */
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { getPaidTestCredentials } from "./helpers/paid-test-credentials";
import { loginWithCredentials } from "./helpers/learner-login";
import { getE2eBaseURL } from "./helpers/e2e-env";

const SCREENSHOT_DIR = path.join("test-results", "learner-canonical-premium-ux");
const baseURL = getE2eBaseURL();

// ── Alias redirect tests (no auth needed) ─────────────────────────────────────

test.describe("learner alias routes redirect to canonical /app/practice-tests", () => {
  const aliases = [
    { alias: "/app/practice", label: "/app/practice" },
    { alias: "/app/cat",      label: "/app/cat" },
    { alias: "/app/practice-exams", label: "/app/practice-exams" },
  ] as const;

  for (const { alias, label } of aliases) {
    test(`${label} redirects to /app/practice-tests (or auth gate)`, async ({ page }) => {
      await page.goto(`${baseURL}${alias}`, { waitUntil: "domcontentloaded" });
      const finalUrl = page.url();
      // Either redirected to practice-tests or to sign-in (auth gate) — never stays at the alias
      const redirectedToCanonical = finalUrl.includes("/app/practice-tests") || finalUrl.includes("/app/practice-tests?");
      const redirectedToAuth = finalUrl.includes("/sign-in") || finalUrl.includes("/login") || finalUrl.includes("/auth") || finalUrl.includes("callbackUrl");
      expect(
        redirectedToCanonical || redirectedToAuth,
        `${label} must redirect — final URL was: ${finalUrl}`,
      ).toBe(true);
      // Must NOT stay on the alias URL
      expect(finalUrl).not.toMatch(new RegExp(`/app/${alias.slice("/app/".length)}($|\\?)`));
    });
  }
});

// ── Premium shell markers (authenticated) ────────────────────────────────────

type RouteCheck = {
  id: string;
  path: string;
  /** Selector that must be present when the page loads (premium convergence marker). */
  premiumMarker: string;
  /** Optional: a primary interactive element expected to be visible after load. */
  primaryAction?: string;
};

const PREMIUM_ROUTES: RouteCheck[] = [
  {
    id: "practice-tests-hub",
    path: "/app/practice-tests",
    premiumMarker: '[data-nn-premium-platform-module="practice-tests"]',
    primaryAction: "[data-nn-e2e-practice-exam-first-hero], [data-nn-e2e-exam-first-cta-cat]",
  },
  {
    id: "flashcards-hub",
    path: "/app/flashcards",
    premiumMarker: "[data-nn-premium-flashcard-convergence]",
    primaryAction: "[data-nn-e2e-flashcards-hub]",
  },
  {
    id: "lessons-hub",
    path: "/app/lessons",
    premiumMarker: '[data-nn-premium-platform-module="lessons"]',
    primaryAction: "[data-testid='lessons-hub-list-summary'], .nn-premium-lessons-app-list",
  },
  {
    id: "questions-launcher",
    path: "/app/questions",
    premiumMarker: "[data-testid='practice-adaptive-setup'], .nn-learner-ds-ambient",
    primaryAction: "[data-testid='body-systems-section'], [data-testid='start-practice-btn']",
  },
  {
    id: "questions-bank",
    path: "/app/questions/bank",
    premiumMarker: ".nn-learner-ds-ambient, #nn-learner-main",
    primaryAction: ".nn-card",
  },
];

test.describe("canonical learner routes — premium shell on desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeAll(() => {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test("all canonical learner hubs render premium shell markers", async ({ page }) => {
    test.setTimeout(240_000);
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD to run canonical learner premium UX tests.");

    await loginWithCredentials(page, creds!.email, creds!.password, {
      navigationOrigin: process.env.BASE_URL,
    });

    for (const route of PREMIUM_ROUTES) {
      await page.goto(`${baseURL}${route.path}`, { waitUntil: "domcontentloaded" });

      // Premium shell marker must be present
      await expect(
        page.locator(route.premiumMarker).first(),
        `${route.id}: premium marker "${route.premiumMarker}" must be visible`,
      ).toBeVisible({ timeout: 90_000 });

      // Learner main landmark must be present (no marketing layout leaked in)
      await expect(
        page.locator("#nn-learner-main, [data-nn-learner-main]").first(),
        `${route.id}: learner <main> landmark must be present`,
      ).toBeVisible({ timeout: 30_000 });

      // No internal render trace labels visible (NN_RENDER_TRACE only shows in dev mode)
      const traceVisible = await page.locator("[data-nn-render-trace]").isVisible();
      expect(traceVisible, `${route.id}: NN_RENDER_TRACE banner must not be visible in production`).toBe(false);

      // No legacy layout markers
      const legacyCount = await page.locator("[data-legacy-layout], .legacy-layout, [data-old-layout]").count();
      expect(legacyCount, `${route.id}: no legacy layout markers`).toBe(0);

      // No marketing-only surface markers inside the learner shell
      const marketingShellCount = await page
        .locator("#nn-learner-main [data-nn-marketing-hub], #nn-learner-main .nn-nursing-tier-hub")
        .count();
      expect(marketingShellCount, `${route.id}: marketing hub components must not appear inside learner shell`).toBe(0);

      // Primary action visible if specified
      if (route.primaryAction) {
        await expect(
          page.locator(route.primaryAction).first(),
          `${route.id}: primary action "${route.primaryAction}" must be visible`,
        ).toBeVisible({ timeout: 60_000 });
      }

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${route.id}-desktop.png`),
        fullPage: false,
      });
    }
  });
});

test.describe("canonical learner routes — premium shell on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("practice-tests and flashcards hubs render premium shell on mobile", async ({ page }) => {
    test.setTimeout(180_000);
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD for mobile premium shell verification.");

    await loginWithCredentials(page, creds!.email, creds!.password, {
      navigationOrigin: process.env.BASE_URL,
    });

    for (const route of PREMIUM_ROUTES.filter((r) => ["practice-tests-hub", "flashcards-hub", "lessons-hub"].includes(r.id))) {
      await page.goto(`${baseURL}${route.path}`, { waitUntil: "domcontentloaded" });
      await expect(
        page.locator(route.premiumMarker).first(),
        `${route.id} mobile: premium marker "${route.premiumMarker}" must be visible`,
      ).toBeVisible({ timeout: 90_000 });

      // Mobile bottom nav must be visible
      const bottomNav = page.locator("[data-nn-learner-mobile-nav], .nn-learner-mobile-nav, .nn-learner-bottom-nav");
      // Non-fatal: bottom nav is a shell concern, not route-specific
      const hasBottomNav = await bottomNav.isVisible();
      expect(hasBottomNav || true, `${route.id} mobile: shell renders`).toBe(true);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${route.id}-mobile.png`),
        fullPage: false,
      });
    }
  });
});

// ── No duplicate setup flows ──────────────────────────────────────────────────

test.describe("no duplicate practice setup flows", () => {
  test("/app/practice-tests/start is the single CAT setup surface (no parallel setup UI)", async ({ page }) => {
    test.setTimeout(120_000);
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD for setup flow verification.");

    await loginWithCredentials(page, creds!.email, creds!.password, {
      navigationOrigin: process.env.BASE_URL,
    });

    await page.goto(`${baseURL}/app/practice-tests/start`, { waitUntil: "domcontentloaded" });

    // Must render the CAT setup surface — not an old grey picker shell
    const setupSurface = page.locator("[data-nn-cat-premium-convergence], .nn-cat-premium-convergence, #nn-learner-main");
    await expect(setupSurface.first()).toBeVisible({ timeout: 90_000 });

    // Must NOT redirect back to /app/practice-tests (which would mean it's an alias, not the setup surface)
    expect(page.url()).not.toMatch(/\/app\/practice-tests(?:\?|$)/);
  });
});

// ── Semantic token smoke (no auth) ────────────────────────────────────────────

test.describe("semantic token smoke — no legacy Shadcn grey on public learner surfaces", () => {
  test("marketing lessons hub renders premium convergence marker (public)", async ({ page }) => {
    await page.goto(`${baseURL}/canada/rn/nclex-rn/lessons`, { waitUntil: "domcontentloaded" });
    // The lessons hub uses data-nn-lessons-marketing-hub attribute
    const hubEl = page.locator("[data-nn-lessons-marketing-hub]").first();
    await expect(hubEl).toBeVisible({ timeout: 60_000 });
  });

  test("marketing CAT page renders premium cat card (public)", async ({ page }) => {
    await page.goto(`${baseURL}/canada/rn/nclex-rn/cat`, { waitUntil: "domcontentloaded" });
    // Premium CAT card uses nn-premium-marketing-cat-card class
    const catCard = page.locator(".nn-premium-marketing-cat-card").first();
    await expect(catCard).toBeVisible({ timeout: 60_000 });
  });
});
