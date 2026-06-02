/**
 * Flashcards landing page — premium hub regression checks.
 * npx playwright test -c playwright.learning-routes.config.ts tests/e2e/flashcards/flashcards-landing-premium.spec.ts
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

async function gotoHub(page: import("@playwright/test").Page, baseURL: string | undefined) {
  const url = new URL(paidFlashcardsHubUrl(RN_PATHWAY_ID), resolveE2eAppBaseUrl(baseURL)).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  expectNotLoginUrl(page);
  await expectPaidLearnerShellReady(page, "flashcards premium landing");
  await expectNoSubscriptionPaywall(page, "flashcards premium landing");
  const blocked = page.getByText("This study track is not on your account");
  if (await blocked.isVisible().catch(() => false)) return false;
  await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 120_000 });
  return true;
}

test.describe("Flashcards premium landing", () => {
  test("uses learner navigation, Title Case metadata, gradient shell, and numeric counts", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");

      await expect(page).toHaveTitle(/NCLEX-RN Flashcards \| NurseNest|RN Flashcards \| NurseNest/);
      await expect(page.locator('[data-testid="learner-shell"]')).toBeVisible();
      await expect(page.locator(".nn-learner-shell-nav-row")).toBeVisible();

      const main = learnerAppMainLandmark(page);
      await expect(main.getByRole("heading", { level: 1 })).toContainText(/Flashcards/);
      await expect(main.locator("[data-nn-flashcards-premium-hub]")).toBeVisible();
      await expect(main.getByText("Included")).toHaveCount(0);

      const counts = main.locator("[data-nn-e2e-flashcards-system-count]");
      await expect(counts.first()).toHaveText(/^\d[\d,]* Flashcards$/, { timeout: 60_000 });

      const gradient = await main.locator("[data-nn-flashcards-premium-hub]").evaluate((node) => {
        return window.getComputedStyle(node).backgroundImage;
      });
      expect(gradient).toContain("linear-gradient");
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("system card is fully clickable and keyboard focusable", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const firstCard = learnerAppMainLandmark(page).locator("[data-nn-e2e-flashcards-system-card]").first();
      await expect(firstCard).toBeVisible({ timeout: 60_000 });
      await expect(firstCard).toHaveAttribute("href", /\/app\/flashcards\/custom\?/);

      await firstCard.focus();
      const focusStyles = await firstCard.evaluate((node) => {
        const styles = window.getComputedStyle(node);
        return { outlineStyle: styles.outlineStyle, outlineWidth: styles.outlineWidth };
      });
      expect(focusStyles.outlineStyle).not.toBe("none");
      expect(focusStyles.outlineWidth).not.toBe("0px");
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("Blossom theme uses the Blossom leaf asset and mobile has no horizontal overflow", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      await page.setViewportSize({ width: 390, height: 844 });
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");

      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "blossom");
        localStorage.setItem("nursenest-theme", "blossom");
      });
      const logo = page.locator('[data-testid="learner-shell"] img[alt="NurseNest"]').first();
      await expect(logo).toHaveAttribute("src", /branding\/blossom-leaf|hotpinkblossomleaflogo/, {
        timeout: 10_000,
      });

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
      await expect(learnerAppMainLandmark(page).locator("[data-nn-e2e-flashcards-system-card]").first()).toBeVisible();
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});
