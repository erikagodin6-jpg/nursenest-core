/**
 * Browser-level PostHog / client telemetry governance smoke.
 *
 * Validates LOFT pathways do not emit forbidden cat_* event names in page scripts
 * and that governed client helpers strip psychometric props.
 */
import { expect, test } from "@playwright/test";
import { gotoExpectOk } from "../helpers/navigation-e2e";

test.describe("PostHog client telemetry governance", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("CNPLE simulation marketing page has no CAT learner telemetry leaks in HTML", async ({ page }) => {
    await gotoExpectOk(page, "/canada/np/cnple/simulation");
    const html = await page.content();
    expect(html).not.toMatch(/cat_session_complete/i);
    expect(html).not.toMatch(/cat_theta/i);
    expect(html).not.toMatch(/pass_probability/i);
  });

  test("public practice tests hub does not advertise computerized adaptive CNPLE", async ({ page }) => {
    await gotoExpectOk(page, "/canada/np/cnple");
    const html = await page.content();
    expect(html).not.toMatch(/Start Another CAT/i);
    expect(html).not.toMatch(/computerized adaptive test for CNPLE/i);
  });
});
