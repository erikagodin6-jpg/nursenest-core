/**
 * RT tier Phase 2 — focused routes + overflow + ventilator HTTP gates.
 * Full authenticated learner flows require QA credentials (skipped when unset).
 *
 * Run: cd nursenest-core && npx playwright test tests/e2e/rt/rt-phase-2-readiness.spec.ts
 */
import { expect, test } from "@playwright/test";
import { isBenignPublicMarketingConsoleMessage } from "../helpers/benign-console";
import {
  assertDocumentNoHorizontalOverflow,
  assertElementNoHorizontalOverflow,
} from "../helpers/visual-layout-assertions";
import { gotoExpectOk, requireOrigin } from "../helpers/navigation-e2e";
import { loginWithCredentials } from "../helpers/learner-login";
import { resolvePrenursingAlliedCredentials } from "../helpers/pathway-prenursing-allied-credentials";

const PREMIUM = '[data-nn-qa-pathway-premium-modules=""]';
const HUB_TITLE = "#allied-pathway-hub-hero-title";

test.describe.configure({ timeout: 240_000 });

test.describe("RT Phase 2 — public & guest", () => {
  test("public RT occupation hub loads (no RN redirect)", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await gotoExpectOk(page, "/allied/respiratory");
    await expect(page).toHaveURL(/\/allied\/respiratory/);
    expect(page.url()).not.toMatch(/\/us\/rn\/|\/rn\/nclex/i);
    await expect(page.locator(HUB_TITLE)).toBeVisible({ timeout: 90_000 });
    await assertDocumentNoHorizontalOverflow(page);
    await assertElementNoHorizontalOverflow(page, PREMIUM);
  });

  test("marketing RT surfaces respond (<500)", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    const origin = requireOrigin(baseURL);
    for (const path of [
      "/allied/allied-health/lessons?alliedProfession=respiratory",
      "/allied/allied-health/questions?alliedProfession=respiratory",
      "/allied/allied-health/cat?alliedProfession=respiratory",
      "/respiratory-therapy/ventilator-training",
    ]) {
      const res = await page.request.get(`${origin}${path}`, { timeout: 45_000 });
      expect(res.status(), path).toBeLessThan(500);
      expect(res.status(), path).not.toBe(503);
    }
  });

  test("guest cannot open learner ventilator module as 200", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    const origin = requireOrigin(baseURL);
    const res = await page.request.get(`${origin}/modules/rt-ventilator`, { timeout: 45_000 });
    expect([401, 403, 404]).toContain(res.status());
  });

  test("mobile RT hub + ventilator marketing — no horizontal overflow", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, "/allied/respiratory");
    await expect(page.locator(HUB_TITLE)).toBeVisible({ timeout: 90_000 });
    await assertDocumentNoHorizontalOverflow(page);
    await gotoExpectOk(page, "/respiratory-therapy/ventilator-training");
    await assertDocumentNoHorizontalOverflow(page);
  });
});

test.describe("RT Phase 2 — authenticated (optional QA)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("RT allied learner: dashboard + lessons + flashcards entry + practice + CAT (when creds)", async ({
    page,
    baseURL,
  }) => {
    test.skip(!baseURL, "BASE_URL required");
    const creds = resolvePrenursingAlliedCredentials(["QA_RT_US", "QA_ALLIED_US", "QA_ALLIED", "QA_PAID_ALLIED"]);
    test.skip(!creds, "Set QA_ALLIED_US_EMAIL + QA_ALLIED_US_PASSWORD (or QA_RT_US_* / allied QA vars).");

    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isBenignPublicMarketingConsoleMessage(msg.text())) {
        errors.push(msg.text());
      }
    });

    await loginWithCredentials(page, creds.email, creds.password);

    await gotoExpectOk(page, "/app");
    await assertDocumentNoHorizontalOverflow(page);

    await gotoExpectOk(page, "/app/lessons");
    await assertDocumentNoHorizontalOverflow(page);

    await gotoExpectOk(page, "/app/flashcards");
    await assertDocumentNoHorizontalOverflow(page);

    await gotoExpectOk(page, "/app/practice-tests");
    await assertDocumentNoHorizontalOverflow(page);

    await gotoExpectOk(page, "/app/cat");
    await assertDocumentNoHorizontalOverflow(page);

    expect(errors.slice(0, 8), errors.join("\n")).toEqual([]);
  });

});
