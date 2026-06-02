import { expect, test } from "@playwright/test";

import { marketingCatPathForPathwayId } from "../../../src/lib/exam-pathways/practice-exams-cat-start";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials, getRuntimeTierAccounts, type RuntimeTierAccount } from "../helpers/paid-test-credentials";
import { attachRuntimeCriticalObserver, expectRuntimeHealthy } from "../helpers/runtime-critical-observer";

const pathwayIds = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-np-fnp",
  "ca-np-cnple",
] as const;

const themeRoutes = ["/login", "/practice-exams", "/us/rn/nclex-rn/cat"] as const;

const fallbackPaidAccount = getPaidTestCredentials();
const tierAccounts = getRuntimeTierAccounts();
const authenticatedAccounts: RuntimeTierAccount[] =
  tierAccounts.length > 0
    ? tierAccounts
    : fallbackPaidAccount
      ? [
          {
            key: "RN",
            label: "Generic paid learner — Canada RN fallback",
            pathwayId: "ca-rn-nclex-rn",
            email: fallbackPaidAccount.email,
            password: fallbackPaidAccount.password,
            source: "generic paid fallback",
          },
        ]
      : [];

const activityRoutesForPathway = (pathwayId: string) =>
  [
    `/app/practice-tests?pathwayId=${encodeURIComponent(pathwayId)}`,
    `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}`,
    `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pathwayId)}`,
  ] as const;

test.describe("autonomous runtime critical gate", () => {
  test("CAT entrypoints stay pathway-scoped and do not trigger runtime failures", async ({ page }, testInfo) => {
    const observer = await attachRuntimeCriticalObserver(page, testInfo);
    try {
      for (const pathwayId of pathwayIds) {
        const path = marketingCatPathForPathwayId(pathwayId);
        expect(path, `missing CAT marketing path for ${pathwayId}`).toBeTruthy();
        await page.goto(path!, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
        await expect(page.locator("body")).not.toBeEmpty({ timeout: 30_000 });
        await expect(page.locator("body")).toContainText(/NurseNest|NCLEX|CAT|Simulation|Practice|Lessons|Questions/i, {
          timeout: 30_000,
        });
        if (pathwayId === "ca-np-cnple") {
          expect(new URL(page.url()).pathname).toBe("/canada/np/cnple/simulation");
          continue;
        }
        await expect(page.locator(`a[href*="callbackUrl=${encodeURIComponent(path!)}"]`).first()).toBeVisible({
          timeout: 30_000,
        });
      }
      await expectRuntimeHealthy(page, observer);
    } finally {
      observer.dispose();
    }
  });

  test("theme persists across auth, practice, and CAT route boundaries", async ({ page }, testInfo) => {
    const observer = await attachRuntimeCriticalObserver(page, testInfo);
    try {
      await page.addInitScript(() => {
        localStorage.setItem("nursenest-theme", "midnight");
        document.cookie = "nn-theme=midnight; path=/; max-age=31536000; SameSite=Lax";
      });

      for (const route of themeRoutes) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
        await expect(page.locator("html")).toHaveAttribute("data-theme", "midnight", { timeout: 15_000 });
        await expect(page.locator("body")).not.toBeEmpty({ timeout: 15_000 });
      }

      await page.goto("/login", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "midnight", { timeout: 15_000 });
      await expect(page.locator('[data-theme="sea-glass"]').first()).toHaveCount(1, { timeout: 15_000 });
      await expectRuntimeHealthy(page, observer);
    } finally {
      observer.dispose();
    }
  });

  test("flashcards discovery and custom-session entrypoint fail safely", async ({ page }, testInfo) => {
    const observer = await attachRuntimeCriticalObserver(page, testInfo);
    try {
      await page.goto("/us/rn/nclex-rn", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
      await expect(page.locator("body")).not.toBeEmpty({ timeout: 30_000 });
      const flashcardLinks = page.locator('a[href*="flashcard"], a[href*="/app/flashcards/custom"]');
      await expect(flashcardLinks.first()).toBeVisible({ timeout: 30_000 });
      await expectRuntimeHealthy(page, observer);
    } finally {
      observer.dispose();
    }
  });

  test("practice exam launcher renders without route loops or chunk failures", async ({ page }, testInfo) => {
    const observer = await attachRuntimeCriticalObserver(page, testInfo);
    try {
      await page.goto("/practice-exams", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
      await expect(page.locator("body")).toContainText(/Practice|NCLEX|CAT|Flashcards|Question/i, { timeout: 30_000 });
      const visibleLaunchLinks = page.locator(
        'a:visible[href*="/cat"], a:visible[href*="/questions"], a:visible[href*="/login"]',
      );
      await expect(visibleLaunchLinks.first()).toBeVisible({ timeout: 30_000 });
      await expectRuntimeHealthy(page, observer);
    } finally {
      observer.dispose();
    }
  });

  for (const account of authenticatedAccounts) {
    test(`authenticated ${account.key} activity surfaces launch for ${account.pathwayId}`, async ({ page, baseURL }, testInfo) => {
      testInfo.annotations.push({
        type: "runtime-tier-account",
        description: `${account.key} ${account.pathwayId} via ${account.source}`,
      });

      const observer = await attachRuntimeCriticalObserver(page, testInfo);
      try {
        await loginWithCredentials(page, account.email, account.password, {
          navigationOrigin: baseURL ?? undefined,
          enterLearnerApp: true,
        });

        await page.evaluate((pathwayId) => {
          localStorage.setItem(
            "flashcard-study-item-state:v1",
            JSON.stringify({
              good: { starred: true },
              malformedNull: null,
              malformedArray: ["bad"],
            }),
          );
          localStorage.setItem(
            "nn_flashcards_custom_checkpoint_v1",
            JSON.stringify({
              [pathwayId]: {
                pathwayId,
                queryString: null,
                index: "not-a-number",
                totalCards: 20,
                systemsLabel: { bad: true },
                updatedAt: null,
              },
            }),
          );
        }, account.pathwayId);

        for (const route of activityRoutesForPathway(account.pathwayId)) {
          await page.goto(route, { waitUntil: "domcontentloaded" });
          await expect(page.locator("body"), `${account.label} ${route}`).not.toBeEmpty({ timeout: 30_000 });
          await expect(page.locator("body"), `${account.label} ${route}`).not.toContainText(
            /Unable to load this section|Your account and access remain intact/i,
            { timeout: 5_000 },
          );
          await expect(page.locator("body"), `${account.label} ${route}`).not.toContainText(/Log in|Sign in/i, {
            timeout: 5_000,
          });
        }

        await expectRuntimeHealthy(page, observer);
      } finally {
        observer.dispose();
      }
    });
  }

  test("authenticated activity surfaces launch when paid credentials are configured", async () => {
    test.skip(
      authenticatedAccounts.length > 0,
      "Covered by tier-scoped authenticated runtime checks.",
    );
    test.skip(
      true,
      "Set PLAYWRIGHT_RN_*, PLAYWRIGHT_PN_*, PLAYWRIGHT_NP_*, QA_PAID_*, E2E_PAID_*, or PLAYWRIGHT_TEST_* credentials.",
    );
  });
});
