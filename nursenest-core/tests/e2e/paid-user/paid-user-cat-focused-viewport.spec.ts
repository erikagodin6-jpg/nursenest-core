/**
 * Authenticated proof: adaptive CAT exam runtime fits 1366×768 without document scroll.
 *
 * @see paid-user-cat-smoke.spec.ts (same hub → session entry)
 */
import { expect, test } from "@playwright/test";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import { clickBeginExamAfterPracticeHubStart } from "../helpers/cat-practice-exam-flow";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import fs from "node:fs";
import path from "node:path";

const VIEWPORT = { width: 1366, height: 768 } as const;
const PROOF_JSON = path.join(process.cwd(), "test-results", "cat-viewport-proof-1366x768.json");
const PROOF_PNG = path.join(process.cwd(), "test-results", "cat-focused-session-viewport-1366x768-proof.png");

test.describe("Paid user — CAT focused viewport proof", () => {
  test("1366×768: document fits; stem/options compact; screenshot", async ({ page }) => {
    await page.setViewportSize(VIEWPORT);

    await page.goto(
      `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
      { waitUntil: "domcontentloaded" },
    );
    await waitForAuthenticatedLearnerShell(page);
    await expectNoSubscriptionPaywall(page, "CAT hub");
    await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
    await page.locator("[data-nn-qa-practice-hub-start-test]").click();
    await clickBeginExamAfterPracticeHubStart(page);
    await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

    await expect(page.locator(".nn-cat-question-stem").first()).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.locator("ul.nn-cat-opt-list").first()).toBeVisible({ timeout: 120_000 });

    const proof = await page.evaluate(() => {
      const root = document.documentElement;
      const html = document.documentElement;
      const stemP =
        document.querySelector(".nn-cat-exam-stem-scroll .nn-cat-question-stem") ??
        document.querySelector(".nn-cat-question-stem");
      const firstOpt = document.querySelector("ul.nn-cat-opt-list .nn-cat-opt");
      const rStem = stemP?.getBoundingClientRect();
      const rOpt = firstOpt?.getBoundingClientRect();
      const deadGapPx = rStem && rOpt ? Math.max(0, rOpt.top - rStem.bottom) : null;

      const optCount = document.querySelectorAll("ul.nn-cat-opt-list .nn-cat-opt").length;

      return {
        innerHeight: window.innerHeight,
        scrollHeight: root.scrollHeight,
        clientHeight: root.clientHeight,
        scrollY: window.scrollY,
        examChromeHidden: html.getAttribute("data-learner-exam-chrome") === "hidden",
        timedModeOn: Boolean(document.querySelector(".nn-cat-exam-timing-alert")),
        deadGapPx,
        catMcqOptionCount: optCount,
        fits: root.scrollHeight <= window.innerHeight + 1,
      };
    });

    fs.mkdirSync(path.dirname(PROOF_JSON), { recursive: true });
    fs.writeFileSync(PROOF_JSON, `${JSON.stringify({ viewport: VIEWPORT, ...proof }, null, 2)}\n`, "utf8");

    await page.screenshot({ path: PROOF_PNG, fullPage: true });

    expect(
      proof.fits,
      `scrollHeight=${proof.scrollHeight} innerHeight=${proof.innerHeight} (expected scrollHeight <= innerHeight+1). See ${PROOF_JSON}`,
    ).toBe(true);

    expect(
      proof.deadGapPx == null || proof.deadGapPx <= 48,
      `unexpected dead vertical gap between stem and first option: ${proof.deadGapPx}px`,
    ).toBe(true);

    expect(Math.abs(proof.scrollY), `expected no window scroll, scrollY=${proof.scrollY}`).toBeLessThanOrEqual(1);
    expect(proof.catMcqOptionCount, "expected at least 4 CAT options on screen for MCQ proof").toBeGreaterThanOrEqual(4);
  });
});
