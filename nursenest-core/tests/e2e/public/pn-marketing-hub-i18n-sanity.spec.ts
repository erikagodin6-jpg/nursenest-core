/**
 * Public PN hubs: block obvious missing-translation sentinels in the DOM (G-011 SAFE_FOR_AI).
 *
 * Run: `npx playwright test tests/e2e/public/pn-marketing-hub-i18n-sanity.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { expectNotPageNotFound, gotoExpectOk, requireOrigin, seedCaMarketingCookie, seedUsMarketingCookie } from "../helpers/navigation-e2e";

test.use({ storageState: { cookies: [], origins: [] } });

const SENTINELS = [/\[missing/i, /\{\{missing/i, /missing canonical English key/i];

async function assertNoI18nSentinels(page: import("@playwright/test").Page): Promise<void> {
  const body = await page.locator("body").innerText();
  for (const re of SENTINELS) {
    expect(body, `unexpected i18n sentinel in page text (matched ${re})`).not.toMatch(re);
  }
}

test.describe("PN marketing hubs — i18n sanity (English)", () => {
  test("US NCLEX-PN hub has no raw missing-key sentinels", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/pn/nclex-pn");
    await expectNotPageNotFound(page);
    await assertNoI18nSentinels(page);
  });

  test("CA REx-PN hub has no raw missing-key sentinels", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    await gotoExpectOk(page, "/canada/pn/rex-pn");
    await expectNotPageNotFound(page);
    await assertNoI18nSentinels(page);
  });
});
