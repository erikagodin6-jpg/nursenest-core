/**
 * Flashcards hub — session setup, selection states, persistence UX.
 * npx playwright test -c playwright.learning-routes.config.ts tests/e2e/flashcards/flashcards-hub-setup.spec.ts
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
const PREFS_KEY = `nn_flashcards_hub_prefs_v1_${RN_PATHWAY_ID}`;

async function gotoHub(page: import("@playwright/test").Page, baseURL: string | undefined) {
  const url = new URL(paidFlashcardsHubUrl(RN_PATHWAY_ID), resolveE2eAppBaseUrl(baseURL)).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  expectNotLoginUrl(page);
  await expectPaidLearnerShellReady(page, "flashcards hub setup");
  await expectNoSubscriptionPaywall(page, "flashcards hub setup");
  const blocked = page.getByText("This study track is not on your account");
  if (await blocked.isVisible().catch(() => false)) return false;
  await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 120_000 });
  return true;
}

test.describe("Flashcards hub session setup", () => {
  test("launcher shows original setup CTA, card-count controls, and study filters", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      await expect(main.getByRole("heading", { name: "Choose What to Study" })).toBeVisible({ timeout: 60_000 });
      await expect(main.getByText("1. Systems & Categories")).toBeVisible();
      await expect(main.getByText("2. Study Filters")).toBeVisible();
      await expect(main.getByText("3. Card Count")).toBeVisible();
      await expect(main.locator("[data-nn-e2e-start-review]").first()).toBeVisible();
      await expect(main.locator("[data-nn-e2e-flashcards-setup-panel]")).toBeVisible();
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("selecting a system shows explicit selected state (not all tiles active)", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      const firstCard = main.locator("[data-nn-e2e-flashcards-system-card]").first();
      test.skip(!(await firstCard.isVisible({ timeout: 30_000 }).catch(() => false)), "No system cards.");
      const total = await main.locator("[data-nn-e2e-flashcards-system-card]").count();
      const selectedBefore = await main.locator('[data-nn-e2e-flashcards-system-card][data-selected="true"]').count();
      expect(selectedBefore, "All systems mode should not mark every tile selected").toBeLessThan(total);

      await firstCard.click();
      await expect(main.locator('[data-nn-e2e-flashcards-system-card][data-selected="true"]').first()).toBeVisible({
        timeout: 10_000,
      });
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("session size preset updates CTA subline and start URL cardLimit", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      await main.locator('[data-nn-e2e-session-size-preset="50"]').click();
      await expect(main.locator("[data-nn-e2e-flashcards-cta-subline]")).toContainText("50 cards", {
        timeout: 10_000,
      });
      const href = await main.locator("[data-nn-e2e-start-review]").getAttribute("href");
      expect(href ?? "").toMatch(/cardLimit=50/);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("launcher stays first, then selected systems and card count start study", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      await expect(main.locator("[data-nn-e2e-flashcards-setup-panel]")).toBeVisible({ timeout: 60_000 });
      await expect(page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium")).toHaveCount(0);

      const firstCard = main.locator("[data-nn-e2e-flashcards-system-card]").first();
      test.skip(!(await firstCard.isVisible({ timeout: 30_000 }).catch(() => false)), "No system cards.");
      await firstCard.click();
      await main.locator('[data-nn-e2e-session-size-preset="25"]').click();
      await expect(main.locator("[data-nn-e2e-flashcards-cta-subline]")).toContainText("25 cards", {
        timeout: 10_000,
      });

      await main.locator("[data-nn-e2e-start-review]").click();
      await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 120_000 });
      await expect(page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium")).toBeVisible({
        timeout: 120_000,
      });
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("full review preset uses cardLimit=all in start href", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      await main.locator('[data-nn-e2e-session-size-preset="all"]').click();
      const href = await main.locator("[data-nn-e2e-start-review]").getAttribute("href");
      expect(href ?? "").toMatch(/cardLimit=all/);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("hub preferences persist in localStorage after reload", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const main = learnerAppMainLandmark(page);
      await main.locator('[data-nn-e2e-session-size-preset="25"]').click();
      await page.waitForTimeout(400);
      const stored = await page.evaluate((key) => localStorage.getItem(key), PREFS_KEY);
      expect(stored).toBeTruthy();
      expect(stored).toContain('"cardLimit":25');

      await page.reload({ waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, "flashcards hub reload");
      await expect(main.locator('[data-nn-e2e-session-size-preset="25"]')).toHaveAttribute("aria-pressed", "true", {
        timeout: 30_000,
      });
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});
