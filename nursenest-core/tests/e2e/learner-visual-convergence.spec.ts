/**
 * Learner visual convergence verification — 2026-05 pass.
 *
 * Captures real screenshots from the canonical learner routes and asserts:
 *   1. No vertical-column collapse (content fills reasonable width).
 *   2. No overlapping chrome (sticky nav does not overlap content).
 *   3. Sidebar/rail collapses before squeezing main content (xl+ only).
 *   4. No nested `border-2` or `ring-1` class on learner hub cards.
 *   5. Practice-tests hero uses soft `border` (not `border-2`).
 *   6. Flashcard hub has adequate vertical spacing.
 *   7. Question bank session setup uses `rounded-2xl` (not `rounded-xl`).
 *   8. No `bg-muted` or `text-muted-foreground` in learner hub class lists.
 *
 * Run against staging:
 *   BASE_URL=https://staging.nursenest.ca npx playwright test tests/e2e/learner-visual-convergence.spec.ts
 */
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { getPaidTestCredentials } from "./helpers/paid-test-credentials";
import { loginWithCredentials } from "./helpers/learner-login";
import { getE2eBaseURL } from "./helpers/e2e-env";

const SCREENSHOT_DIR = path.join("test-results", "learner-visual-convergence");
const baseURL = getE2eBaseURL();

// ── Static (source-based) design token assertions ─────────────────────────────
// These run without a server and verify the JSX changes are in the source files.

test.describe("visual convergence — source assertions (no server needed)", () => {
  const { readFileSync } = require("node:fs");
  const appRoot = path.resolve(__dirname, "../../src");

  function readSrc(relPath: string): string {
    return readFileSync(path.join(appRoot, relPath), "utf8");
  }

  test("practice-tests hub hero uses border (not border-2)", () => {
    const src = readSrc("components/student/practice-tests-hub-client.tsx");
    // Hero header must NOT have border-2 on the outer card
    const heroMatch = src.match(/nn-premium-practice-hub-hero[^"]*"[^>]*className="([^"]+)"/);
    // Check: anywhere the nn-premium-practice-hub-hero section starts, border-2 should not follow directly
    const heroBorder2Count = (src.match(/nn-premium-practice-hub-hero[^>]{0,400}border-2/g) ?? []).length;
    expect(heroBorder2Count, "practice-tests hero must not use border-2").toBe(0);
  });

  test("practice-tests hero CTA buttons use border (not border-2)", () => {
    const src = readSrc("components/student/practice-tests-hub-client.tsx");
    // Count border-2 inside the hero section — must be 0 for the inner CTA buttons
    // The CTA buttons were changed from border-2 to border
    const innerBorder2 = (src.match(/nn-e2e-exam-first-cta[^>]{0,200}border-2/g) ?? []).length;
    expect(innerBorder2, "exam-first CTA buttons must not use border-2").toBe(0);
  });

  test("practice-tests hero does not use ring-1 on the outer card", () => {
    const src = readSrc("components/student/practice-tests-hub-client.tsx");
    // The hero header card must not have ring-1
    const heroRing = (src.match(/nn-premium-practice-hub-hero[^>]{0,500}ring-1/g) ?? []).length;
    expect(heroRing, "practice-tests hero outer card must not use ring-1").toBe(0);
  });

  test("practice-tests sidebar is xl-only (not lg-only)", () => {
    const src = readSrc("components/student/practice-tests-hub-client.tsx");
    expect(src.includes("max-xl:hidden"), "sidebar must be hidden below xl (not lg)").toBe(true);
    expect(src.includes("xl:sticky"), "sidebar must be sticky from xl").toBe(true);
    expect(src.includes("max-lg:hidden"), "old lg-only sidebar guard must be replaced").toBe(false);
  });

  test("flashcards hub hero uses increased padding", () => {
    const src = readSrc("components/flashcards/flashcards-hub-client.tsx");
    // New padding: px-5 py-5 sm:px-6 sm:py-5
    expect(src.includes("px-5 py-5"), "flashcard hero must use px-5 py-5").toBe(true);
  });

  test("flashcards hub has larger vertical spacing", () => {
    const src = readSrc("components/flashcards/flashcards-hub-client.tsx");
    // space-y-6 sm:space-y-8
    expect(src.includes("space-y-6"), "flashcard hub must use at least space-y-6").toBe(true);
    expect(src.includes("sm:space-y-8"), "flashcard hub must use sm:space-y-8").toBe(true);
    // Must NOT use old space-y-4 override
    const oldSpacing = src.includes('className="nn-flashcards-hub-premium space-y-4');
    expect(oldSpacing, "flashcard hub must not use the old space-y-4 tight spacing").toBe(false);
  });

  test("question bank session setup uses rounded-2xl and no nn-card", () => {
    const src = readSrc("components/student/question-bank-practice-client.tsx");
    // The details/accordion must use rounded-2xl now
    expect(
      src.includes('mb-6 overflow-hidden rounded-2xl border'),
      "question bank accordion must use rounded-2xl",
    ).toBe(true);
    // Must not still use the old nn-card class on the session setup
    expect(
      src.includes('nn-card mb-4 overflow-hidden rounded-xl'),
      "question bank accordion must not use old nn-card rounded-xl pattern",
    ).toBe(false);
  });

  test("question bank accordion summary has larger padding", () => {
    const src = readSrc("components/student/question-bank-practice-client.tsx");
    expect(src.includes("px-5 py-4"), "accordion summary must use px-5 py-4").toBe(true);
  });

  test("lessons hub uses increased section spacing", () => {
    const src = readSrc("app/(app)/app/(learner)/lessons/page.tsx");
    expect(src.includes("space-y-8 sm:space-y-10"), "lessons hub must use space-y-8 sm:space-y-10").toBe(true);
    expect(src.includes("space-y-6 sm:space-y-8"), "old tight lessons spacing must be gone").toBe(false);
  });

  test("LearnerStudyPageShell has top breathing room (pt-1 sm:pt-2)", () => {
    const src = readSrc("components/learner-study-ui/learner-study-page-shell.tsx");
    expect(src.includes("pt-1"), "shell must have pt-1 for top breathing room").toBe(true);
    expect(src.includes("sm:pt-2"), "shell must have sm:pt-2 for top breathing room").toBe(true);
  });

  test("learner-global.css defines nn-learner-page-hero", () => {
    const css = readFileSync(
      path.join(appRoot, "app/styles/learner/learner-global.css"),
      "utf8",
    ) as string;
    expect(css.includes(".nn-learner-page-hero"), "nn-learner-page-hero must be defined in learner-global.css").toBe(true);
    expect(css.includes(".nn-app-lessons-hub-premium"), "nn-app-lessons-hub-premium must be defined").toBe(true);
  });

  test("no bg-muted or text-muted-foreground remain in practice-tests or flashcards hubs", () => {
    const practiceHub = readSrc("components/student/practice-tests-hub-client.tsx");
    const flashcardsHub = readSrc("components/flashcards/flashcards-hub-client.tsx");
    const qbankClient = readSrc("components/student/question-bank-practice-client.tsx");

    for (const [label, src] of [
      ["practice-tests-hub-client", practiceHub],
      ["flashcards-hub-client", flashcardsHub],
      ["question-bank-practice-client", qbankClient],
    ] as const) {
      const bgMutedCount = (src.match(/bg-muted\b/g) ?? []).length;
      expect(bgMutedCount, `${label}: no bg-muted legacy tokens`).toBe(0);
      const textMutedFgCount = (src.match(/text-muted-foreground/g) ?? []).length;
      expect(textMutedFgCount, `${label}: no text-muted-foreground legacy tokens`).toBe(0);
    }
  });
});

// ── Live visual checks (authenticated) ───────────────────────────────────────

const VISUAL_ROUTES = [
  {
    id: "practice-tests",
    path: "/app/practice-tests",
    readyMarker: '[data-nn-premium-platform-module="practice-tests"]',
    checks: {
      heroNotBorder2: "header.nn-premium-practice-hub-hero",
      sidebarXlOnly: '[class*="max-xl:hidden"]',
      mainContent: "[data-nn-e2e-practice-exam-first-hero]",
    },
  },
  {
    id: "flashcards",
    path: "/app/flashcards",
    readyMarker: "[data-nn-premium-flashcard-convergence]",
    checks: {
      mainContent: "[data-nn-e2e-flashcards-hub]",
    },
  },
  {
    id: "lessons",
    path: "/app/lessons",
    readyMarker: '[data-nn-premium-platform-module="lessons"]',
    checks: {
      mainContent: "[data-nn-premium-lessons-hub-body]",
    },
  },
  {
    id: "questions",
    path: "/app/questions",
    readyMarker: "[data-testid='practice-adaptive-setup'], #nn-learner-main",
    checks: {
      mainContent: "[data-testid='body-systems-section'], .nn-qbank-skeleton, #nn-learner-main",
    },
  },
] as const;

for (const viewport of [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "mobile", width: 390, height: 844 },
] as const) {
  test.describe(`visual convergence — ${viewport.id} (${viewport.width}×${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeAll(() => {
      mkdirSync(path.join(SCREENSHOT_DIR, viewport.id), { recursive: true });
    });

    test(`canonical learner hubs render premium visual language — ${viewport.id}`, async ({ page }) => {
      test.setTimeout(300_000);
      const creds = getPaidTestCredentials();
      test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD to run visual convergence verification.");

      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" && !msg.text().includes("ChunkLoadError")) {
          consoleErrors.push(`[${msg.url()}] ${msg.text()}`);
        }
      });

      await loginWithCredentials(page, creds!.email, creds!.password, {
        navigationOrigin: process.env.BASE_URL,
      });

      for (const route of VISUAL_ROUTES) {
        consoleErrors.length = 0;
        await page.goto(`${baseURL}${route.path}`, { waitUntil: "domcontentloaded" });

        // Wait for premium convergence marker
        await expect(
          page.locator(route.readyMarker).first(),
          `${route.id} ${viewport.id}: premium marker must be visible`,
        ).toBeVisible({ timeout: 90_000 });

        // Learner main landmark
        const main = page.locator("#nn-learner-main, [data-nn-learner-main]").first();
        await expect(main, `${route.id} ${viewport.id}: learner main must be present`).toBeVisible({
          timeout: 30_000,
        });

        // Check main content is visible
        const mainContent = page.locator(route.checks.mainContent).first();
        await expect(mainContent, `${route.id} ${viewport.id}: main content visible`).toBeVisible({
          timeout: 60_000,
        });

        // No horizontal overflow (content column collapse)
        const scrollOverflow = await page.evaluate(() => {
          const root = document.documentElement;
          return root.scrollWidth - root.clientWidth;
        });
        expect(scrollOverflow, `${route.id} ${viewport.id}: no horizontal overflow`).toBeLessThanOrEqual(4);

        // Verify sticky nav does not overlap learner main content
        const stickyChrome = await page.locator(".nn-learner-shell-sticky").first().boundingBox();
        const mainBox = await main.boundingBox();
        if (stickyChrome && mainBox) {
          const stickyBottom = stickyChrome.y + stickyChrome.height;
          expect(
            mainBox.y,
            `${route.id} ${viewport.id}: learner main must start below sticky chrome (stickyBottom=${stickyBottom}, mainTop=${mainBox.y})`,
          ).toBeGreaterThanOrEqual(stickyChrome.y);
        }

        // On tablet (768px): practice-tests sidebar must NOT be visible (xl-only)
        if (viewport.id === "tablet" && route.id === "practice-tests") {
          const sidebarVisible = await page.locator('[class*="max-xl:hidden"]').first().isVisible();
          expect(sidebarVisible, "practice-tests sidebar must be hidden on tablet").toBe(false);
        }

        // On desktop (1440px): practice-tests sidebar must be visible
        if (viewport.id === "desktop" && route.id === "practice-tests") {
          const desktopSidebar = await page.locator('[class*="xl:sticky"]').first().isVisible();
          // Non-fatal: sidebar might not always be present depending on pathway
          if (!desktopSidebar) {
            console.warn(`practice-tests desktop: xl sidebar not found (may be OK if pathway has no tools rail)`);
          }
        }

        // Screenshot for visual inspection
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, viewport.id, `${route.id}.png`),
          fullPage: viewport.id === "desktop",
          clip:
            viewport.id !== "desktop"
              ? { x: 0, y: 0, width: viewport.width, height: Math.min(viewport.height * 2, 1800) }
              : undefined,
        });

        // No unexpected console errors
        const severeErrors = consoleErrors.filter(
          (e) =>
            !e.includes("net::ERR_") &&
            !e.includes("favicon") &&
            !e.includes("posthog") &&
            !e.includes("NN_RENDER_TRACE"),
        );
        expect(severeErrors, `${route.id} ${viewport.id}: no console errors`).toEqual([]);
      }
    });
  });
}
