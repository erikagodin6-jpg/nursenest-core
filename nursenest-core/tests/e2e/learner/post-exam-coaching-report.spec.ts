/**
 * Post-exam adaptive report — coaching semantics & layout smoke.
 * Requires authenticated learner session + completed practice test in CI fixtures when enabled.
 */
import { expect, test } from "@playwright/test";

test.describe("Post-exam coaching report", () => {
  test("CAT results root exposes session kind when present", async ({ page }) => {
    test.skip(!process.env.E2E_LEARNER_POST_EXAM_URL, "Set E2E_LEARNER_POST_EXAM_URL to a completed CAT results page");

    await page.goto(process.env.E2E_LEARNER_POST_EXAM_URL!);
    const root = page.locator("[data-nn-post-exam-adaptive-report]");
    await expect(root).toBeVisible({ timeout: 30_000 });

    const kind = await root.getAttribute("data-session-kind");
    expect(kind).toBeTruthy();

    const coachingModel = await root.getAttribute("data-coaching-model");
    if (coachingModel === "loft_readiness") {
      const body = await root.innerText();
      expect(body).not.toMatch(/\badaptive readiness\b/i);
      expect(body).not.toMatch(/\bstandard error\b/i);
      expect(body).not.toMatch(/\bdifficulty progression\b/i);
    }

    if (coachingModel === "cat_adaptive") {
      await expect(page.locator("#post-exam-rec-heading")).toBeVisible();
    }

    await expect(page.locator("#post-exam-rec-heading")).toBeVisible();
    const recLinks = page.locator('[data-nn-post-exam-adaptive-report] ol a.nn-btn-primary');
    const count = await recLinks.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(5);

    const hrefs = await recLinks.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  test("mobile viewport: recommendations visible without horizontal overflow", async ({ page }) => {
    test.skip(!process.env.E2E_LEARNER_POST_EXAM_URL, "Set E2E_LEARNER_POST_EXAM_URL");

    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(process.env.E2E_LEARNER_POST_EXAM_URL!);
    const root = page.locator("[data-nn-post-exam-adaptive-report]");
    await expect(root).toBeVisible({ timeout: 30_000 });

    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth > el.clientWidth + 2;
    });
    expect(overflow).toBe(false);
  });
});
