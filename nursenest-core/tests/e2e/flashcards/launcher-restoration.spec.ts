/**
 * Regression guard: flashcards + practice exam landing pages keep the
 * pre-redesign launcher structure (not the converged single-hero shell).
 *
 * npx playwright test -c playwright.learning-routes.config.ts tests/e2e/flashcards/launcher-restoration.spec.ts
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { resolveE2eAppBaseUrl } from "../helpers/e2e-env";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  expectPaidLearnerShellReady,
  learnerAppMainLandmark,
} from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

const RN_PATHWAY_ID = PAID_E2E_DEFAULT_PATHWAY_ID;

async function gotoFlashcardsHub(page: import("@playwright/test").Page, baseURL: string | undefined) {
  const url = new URL(paidFlashcardsHubUrl(RN_PATHWAY_ID), resolveE2eAppBaseUrl(baseURL)).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  expectNotLoginUrl(page);
  await expectPaidLearnerShellReady(page, "flashcards launcher restoration");
  await expectNoSubscriptionPaywall(page, "flashcards launcher restoration");
  const blocked = page.getByText("This study track is not on your account");
  if (await blocked.isVisible().catch(() => false)) return false;
  await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 120_000 });
  return true;
}

async function gotoPracticeHub(page: import("@playwright/test").Page, baseURL: string | undefined) {
  const url = new URL(
    `/app/practice-tests?pathwayId=${encodeURIComponent(RN_PATHWAY_ID)}`,
    resolveE2eAppBaseUrl(baseURL),
  ).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  expectNotLoginUrl(page);
  await expectPaidLearnerShellReady(page, "practice launcher restoration");
  await expectNoSubscriptionPaywall(page, "practice launcher restoration");
  const blocked = page.getByText("This study track is not on your account");
  if (await blocked.isVisible().catch(() => false)) return false;
  await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 120_000 });
  return true;
}

test.describe("Launcher restoration — flashcards hub", () => {
  test("shows original setup steps, system grid, and start CTA before study session", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoFlashcardsHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      await expect(main.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 60_000 });
      await expect(main.getByRole("heading", { name: "Choose What to Study" })).toBeVisible();
      await expect(main.getByText("1. Systems & Categories")).toBeVisible();
      await expect(main.getByText("2. Study Filters")).toBeVisible();
      await expect(main.getByText("3. Card Count")).toBeVisible();
      await expect(main.locator("[data-nn-e2e-flashcards-canonical-grid]")).toBeVisible();
      await expect(main.locator("[data-nn-e2e-flashcards-system-card]").first()).toBeVisible();
      await expect(main.locator("[data-nn-e2e-flashcards-setup-panel]")).toBeVisible();
      await expect(main.locator("[data-nn-e2e-start-review]").first()).toBeVisible();
      await expect(page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium")).toHaveCount(0);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("system selection does not shift the launcher grid", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    await page.addInitScript(() => {
      const w = window as typeof window & { __nnLayoutShifts?: number[] };
      w.__nnLayoutShifts = [];
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
            if (!layoutShift.hadRecentInput && typeof layoutShift.value === "number") {
              w.__nnLayoutShifts?.push(layoutShift.value);
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
      } catch {
        // Chromium supports layout-shift; other browsers will still use geometric assertions below.
      }
    });
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoFlashcardsHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      const setupPanel = main.locator("[data-nn-e2e-flashcards-setup-panel]");
      const grid = main.locator("[data-nn-e2e-flashcards-system-grid]");
      const cards = main.locator("[data-nn-e2e-flashcards-system-card]");
      await expect(setupPanel).toBeVisible({ timeout: 60_000 });
      await expect(grid).toBeVisible({ timeout: 60_000 });
      await expect(cards.first()).toBeVisible({ timeout: 60_000 });
      await page.waitForTimeout(250);

      const beforePanel = await setupPanel.boundingBox();
      const beforeGrid = await grid.boundingBox();
      const beforeTop = await page.evaluate(() => window.scrollY);
      expect(beforePanel, "setup panel box before selection").not.toBeNull();
      expect(beforeGrid, "system grid box before selection").not.toBeNull();
      await page.screenshot({ path: testInfo.outputPath("flashcard-launcher-before-selection.png"), fullPage: true });

      await cards.nth(0).click();
      await cards.nth(1).click();
      await cards.nth(0).click();
      await main.locator("[data-nn-e2e-flashcards-shuffle]").click();
      await main.locator('[data-nn-e2e-session-size-preset="25"]').click();
      await page.waitForTimeout(250);

      const afterPanel = await setupPanel.boundingBox();
      const afterGrid = await grid.boundingBox();
      const afterTop = await page.evaluate(() => window.scrollY);
      expect(afterPanel, "setup panel box after selection").not.toBeNull();
      expect(afterGrid, "system grid box after selection").not.toBeNull();
      expect(afterTop, "viewport should not jump").toBe(beforeTop);
      expect(Math.abs((afterPanel?.y ?? 0) - (beforePanel?.y ?? 0)), "launcher top shift").toBeLessThan(1);
      expect(Math.abs((afterPanel?.width ?? 0) - (beforePanel?.width ?? 0)), "launcher width shift").toBeLessThan(1);
      expect(Math.abs((afterGrid?.y ?? 0) - (beforeGrid?.y ?? 0)), "grid top shift").toBeLessThan(1);
      expect(Math.abs((afterGrid?.height ?? 0) - (beforeGrid?.height ?? 0)), "grid height shift").toBeLessThan(1);

      const cls = await page.evaluate(() => {
        const w = window as typeof window & { __nnLayoutShifts?: number[] };
        return (w.__nnLayoutShifts ?? []).reduce((sum, value) => sum + value, 0);
      });
      expect(cls, "launcher CLS").toBeLessThan(0.01);
      await page.screenshot({ path: testInfo.outputPath("flashcard-launcher-after-selection.png"), fullPage: true });
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("session size preset updates start href", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoFlashcardsHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      await main.locator('[data-nn-e2e-session-size-preset="25"]').click();
      const href = await main.locator("[data-nn-e2e-start-review]").first().getAttribute("href");
      expect(href ?? "").toMatch(/cardLimit=25/);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});

test.describe("Launcher restoration — practice exams hub", () => {
  test("shows original categories grid, setup panel, and Start Exam CTA", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoPracticeHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      await expect(main.locator("[data-nn-e2e-practice-tests-hub]")).toBeVisible({ timeout: 60_000 });
      await expect(main.getByRole("heading", { name: "Practice Exam", level: 1 })).toBeVisible();
      await expect(main.locator("[data-nn-e2e-practice-exams-builder]")).toBeVisible();
      await expect(main.locator("[data-nn-e2e-practice-canonical-grid]")).toBeVisible({ timeout: 60_000 });
      await expect(main.locator("[data-nn-e2e-practice-setup-panel]")).toBeVisible();
      await expect(main.getByText("Exam Mode", { exact: true })).toBeVisible();
      await expect(main.getByText("Question Count", { exact: true })).toBeVisible();
      await expect(main.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible();
      await expect(main.locator("[data-nn-e2e-practice-single-landing]")).toHaveCount(0);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("question count input accepts custom values", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoPracticeHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      const countInput = main.locator("[data-nn-e2e-question-count]");
      await expect(countInput).toBeVisible({ timeout: 60_000 });
      await countInput.fill("50");
      await expect(countInput).toHaveValue("50");
      await main.locator('[data-nn-e2e-practice-session-size] button').filter({ hasText: "50" }).click();
      await expect(countInput).toHaveValue("50");
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});
