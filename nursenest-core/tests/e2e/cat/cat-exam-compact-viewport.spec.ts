/**
 * Short-laptop viewport: exam stacked shell should keep options scrollable and the anchored
 * footer from overlapping the last option (regression guard for measured scroll padding).
 *
 * Paid E2E credentials required (same harness as cat-exam-mode-contract).
 */
import { expect, test } from "@playwright/test";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  buildPaidFailureSnapshot,
  collectPaidSurfaceDebug,
  logPaidSurfaceDebug,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import { attachPageObservers } from "../helpers/attach-observers";
import { logObserverFailureSummary } from "../helpers/log-observer-failure-summary";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

test.describe("CAT exam — compact viewport layout", () => {
  test("scroll region has usable height; footer does not cover last option; single anchored footer", async ({
    page,
  }, testInfo) => {
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      /** Standard laptop-ish viewport (CAT density contract). */
      await page.setViewportSize({ width: 1366, height: 768 });

      await page.goto(
        `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
        { waitUntil: "domcontentloaded" },
      );
      await waitForAuthenticatedLearnerShell(page);
      await expectNoSubscriptionPaywall(page, "CAT hub");
      await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
      await page.locator("[data-nn-qa-practice-hub-start-test]").click();
      await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 15_000 });
      await page.getByRole("button", { name: /^Begin exam$/i }).click();
      await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

      await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
      const scroll = page.locator("#nn-cat-exam-scroll-region");
      await expect(scroll).toBeVisible({ timeout: 60_000 });

      const list = page.locator("ul.nn-cat-opt-list").first();
      await expect(list).toBeVisible({ timeout: 60_000 });
      const options = list.locator("button.nn-cat-opt");
      await expect(options.first()).toBeVisible({ timeout: 60_000 });
      const count = await options.count();
      expect(count, "expected at least one MCQ option").toBeGreaterThan(0);
      const lastOpt = options.nth(count - 1);

      const metrics = await page.evaluate(() => {
        const root = document.querySelector("[data-cat-exam-root]");
        const scrollEl = document.getElementById("nn-cat-exam-scroll-region");
        const footer =
          document.querySelector(".nn-cat-question-card__exam-footer--anchored") ??
          document.querySelector("[data-nn-qa-cat-adaptive-exam-footer]");
        const opts = scrollEl?.querySelectorAll("button.nn-cat-opt, label.nn-cat-opt") ?? [];
        const last = opts[opts.length - 1] as HTMLElement | undefined;
        if (!scrollEl || !footer || !last) {
          return { ok: false as const, reason: "missing-elements" };
        }
        const sr = scrollEl.getBoundingClientRect();
        const fr = footer.getBoundingClientRect();
        const lr = last.getBoundingClientRect();
        const anchored = root?.querySelectorAll(".nn-cat-question-card__exam-footer--anchored") ?? [];
        const board = root?.querySelectorAll("[data-nn-qa-cat-adaptive-exam-footer]") ?? [];
        return {
          ok: true as const,
          scrollClientH: scrollEl.clientHeight,
          gapFooterMinusLastOpt: fr.top - lr.bottom,
          stemTop: scrollEl.querySelector(".nn-cat-question-stem")?.getBoundingClientRect().top ?? null,
          scrollTop: sr.top,
          anchoredFooterCount: anchored.length + board.length,
        };
      });

      expect(metrics.ok, JSON.stringify(metrics)).toBe(true);
      if (!metrics.ok) return;

      expect(metrics.scrollClientH, "scroll region should have meaningful height").toBeGreaterThan(120);
      expect(
        metrics.gapFooterMinusLastOpt,
        "last option should sit above the footer (measured padding / no overlap)",
      ).toBeGreaterThan(-4);

      if (typeof metrics.stemTop === "number" && typeof metrics.scrollTop === "number") {
        expect(
          metrics.stemTop - metrics.scrollTop,
          "stem should not sit far below scroll region top (no pathological top dead space)",
        ).toBeLessThan(80);
      }

      expect(metrics.anchoredFooterCount, "single exam footer (anchored card or adaptive board bar)").toBe(1);

      const docScroll = await page.evaluate(() => {
        const el = document.documentElement;
        const sh = el.scrollHeight;
        const ih = window.innerHeight;
        return { scrollHeight: sh, innerHeight: ih, delta: sh - ih };
      });
      expect(
        docScroll.delta,
        `document should not exceed viewport (scrollHeight=${docScroll.scrollHeight} innerHeight=${docScroll.innerHeight})`,
      ).toBeLessThanOrEqual(1);

      await page.screenshot({
        path: testInfo.outputPath("cat-exam-compact-after.png"),
        fullPage: true,
      });

      const serious = obs.consoleErrors.filter(
        (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
      );
      if (serious.length > 0 || obs.failedRequests.length > 0) {
        logObserverFailureSummary({
          tag: "[cat-exam-compact-viewport]",
          routeLabel: "final",
          seriousConsole: serious,
          failedRequests: obs.failedRequests,
          pageUrl: page.url(),
        });
      }
      expect(serious, serious.slice(0, 6).join("\n")).toEqual([]);
      expect(obs.failedRequests, obs.failedRequests.slice(0, 6).join("\n")).toEqual([]);
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-exam-compact"), obs));
      throw e;
    } finally {
      obs.dispose();
    }
  });
});
