/**
 * CNPLE psychometric integrity smoke — LOFT must not surface CAT learner semantics.
 *
 * Public/guest routes only (no auth session required).
 */
import { expect, test } from "@playwright/test";
import { gotoExpectOk } from "../helpers/navigation-e2e";

test.describe("CNPLE psychometric integrity — routing", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("cat-launch with CNPLE pathway redirects to case hub", async ({ page }) => {
    await page.goto("/app/practice-tests/cat-launch?pathwayId=ca-np-cnple", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForURL(/\/app\/cases\/cnple/, { timeout: 30_000 });
    expect(page.url()).toMatch(/\/app\/cases\/cnple/);
  });

  test("simulation marketing page does not claim computerized adaptive CNPLE", async ({ page }) => {
    await gotoExpectOk(page, "/canada/np/cnple/simulation");
    const html = await page.content();
    assertNoRenderedLeak(html);
  });
});

function assertNoRenderedLeak(html: string) {
  expect(html).not.toMatch(/Start Another CAT/i);
  expect(html).not.toMatch(/Review This CAT/i);
  expect(html).not.toMatch(/Pass probability:\s*\d+%/i);
  expect(html).not.toMatch(/CNPLE.{0,80}(?:is|uses)\s+(?:a\s+)?computerized\s+adaptive/i);
}
