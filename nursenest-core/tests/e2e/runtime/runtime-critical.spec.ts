import { expect, test } from "@playwright/test";

import { marketingCatPathForPathwayId } from "../../../src/lib/exam-pathways/practice-exams-cat-start";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
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
      await expect(page.locator('[data-theme="mint-blossom"]').first()).toHaveCount(1, { timeout: 15_000 });
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

  test("authenticated activity surfaces launch when paid credentials are configured", async ({ page, baseURL }, testInfo) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL/QA_PAID_PASSWORD or E2E_PAID_EMAIL/E2E_PAID_PASSWORD for authenticated launch checks.");

    const observer = await attachRuntimeCriticalObserver(page, testInfo);
    try {
      await loginWithCredentials(page, creds!.email, creds!.password, {
        navigationOrigin: baseURL ?? undefined,
        enterLearnerApp: true,
      });

      await page.addInitScript(() => {
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
            "ca-rn-nclex-rn": {
              pathwayId: "ca-rn-nclex-rn",
              queryString: null,
              index: "not-a-number",
              totalCards: 20,
              systemsLabel: { bad: true },
              updatedAt: null,
            },
          }),
        );
      });

      for (const route of ["/app/practice-tests", "/app/flashcards?pathwayId=ca-rn-nclex-rn"] as const) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.locator("body")).not.toBeEmpty({ timeout: 30_000 });
        await expect(page.locator("main, body")).not.toContainText(/Unable to load this section/i, { timeout: 5_000 });
      }

      await expectRuntimeHealthy(page, observer);
    } finally {
      observer.dispose();
    }
  });
});
