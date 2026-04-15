/**
 * Public/marketing discovery for flashcards; deep paid deck flows run in
 * `paid-user/paid-user-smoke.spec.ts` under `--project=chromium-paid`.
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();

test.describe("Flashcards marketing surface", () => {
  test("US RN hub loads (entry to learner flashcards via app)", async ({ page }, testInfo) => {
    const o = attachPageObservers(page);
    await page.goto(`${baseURL}/us/rn/nclex-rn`, { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
    const d = await logObserverDiagnostics(o, testInfo.title);
    o.dispose();
    expect(d.consoleErrors).toEqual([]);
    expect(d.failedRequests).toEqual([]);
  });
});
