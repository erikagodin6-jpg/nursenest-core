/**
 * Master-prompt user journeys — smoke coverage for critical paths (public + optional learner shell).
 *
 * Pair with:
 * - `tests/e2e/public/pre-deploy-regression.spec.ts` (marketing depth)
 * - `tests/e2e/public/link-crawl-audit.spec.ts` (link graph)
 * - `tests/e2e/public/marketing-navigation-audit.spec.ts` (nav chrome)
 *
 * Run (server already up or use webServer from playwright.config):
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 npx playwright test tests/e2e/public/user-journey-smoke-matrix.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";
import { CANONICAL_PATHWAY_HUB } from "../../../src/lib/marketing/canonical-pathway-hubs";
import { gotoExpectOk, requireOrigin, expectNotPageNotFound } from "../helpers/navigation-e2e";

function marketingShell(page: import("@playwright/test").Page) {
  return page.locator('[data-nn-nav-mode="public"]').first();
}

test.describe("User journey smoke matrix", () => {
  test("1 — Homepage → primary CTA surface (pricing path)", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/");
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    await expectNotPageNotFound(page);
    await gotoExpectOk(page, "/pricing");
    await expect(marketingShell(page)).toBeVisible({ timeout: 60_000 });
    await expectNotPageNotFound(page);
  });

  test("2 — Canonical pathway hub resolves (US RN)", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    const hub = CANONICAL_PATHWAY_HUB.usRn;
    await gotoExpectOk(page, hub);
    await expectNotPageNotFound(page);
  });

  test("3 — Public lessons index", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/lessons");
    await expectNotPageNotFound(page);
  });

  test("4 — Blog index → article list surface", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/blog");
    await expectNotPageNotFound(page);
    await expect(page.locator("main, [role='main'], article").first()).toBeVisible({ timeout: 30_000 });
  });

  test("5 — Tools hub (public calculators)", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await gotoExpectOk(page, "/tools");
    await expectNotPageNotFound(page);
  });
});
