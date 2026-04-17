/**
 * Public marketing homepage — caching guard for guest traffic.
 *
 * Flow: open `/` as guest → reload 3 times. Tracks JSON/API-style endpoints; reloads should not
 * hammer identical resources with repeated full 200 responses (expect cache hits, 304, or no refetch).
 *
 * ```
 * npx playwright test tests/e2e/public/public-homepage-caching.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";
import {
  attachPublicMarketingDataResponseTracker,
  findDuplicateIdenticalDataRequestsInLoad,
  findReloadFullFetchViolations,
  type PublicDataResponseEntry,
} from "../helpers/public-marketing-data-request-tracker";

/**
 * Navigation (document) budget — measured at `domcontentloaded` (HTML + sync scripts), not React hydration.
 * Default ceilings are loose so `next dev` (slow SSR on every full reload) does not flake CI.
 * For the **≤2s** product SLA, run against `next start` or a deployed URL and set `E2E_PUBLIC_NAV_SLA_MS=2000`.
 */
const FIRST_NAV_BUDGET_MS = Number(process.env.E2E_PUBLIC_FIRST_NAV_BUDGET_MS) || 15_000;
const RELOAD_NAV_BUDGET_MS = Number(process.env.E2E_PUBLIC_RELOAD_NAV_BUDGET_MS) || 12_000;
/** When set (e.g. `2000`), each navigation must also meet this stricter SLA (staging / production-like runs). */
const NAV_SLA_MS =
  process.env.E2E_PUBLIC_NAV_SLA_MS !== undefined && process.env.E2E_PUBLIC_NAV_SLA_MS !== ""
    ? Number(process.env.E2E_PUBLIC_NAV_SLA_MS)
    : undefined;
const RELOAD_COUNT = 3;

test.describe("Public — guest homepage caching", () => {
  test("reloads do not repeat full fetches for identical data endpoints; load budget", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(120_000);
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;

    const tracker = attachPublicMarketingDataResponseTracker(page, appOrigin);
    /** Wall time from goto/reload start → `domcontentloaded` (excludes hydration to public shell). */
    const navigationDurationsMs: number[] = [];
    /** Optional: full time until marketing shell is visible (diagnostic only). */
    const shellVisibleDurationsMs: number[] = [];

    try {
      for (let loadIndex = 0; loadIndex <= RELOAD_COUNT; loadIndex++) {
        tracker.setLoadIndex(loadIndex);
        const t0 = Date.now();

        if (loadIndex === 0) {
          const r = await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
          expect(r?.ok(), `HTTP ${r?.status()} for /`).toBeTruthy();
        } else {
          const r = await page.reload({ waitUntil: "domcontentloaded", timeout: 60_000 });
          expect(r?.ok(), `HTTP ${r?.status()} for reload ${loadIndex}`).toBeTruthy();
        }

        const navElapsed = Date.now() - t0;
        navigationDurationsMs.push(navElapsed);
        const navBudget = loadIndex === 0 ? FIRST_NAV_BUDGET_MS : RELOAD_NAV_BUDGET_MS;
        expect(
          navElapsed,
          `Navigation ${loadIndex} (${loadIndex === 0 ? "first open" : `reload ${loadIndex}`}) document reached domcontentloaded after ${navElapsed}ms (budget ${navBudget}ms; override with E2E_PUBLIC_FIRST_NAV_BUDGET_MS / E2E_PUBLIC_RELOAD_NAV_BUDGET_MS)`,
        ).toBeLessThanOrEqual(navBudget);
        if (NAV_SLA_MS !== undefined && !Number.isNaN(NAV_SLA_MS)) {
          expect(
            navElapsed,
            `Navigation ${loadIndex} SLA (E2E_PUBLIC_NAV_SLA_MS=${NAV_SLA_MS}): domcontentloaded took ${navElapsed}ms`,
          ).toBeLessThanOrEqual(NAV_SLA_MS);
        }

        const tShell = Date.now();
        await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 30_000 });
        shellVisibleDurationsMs.push(Date.now() - tShell);
      }

      const entries = tracker.entries;
      const reloadViolations = findReloadFullFetchViolations(entries);
      const duplicateInLoad = findDuplicateIdenticalDataRequestsInLoad(entries);

      const artifact: {
        appOrigin: string;
        loadCount: number;
        firstNavBudgetMs: number;
        reloadNavBudgetMs: number;
        navSlaMs: number | null;
        navigationDurationsMs: number[];
        shellVisibleAfterNavMs: number[];
        reloadFullFetchViolations: string[];
        duplicateIdenticalRequestsInLoad: string[];
        responseLog: PublicDataResponseEntry[];
      } = {
        appOrigin,
        loadCount: RELOAD_COUNT + 1,
        firstNavBudgetMs: FIRST_NAV_BUDGET_MS,
        reloadNavBudgetMs: RELOAD_NAV_BUDGET_MS,
        navSlaMs: NAV_SLA_MS ?? null,
        navigationDurationsMs,
        shellVisibleAfterNavMs: shellVisibleDurationsMs,
        reloadFullFetchViolations: reloadViolations,
        duplicateIdenticalRequestsInLoad: duplicateInLoad,
        responseLog: entries,
      };

      await testInfo.attach("public-homepage-caching.json", {
        body: Buffer.from(JSON.stringify(artifact, null, 2)),
        contentType: "application/json",
      });

      expect(
        reloadViolations,
        `Repeated full HTTP 200 refetches for the same data endpoint on reload navigations:\n${reloadViolations.join("\n")}\nSee public-homepage-caching.json.`,
      ).toEqual([]);

      expect(
        duplicateInLoad,
        `Duplicate identical data requests within a single load:\n${duplicateInLoad.join("\n")}\nSee public-homepage-caching.json.`,
      ).toEqual([]);
    } finally {
      tracker.dispose();
    }
  });
});
