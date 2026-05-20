/**
 * Prisma query audit — after `/app` and `/app/lessons`, SQL against hot tables must be bounded
 * (LIMIT / unique equality) per `src/lib/db/prisma-query-audit.ts`.
 *
 * Requires query logging (`NODE_ENV !== production` in `next dev`, or `PRISMA_QUERY_AUDIT=1`).
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-prisma-query-bounds.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";

test.describe("Paid user — Prisma query bounds (hot tables)", () => {
  test("/app and /app/lessons emit no unbounded watch-table queries", async ({ page, baseURL }) => {
    test.setTimeout(120_000);
    test.skip(!getPaidTestCredentials(), "Requires paid E2E credentials / chromium-paid storage");

    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;

    const clearRes = await page.request.post(`${origin}/api/debug/prisma-query-audit`, {
      data: { clear: true },
      headers: { "content-type": "application/json" },
    });
    expect(clearRes.status(), "prisma-query-audit clear").toBe(200);

    for (const path of ["/app", "/app/lessons"] as const) {
      await test.step(path, async () => {
        await page.goto(path, { waitUntil: "domcontentloaded", timeout: 60_000 });
        await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
      });
    }

    const auditRes = await page.request.get(`${origin}/api/debug/prisma-query-audit`);
    expect(auditRes.status(), "prisma-query-audit snapshot").toBe(200);
    const body = (await auditRes.json()) as {
      violations: unknown[];
      violationsCount?: number;
      queriesCaptured?: number;
    };

    expect(
      body.violations,
      `Prisma query violations (see prisma-query-audit): ${JSON.stringify(body.violations)}`,
    ).toEqual([]);
    expect(body.violationsCount ?? body.violations.length, "violationsCount").toBe(0);
  });
});
