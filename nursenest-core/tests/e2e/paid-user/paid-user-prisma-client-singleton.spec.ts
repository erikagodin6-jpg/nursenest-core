/**
 * Prisma singleton — server should construct at most one `PrismaClient` per Node process (`src/lib/db.ts`).
 *
 * - **Runtime:** `globalThis.__PRISMA_CLIENT_COUNT__` increments on each `new PrismaClient()`; `console.warn`
 *   fires if count &gt; 1 (message includes **"Multiple Prisma clients detected"**). That warning is **server-side**
 *   only; this spec also calls `/api/debug/prisma-client-count` to assert the count from the app process.
 * - **Browser console:** must not surface the duplicate-client string (defense in depth if anything ever forwarded it).
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-prisma-client-singleton.spec.ts
 * ```
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";

const MULTIPLE_PRISMA_RE = /Multiple Prisma clients detected/;

test.describe("Paid user — Prisma client singleton", () => {
  test("navigation does not multiply PrismaClient; no duplicate-client signal", async ({ page, baseURL }) => {
    test.setTimeout(120_000);
    test.skip(!getPaidTestCredentials(), "Requires paid E2E credentials / chromium-paid storage");

    const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });

    try {
      for (const path of ["/app", "/app/lessons", "/app/questions"] as const) {
        await test.step(path, async () => {
          await page.goto(path, { waitUntil: "domcontentloaded", timeout: 60_000 });
          await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
        });
      }

      const browserLinesWithDuplicate = [
        ...observers.consoleErrors,
        ...(observers.consoleErrorContext?.map((c) => `${c.pageUrl} ${c.text}`) ?? []),
      ].filter((line) => MULTIPLE_PRISMA_RE.test(line));
      expect(
        browserLinesWithDuplicate,
        "Browser console must not report Multiple Prisma clients detected",
      ).toEqual([]);

      const res = await page.request.get(`${origin}/api/debug/prisma-client-count`);
      expect(res.status(), "prisma-client-count diagnostic").toBe(200);
      const body = (await res.json()) as { instantiationCount: number; multipleDetected: boolean };
      expect(body.multipleDetected, "more than one PrismaClient constructed in this server process").toBe(
        false,
      );
      expect(body.instantiationCount, "expected exactly one PrismaClient construction").toBe(1);
    } finally {
      observers.dispose();
    }
  });
});
