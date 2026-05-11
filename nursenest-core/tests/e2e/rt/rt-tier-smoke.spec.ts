/**
 * Respiratory therapy (allied profession `respiratory`) — public marketing smoke + layout bounds.
 * RT uses TierCode.ALLIED + pathway `us-allied-core`; hub URL is `/allied/respiratory` (not a standalone Stripe tier).
 *
 * Run: cd nursenest-core && npx playwright test tests/e2e/rt/rt-tier-smoke.spec.ts
 */
import { expect, test } from "@playwright/test";
import { isBenignPublicMarketingConsoleMessage } from "../helpers/benign-console";
import {
  assertDocumentNoHorizontalOverflow,
  assertElementNoHorizontalOverflow,
} from "../helpers/visual-layout-assertions";
import { gotoExpectOk, requireOrigin } from "../helpers/navigation-e2e";

const PREMIUM = '[data-nn-qa-pathway-premium-modules=""]';
const HUB_TITLE = "#allied-pathway-hub-hero-title";

test.describe.configure({ timeout: 180_000 });

test.describe("RT / respiratory allied tier — public smoke", () => {
  test("occupation hub loads and stays on allied route (no RN redirect)", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isBenignPublicMarketingConsoleMessage(msg.text())) {
        errors.push(msg.text());
      }
    });

    await gotoExpectOk(page, "/allied/respiratory");
    await expect(page).toHaveURL(/\/allied\/respiratory/);
    expect(page.url(), "must not bounce to RN nursing hub").not.toMatch(/\/us\/rn\/|\/rn\/nclex/i);

    await expect(page.locator(HUB_TITLE)).toBeVisible({ timeout: 90_000 });
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });

    await assertDocumentNoHorizontalOverflow(page);
    await assertElementNoHorizontalOverflow(page, PREMIUM);

    expect(errors.slice(0, 6), errors.join("\n")).toEqual([]);
  });

  test("lessons / questions / CAT marketing surfaces respond", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    const origin = requireOrigin(baseURL);
    for (const path of [
      "/allied/allied-health/lessons?alliedProfession=respiratory",
      "/allied/allied-health/questions?alliedProfession=respiratory",
      "/allied/allied-health/cat?alliedProfession=respiratory",
    ]) {
      const res = await page.request.get(`${origin}${path}`, { timeout: 45_000 });
      expect(res.status(), path).toBeLessThan(500);
      expect(res.status(), path).not.toBe(503);
    }
  });

  test("legacy US allied-health URL redirects to global /allied/allied-health (not RN)", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    const origin = requireOrigin(baseURL);
    const res = await page.request.get(`${origin}/us/allied/allied-health`, { maxRedirects: 0 });
    const loc = res.headers().location ?? "";
    expect(loc, "redirect target").toMatch(/\/allied\/allied-health/);
    expect(loc).not.toMatch(/\/rn\/|nclex-rn/i);
  });

  test("mobile viewport — RT hub chrome fits width", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, "/allied/respiratory");
    await expect(page.locator(HUB_TITLE)).toBeVisible({ timeout: 90_000 });
    await assertDocumentNoHorizontalOverflow(page);
  });
});
