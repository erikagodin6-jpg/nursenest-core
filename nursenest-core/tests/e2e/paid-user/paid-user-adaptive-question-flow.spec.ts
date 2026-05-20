/**
 * Adaptive question bank flow: `studyMode` drives server-side ordering (e.g. weak areas, high-yield filters).
 *
 * Tracks question ids from GET `/api/questions?...&mode=preview` and asserts session stability.
 *
 * Override study mode (default `weak`):
 *   E2E_ADAPTIVE_STUDY_MODE=high_yield npx playwright test ... --project=chromium-paid
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { logObserverFailureSummary } from "../helpers/log-observer-failure-summary";
import {
  assertDifficultiesInValidRange,
  attachQuestionPreviewResponseCollector,
  hasRepeatInWindow,
} from "../helpers/question-bank-adaptive-flow";

function studyMode(): string {
  const v = process.env.E2E_ADAPTIVE_STUDY_MODE?.trim();
  if (v && /^[a-z_]+$/.test(v)) return v;
  return "weak";
}

function stepCount(): number {
  const n = Number(process.env.E2E_ADAPTIVE_STEPS ?? "6");
  return Number.isFinite(n) && n >= 3 && n <= 12 ? Math.floor(n) : 6;
}

async function answerCurrentQuestion(page: Page): Promise<void> {
  const checkBtn = page.getByRole("button", { name: /^Check answer$/i });
  await expect(checkBtn).toBeVisible({ timeout: 120_000 });

  const list = page.locator("ul.nn-qopt-list").first();
  await expect(list).toBeVisible({ timeout: 20_000 });

  const firstCb = list.locator('input[type="checkbox"]').first();
  if (await firstCb.isVisible().catch(() => false)) {
    await firstCb.click();
  } else {
    await list.locator("li > button").first().click();
  }

  await expect(checkBtn).toBeEnabled({ timeout: 20_000 });
  await checkBtn.click();
  await expect(page.getByRole("status")).toBeVisible({ timeout: 45_000 });
}

function seriousConsole(lines: string[]): string[] {
  return lines.filter((x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x));
}

test.describe("Paid user — adaptive question flow", () => {
  test("study mode session advances with distinct questions and stable API", async ({ page }) => {
    const sm = studyMode();
    const steps = stepCount();
    const obs = attachPageObservers(page, { profile: "app" });
    const collector = attachQuestionPreviewResponseCollector(page);

    try {
      await page.goto(`/app/questions?studyMode=${encodeURIComponent(sm)}`, { waitUntil: "domcontentloaded" });
      expect(page.url(), "Unexpected /login").not.toMatch(/\/login/i);

      await expect(page.getByRole("heading", { name: /^Question bank$/i })).toBeVisible({ timeout: 120_000 });
      await expect(page.getByRole("button", { name: /^Check answer$/i })).toBeVisible({ timeout: 120_000 });

      await expect
        .poll(() => collector.batches[0]?.ids?.length ?? 0, { timeout: 90_000 })
        .toBeGreaterThan(0);

      const batch0 = collector.batches[0]!;
      const n = Math.min(steps, batch0.ids.length);
      expect(n, `Preview batch must include at least 3 questions (got ${batch0.ids.length})`).toBeGreaterThanOrEqual(3);
      expect(new Set(batch0.ids).size, "API returned duplicate ids in one batch").toBe(batch0.ids.length);

      assertDifficultiesInValidRange(batch0.difficulties.slice(0, n));
      const definedDiffs = batch0.difficulties.slice(0, n).filter((d): d is number => typeof d === "number");
      expect(
        definedDiffs.length,
        "Expected difficulty metadata on most preview rows (check API preview select)",
      ).toBeGreaterThan(0);

      const visitedIds: string[] = [];
      let prevStem = "";

      for (let i = 0; i < n; i++) {
        const stem = page.locator(".nn-question-stem").first();
        await expect(stem).toBeVisible({ timeout: 30_000 });
        const stemText = (await stem.innerText()).trim();
        expect(stemText.length, "Meaningful stem").toBeGreaterThan(12);

        if (i > 0) {
          expect(stemText, "Question stem should change when moving to the next item").not.toBe(prevStem);
        }
        prevStem = stemText;

        await answerCurrentQuestion(page);
        visitedIds.push(batch0.ids[i]!);

        if (i < n - 1) {
          const nextQ = page.locator("button.nn-question-nav-actions__next").filter({ hasText: /next question/i });
          await expect(nextQ, "Next question control must appear after grading").toBeVisible({ timeout: 45_000 });
          await expect(nextQ).toBeEnabled({ timeout: 15_000 });
          await nextQ.click();
          await page.waitForTimeout(400);
          await expect(page.getByRole("button", { name: /^Check answer$/i })).toBeVisible({ timeout: 45_000 });
        }
      }

      expect(new Set(visitedIds).size, `Repeated question id in session: ${visitedIds.join(", ")}`).toBe(
        visitedIds.length,
      );
      expect(hasRepeatInWindow(visitedIds, 5), "Same question revisited inside a short window").toBe(false);

      const diffsForVisit = visitedIds.map((_, i) => batch0.difficulties[i] ?? null);
      assertDifficultiesInValidRange(diffsForVisit);

      const serious = seriousConsole(obs.consoleErrors);
      if (serious.length > 0 || obs.failedRequests.length > 0) {
        logObserverFailureSummary({
          tag: "[adaptive-qbank]",
          routeLabel: "done",
          seriousConsole: serious,
          failedRequests: obs.failedRequests,
          pageUrl: page.url(),
        });
      }
      expect(serious, serious.slice(0, 6).join("\n")).toEqual([]);
      expect(obs.failedRequests, obs.failedRequests.slice(0, 6).join("\n")).toEqual([]);
    } finally {
      collector.dispose();
      obs.dispose();
    }
  });
});
