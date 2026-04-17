/**
 * Guardrail: `/app` must not issue duplicate heavy API fetches (lessons / dashboard / progress bundles).
 *
 * - **Auth:** `chromium-paid` reuses `setup-paid-auth` storage (paid subscriber) — no UI login in this file.
 * - **Instrumentation:** all same-origin HTTP requests during navigation + `networkidle`.
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-duplicate-heavy-requests.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import {
  attachHeavyApiRequestTracker,
  countByHeavyPath,
  findDuplicateIdenticalApiRequests,
  HEAVY_API_PATHS,
  type HeavyApiRequestLogEntry,
} from "../helpers/app-heavy-api-request-tracker";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";

test.describe("Paid user — duplicate heavy API requests on /app", () => {
  test("at most one call each to /api/lessons, /api/dashboard, /api/progress; no duplicate identical API requests", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(120_000);
    const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;

    const tracker = attachHeavyApiRequestTracker(page, appOrigin);
    try {
      await page.goto("/app", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      await expect(page.getByTestId("learner-shell")).toBeVisible({ timeout: 30_000 });
      await expectNoSubscriptionPaywall(page, "paid duplicate-heavy-requests /app");

      const entries = tracker.entries;
      const counts = countByHeavyPath(entries);
      const duplicateKeys = findDuplicateIdenticalApiRequests(entries);

      const artifact: {
        baseURL: string;
        appOrigin: string;
        monitoredPaths: typeof HEAVY_API_PATHS;
        countsByMonitoredPath: typeof counts;
        duplicateIdenticalApiRequestKeys: string[];
        requestLog: HeavyApiRequestLogEntry[];
      } = {
        baseURL: baseURL ?? "",
        appOrigin,
        monitoredPaths: [...HEAVY_API_PATHS],
        countsByMonitoredPath: counts,
        duplicateIdenticalApiRequestKeys: duplicateKeys,
        requestLog: entries,
      };

      await testInfo.attach("network-request-log.json", {
        body: Buffer.from(JSON.stringify(artifact, null, 2)),
        contentType: "application/json",
      });

      for (const p of HEAVY_API_PATHS) {
        expect(
          counts[p],
          `Expected at most 1 request to ${p} per /app load; got ${counts[p]}. See network-request-log.json.`,
        ).toBeLessThanOrEqual(1);
      }

      expect(
        duplicateKeys,
        `Duplicate identical API requests (method + full URL):\n${duplicateKeys.join("\n")}\nSee network-request-log.json.`,
      ).toEqual([]);
    } finally {
      tracker.dispose();
    }
  });
});
