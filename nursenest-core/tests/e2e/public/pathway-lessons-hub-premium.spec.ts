/**
 * Marketing pathway lessons hubs (category-first index + filtered list shell): premium wrapper,
 * stable hooks, no placeholder copy in main content.
 *
 * Routes use published marketing segments (`[locale]` = country slug, PN/RPN use `pn` in URL).
 *
 * Run: `cd nursenest-core && npx playwright test tests/e2e/public/pathway-lessons-hub-premium.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";

const HUB_ROOT = '[data-nn-lessons-marketing-hub="1"]';
const LESSONS_SECTION = '[data-nn-qa-pathway-lessons-hub="true"]';
const PLACEHOLDER_RE = /placeholder|lorem ipsum|todo:|tbd\b|\[insert\]/i;

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return Math.max(0, doc.scrollWidth - doc.clientWidth);
  });
  expect(overflow, "main document horizontal overflow").toBeLessThanOrEqual(8);
}

test.describe("Pathway lessons hub — premium shell (RN / PN / CA RPN)", () => {
  test("US RN lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expectNotPageNotFound(page);

    await expect(page.locator(HUB_ROOT)).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("heading", { level: 1, name: /lessons/i })).toBeVisible();
    await expect(page.locator(LESSONS_SECTION)).toBeVisible();
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).not.toContainText(PLACEHOLDER_RE);

    await expect(page.locator(`${HUB_ROOT} a`).filter({ hasText: /overview/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /practice questions/i }).first()).toBeVisible();
  });

  test("US PN lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/pn/nclex-pn/lessons");
    await expectNotPageNotFound(page);

    await expect(page.locator(HUB_ROOT)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(LESSONS_SECTION)).toBeVisible();
    const main = page.locator("main");
    await expect(main).not.toContainText(PLACEHOLDER_RE);
  });

  test("Canada RPN (REx-PN) lessons index loads premium hub + lesson section", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/canada/pn/rex-pn/lessons");
    await expectNotPageNotFound(page);

    await expect(page.locator(HUB_ROOT)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(LESSONS_SECTION)).toBeVisible();
    const main = page.locator("main");
    await expect(main).not.toContainText(PLACEHOLDER_RE);
  });

  test("Mobile viewport — no runaway horizontal scroll", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, "/us/rn/nclex-rn/lessons");
    await expectNotPageNotFound(page);
    await expect(page.locator(HUB_ROOT)).toBeVisible({ timeout: 60_000 });
    await assertNoHorizontalOverflow(page);
  });
});
